import requests
import string
import random
import jwt
from icecream import ic
from enum_postech_in_the_sky import *
from parse.map import find_cell_id_by_name, read_region
from parse.user import read_users, write_pins
from parse.monster import read_monsters
from parse.coordiItem import read_items_coordi
from parse.enchantItem import read_items_enchant
from parse.equipableItem import read_items_accessory, read_items_weapon
from silhouette import prepareSilhouette, toSilhouetteAccessory, toSilhouetteBossMonster, toSilhouetteCoordi, toSilhouetteEnchant, toSilhouetteMonster, toSilhouetteWeapon
from parse.itemCollection import read_collections

TEST = True
if TEST:
    HOST = "localhost"
    PORT = 9593
else:
    HOST = "localhost"
    PORT = 80
URI = f"http://{HOST}:{PORT}"

class Client:
    def __init__(self, studentId=None, pw=None, jwtSecret=None):
        ic()
        self.studentId = studentId if studentId else "20000000"
        self.pw = (
            pw
            if pw
            else "".join([random.choice(string.ascii_letters) for i in range(0x10)])
        )
        self.s = requests.Session()
        ic(self.studentId, self.pw)

        # set fake admin token
        with open('.env.development.local' if TEST else '.env.production.local') as f:
            for line in f.readlines():
                line = line.strip()
                if not line: continue
                key, value = line.split('=')
                if key == 'JWT_SECRET':
                    jwtSecret = value

        self.token = jwt.encode(
            {"studentId": int(self.studentId), "isAdmin": True}, jwtSecret
        )
        ic(self.token)
        self._admin_session_on()

    def _session_off(self):
        self.s.cookies.clear()

    def _admin_session_on(self):
        self.s.cookies.set("token", self.token)

    def _access(self, route, data, debug=False):
        if debug:
            ic(self.s.cookies)
        ic(route)
        ic(data)
        res = self.s.post(f"{URI}/api/{route}", json=data)
        if debug:
            ic(res.status_code)
        ic(res.json())
        if res.status_code >= 400:  # fail
            ic(res.status_code)
            ic(res.json())
            ic(res.json()["message"])
            # assert False
        return res.json()

    def admin_user_set_admin(self, studentId):
        data = self._access(
            "admin/user/set-admin",
            {
                "studentId": studentId,
            },
        )

    def user_signup(self, pin, password, email):
        data = self._access(
            "user/sign-up",
            {
                "pin": pin,
                "password": password,
                "email": email,
            },
        )

    def user_signin(self, studentId, password):
        data = self._access(
            "user/sign-in",
            {
                "studentId": studentId,
                "password": password,
            },
        )

    def admin_iteminfo_generate(self, info):
        data = self._access("admin/item-info/generate", info)
        return data["itemInfo"]

    def admin_iteminfo_generate_equipable(
        self, name, description, itemType, specialized, battleType, durability
    ):
        data = self._access(
            "admin/item-info/generate",
            {
                "name": name,
                "description": description,
                "itemType": itemType,
                "specialized": specialized,
                "battleType": battleType,
                "durability": durability,
            },
        )
        return data["itemInfo"]

    def admin_iteminfo_generate_coordi(self, name, itemType, layers):
        data = self._access(
            "admin/item-info/generate", {"name": name, "itemType": itemType, "layers": layers}
        )
        return data["itemInfo"]


    def admin_iteminfo_generate_enchant(
        self,
        name,
        itemType,
        enchantSuccess,
        onStart,
        onTurn,
        special,
        isChangeBattleType,
        battleType,
        startStatus,
        effectStatusToSelf,
        effectStatusToEnemy,
        attackCount,
        attackTurn,
        isDroppable,
    ):
        data = self._access(
            "admin/item-info/generate",
            {
                "name": name,
                "itemType": itemType,
                "enchantSuccess": enchantSuccess,
                "onStart": onStart,
                "onTurn": onTurn,
                "special": special,
                "isChangeBattleType": isChangeBattleType,
                "battleType": battleType,
                "startStatus": startStatus,
                "effectStatusToSelf": effectStatusToSelf,
                "effectStatusToEnemy": effectStatusToEnemy,
                "attackCount": attackCount,
                "attackTurn": attackTurn,
                "isDroppable": isDroppable
            },
        )
        return data["itemInfo"]

    def player_inventory_remove(self, itemId):
        self._access("player/inventory/remove", {"itemId": itemId})

    def admin_iteminfo_remove(self, itemInfoId):
        self._access("admin/item-info/remove", {"itemInfoId": itemInfoId})

    def admin_player_inventory_additem_equipable(
        self, playerId, itemInfoId, itemLevel, sharpness
    ):
        data = self._access(
            "admin/player/inventory/add-item",
            {
                "playerId": playerId,
                "itemInfoId": itemInfoId,
                "itemLevel": itemLevel,
                "sharpness": sharpness,
            },
        )
        return data["itemId"]

    def admin_player_inventory_additem_enchant(self, playerId, itemInfoId):
        data = self._access(
            "admin/player/inventory/add-item",
            {"playerId": playerId, "itemInfoId": itemInfoId},
        )
        return data["itemId"]

    def admin_player_inventory_additem_coordi(self, playerId, itemInfoId):
        data = self._access(
            "admin/player/inventory/add-item",
            {"playerId": playerId, "itemInfoId": itemInfoId},
        )
        return data["itemId"]

    def admin_player_setlevel(self, playerId, level):
        self._access(
            "admin/player/set-level",
            {"playerId": playerId, "level": level}
        )
        
    def admin_player_restore_level(self, studentId, level):
        self._access(
            "admin/player/restore-level",
            {"studentId": studentId, "level": level}
        ) 

    def item_getinfo(self, itemId):
        self._access("item/get-info", {"itemId": itemId})

    def player_equipments_equip(self, itemId):
        self._access("player/equipments/equip", {"itemId": itemId})

    def player_equipments_unequip(self, itemType):
        self._access("player/equipments/unequip", {"itemType": itemType})

    def player_equipments_get(self):
        self._access("player/equipments/get", {})

    def player_inventory_items(self):
        self._access("player/inventory/items", {})

    def player_status_check(self):
        self._access("player/status/check", {})

    def player_enchant(self, weaponId, enchantId):
        self._access("player/enchant", {"weaponId": weaponId, "enchantId": enchantId})

    def admin_map_addregion(self, name, level):
        data = self._access("admin/map/add-region", {"name": name, "level": level})
        return data["id"]

    def admin_map_addcell(self, name, regionId, battleType, isCapturable, isTeleportable, isEnding, cellLevel):
        data = self._access(
            "admin/map/add-cell",
            {
                "name": name,
                "regionId": regionId,
                "battleType": battleType,
                "isCapturable": isCapturable,
                "isTeleportable": isTeleportable,
                "isEnding": isEnding,
                "cellLevel": cellLevel,
            },
        )
        return data["id"]

    def admin_map_updatecell(
        self, cellId, adjEastId, adjWestId, adjSouthId, adjNorthId
    ):
        req = {
            "cellId": cellId,
        }
        if adjEastId != None:
            req["adjEastId"] = adjEastId
        if adjWestId != None:
            req["adjWestId"] = adjWestId
        if adjSouthId != None:
            req["adjSouthId"] = adjSouthId
        if adjNorthId != None:
            req["adjNorthId"] = adjNorthId
        self._access("admin/map/update-cell", req)

    def player_location_move(self, cardinalDirection):
        self._access("player/location/move", {"cardinalDirection": cardinalDirection})

    def player_explore(self):
        self._access("player/explore", {})

    def admin_money_donate(self, studentId, amount):
        self._access("admin/money/donate", {"studentId": studentId, "amount": amount})

    def admin_money_donateraw(self, playerId, amount):
        self._access("admin/money/donate-raw", {"playerId": playerId, "amount": amount})

    def admin_monsterinfo_generate(self, name, battleType, minStatus, maxStatus):
        json = self._access(
            "admin/monster-info/generate",
            {
                "name": name,
                "battleType": battleType,
                "minStatus": minStatus,
                "maxStatus": maxStatus,
            },
        )
        monsterInfo = json['monsterInfo']
        toSilhouetteMonster(monsterInfo)

    def admin_monsterinfo_generate(self, info):
        json = self._access("admin/monster-info/generate", info)
        monsterInfo = json['monsterInfo']
        toSilhouetteMonster(monsterInfo)

    def admin_bossmonsterinfo_generate(self, name, battleType, status):
        json = self._access(
            "admin/monster-info/generate-boss",
            {
                "name": name,
                "battleType": battleType,
                "status": status,
            },
        )
        bossMonsterInfo = json['bossMonsterInfo']
        toSilhouetteBossMonster(bossMonsterInfo)

    def admin_bossmonsterinfo_generate2(self, info):
        json = self._access("admin/monster-info/generate-boss", info)
        bossMonsterInfo = json['bossMonsterInfo']
        toSilhouetteBossMonster(bossMonsterInfo)
        
    def admin_player_createGroup(self, groupNum):
        json = self._access('admin/player/create-group', {
            'groupNum': groupNum
        }, True)
        
    def admin_player_updateGroup(self, playerId, groupNum):
        json = self._access('admin/player/update-group', {
            'playerId': playerId,
            'groupNum': groupNum
        }, True)


    def makeSiege(self, playerId, damage):
        json = self._access('admin/siege/mock-siege', {
            'playerId': playerId,
            'damage': damage
        }, True)


    def movePlayer(self, playerId, cellId):
        json = self._access('admin/player/move', {
            'playerId': playerId,
            'cellId': cellId
        }, True)


    def currentPhase(self):
        json = self._access('admin/siege/current-phase', {}, True)
        return json['phase']

    def generatePhase(self):
        json = self._access('admin/siege/generate-phase', {}, True)

    def updatePhase(self, num):
        json = self._access('admin/siege/update-phase',
                    {'num': num, }, True)

    def increasePhase(self):
        json = self._access('admin/siege/increase-phase',
                    {}, True)

    def updateGroup(self, playerId, groupNum):
        json = self._access('admin/player/update-group', {
            'playerId': playerId,
            'groupNum': groupNum
        }, True)

    def admin_group_members(self, groupNum):
        json = self._access('admin/group/members', {
            'groupNum': groupNum
        }, True)
        return json['members']


    def addGroupColumn(self):
        json = self._access('admin/player/add-column-group', {}, True)


    def updateOccupation(self):
        json = self._access('admin/siege/update-occupation', {}, True)

    def updateOccupation(self, phase):
        json = self._access('admin/siege/update-occupation', {'phase': phase}, True)


    def updateCellOccupation(self, cellId):
        json = self._access('admin/siege/update-cell',
                    {'cellId': cellId, }, True)

    def updateCellOccupation(self, cellId, phase):
        json = self._access('admin/siege/update-cell',
                    {'cellId': cellId, 'phase': phase}, True)

    def getSiegeCells(self):
        json = self._access('map/get-siege-cells',
                    {}, False)
        return json['cells']

    def generateItemCollection(self, name, itemInfos):
        json = self._access('admin/collection/generate',
              {'collectionName': name,
               'itemInfoNames': itemInfos}, True)

    def addtoGroupCollection(self):
        json = self._access('admin/collection/add-to-group',
                  {}, True)

    def resetHonored(self, num):
        json = self._access('admin/player/achievement/reset',
                  {'playerId': num }, True)

    def checkAchievement(self):
        json = self._access('player/achievement/check',
                  {}, False)

    def validateItemCollection(self):
        json = self._access('admin/collection/validate',
                            {}, True)
        
    def addMissionBuff(self,groupNum,effectName):
        json = self._access('admin/group/add-mission-buff',
                            {'groupNum':groupNum,'effectName':effectName}, True)

    def add_region_and_cells(self, levels):
        self._admin_session_on()
        cellIds = []
        cellData = []
        for level in levels:
            data = read_region(level)
            regionId = self.admin_map_addregion(data["name"], data["level"])
            for cell in data["cells"]:
                cellIds.append(
                    self.admin_map_addcell(
                        cell["name"], regionId, cell["battleType"], cell["isCapturable"], cell["isTeleportable"], cell["isEnding"], cell["cellLevel"]
                    )
                )
            cellData += data["cells"]
        for cell, id in zip(cellData, cellIds):
            adjEast = (
                find_cell_id_by_name(cellIds, cellData, cell["adjEast"])
                if "adjEast" in cell
                else None
            )
            adjWest = (
                find_cell_id_by_name(cellIds, cellData, cell["adjWest"])
                if "adjWest" in cell
                else None
            )
            adjSouth = (
                find_cell_id_by_name(cellIds, cellData, cell["adjSouth"])
                if "adjSouth" in cell
                else None
            )
            adjNorth = (
                find_cell_id_by_name(cellIds, cellData, cell["adjNorth"])
                if "adjNorth" in cell
                else None
            )
            self.admin_map_updatecell(
                id, adjEast, adjWest, adjSouth, adjNorth
            )

    def add_monsters(self):
        self._admin_session_on()
        data = read_monsters()
        for monster_info in data["monsters"]:
            self.admin_monsterinfo_generate(monster_info)
        for monster_info in data["boss_monsters"]:
            self.admin_bossmonsterinfo_generate(monster_info['name'], monster_info['battleType'], monster_info['maxStatus'])

    def add_items_weapon(self):
        self._admin_session_on()
        data = read_items_weapon()
        for weapon_info in data["items_weapon"]:
            itemInfo = self.admin_iteminfo_generate(weapon_info)
            toSilhouetteWeapon(itemInfo)
        return len(data["items_weapon"])

    def add_items_accessory(self):
        self._admin_session_on()
        data = read_items_accessory()
        for accessory_info in data["items_accessory"]:
            itemInfo = self.admin_iteminfo_generate(accessory_info)
            toSilhouetteAccessory(itemInfo)
        return len(data["items_accessory"])

    def add_items_enchant(self):
        self._admin_session_on()
        data = read_items_enchant()
        for enchant_info in data["items_enchant"]:
            itemInfo = self.admin_iteminfo_generate(enchant_info)
            toSilhouetteEnchant(itemInfo)
        return len(data["items_enchant"])

    def add_items_enchant_last(self):
        self._admin_session_on()
        data = read_items_enchant()
        for enchant_info in [data["items_enchant"][-1]]:
            ic(enchant_info)
            itemInfo = self.admin_iteminfo_generate(enchant_info)
            toSilhouetteEnchant(itemInfo)
        return len(data["items_enchant"])

    def add_items_coordi(self):
        self._admin_session_on()
        data = read_items_coordi()
        for coordi_info in data["items_coordi"]:
            itemInfo = self.admin_iteminfo_generate(coordi_info)
            toSilhouetteCoordi(itemInfo)
        return len(data["items_coordi"])

    def add_items(self):
        weapon_cnt = self.add_items_weapon()
        accessory_cnt = self.add_items_accessory()
        enchant_cnt = self.add_items_enchant()
        coordi_cnt = self.add_items_coordi()
        return (weapon_cnt, accessory_cnt, enchant_cnt, coordi_cnt)
    
    def add_item_collections(self):
        _collections = read_collections()
        for _collection in _collections:
            self.generateItemCollection(_collection['name'],_collection['itemInfos'])

    def restore_item(self, studentId, itemInfoName, level = -1, sharpness = 0):
        if level == -1:
            json = self._access('admin/player/inventory/restore-item',
                  {'studentId': studentId,
                   'itemInfoName': itemInfoName}, True)
        elif level > 0:
            json = self._access('admin/player/inventory/restore-item',
                  {'studentId': studentId,
                   'itemInfoName': itemInfoName,
                   'itemLevel':level,
                   'sharpness':sharpness }, True)
        else:
            print('you should follow properties for item')
    
    def capture_cell(self, cellName, groupNum):
        json = self._access('admin/siege/capture-cell',
                  {'cellName': cellName,
                   'groupNum': groupNum}, True)
        
    def restore_item_with_enchant(self, studentId, itemInfoName, level , sharpness, enchantInfo):
        if level > 0:
            json = self._access('admin/player/inventory/restore-item-enchant',
                  {'studentId': studentId,
                   'itemInfoName': itemInfoName,
                   'itemLevel':level,
                   'sharpness':sharpness,
                   'enchantInfo': enchantInfo}, True)
    
    def cloudtower_challenge(self):
        json = self._access('cloudtower/challenge',{}, False)
        
    def cloudtower_ranking(self):
        json = self._access('cloudtower/ranking',{}, False)
        
    def cloudtower_myfloor(self):
        json = self._access('cloudtower/my-floor', {}, False)
        
    def admin_blacktiger(self):
        json = self._access('admin/award/blacktiger',{}, True)

if __name__ == "__main__":
    c = Client()

    for i in range(15 + 1):
        c.admin_player_createGroup(i)
    c.add_region_and_cells([1, 2, 3, 4, 5])
    prepareSilhouette()
    c.add_monsters()
    c.generatePhase()
    weapon_cnt, accessory_cnt, enchant_cnt, coordi_cnt = c.add_items()
