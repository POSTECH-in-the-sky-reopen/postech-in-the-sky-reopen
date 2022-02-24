import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class Phase extends BaseEntity { 

    @PrimaryGeneratedColumn()
    id: number

    @Column('tinyint')
    phase: number

}