import sys
from access import Client
import math

from parse.data import parse_tsv


def parse_item_restore(tsv):
    ret = []
    item_restore_table = parse_tsv(tsv, 1)
    for item_restore_info in item_restore_table:
        info = parse_item_restore_info(item_restore_info)
        ret.append(info)
    return ret


def parse_item_restore_info(item_restore_info):
    _item_restore_info = item_restore_info
    itemInfoName = _item_restore_info[0]
    return {'itemInfoName': itemInfoName}


def restore_equipable(data, studentId, regionLevel):
    c = Client()
    if regionLevel < 1:
        return
    for x in data:
        c.restore_item(studentId, x['itemInfoName'], regionLevel, 0)


def restore_enchant(data, studentId):
    c = Client()
    for x in data:
        c.restore_item(studentId, x['itemInfoName'])
        c.restore_item(studentId, x['itemInfoName'])
        c.restore_item(studentId, x['itemInfoName'])


def parse_player(tsv):
    ret = []
    player_table = parse_tsv(tsv, 1)
    for player_info in player_table:
        info = parse_player_info(player_info)
        ret.append(info)
    return ret


def parse_player_info(item_restore_info):
    _item_restore_info = item_restore_info
    playerId = int(_item_restore_info[0])
    level = int(_item_restore_info[1])
    regionLevel = int(_item_restore_info[2])
    money = int(_item_restore_info[3])
    return {'studentId': playerId,
            'level': level,
            'regionLevel': regionLevel,
            'money': money}


def restore(player_tsv):
    p_data = parse_player(player_tsv)
    e_data = parse_item_restore("tools/data/restore_equipable.tsv")
    c_data = parse_item_restore("tools/data/restore_enchant.tsv")
    b_data = parse_item_restore("tools/data/restore_basic.tsv")
    c = Client()
    for x in p_data:
        c.admin_player_restore_level(x['studentId'], x['level'])
        c.admin_money_donate(x['studentId'], x['money'])
        restore_equipable(e_data, x['studentId'], x['regionLevel'])
        for i in range(1, x['regionLevel']):
            restore_equipable(b_data, x['studentId'], i)
        restore_enchant(c_data, x['studentId'])

if __name__ == "__main__":
    if len(sys.argv) == 2:
        restore(sys.argv[1])
    else:
        print('you should give an argument with .tsv')
