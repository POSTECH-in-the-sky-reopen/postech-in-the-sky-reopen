import requests
import string
import random
import jwt
from icecream import ic
from enum_postech_in_the_sky import *
from parse.enchantItem import read_items_enchant

TEST = True
if TEST:
    HOST = "localhost"
    PORT = 3000
else:
    HOST = "localhost"
    PORT = 80
URI = f"http://{HOST}:{PORT}"

class Client:
    def __init__(self, studentId=None, pw=None, jwt_secret=None):
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
        self.token = jwt.encode(
            {"studentId": int(self.studentId), "isAdmin": True}, input("JWT SECRET >> ")
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
    
    def admin_iteminfo_update(self, info):
        data = self._access("admin/item-info/update", info)
    
    def patch_items_enchant(self):
        self._admin_session_on()
        data = read_items_enchant()
        for enchant_info in data["items_enchant"]:
            itemInfo = self.admin_iteminfo_update(enchant_info)
        return len(data["items_enchant"])

if __name__ == "__main__":
    c = Client()
    
    c.patch_items_enchant()


    
