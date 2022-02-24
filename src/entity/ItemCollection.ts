import {
    BaseEntity,
    Column,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
} from "typeorm";
import { GroupInfo } from "./GroupInfo";
import { ItemInfo } from "./ItemInfo";

@Entity()
export class ItemCollection extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('varchar', {
        length: 40
    })
    name: string
    
    @ManyToMany(type => GroupInfo, group => group.itemCollections)
    @JoinTable()
    groups: GroupInfo[]

    @ManyToMany((type) => ItemInfo, (itemInfo) => itemInfo.itemCollections,{
        eager: true,
        cascade: true
    })
    @JoinTable()
    itemInfos: ItemInfo[];
}