import { ItemCollection } from "src/entity/ItemCollection";
import { ItemInfo } from "src/entity/ItemInfo";

export function addMark(mark: number, items: ItemInfo[], found: ItemInfo): number {
    for(let i = 0; i < items.length; i++){
        if(items[i].id==found.id){
            return mark | (1 << i)
        }
    }
    return mark | 0
}

export function checkMark(mark: number, items: ItemInfo[]): boolean {
    return mark === ((1 << items.length) - 1)
}

export function getMark(mark: number, index: number): boolean {
    return (mark & (1 << index)) === (1 << index)
}

export function marksToString(marks: number[]): string {
    return marks.toLocaleString()
}