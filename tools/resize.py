import os
from PIL import Image, ImageOps

def favicon():
    im = Image.open("public/static/favicon.png")
    favicon = im.resize((192, 192))
    favicon.save("public/static/favicon_192.png")
    favicon = im.resize((32, 32))
    favicon.save("public/static/favicon_32.png")
    favicon.save("public/static/favicon.ico")


def resize(filename: str, width = 960):
    im = Image.open(filename)
    im = ImageOps.exif_transpose(im)
    w, h = im.size
    if w == width: return
    ratio = width / float(w)
    h_resized = int(float(h) * ratio)
    im_resized = im.resize((width, h_resized), Image.ADAPTIVE)
    im_resized.save(filename)


if __name__ == "__main__":
    for entry in os.listdir('public/static/배경/'):
        filename = os.path.join(f'public/static/배경/{entry}')
        if os.path.isfile(filename):
            resize(filename)
    favicon()

