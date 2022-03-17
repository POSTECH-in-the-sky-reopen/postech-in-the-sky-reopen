import sys
from access import Client


def look():
    c = Client()
    cells = c.getSiegeCells()
    for cell in cells:
        name = cell['name']
        group = cell['group']
        if group['num'] > 0:
            print(f"{name}: {group['num']}분반")
        else:
            print(f"{name}: 미점령")


def update(money, itemId):
    c = Client()
    phase = c.currentPhase()
    c.increasePhase()
    cells = c.getSiegeCells()
    for cell in cells:
        id = cell['id']
        c.updateCellOccupation(id, phase)

    cells = c.getSiegeCells()
    for cell in cells:
        id = cell['id']
        group = cell['group']

        members = c.admin_group_members(group['num'])
        for member in members:
            c.admin_money_donateraw(member['id'], money)
            c.admin_player_inventory_additem_enchant(member['id'], itemId)


if __name__ == "__main__":
    if len(sys.argv) == 3:
        update(sys.argv[1], sys.argv[2])
        look()
    elif len(sys.argv) == 1:
        look()
        