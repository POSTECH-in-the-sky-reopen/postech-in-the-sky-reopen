import {
    BaseEntity,
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn,
} from "typeorm";
import { Cell } from "./Cell";
import { Player } from "./Player";

@Entity()
export class Siege extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne((type) => Cell, (cell) => cell.sieges, {
        eager: true,
    })
    cell: Cell;

    @ManyToOne((type) => Player, (player) => player.sieges, {
        eager: true,
    })
    player: Player;

    @Column("tinyint", {
        default: 0,
    })
    phase: number;

    @Column("int", {
        default: 0,
    })
    damage: number;
}
