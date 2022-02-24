from enum_postech_in_the_sky import ItemType
from parse.data import parse_tsv
from parse.enum import parse_battletype, parse_status


def parse_items_enchant():
    ret = []
    enchant_info_table = parse_tsv(f"tools/data/enchant.tsv", 1)
    for enchant_info in enchant_info_table:
        info = parse_enchant_item_info(enchant_info)
        ret.append(info)
    return ret


def parse_enchant_item_info(enchant_item_info):
    (
        name,
        description,
        enchantSuccess,
        onStart,
        onTurn,
        special,
        isChangeBattleType,
        battleType,
        startStatus,
        effectStatusToSelf,
        effectStatusToEnemy,
        attackCount,
        attackTurn,
        isDroppable,
    ) = enchant_item_info
    return {
        "name": name,
        "description": description,
        "itemType": ItemType.ENCHANT,
        "enchantSuccess": int(enchantSuccess),
        "onStart": onStart == "1",
        "onTurn": onTurn == "1",
        "special": int(special),
        "isChangeBattleType": isChangeBattleType == "1",
        "battleType": parse_battletype(battleType),
        "startStatus": parse_status(startStatus),
        "effectStatusToSelf": parse_status(effectStatusToSelf),
        "effectStatusToEnemy": parse_status(effectStatusToEnemy),
        "attackCount": int(attackCount),
        "attackTurn": int(attackTurn),
        "isDroppable": isDroppable == "1"
    }


def read_items_enchant():
    items_enchant = parse_items_enchant()
    return {"items_enchant": items_enchant}
