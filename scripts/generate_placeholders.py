import os
from PIL import Image, ImageDraw, ImageFont

# Basis-Ordnerstruktur (relativ zum Skript)
base = os.path.join(os.path.dirname(__file__), '..')
assets_root = os.path.normpath(os.path.join(base, 'assets'))
folders = [
    "helpers", "coins", "ui", "ui/icons", "backgrounds", "particles"
]

# Dateispezifikationen
assets = [
    ("helpers/helper_knecht.png", 48 * 25, 48),
    ("helpers/helper_handwerker.png", 48 * 25, 48),
    ("helpers/helper_meister.png", 48 * 25, 48),
    ("helpers/portrait_knecht.png", 96, 96),
    ("helpers/portrait_handwerker.png", 96, 96),
    ("helpers/portrait_meister.png", 96, 96),
    ("coins/coin_bronze.png", 48 * 8, 48),
    ("coins/coin_silver.png", 48 * 8, 48),
    ("coins/coin_gold.png", 48 * 8, 48),
    ("coins/coin_titanium.png", 48 * 8, 48),
]

icons = ["helper", "economy", "rebirth", "test", "close", "speed", "area", "buy", "loot"]
for icon in icons:
    assets.append((f"ui/icons/{icon}.png", 24, 24))

rebirth_nodes = ["dig", "coin", "speed", "mastery"]
for node in rebirth_nodes:
    assets.append((f"ui/rebirth_node_{node}.png", 48, 48))

assets += [
    ("ui/rebirth_conn.png", 32, 32),
    ("ui/rebirth_banner.png", 320, 80),
]

for i in range(1,6):
    assets.append((f"backgrounds/meadow_tier{i}.png", 128, 128))
assets += [("backgrounds/soil_tile.png", 128, 128), ("backgrounds/vignette_overlay.png", 1440, 840), ("backgrounds/clouds.png", 256 * 3, 64)]

assets += [
    ("particles/dust.png", 16 * 6, 16),
    ("particles/sparkle.png", 16 * 6, 16),
    ("particles/coin_shine.png", 24 * 6, 24),
    ("ui/btn_primary.png", 160, 36 * 3),
    ("ui/btn_ghost.png", 160, 36 * 3),
    ("ui/panel_tile.png", 16, 16),
    ("ui/panel_corner.png", 16, 16),
    ("ui/cursor_pixel.png", 32, 32),
    ("placeholder.png", 48, 48)
]

os.makedirs(assets_root, exist_ok=True)
for folder in folders:
    os.makedirs(os.path.join(assets_root, folder), exist_ok=True)

# Simple font for text (fallback)
try:
    font = ImageFont.load_default()
except Exception:
    font = None

colors = [(200,50,50), (50,200,50), (50,50,200), (200,200,50), (200,100,200), (100,200,200)]

for idx, (relpath, w, h) in enumerate(assets):
    path = os.path.join(assets_root, relpath)
    d = os.path.dirname(path)
    os.makedirs(d, exist_ok=True)
    img = Image.new("RGBA", (w, h), (0,0,0,0))
    draw = ImageDraw.Draw(img)
    # colored background rectangle with checker
    bg = colors[idx % len(colors)]
    draw.rectangle([0,0,w-1,h-1], outline=(0,0,0,255), fill=(bg[0], bg[1], bg[2], 48))
    # draw label
    label = os.path.basename(relpath)
    if font:
        draw.text((4,4), label, fill=(0,0,0,180), font=font)
    else:
        draw.text((4,4), label, fill=(0,0,0,180))
    img.save(path, "PNG")
    print("Erstellt:", path, f"({w}x{h})")

print("Fertig: Platzhalter erstellt unter:", assets_root)
