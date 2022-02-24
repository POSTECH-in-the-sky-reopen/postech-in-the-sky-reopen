from enum import IntEnum


class BattleType(IntEnum):
    친화 = 0
    감성 = 1
    계산 = 2
    논리 = 3
    암기 = 4
    NONE = 5


class ItemType(IntEnum):
    WEAPON = 0
    ACCESSORY = 1
    ENCHANT = 2
    FACE = 3
    HAIR = 4
    SUIT = 5
    DECO = 6


class Layer(IntEnum):
    배경 = 0
    망토 = 1
    뒷머리 = 2
    틀 = 3
    앞머리 = 4
    옷 = 5
    얼굴 = 6
    오버레이 = 7
    장비 = 8


class Specialized(IntEnum):
    DEFAULT = 0
    BALANCED = 1
    SPECIAL = 2
    EXTREME_SPECIAL = 3
    REVERSED = 4
    LUCK = 5


class CardinalDirection(IntEnum):
    EAST = 0
    WEST = 1
    SOUTH = 2
    NORTH = 3
