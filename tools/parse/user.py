from parse.data import parse_xlsx, append_xlsx

def parse_users(isAdmin=False):
    ret = []
    user_info_table = parse_xlsx(f"tools/data/user.xlsx" if not isAdmin else f"tools/data/admin.xlsx")
    for name, studentId, group in zip(user_info_table['성명'], user_info_table['학번'], user_info_table['분반']):
        info = {
            'name': name,
            'studentId': studentId,
            'group': group,
        }
        ret.append(info)
    return ret

def read_users(isAdmin=False):
    users = parse_users(isAdmin)
    return {
        'users': users
    }

def write_pins(pins, isAdmin=False):
    append_xlsx("tools/data/user.xlsx" if not isAdmin else f"tools/data/admin.xlsx", '핀번호', pins)
