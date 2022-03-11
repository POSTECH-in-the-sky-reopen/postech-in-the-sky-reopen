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
            this.findOneByStudentIdSigned(studentId)
                .then(user => {
                    if (user.confirmEmailToken){
                        reject("사용자가 존재하지만 이메일 인증이 되지 않았습니다.")
                    } else {
                        reject("이미 존재하는 사용자입니다.")
                    }
                })
                .catch(err => {
                    resolve()
                })
        })
    }

    async assureNonexistByInfo(name: string, studentId: number, povisId: string): Promise<void> {
        return new Promise((resolve, reject) => {
            this.findOneByInfo(name, studentId, povisId)
                .then(user => {
                    if (user.confirmEmailToken){
                        reject("사용자가 존재하지만 이메일 인증이 되지 않았습니다.")
                    } else {
                        reject("이미 존재하는 사용자입니다.")
                    }
                })
                .catch(err => {
                    resolve()
                })
        })
    }

    async findOneByStudentIdSigned(studentId: number, relations: string[] = []): Promise<User> {
        return new Promise((resolve, reject) => {
            this.findOne({
                where: {
                    studentId: studentId,
                    confirmEmailToken: null,
                },
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

    async findOneByInfo(name: string, studentId: number, povisId: string): Promise<User> {
        return new Promise((resolve, reject) => {
            this.findOne({
                where: { 
                    name: name,
                    studentId: studentId,
                    povisId: povisId
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

    async confirmEmail(confirmEmailToken: string): Promise<UpdateResult> {
        return new Promise((resolve, reject) => {
            this.update({
                    confirmEmailToken: confirmEmailToken,
                },{ 
                    confirmEmailToken: undefined,
                })
                .then(updateResult => {
                    resolve(updateResult)
                })
                .catch(err => {
                    console.error(err)
                    reject()
                })
        })
    }

    async createAndSave(name: string, studentId: number, povisId: string, isAdmin: boolean|undefined, password: string): Promise<User> {
        const user = new User()
        user.name = name
        user.studentId = studentId
        user.povisId = povisId
        user.isAdmin = isAdmin === undefined ? false : isAdmin
        const hashedPassword = hashSync(password, 10)
        user.password = hashedPassword
        return this.manager.save(user)
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

    async updatePlayer(id: number, player: Player | undefined): Promise<UpdateResult> {
        return this.update(id, { player: player})
    }
    
    async checkPassword(studentId: number, password: string): Promise<User> {
        return new Promise((resolve, reject) => {
            this.findOneByStudentIdSigned(studentId)
                .then(user => {
                    if (user === undefined) {
                        return reject()
                    }
                    if (user.confirmEmailToken) {
                        reject("사용자가 존재하지만 이메일 인증이 되지 않았습니다.")
                    }
                    if (compareSync(password, user.password)) {
                        resolve(user)
                    } else {
                        reject()
                    }
                })
                .catch(err => {
                    reject(err)
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

        
    async generateConfirmEmailToken(id: number): Promise<string> {
        return new Promise((resolve, reject) => {
            const confirmEmailToken = createPin()
            this.update(id,
                { 
                    confirmEmailToken: confirmEmailToken
                })
                .then(updateResult => {
                    if (updateResult.affected === 0) {
                        reject('존재하지 않는 사용자입니다.')
                    }
                    resolve(confirmEmailToken)
                })
                .catch(err => {
                    console.error(err)
                    reject()
                })
        })
    }

}