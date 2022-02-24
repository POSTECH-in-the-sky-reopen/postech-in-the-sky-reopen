import re
from icecream import ic
from enum_postech_in_the_sky import BattleType, ItemType
from parse.enum import parse_battletype, parse_specialized
from parse.data import parse_tsv


def parse_items_weapon():
    ret = []
    weapon_info_table = parse_tsv(f"tools/data/weapon.tsv", 1)
    for weapon_info in weapon_info_table:
        info = dict( parse_equipable_item_info(weapon_info) ,** {"itemType": ItemType.WEAPON})
        ret.append(info)
    return ret


def parse_items_accessory():
    ret = []
    accessory_info_table = parse_tsv(f"tools/data/accessory.tsv", 1)
    for accessory_info in accessory_info_table:
        info = dict(parse_equipable_item_info(accessory_info) ,** {"itemType": ItemType.ACCESSORY})
        ret.append(info)
    return ret


def parse_equipable_item_info(equipable_item_info):
    battleType, name, description, specialized, durability = equipable_item_info
    return {
        "battleType": parse_battletype(battleType),
        "name": name,
        "description": description,
        "specialized": parse_specialized(specialized),
        "durability": durability,
    }


def read_items_weapon():
    items_weapon = parse_items_weapon()
    return {"items_weapon": items_weapon}


def read_items_accessory():
    items_accessory = parse_items_accessory()
    return {"items_accessory": items_accessory}



if __name__ == "__main__":
    p = re.compile(r"[^\d-]*(-?\d+)" * 8 + r".*", re.MULTILINE | re.DOTALL)

    while True:
        table = ""
        for i in range(4):
            table += input(">" * (i + 1) + " ")
        table = table.replace(" ", "")
        m = p.match(table)
        res = m.groups()

        ret = []
        for i in range(3):
            ret.append(
                {
                    "attack": res[i],
                    "defense": res[3 + i],
                    "hpmax": res[6],
                    "luck": res[7],
                }
            )
        ic(ret)
