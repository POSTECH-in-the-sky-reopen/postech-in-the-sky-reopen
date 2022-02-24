from pathlib import Path
import shutil
from PIL import Image

from parse.enum import stringify_layer


def _toSilhouette(_from: str, _to: str):
    im = Image.open(_from)
    alpha = im.getchannel("A")
    black = Image.new("LA", im.size, 0)
    black.putalpha(alpha)
    if Path(_to).is_file():
        im_to = Image.open(_to).convert("RGBA")
        x, y = im_to.size
        black = black.convert("RGBA")
        black.paste(im_to, (0, 0, x, y), im_to)
    black.save(_to)


def toSilhouetteMonster(monsterInfo):
    _toSilhouette(
        f"public/static/몬스터/{monsterInfo['name']}.png",
        f"public/static/몬스터 실루엣/{monsterInfo['silhouetteId']}.png",
    )


def toSilhouetteBossMonster(bossMonsterInfo):
    _toSilhouette(
        f"public/static/몬스터/{bossMonsterInfo['name']}.png",
        f"public/static/몬스터 실루엣/{bossMonsterInfo['silhouetteId']}.png",
    )


def toSilhouetteWeapon(itemInfo):
    _toSilhouette(
        f"public/static/무기 아이콘/{itemInfo['name']}.png",
        f"public/static/무기 아이콘 실루엣/{itemInfo['silhouetteId']}.png",
    )


def toSilhouetteAccessory(itemInfo):
    _toSilhouette(
        f"public/static/장신구/{itemInfo['name']}.png",
        f"public/static/장신구 실루엣/{itemInfo['silhouetteId']}.png",
    )


def toSilhouetteEnchant(itemInfo):
    _toSilhouette(
        f"public/static/UI 아이콘/인챈트북.png",
        f"public/static/인챈트 실루엣/{itemInfo['silhouetteId']}.png",
    )


def toSilhouetteCoordi(itemInfo):
    for layer in itemInfo['layers']:
        _toSilhouette(
            f"public/static/코디/{stringify_layer(layer)}_{itemInfo['name']}.png",
            f"public/static/코디 실루엣/{itemInfo['silhouetteId']}.png",
        )


def prepareSilhouette():
    silhouettePath = Path("public/static/몬스터 실루엣")
    if silhouettePath.exists() and silhouettePath.is_dir():
        shutil.rmtree(silhouettePath)
    silhouettePath.mkdir(parents=True, exist_ok=True)

    silhouettePath = Path("public/static/무기 아이콘 실루엣")
    if silhouettePath.exists() and silhouettePath.is_dir():
        shutil.rmtree(silhouettePath)
    silhouettePath.mkdir(parents=True, exist_ok=True)

    silhouettePath = Path("public/static/장신구 실루엣")
    if silhouettePath.exists() and silhouettePath.is_dir():
        shutil.rmtree(silhouettePath)
    silhouettePath.mkdir(parents=True, exist_ok=True)

    silhouettePath = Path("public/static/인챈트 실루엣")
    if silhouettePath.exists() and silhouettePath.is_dir():
        shutil.rmtree(silhouettePath)
    silhouettePath.mkdir(parents=True, exist_ok=True)

    silhouettePath = Path("public/static/코디 실루엣")
    if silhouettePath.exists() and silhouettePath.is_dir():
        shutil.rmtree(silhouettePath)
    silhouettePath.mkdir(parents=True, exist_ok=True)


if __name__ == "__main__":
    pass
