from __future__ import annotations

import binascii
import struct
import zlib
from pathlib import Path

OUT_DIR = Path(__file__).resolve().parent.parent / "images"
SIZE = 64
SCALE = 4
GRID = SIZE // SCALE

PALETTES = {
    "bronze_coin-removebg-preview.png": {
        "base": (204, 132, 67),
        "mid": (170, 103, 50),
        "dark": (104, 64, 31),
        "light": (244, 198, 133),
        "shine": (255, 241, 194),
        "outline": (74, 47, 20),
        "mark": (255, 228, 145),
        "kind": "round",
        "symbol": "B",
    },
    "silber_coin-removebg-preview.png": {
        "base": (206, 217, 226),
        "mid": (160, 171, 183),
        "dark": (91, 101, 114),
        "light": (248, 250, 252),
        "shine": (255, 255, 255),
        "outline": (79, 89, 102),
        "mark": (230, 238, 245),
        "kind": "round",
        "symbol": "S",
    },
    "gold_coin-removebg-preview.png": {
        "base": (238, 196, 58),
        "mid": (197, 148, 29),
        "dark": (119, 82, 15),
        "light": (255, 236, 130),
        "shine": (255, 250, 214),
        "outline": (124, 84, 10),
        "mark": (255, 222, 102),
        "kind": "round",
        "symbol": "G",
    },
    "titanium_coin-removebg-preview.png": {
        "base": (208, 241, 247),
        "mid": (140, 194, 208),
        "dark": (74, 116, 133),
        "light": (242, 255, 255),
        "shine": (255, 255, 255),
        "outline": (68, 103, 118),
        "mark": (179, 232, 240),
        "kind": "hex",
        "symbol": "T",
    },
    "emerald_coin.png": {
        "base": (92, 239, 108),
        "mid": (42, 175, 67),
        "dark": (10, 82, 31),
        "light": (200, 255, 199),
        "shine": (255, 255, 255),
        "outline": (20, 110, 42),
        "mark": (186, 255, 184),
        "kind": "gem",
        "symbol": "E",
    },
    "diamond_coin-removebg-preview.png": {
        "base": (216, 246, 255),
        "mid": (153, 221, 234),
        "dark": (84, 143, 170),
        "light": (255, 255, 255),
        "shine": (255, 255, 255),
        "outline": (84, 131, 150),
        "mark": (205, 245, 255),
        "kind": "diamond",
        "symbol": "D",
    },
    "ruby_coin.png": {
        "base": (255, 96, 127),
        "mid": (208, 52, 84),
        "dark": (112, 17, 39),
        "light": (255, 200, 208),
        "shine": (255, 255, 255),
        "outline": (130, 22, 46),
        "mark": (255, 187, 200),
        "kind": "oval",
        "symbol": "R",
    },
}


def rgba(color: tuple[int, int, int], alpha: int = 255) -> bytes:
    return bytes((*color, alpha))


def new_grid() -> list[list[tuple[int, int, int, int]]]:
    return [[(0, 0, 0, 0) for _ in range(GRID)] for _ in range(GRID)]


def set_px(grid, x: int, y: int, color, alpha: int = 255) -> None:
    if 0 <= x < GRID and 0 <= y < GRID:
        grid[y][x] = (*color, alpha)


def fill(grid, x: int, y: int, w: int, h: int, color, alpha: int = 255) -> None:
    for yy in range(y, y + h):
        for xx in range(x, x + w):
            set_px(grid, xx, yy, color, alpha)


def draw_disc(grid, cx: int, cy: int, r: int, palette) -> None:
    r2 = r * r
    for y in range(GRID):
        for x in range(GRID):
            dx = x - cx
            dy = y - cy
            d2 = dx * dx + dy * dy
            if d2 > r2:
                continue
            if d2 > (r - 1) * (r - 1):
                color = palette["outline"]
            elif x + y < cx + cy - 3:
                color = palette["light"]
            elif x > cx + 1 and y > cy + 1:
                color = palette["dark"]
            elif x < cx - 2:
                color = palette["mid"]
            else:
                color = palette["base"]
            set_px(grid, x, y, color)


def draw_hex(grid, cx: int, cy: int, radius: int, palette) -> None:
    for y in range(GRID):
        for x in range(GRID):
            dx = abs(x - cx)
            dy = abs(y - cy)
            if dy > radius or dx + dy * 0.55 > radius:
                continue
            edge = dx + dy * 0.55 > radius - 1
            color = palette["outline"] if edge else (palette["light"] if x + y < cx + cy - 4 else palette["mid"] if x > cx + 1 and y > cy + 1 else palette["base"])
            set_px(grid, x, y, color)


def draw_diamond(grid, cx: int, cy: int, radius: int, palette) -> None:
    for y in range(GRID):
        for x in range(GRID):
            dx = abs(x - cx)
            dy = abs(y - cy)
            if dx + dy > radius:
                continue
            edge = dx + dy > radius - 1
            color = palette["outline"] if edge else (palette["light"] if y < cy - 1 else palette["mid"] if x > cx else palette["base"])
            set_px(grid, x, y, color)


def draw_oval(grid, cx: int, cy: int, rx: int, ry: int, palette) -> None:
    for y in range(GRID):
        for x in range(GRID):
            nx = (x - cx) / rx
            ny = (y - cy) / ry
            if nx * nx + ny * ny > 1:
                continue
            edge = nx * nx + ny * ny > 0.8
            color = palette["outline"] if edge else (palette["light"] if y < cy - 1 else palette["mid"] if x > cx + 1 else palette["base"])
            set_px(grid, x, y, color)


def add_symbol(grid, symbol: str, palette) -> None:
    if symbol == "B":
        fill(grid, 7, 6, 2, 6, palette["mark"])
        fill(grid, 9, 7, 3, 2, palette["mark"])
        fill(grid, 9, 10, 3, 2, palette["mark"])
        fill(grid, 9, 12, 2, 1, palette["mark"])
    elif symbol == "S":
        fill(grid, 7, 6, 5, 2, palette["mark"])
        fill(grid, 6, 8, 2, 3, palette["mark"])
        fill(grid, 8, 10, 4, 2, palette["mark"])
        fill(grid, 10, 12, 2, 3, palette["mark"])
        fill(grid, 6, 14, 5, 2, palette["mark"])
    elif symbol == "G":
        fill(grid, 7, 6, 5, 2, palette["mark"])
        fill(grid, 5, 8, 2, 5, palette["mark"])
        fill(grid, 7, 11, 5, 2, palette["mark"])
        fill(grid, 10, 10, 3, 2, palette["mark"])
        fill(grid, 11, 11, 2, 4, palette["mark"])
    elif symbol == "T":
        fill(grid, 7, 6, 4, 2, palette["mark"])
        fill(grid, 8, 8, 2, 8, palette["mark"])
    elif symbol == "E":
        fill(grid, 7, 6, 5, 2, palette["mark"])
        fill(grid, 6, 8, 2, 8, palette["mark"])
        fill(grid, 8, 10, 4, 2, palette["mark"])
        fill(grid, 8, 13, 4, 2, palette["mark"])
        fill(grid, 8, 15, 3, 2, palette["mark"])
    elif symbol == "D":
        fill(grid, 7, 6, 3, 2, palette["mark"])
        fill(grid, 6, 8, 2, 5, palette["mark"])
        fill(grid, 8, 8, 4, 2, palette["mark"])
        fill(grid, 10, 9, 2, 4, palette["mark"])
        fill(grid, 8, 13, 3, 2, palette["mark"])
    elif symbol == "R":
        fill(grid, 7, 6, 4, 2, palette["mark"])
        fill(grid, 6, 8, 2, 8, palette["mark"])
        fill(grid, 8, 8, 4, 2, palette["mark"])
        fill(grid, 10, 10, 2, 6, palette["mark"])


def add_shine(grid, palette) -> None:
    fill(grid, 5, 4, 2, 2, palette["shine"])
    set_px(grid, 7, 5, palette["shine"])
    set_px(grid, 6, 6, palette["shine"])


def build_icon(filename: str, palette: dict) -> list[list[tuple[int, int, int, int]]]:
    grid = new_grid()
    cx = cy = GRID // 2
    kind = palette["kind"]
    if kind == "round":
        draw_disc(grid, cx, cy, 7, palette)
    elif kind == "hex":
        draw_hex(grid, cx, cy, 7, palette)
    elif kind == "gem":
        draw_hex(grid, cx, cy, 7, palette)
    elif kind == "diamond":
        draw_diamond(grid, cx, cy, 7, palette)
    elif kind == "oval":
        draw_oval(grid, cx, cy, 6, 7, palette)

    add_shine(grid, palette)
    add_symbol(grid, palette["symbol"], palette)

    # Bottom-right shadow for depth.
    for y in range(GRID):
        for x in range(GRID):
            px = grid[y][x]
            if px[3] == 0:
                continue
            if x > cx + 1 and y > cy + 1 and (x + y) > cx + cy + 2:
                grid[y][x] = palette["dark"] + (255,)

    return grid


def upscale(grid):
    out = [[(0, 0, 0, 0) for _ in range(SIZE)] for _ in range(SIZE)]
    for gy, row in enumerate(grid):
        for gx, px in enumerate(row):
            for oy in range(SCALE):
                for ox in range(SCALE):
                    out[gy * SCALE + oy][gx * SCALE + ox] = px
    return out


def write_png(path: Path, pixels) -> None:
    raw = bytearray()
    for row in pixels:
        raw.append(0)
        for r, g, b, a in row:
            raw.extend((r, g, b, a))
    data = zlib.compress(bytes(raw), 9)

    def chunk(tag: bytes, payload: bytes) -> bytes:
        return struct.pack(">I", len(payload)) + tag + payload + struct.pack(">I", binascii.crc32(tag + payload) & 0xFFFFFFFF)

    png = bytearray(b"\x89PNG\r\n\x1a\n")
    png += chunk(b"IHDR", struct.pack(">IIBBBBB", SIZE, SIZE, 8, 6, 0, 0, 0))
    png += chunk(b"IDAT", data)
    png += chunk(b"IEND", b"")
    path.write_bytes(png)


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    for filename, palette in PALETTES.items():
        grid = build_icon(filename, palette)
        write_png(OUT_DIR / filename, upscale(grid))
        print(f"wrote images/{filename}")


if __name__ == "__main__":
    main()
