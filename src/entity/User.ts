import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn } from 'typeorm'
import { Player } from './Player'

export const NANOID_LENGTH = 30

@Entity()
export class User extends BaseEntity { 
    @PrimaryGeneratedColumn()
    id: number

    @Column('varchar', {
        length: NANOID_LENGTH,
        unique: true,
    })
    confirmEmailToken: string
    
    @Column('char', {
        length: 60
    })
    password: string
    
    @Column('varchar', {
        length: 20
    })
    name: string

    @Column('varchar', {
        length: 100,
        unique: true
    })
    povisId: string

    @Column('int', {
        unique: true
    })
    studentId: number

    @Column('bool', {
        default: false
    })
    isAdmin: boolean

    @Column('varchar', {
        length: NANOID_LENGTH,
        unique: true,
        nullable: true,
    })
    resetPasswordToken: string

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @Column('datetime', {
        default: () => 'CURRENT_TIMESTAMP'
    })
    forgotPasswordAt: Date
    
    @OneToOne(() => Player)
    @JoinColumn()
    player: Player

}
