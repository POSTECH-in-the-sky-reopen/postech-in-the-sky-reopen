from parse.enum import parse_battletype, parse_status
from parse.data import parse_tsv

def parse_monsters():
    ret = []
    monster_info_table = parse_tsv(f"tools/data/monster.tsv", 1)
    for monster_info in monster_info_table:
        info = parse_monster_info(monster_info)
        ret.append(info)
    return ret

def parse_boss_monsters():
    ret = []
    boss_monster_info_table = parse_tsv(f"tools/data/bossmonster.tsv", 1)
    for boss_monster_info in boss_monster_info_table:
        info = parse_monster_info(boss_monster_info)
        ret.append(info)
    return ret

def parse_monster_info(monster_info):
    name, battleType, minStatus, maxStatus = monster_info
    return {
        'name': name,
        'battleType': parse_battletype(battleType),
        'minStatus': parse_status(minStatus),
        'maxStatus': parse_status(maxStatus)
    }

def read_monsters():
    monsters = parse_monsters()
    boss_monsters = parse_boss_monsters()
    return {
        'monsters': monsters,
        'boss_monsters': boss_monsters,
    }

