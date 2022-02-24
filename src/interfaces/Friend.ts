import { Cell } from "src/entity/Cell";
import { Equipments } from "./Equipments";

export function daytime(hour: number): string{
    return ((hour < 12) ? "오전": "오후")
}

export function getFriendDate(date: Date): string{
    return (date.getMonth() + 1) + "월 " 
        + date.getDate() + "일 " 
        + daytime(date.getHours())
}

export interface Friend{
    name: string,
    honored: string | undefined,
    equipments: Equipments
    location: Cell
    recentAccessedAt: string
}