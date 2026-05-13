from PIL import Image, ImageDraw
import os

assets_root = os.path.join(os.path.dirname(__file__), '..', 'assets')
helpers = [
    ('helper_knecht', (139,115,85)),
    ('helper_handwerker', (192,192,192)),
    ('helper_meister', (255,215,0))
]

coins = [
    ('coin_bronze', (191,135,79)),
    ('coin_silver', (188,200,213)),
    ('coin_gold', (255,215,106)),
    ('coin_titanium', (176,248,255))
]

os.makedirs(os.path.join(assets_root, 'helpers'), exist_ok=True)
os.makedirs(os.path.join(assets_root, 'coins'), exist_ok=True)

FRAME_W = 48
FRAME_H = 48

# helper sprites: 25 frames layout as in manifest
for name, color in helpers:
    frames = 25
    sheet = Image.new('RGBA', (FRAME_W * frames, FRAME_H), (0,0,0,0))
    for i in range(frames):
        fx = i * FRAME_W
        # draw onto small 16x16 pixel canvas for crisper pixel-art when scaled
        base = Image.new('RGBA', (16,16), (0,0,0,0))
        bd = ImageDraw.Draw(base)
        # head (5x4) at top
        bd.rectangle([5,1,10,5], fill=(237,210,171))
        # eyes
        bd.point((6,3), fill=(30,20,10))
        bd.point((9,3), fill=(30,20,10))
        # body
        bd.rectangle([5,6,10,13], fill=color)
        # legs
        bd.rectangle([6,12,7,15], fill=(60,40,20))
        bd.rectangle([8,12,9,15], fill=(60,40,20))
        # headgear/hat
        if name == 'helper_handwerker':
            bd.rectangle([4,0,11,1], fill=(100,100,100))
        if name == 'helper_meister':
            bd.rectangle([4,0,11,1], fill=(180,120,40))
        # arms and tool depending on animation phase
        if 10 <= i <= 15:  # dig frames -> show shovel to the right
            bd.rectangle([11,8,13,10], fill=(150,110,80))
            bd.rectangle([12,10,14,12], fill=(120,120,120))
            bd.rectangle([3,8,5,9], fill=(200,170,120))
        elif 4 <= i <= 9:  # walk
            phase = (i - 4) % 6
            offset = -1 if phase < 3 else 1
            bd.rectangle([3+offset,8,5+offset,9], fill=(200,170,120))
            bd.rectangle([10-offset,8,12-offset,9], fill=(200,170,120))
        else:
            bd.rectangle([3,8,5,9], fill=(200,170,120))
            bd.rectangle([10,8,12,9], fill=(200,170,120))

        up = base.resize((FRAME_W, FRAME_H), resample=Image.NEAREST)
        sheet.paste(up, (fx,0), up)
    path = os.path.join(assets_root, 'helpers', f"{name}.png")
    sheet.save(path)
    print('Wrote', path)

# coins: 8-frame spin
for name, color in coins:
    frames = 8
    sheet = Image.new('RGBA', (FRAME_W * frames, FRAME_H), (0,0,0,0))
    for i in range(frames):
        fx = i * FRAME_W
        base = Image.new('RGBA', (48,48), (0,0,0,0))
        bd = ImageDraw.Draw(base)
        # draw circle
        bd.ellipse([6,6,42,42], fill=color)
        # shine position shifts with frame
        sx = 10 + (i % frames) * 2
        bd.ellipse([sx,10,sx+6,16], fill=(255,255,255,180))
        # inner rim
        bd.ellipse([12,12,36,36], outline=(255,255,255,60))
        sheet.paste(base, (fx,0), base)
    path = os.path.join(assets_root, 'coins', f"{name}.png")
    sheet.save(path)
    print('Wrote', path)

print('Pixel sprites generated.')
