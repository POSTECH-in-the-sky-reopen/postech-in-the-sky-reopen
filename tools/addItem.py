import sys
from access import Client
from parse.data import parse_tsv


def parse_equipable_item_restore(tsv):
    ret = []
    item_restore_table = parse_tsv(tsv, 1)
    for item_restore_info in item_restore_table:
        info = parse_equipable_item_restore_info(item_restore_info)
        ret.append(info)
    return ret


def parse_enchant_item_restore(tsv):
    ret = []
    item_restore_table = parse_tsv(tsv, 1)
    for item_restore_info in item_restore_table:
        info = parse_enchant_item_restore_info(item_restore_info)
        ret.append(info)
    return ret

def parse_enchant_weapon_item_restore(tsv):
    ret = []
    item_restore_table = parse_tsv(tsv, 1)
    for item_restore_info in item_restore_table:
        info = parse_enchant_weapon_item_restore_info(item_restore_info)
        ret.append(info)
    return ret

def parse_equipable_item_restore_info(item_restore_info):
    _item_restore_info = item_restore_info
    studentId = int(_item_restore_info[0])
    itemInfoName = _item_restore_info[1]
    itemLevel = int(_item_restore_info[2])
    sharpness = int(_item_restore_info[3])
    return {'studentId': studentId,
            'itemInfoName': itemInfoName,
            'itemLevel': itemLevel,
            'sharpness': sharpness}


def parse_enchant_item_restore_info(item_restore_info):
    _item_restore_info = item_restore_info
    studentId = int(_item_restore_info[0])
    itemInfoName = _item_restore_info[1]
    return {'studentId': studentId,
            'itemInfoName': itemInfoName}

def parse_enchant_weapon_item_restore_info(item_restore_info):
    _item_restore_info = item_restore_info
    studentId = int(_item_restore_info[0])
    itemInfoName = _item_restore_info[1]
    itemLevel = int(_item_restore_info[2])
    sharpness = int(_item_restore_info[3])
    enchantInfo = _item_restore_info[4]
    return {'studentId': studentId,
            'itemInfoName': itemInfoName,
            'itemLevel': itemLevel,
            'sharpness': sharpness,
            'enchantInfo': enchantInfo}


def restore_equipable(tsv):
    data = parse_equipable_item_restore(tsv)
    c = Client()
    for x in data:
        if x['itemLevel'] < 1:
            continue
        c.restore_item(x['studentId'], x['itemInfoName'],
                             x['itemLevel'], x['sharpness'])


def restore_enchant(tsv):
    data = parse_enchant_item_restore(tsv)
    c = Client()
    for x in data:
        c.restore_item(x['studentId'], x['itemInfoName'])


def restore_enchant_weapon(tsv):
    data = parse_enchant_weapon_item_restore(tsv)
    c = Client()
    for x in data:
        if x['itemLevel'] < 1:
            continue
        c.restore_item_with_enchant(x['studentId'], x['itemInfoName'],
                             x['itemLevel'], x['sharpness'], x['enchantInfo'])
        

def restore_one(studentId, itemInfoName, itemLevel=-1, sharpness=0, enchantInfo = ''):
    c = Client()
    if itemLevel == -1:
        c.restore_item(int(studentId), (itemInfoName))
    elif int(itemLevel) > 0:
        if enchantInfo == '':
            c.restore_item(int(studentId), (itemInfoName), int(itemLevel), int(sharpness))
        else:
            c.restore_item_with_enchant(int(studentId), (itemInfoName), int(itemLevel), int(sharpness), enchantInfo)
    else:
        print('you should follow properties for item')

if __name__ == "__main__":
    if len(sys.argv) == 3:
        if sys.argv[1] == "--e":
            restore_equipable(sys.argv[2])
        elif sys.argv[1] == "--c":
            restore_enchant(sys.argv[2])
        elif sys.argv[1] == "--w":
            restore_enchant_weapon(sys.argv[2])
    elif len(sys.argv) == 4:
        if sys.argv[1] == "--p":
            restore_one(sys.argv[2],sys.argv[3])
    elif len(sys.argv) == 6:
        if sys.argv[1] == "--p":
            restore_one(sys.argv[2],sys.argv[3],int(sys.argv[4]),int(sys.argv[5]))
    elif len(sys.argv) == 7:
        if sys.argv[1] == "--p":
            restore_one(sys.argv[2],sys.argv[3],int(sys.argv[4]),int(sys.argv[5]),sys.argv[6])
