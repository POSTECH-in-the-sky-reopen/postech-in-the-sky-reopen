import { EnchantItemInfo } from "src/entity/ItemInfo";
import { BattleType } from "src/enums/BattleType";
import { Status } from "./Status";

export interface EquipedInformation {
    status: Status,
    attackBattleType: BattleType | undefined,
    defenseBattleType: BattleType | undefined,
    enchantItemInfo: EnchantItemInfo | undefined,
}