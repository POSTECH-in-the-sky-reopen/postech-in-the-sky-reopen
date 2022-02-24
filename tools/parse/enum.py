from enum_postech_in_the_sky import BattleType, ItemType, Layer, Specialized


def parse_status(status):
    attack, defense, hpmax, luck = status.split(",")
    return {"attack": float(attack), "defense": float(defense), "hpmax": float(hpmax), "luck": float(luck)}


def parse_battletype(battletype):
    if battletype == "감성":
        return BattleType.감성
    if battletype == "계산":
        return BattleType.계산
    if battletype == "논리":
        return BattleType.논리
    if battletype == "암기":
        return BattleType.암기
    if battletype == "친화":
        return BattleType.친화
    if battletype == "NONE":
        return BattleType.NONE
    return BattleType.NONE


def parse_specialized(specialized):
    if specialized == "0":
        return Specialized.DEFAULT
    if specialized == "1":
        return Specialized.BALANCED
    if specialized == "2":
        return Specialized.SPECIAL
    if specialized == "3":
        return Specialized.EXTREME_SPECIAL
    if specialized == "4":
        return Specialized.REVERSED
    if specialized == "5":
        return Specialized.LUCK


def parse_itemtype_coordi(itemtype):
    if itemtype == "옷":
        return ItemType.SUIT
    if itemtype == "헤어":
        return ItemType.HAIR
    if itemtype == "얼굴":
        return ItemType.FACE
    if itemtype == "악세사리":
        return ItemType.DECO
    assert False


def parse_layer(layer):
    if layer == "배경":
        return Layer.배경
    if layer == "망토":
        return Layer.망토
    if layer == "뒷머리":
        return Layer.뒷머리
    if layer == "틀":
        return Layer.틀
    if layer == "앞머리":
        return Layer.앞머리
    if layer == "옷":
        return Layer.옷
    if layer == "얼굴":
        return Layer.얼굴
    if layer == "오버레이":
        return Layer.오버레이
    if layer == "장비":
        return Layer.장비


def stringify_layer(layer: Layer):
    if layer == Layer.배경:
        return "배경"
    if layer == Layer.망토:
        return "망토"
    if layer == Layer.뒷머리:
        return "뒷머리"
    if layer == Layer.틀:
        return "틀"
    if layer == Layer.앞머리:
        return "앞머리"
    if layer == Layer.옷:
        return "옷"
    if layer == Layer.얼굴:
        return "얼굴"
    if layer == Layer.오버레이:
        return "오버레이"
    if layer == Layer.장비:
        return "장비"
