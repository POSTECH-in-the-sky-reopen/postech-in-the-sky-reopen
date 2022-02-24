from parse.data import parse_tsv
from parse.enum import parse_itemtype_coordi, parse_layer


def parse_items_coordi():
    ret = []
    coordi_info_table = parse_tsv(f"tools/data/coordi.tsv", 1)
    for coordi_info in coordi_info_table:
        if coordi_info[0] == '': continue
        info = parse_coordi_item_info(coordi_info)
        ret.append(info)
    return ret
    

def parse_coordi_item_info(coordi_item_info):
    (
        itemtype,
        layer,
        name,
        description,
        image,
        _,
    ) = coordi_item_info
    return {
        "itemType": parse_itemtype_coordi(itemtype),
        "layers": [parse_layer(layer)],
        "name": name,
        "description": description if description else '없음' ,
        "image": image,
    }

def read_items_coordi():
    items_coordi = parse_items_coordi()

    items = []
    ret = []
    for item in items_coordi:
        if item['name'] not in items:
            items.append(item['name'])
            ret.append(item)
        else:
            for x in ret:
                if x['name'] == item['name'] and item['image'] != "(없음)":
                    x['layers'].extend(item['layers'])
                    break
    print(ret)
    return {"items_coordi": ret}
