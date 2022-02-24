from icecream import ic
from enum_postech_in_the_sky import *
from parse.data import parse_tsv

def parse_npcs():
    ret = []
    npc_info_table = parse_tsv(f"data/npc.tsv", 1)
    for npc_info in npc_info_table:
        info = parse_npc_info(npc_info)
        ret.append(info)
    return ret


def parse_npc_info(npc_info):
    name, statement = npc_info
    return {
        'name': name,
        'statement': statement
    }

def read_npcs():
    npcs = parse_npcs()
    return {
        'npcs': npcs,
    }

ic(read_npcs())