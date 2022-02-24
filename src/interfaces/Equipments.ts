import { Item } from "src/entity/Item";

export interface Equipments{
    Weapon: Item | undefined
    Accessory: Item | undefined
    Hair: Item | undefined
    Face: Item | undefined
    Suit: Item | undefined
    Deco: Item | undefined
}