from enum_postech_in_the_sky import BattleType
from parse.data import parse_tsv
from parse.enum import parse_battletype

def parse_map(regionName):
    ret = []
    map = parse_tsv(f"tools/data/region/{regionName}.tsv", 0, 1)
    cell_info_table = parse_tsv('tools/data/cell.tsv', 1)
    for y, row in enumerate(map[::-1]):
        for x, cell_raw in enumerate(row):
            cell_raw = cell_raw
            if cell_raw == '': continue
            name, adj = parse_cell_adj(map[::-1], x, y)
            info = parse_cell_info(cell_info_table, name)
            d1 = dict(info,** adj )
            d1 = dict(d1, **{ 'x': x, 'y': y })
            ret.append(d1)
            
    return ret

def parse_cell_adj(map, x, y):
    ret = {}
    y_limit, x_limit = len(map[0])-1, len(map)-1
    assert map[y][x] != ''
    if x < x_limit and map[y][x+1] != '':
        ret['adjEast'] = map[y][x+1]
    if x > 0 and map[y][x-1] != '':
        ret['adjWest'] = map[y][x-1]
    if y > 0 and map[y-1][x] != '':
        ret['adjSouth'] = map[y-1][x]
    if y < y_limit and map[y+1][x] != '':
        ret['adjNorth'] = map[y+1][x]
    return map[y][x], ret
    
def parse_cell_info(cell_info_table, name):
    for line in cell_info_table:
        _name, battleType, isCapturable, regionId, isTeleportable, isEnding, cellLevel = line
        if _name != name: continue
        return {
            'name': name,
            'regionId': int(regionId),
            'battleType': parse_battletype(battleType),
            'isCapturable': True if isCapturable == '1' else False,
            'isTeleportable': True if isTeleportable == '1' else False,
            'isEnding': True if isEnding == '1' else False,
            'cellLevel': int(cellLevel)
        }
    print(cell_info_table, name, len(name))
    assert False

def find_cell_id_by_name(cellIds, cells, name):
    return cellIds[[i for i, x in enumerate(cells) if x['name'] == name][0]]

def read_region(level):
    name = f"지역{level}"
    cells = parse_map(name)

    return {
        'name': name,
        'level': level,
        'cells': cells
    }

