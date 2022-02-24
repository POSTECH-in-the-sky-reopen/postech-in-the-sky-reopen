import sys
from access import Client

from parse.data import parse_tsv


def parse_siege_cell_restore(tsv):
    ret = []
    siege_cell_restore_table = parse_tsv(tsv, 1)
    for siege_cell_restore_info in siege_cell_restore_table:
        info = parse_siege_cell_restore_info(siege_cell_restore_info)
        ret.append(info)
    return ret


def parse_siege_cell_restore_info(siege_cell_restore_info):
    cellName, groupNum = siege_cell_restore_info
    return {'cellName': cellName,
            'groupNum': groupNum}


def capture(tsv):
    data = parse_siege_cell_restore(tsv)
    c = Client()
    for x in data:
        c.capture_cell(x['cellName'],x['groupNum'])

if __name__ == "__main__":
    if len(sys.argv) == 2:
        capture(sys.argv[1])
    