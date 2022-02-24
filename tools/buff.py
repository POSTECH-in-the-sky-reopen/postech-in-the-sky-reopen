import sys
from access import Client


def addMission(effectName, groups):
    groups = [int(x) for x in groups]
    c = Client()
    for group in groups:
        c.addMissionBuff(int(group),effectName)

def validateAndMission(effectName, groups):
    groups = [int(x) for x in groups]
    c = Client()
    c.validateItemCollection()
    for group in groups:
        c.addMissionBuff(group,effectName)

def validate():
    c = Client()
    c.validateItemCollection()
    
    
if __name__ == "__main__":
    if len(sys.argv) >= 2:
        if sys.argv[1]=="--a":
            addMission(sys.argv[2], sys.argv[3:])
        else:
            validateAndMission(sys.argv[1], sys.argv[2:])
    else:
        if sys.argv[1]=="--v":
            validate()