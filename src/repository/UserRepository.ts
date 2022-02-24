import { 
    EntityRepository, Repository, UpdateResult 
} from "typeorm";
import { User } from "src/entity/User";
import { hashSync, compareSync } from "bcrypt"
import { currentTime, currentTimestamp, toTimestamp } from "src/lib/time";
import { Player } from "src/entity/Player";
import { createPin } from "src/util/Pin";

@EntityRepository(User)
export class UserRepository extends Repository<User> {

    async assureNonexistByStudentId(studentId: number): Promise<void> {
        return new Promise((resolve, reject) => {
            this.findOneByStudentId(studentId)
                .then(user => {
                    reject()
                })
                .catch(err => {
                    resolve()
                })
        })
    }

    async assureNonexistByPin(pin: string): Promise<void> {
        return new Promise((resolve, reject) => {
            this.findOneByPin(pin)
                .then(user => {
                    reject()
                })
                .catch(err => {
                    resolve()
                })
        })
    }

    async findOneByStudentId(studentId: number, relations: string[] = []): Promise<User> {
        return new Promise((resolve, reject) => {
            this.findOne({
                where: { studentId: studentId },
                relations: relations
            }).then(user => {
                if (user !== undefined) {
                    resolve(user)
                } else {
                    reject()
                }
            })
        })
    }

    async findOneByPin(pin: string): Promise<User> {
        return new Promise((resolve, reject) => {
            this.findOne({
                where: { pin: pin }
            })
                .then(user => {
                    if (user !== undefined) {
                        resolve(user)
                    } else {
                        reject("no user")
                    }
                })

        })
    }

    async findOneByPinRegister(pin: string): Promise<User> {
        return new Promise((resolve, reject) => {
            this.findOne({
                where: {
                    pin: pin,
                    password: ''
                }
            })
                .then(user => {
                    if (user !== undefined) {
                        resolve(user)
                    } else {
                        reject("no user")
                    }
                })

        })
    }

    async findOneByResetPasswordToken(resetPasswordToken: string): Promise<User> {
        return new Promise((resolve, reject) => {
            this.findOne({
                where: { resetPasswordToken: resetPasswordToken }
            })
                .then(user => {
                    if (user !== undefined) {
                        resolve(user)
                    } else {
                        reject()
                    }
                })

        })
    }

    async createAndSave(pin: string, name: string, studentId: number, isAdmin: boolean|undefined): Promise<User> {
        const user = new User()
        user.pin = pin
        user.name = name
        user.studentId = studentId
        user.isAdmin = isAdmin === undefined ? false : isAdmin
        return this.manager.save(user)
    }

    async updatePassword(id: number, password: string): Promise<UpdateResult> {
        const hashedPassword = hashSync(password, 10)
        return this.update(id, { password: hashedPassword})
    }

    async updatePasswordByResetPasswordToken(password: string, resetPasswordToken: string): Promise<UpdateResult> {
        const hashedPassword = hashSync(password, 10)
        return this.createQueryBuilder()
            .update(User)
            .set({
                resetPasswordToken: '',
                password: hashedPassword
            })
            .where(`resetPasswordToken = :resetPasswordToken`, { resetPasswordToken: resetPasswordToken })
            .andWhere(`forgotPasswordAt > :time`, { time: toTimestamp(currentTime() - 30 * 60000) }) // 30 minutes
            .execute()
    }

    async updateEmail(id: number, email: string): Promise<UpdateResult> {
        return this.update(id, { email: email})
    }

    async updatePlayer(id: number, player: Player | undefined): Promise<UpdateResult> {
        return this.update(id, { player: player})
    }
    
    async checkPassword(studentId: number, password: string): Promise<User> {
        return new Promise((resolve, reject) => {
            this.findOneByStudentId(studentId)
                .then(user => {
                    if (user === undefined) {
                        return reject()
                    }
                    if (compareSync(password, user.password)) {
                        resolve(user)
                    } else {
                        reject()
                    }
                })
                .catch(err => {
                    reject()
                })
        })
    }
    
    async generateResetPasswordToken(id: number): Promise<string> {
        return new Promise((resolve, reject) => {
            const resetPasswordToken = createPin()
            this.update(id,
                { 
                    resetPasswordToken: resetPasswordToken,
                    forgotPasswordAt: currentTimestamp()
                })
                .then(updateResult => {
                    if (updateResult.affected === 0) {
                        throw new Error('존재하지 않는 사용자입니다.')
                    }
                    resolve(resetPasswordToken)
                })
                .catch(err => {
                    console.error(err)
                    reject()
                })
        })
    }

}