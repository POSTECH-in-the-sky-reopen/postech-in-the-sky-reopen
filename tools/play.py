import sys
from access import Client

def equip(studentId, itemId):
    c = Client(studentId)
    c.player_equipments_equip(itemId)

def cloudtower_challenge(studentId):
    c = Client(studentId)
    c.cloudtower_challenge()

def inventory(studentId):
    c = Client(studentId)
    c.player_inventory_items()

def cloudtower_ranking():
    c = Client()
    c.cloudtower_ranking()

def cloudtower_myfloor(studentId):
    c = Client(studentId)
    c.cloudtower_myfloor()

if __name__ == "__main__":
    if len(sys.argv) == 3:
        if sys.argv[1] == "inv":
            inventory(sys.argv[2])
        if sys.argv[1] == "ctc":
            if sys.argv[2] == "ranking":
                cloudtower_ranking()
            else:
                cloudtower_challenge(sys.argv[2])
        if sys.argv[1] == "ctf":
            cloudtower_myfloor(sys.argv[2])
    if len(sys.argv) == 4:
        if sys.argv[1] == "equip":
            equip(sys.argv[2], sys.argv[3])
        
    