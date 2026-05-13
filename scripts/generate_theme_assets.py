from pathlib import Path
from textwrap import dedent


ROOT = Path(__file__).resolve().parent.parent
ICONS_DIR = ROOT / "assets" / "ui" / "icons"
IMAGES_DIR = ROOT / "images"


def ensure_dirs() -> None:
    ICONS_DIR.mkdir(parents=True, exist_ok=True)
    IMAGES_DIR.mkdir(parents=True, exist_ok=True)


def write(path: Path, content: str) -> None:
    path.write_text(content.strip() + "\n", encoding="utf-8")


def svg(width: int, height: int, body: str, view_box: str | None = None) -> str:
    vb = view_box or f"0 0 {width} {height}"
    return dedent(
        f"""
        <svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="{vb}" shape-rendering="crispEdges">
          {body}
        </svg>
        """
    ).strip()


def tile_frame(inner_fill: str = "#101711", accent: str = "#83b85a") -> str:
    return f"""
      <rect x="0" y="0" width="24" height="24" fill="#0a0f0a"/>
      <rect x="1" y="1" width="22" height="22" fill="#21301b"/>
      <rect x="2" y="2" width="20" height="20" fill="{inner_fill}"/>
      <rect x="2" y="2" width="20" height="1" fill="#305026"/>
      <rect x="2" y="21" width="20" height="1" fill="#0f140f"/>
      <rect x="2" y="2" width="1" height="20" fill="#3f5e33"/>
      <rect x="21" y="2" width="1" height="20" fill="#0f140f"/>
      <rect x="3" y="3" width="18" height="18" fill="{inner_fill}"/>
      <rect x="3" y="3" width="18" height="1" fill="{accent}" opacity="0.25"/>
      <rect x="3" y="20" width="18" height="1" fill="#000" opacity="0.25"/>
    """


def icon_helper() -> str:
    body = tile_frame("#112312", "#8cc668") + """
      <rect x="5" y="15" width="3" height="5" fill="#6c4529"/>
      <rect x="8" y="8" width="2" height="10" fill="#8a5d35"/>
      <rect x="10" y="6" width="2" height="8" fill="#b7c2c8"/>
      <rect x="12" y="5" width="3" height="2" fill="#e7f1f8"/>
      <rect x="13" y="7" width="2" height="6" fill="#9da7ad"/>
      <rect x="12" y="12" width="4" height="2" fill="#e7f1f8"/>
      <rect x="16" y="13" width="2" height="5" fill="#6c4529"/>
      <rect x="14" y="13" width="2" height="2" fill="#a46b3d"/>
      <rect x="6" y="12" width="3" height="2" fill="#d9e6cf" opacity="0.65"/>
      <rect x="4" y="4" width="2" height="2" fill="#a7e38c"/>
      <rect x="17" y="4" width="2" height="2" fill="#a7e38c"/>
    """
    return svg(24, 24, body)


def icon_economy() -> str:
    body = tile_frame("#102316", "#81cf73") + """
      <rect x="6" y="12" width="11" height="5" fill="#a96d2c"/>
      <rect x="7" y="10" width="9" height="4" fill="#c8893f"/>
      <rect x="8" y="8" width="7" height="3" fill="#e4b65a"/>
      <rect x="9" y="7" width="5" height="2" fill="#fff1aa"/>
      <rect x="10" y="6" width="3" height="1" fill="#fff"/>
      <rect x="5" y="15" width="13" height="2" fill="#7f4f22"/>
      <rect x="16" y="8" width="2" height="2" fill="#a7ffcf"/>
      <rect x="3" y="6" width="2" height="2" fill="#ffd06e"/>
      <rect x="18" y="15" width="2" height="2" fill="#fff4b2"/>
    """
    return svg(24, 24, body)


def icon_rebirth() -> str:
    body = tile_frame("#121c24", "#89c18b") + """
      <rect x="8" y="6" width="8" height="2" fill="#d9ffd0"/>
      <rect x="7" y="7" width="2" height="6" fill="#d9ffd0"/>
      <rect x="7" y="13" width="2" height="2" fill="#78ff9a"/>
      <rect x="9" y="15" width="6" height="2" fill="#78ff9a"/>
      <rect x="15" y="14" width="2" height="3" fill="#78ff9a"/>
      <rect x="14" y="11" width="2" height="2" fill="#78ff9a"/>
      <rect x="10" y="10" width="4" height="4" fill="#5cff88"/>
      <rect x="11" y="11" width="2" height="2" fill="#e6ffe9"/>
      <rect x="4" y="4" width="2" height="2" fill="#ffd06e"/>
      <rect x="17" y="17" width="2" height="2" fill="#ffd06e"/>
      <rect x="18" y="6" width="2" height="2" fill="#a7ffcf"/>
    """
    return svg(24, 24, body)


def icon_test() -> str:
    body = tile_frame("#171716", "#a9cf5c") + """
      <rect x="6" y="6" width="12" height="12" fill="#263226"/>
      <rect x="7" y="7" width="10" height="10" fill="#111711"/>
      <rect x="11" y="4" width="2" height="16" fill="#d6ff9c"/>
      <rect x="4" y="11" width="16" height="2" fill="#d6ff9c"/>
      <rect x="10" y="10" width="4" height="4" fill="#ffd06e"/>
      <rect x="5" y="5" width="2" height="2" fill="#ffd06e"/>
      <rect x="17" y="17" width="2" height="2" fill="#8de1ff"/>
    """
    return svg(24, 24, body)


def icon_close() -> str:
    body = tile_frame("#201316", "#e48d8d") + """
      <rect x="6" y="6" width="2" height="2" fill="#ffd0d0"/>
      <rect x="8" y="8" width="2" height="2" fill="#ffd0d0"/>
      <rect x="10" y="10" width="2" height="2" fill="#ffd0d0"/>
      <rect x="12" y="12" width="2" height="2" fill="#ffd0d0"/>
      <rect x="14" y="14" width="2" height="2" fill="#ffd0d0"/>
      <rect x="14" y="6" width="2" height="2" fill="#ffd0d0"/>
      <rect x="12" y="8" width="2" height="2" fill="#ffd0d0"/>
      <rect x="10" y="10" width="2" height="2" fill="#ffd0d0"/>
      <rect x="8" y="12" width="2" height="2" fill="#ffd0d0"/>
      <rect x="6" y="14" width="2" height="2" fill="#ffd0d0"/>
      <rect x="16" y="6" width="2" height="2" fill="#ff8f8f"/>
      <rect x="6" y="16" width="2" height="2" fill="#ff8f8f"/>
    """
    return svg(24, 24, body)


def icon_speed() -> str:
    body = tile_frame("#132423", "#66dce0") + """
      <rect x="6" y="14" width="10" height="3" fill="#e2f5ff"/>
      <rect x="8" y="10" width="8" height="4" fill="#7aa0b7"/>
      <rect x="9" y="8" width="5" height="3" fill="#c7d3e0"/>
      <rect x="12" y="5" width="2" height="4" fill="#ffb84d"/>
      <rect x="13" y="6" width="4" height="2" fill="#ffd96d"/>
      <rect x="15" y="8" width="2" height="2" fill="#ffb84d"/>
      <rect x="5" y="13" width="2" height="2" fill="#8ef4ff"/>
      <rect x="17" y="13" width="2" height="2" fill="#8ef4ff"/>
    """
    return svg(24, 24, body)


def icon_area() -> str:
    body = tile_frame("#132018", "#9cff8e") + """
      <rect x="6" y="6" width="12" height="12" fill="#2a3d2b"/>
      <rect x="7" y="7" width="10" height="10" fill="#101a11"/>
      <rect x="8" y="8" width="8" height="8" fill="#244528"/>
      <rect x="5" y="11" width="2" height="2" fill="#a7ffcf"/>
      <rect x="17" y="11" width="2" height="2" fill="#a7ffcf"/>
      <rect x="11" y="5" width="2" height="2" fill="#a7ffcf"/>
      <rect x="11" y="17" width="2" height="2" fill="#a7ffcf"/>
      <rect x="10" y="10" width="4" height="4" fill="#ffd06e"/>
    """
    return svg(24, 24, body)


def icon_buy() -> str:
    body = tile_frame("#171e12", "#ffd06e") + """
      <rect x="8" y="7" width="8" height="10" fill="#8c5f2d"/>
      <rect x="7" y="8" width="10" height="2" fill="#c48a49"/>
      <rect x="9" y="6" width="6" height="2" fill="#f0d49a"/>
      <rect x="10" y="10" width="4" height="4" fill="#ffe88f"/>
      <rect x="4" y="13" width="3" height="2" fill="#ffd06e"/>
      <rect x="17" y="12" width="2" height="2" fill="#ffd06e"/>
      <rect x="6" y="5" width="2" height="2" fill="#8ef4ff"/>
      <rect x="16" y="5" width="2" height="2" fill="#8ef4ff"/>
    """
    return svg(24, 24, body)


def icon_loot() -> str:
    body = tile_frame("#151f12", "#d9b15e") + """
      <rect x="6" y="10" width="12" height="7" fill="#7d5330"/>
      <rect x="7" y="8" width="10" height="3" fill="#a26c3f"/>
      <rect x="7" y="9" width="10" height="1" fill="#f0cf8a"/>
      <rect x="9" y="12" width="6" height="3" fill="#d6b25d"/>
      <rect x="11" y="11" width="2" height="5" fill="#f8e6b0"/>
      <rect x="4" y="6" width="2" height="2" fill="#ffd06e"/>
      <rect x="18" y="6" width="2" height="2" fill="#ffd06e"/>
      <rect x="5" y="18" width="2" height="2" fill="#8ef4ff"/>
      <rect x="17" y="18" width="2" height="2" fill="#8ef4ff"/>
    """
    return svg(24, 24, body)


def icon_stardust() -> str:
    body = tile_frame("#101a24", "#7bd7ff") + """
      <rect x="11" y="4" width="2" height="16" fill="#9cecff"/>
      <rect x="4" y="11" width="16" height="2" fill="#9cecff"/>
      <rect x="8" y="8" width="8" height="8" fill="#4bb9ff"/>
      <rect x="10" y="10" width="4" height="4" fill="#d9fbff"/>
      <rect x="6" y="6" width="2" height="2" fill="#6adfff"/>
      <rect x="16" y="6" width="2" height="2" fill="#6adfff"/>
      <rect x="6" y="16" width="2" height="2" fill="#6adfff"/>
      <rect x="16" y="16" width="2" height="2" fill="#6adfff"/>
    """
    return svg(24, 24, body)


def skill_tile(accent: str) -> str:
    return f"""
      <rect x="0" y="0" width="32" height="32" fill="#0c0f18"/>
      <rect x="2" y="2" width="28" height="28" fill="#20284a"/>
      <rect x="3" y="3" width="26" height="26" fill="#10162a"/>
      <rect x="3" y="3" width="26" height="1" fill="{accent}" opacity="0.35"/>
      <rect x="3" y="28" width="26" height="1" fill="#000" opacity="0.3"/>
      <rect x="3" y="3" width="1" height="26" fill="#51618d"/>
      <rect x="28" y="3" width="1" height="26" fill="#05080f"/>
    """


def skill_icons_sheet() -> str:
    icons = [
        # digPower
        """
        <rect x="8" y="18" width="2" height="8" fill="#7a4c27"/>
        <rect x="10" y="8" width="2" height="14" fill="#7a4c27"/>
        <rect x="12" y="6" width="2" height="8" fill="#b7c2c8"/>
        <rect x="14" y="5" width="4" height="2" fill="#dfe9f0"/>
        <rect x="15" y="7" width="3" height="2" fill="#9aa7ad"/>
        <rect x="13" y="12" width="6" height="2" fill="#dfe9f0"/>
        <rect x="6" y="16" width="3" height="2" fill="#a7ffcf"/>
        """,
        # coinBoost
        """
        <rect x="8" y="10" width="10" height="9" fill="#b87a31"/>
        <rect x="9" y="8" width="8" height="4" fill="#d79a43"/>
        <rect x="10" y="7" width="6" height="2" fill="#ffe27a"/>
        <rect x="11" y="6" width="4" height="1" fill="#fff6bf"/>
        <rect x="13" y="12" width="2" height="5" fill="#fff2a6"/>
        <rect x="6" y="13" width="2" height="2" fill="#ffd06e"/>
        <rect x="18" y="13" width="2" height="2" fill="#ffd06e"/>
        """,
        # speedBoost
        """
        <rect x="8" y="18" width="10" height="2" fill="#d9e5f0"/>
        <rect x="9" y="13" width="8" height="5" fill="#6e8398"/>
        <rect x="11" y="10" width="4" height="4" fill="#b7c8d8"/>
        <rect x="13" y="6" width="2" height="4" fill="#ffb64d"/>
        <rect x="15" y="7" width="4" height="2" fill="#ffe06f"/>
        <rect x="5" y="12" width="2" height="2" fill="#8ef4ff"/>
        <rect x="19" y="12" width="2" height="2" fill="#8ef4ff"/>
        """,
        # mastery
        """
        <rect x="11" y="7" width="6" height="2" fill="#ffe58f"/>
        <rect x="8" y="9" width="12" height="2" fill="#ffd35c"/>
        <rect x="10" y="11" width="8" height="8" fill="#6a8ad6"/>
        <rect x="11" y="12" width="6" height="6" fill="#9fd3ff"/>
        <rect x="13" y="13" width="2" height="2" fill="#fff4c6"/>
        <rect x="12" y="4" width="4" height="2" fill="#ffcf62"/>
        <rect x="6" y="18" width="2" height="2" fill="#a7ffcf"/>
        """,
        # diamondBoost
        """
        <rect x="11" y="5" width="6" height="2" fill="#baf7ff"/>
        <rect x="9" y="7" width="10" height="2" fill="#8eeaff"/>
        <rect x="8" y="9" width="12" height="8" fill="#3694ff"/>
        <rect x="10" y="11" width="8" height="4" fill="#8ed7ff"/>
        <rect x="12" y="10" width="4" height="6" fill="#d7fbff"/>
        <rect x="7" y="17" width="2" height="2" fill="#baf7ff"/>
        <rect x="18" y="17" width="2" height="2" fill="#baf7ff"/>
        """,
        # doubleDrop (magnet + gem)
        """
        <rect x="7" y="7" width="5" height="12" fill="#ff9644"/>
        <rect x="13" y="7" width="5" height="12" fill="#ff9644"/>
        <rect x="8" y="6" width="4" height="2" fill="#ffd7b1"/>
        <rect x="12" y="6" width="4" height="2" fill="#d8e3ea"/>
        <rect x="10" y="16" width="4" height="2" fill="#ffcf62"/>
        <rect x="5" y="5" width="2" height="2" fill="#8ef4ff"/>
        <rect x="19" y="17" width="2" height="2" fill="#ff7c9b"/>
        """,
        # knechtMastery
        """
        <rect x="8" y="9" width="8" height="7" fill="#8a5b38"/>
        <rect x="9" y="7" width="6" height="3" fill="#d7b48a"/>
        <rect x="10" y="13" width="4" height="4" fill="#5b3922"/>
        <rect x="6" y="15" width="4" height="3" fill="#b78453"/>
        <rect x="16" y="15" width="4" height="3" fill="#b78453"/>
        <rect x="12" y="5" width="2" height="2" fill="#fff1b0"/>
        <rect x="18" y="7" width="2" height="2" fill="#8ef4ff"/>
        """,
        # autoCollect
        """
        <rect x="9" y="8" width="14" height="11" fill="#7a5632"/>
        <rect x="10" y="6" width="12" height="4" fill="#9b6d3d"/>
        <rect x="12" y="5" width="8" height="2" fill="#e0bf84"/>
        <rect x="11" y="11" width="10" height="5" fill="#d1a75e"/>
        <rect x="14" y="12" width="4" height="3" fill="#fff3b6"/>
        <rect x="5" y="6" width="2" height="2" fill="#a7ffcf"/>
        <rect x="6" y="18" width="2" height="2" fill="#ffd06e"/>
        """,
        # rareFinder
        """
        <rect x="8" y="8" width="8" height="8" fill="#c8d5e2"/>
        <rect x="10" y="10" width="4" height="4" fill="#8ed7ff"/>
        <rect x="15" y="15" width="5" height="2" fill="#8a5b38"/>
        <rect x="16" y="13" width="2" height="4" fill="#8a5b38"/>
        <rect x="6" y="6" width="2" height="2" fill="#ffe27a"/>
        <rect x="18" y="6" width="2" height="2" fill="#8ef4ff"/>
        <rect x="11" y="4" width="2" height="2" fill="#ffd06e"/>
        """,
        # bloomBoost
        """
        <rect x="9" y="12" width="2" height="6" fill="#67b84e"/>
        <rect x="11" y="10" width="2" height="8" fill="#67b84e"/>
        <rect x="13" y="12" width="2" height="6" fill="#67b84e"/>
        <rect x="10" y="8" width="4" height="4" fill="#d6ff9c"/>
        <rect x="7" y="9" width="2" height="2" fill="#8ef4ff"/>
        <rect x="16" y="9" width="2" height="2" fill="#8ef4ff"/>
        <rect x="12" y="6" width="2" height="2" fill="#ffe27a"/>
        """,
        # turboDig
        """
        <rect x="8" y="8" width="2" height="10" fill="#7a4c27"/>
        <rect x="10" y="6" width="2" height="12" fill="#7a4c27"/>
        <rect x="12" y="7" width="4" height="2" fill="#b7c2c8"/>
        <rect x="13" y="5" width="2" height="4" fill="#dfe9f0"/>
        <rect x="15" y="11" width="3" height="3" fill="#ffb84d"/>
        <rect x="17" y="8" width="2" height="2" fill="#8ef4ff"/>
        <rect x="6" y="16" width="2" height="2" fill="#ffd06e"/>
        """,
        # goldenTouch
        """
        <rect x="9" y="8" width="8" height="8" fill="#b98422"/>
        <rect x="10" y="6" width="6" height="4" fill="#ffd76a"/>
        <rect x="11" y="5" width="4" height="2" fill="#fff0b7"/>
        <rect x="12" y="11" width="2" height="4" fill="#fff3c8"/>
        <rect x="6" y="8" width="2" height="2" fill="#ffd06e"/>
        <rect x="18" y="8" width="2" height="2" fill="#ffd06e"/>
        <rect x="7" y="17" width="2" height="2" fill="#fff3c8"/>
        """,
        # handwerkerMastery
        """
        <rect x="9" y="7" width="7" height="10" fill="#5f594a"/>
        <rect x="10" y="5" width="5" height="3" fill="#8d846f"/>
        <rect x="8" y="17" width="4" height="3" fill="#3e3326"/>
        <rect x="14" y="17" width="4" height="3" fill="#3e3326"/>
        <rect x="16" y="9" width="3" height="2" fill="#ffb84d"/>
        <rect x="17" y="7" width="2" height="4" fill="#dfe9f0"/>
        <rect x="6" y="6" width="2" height="2" fill="#8ef4ff"/>
        """,
        # megaMagnet
        """
        <rect x="6" y="7" width="7" height="11" fill="#ff9437"/>
        <rect x="13" y="7" width="7" height="11" fill="#ff9437"/>
        <rect x="7" y="6" width="5" height="2" fill="#ffd8b7"/>
        <rect x="12" y="6" width="5" height="2" fill="#d7e2ea"/>
        <rect x="10" y="10" width="4" height="4" fill="#7cf0ff"/>
        <rect x="9" y="9" width="2" height="2" fill="#d9ffff"/>
        <rect x="17" y="17" width="2" height="2" fill="#ffd06e"/>
        """,
        # rubyNose
        """
        <rect x="10" y="8" width="6" height="8" fill="#7a1d2e"/>
        <rect x="11" y="6" width="4" height="4" fill="#ff4970"/>
        <rect x="12" y="5" width="2" height="2" fill="#ffd2df"/>
        <rect x="9" y="10" width="2" height="2" fill="#ffd06e"/>
        <rect x="16" y="10" width="2" height="2" fill="#ffd06e"/>
        <rect x="8" y="16" width="2" height="2" fill="#8ef4ff"/>
        <rect x="18" y="6" width="2" height="2" fill="#ff8fb1"/>
        """,
        # efficiency
        """
        <rect x="10" y="5" width="4" height="4" fill="#ffd76a"/>
        <rect x="8" y="9" width="8" height="8" fill="#6d8b58"/>
        <rect x="9" y="10" width="6" height="6" fill="#9ec57a"/>
        <rect x="11" y="12" width="2" height="2" fill="#f3ffe0"/>
        <rect x="6" y="6" width="2" height="2" fill="#8ef4ff"/>
        <rect x="18" y="6" width="2" height="2" fill="#8ef4ff"/>
        <rect x="6" y="18" width="2" height="2" fill="#ffd06e"/>
        """,
    ]

    svg_parts = [
        '<rect width="100%" height="100%" fill="#0c1019"/>',
    ]
    accents = ["#9eff8e", "#ffd06e", "#66dce0", "#a7ffcf"]
    for idx, icon in enumerate(icons):
        x = (idx % 4) * 32
        y = (idx // 4) * 32
        accent = accents[idx % len(accents)]
        svg_parts.append(f'<g transform="translate({x} {y})">{skill_tile(accent)}{icon}</g>')
    return svg(128, 128, "\n".join(svg_parts))


def cave_background() -> str:
    return svg(
        1440,
        840,
        """
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#121322"/>
            <stop offset="55%" stop-color="#0b0d18"/>
            <stop offset="100%" stop-color="#06070d"/>
          </linearGradient>
          <radialGradient id="glowA" cx="50%" cy="45%" r="45%">
            <stop offset="0%" stop-color="#273b39" stop-opacity="0.6"/>
            <stop offset="100%" stop-color="#273b39" stop-opacity="0"/>
          </radialGradient>
          <radialGradient id="glowGold" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#ffd06e" stop-opacity="0.9"/>
            <stop offset="70%" stop-color="#c98a2a" stop-opacity="0.4"/>
            <stop offset="100%" stop-color="#c98a2a" stop-opacity="0"/>
          </radialGradient>
          <radialGradient id="glowCyan" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#7dfcff" stop-opacity="0.85"/>
            <stop offset="70%" stop-color="#2bc9e0" stop-opacity="0.4"/>
            <stop offset="100%" stop-color="#2bc9e0" stop-opacity="0"/>
          </radialGradient>
        </defs>
        <rect width="1440" height="840" fill="url(#sky)"/>
        <rect width="1440" height="840" fill="url(#glowA)"/>

        <g opacity="0.95">
          <path d="M0,0 H1440 V130 C1290,96 1180,160 1030,118 C880,78 770,16 620,56 C490,90 390,154 250,118 C140,90 72,40 0,58 Z" fill="#10111d"/>
          <path d="M0,70 C110,50 182,96 260,146 C340,198 430,190 520,138 C620,80 724,76 820,118 C930,166 1016,172 1118,126 C1200,88 1320,48 1440,70 V0 H0 Z" fill="#181a2b" opacity="0.95"/>
        </g>

        <g opacity="0.9">
          <path d="M0,840 V170 C65,154 110,130 164,110 C240,84 320,90 390,120 C480,156 560,142 650,104 C735,68 812,58 896,80 C980,102 1040,138 1114,168 C1202,206 1288,202 1440,160 V840 Z" fill="#0e1018"/>
        </g>

        <g fill="#25273a">
          <path d="M0,150 C90,110 175,104 250,128 C330,154 402,158 474,128 C558,92 636,74 718,92 C804,110 890,164 974,170 C1060,176 1148,140 1236,114 C1312,92 1380,96 1440,118 V840 H0 Z" opacity="0.95"/>
        </g>

        <g fill="#171a29">
          <path d="M0,260 C130,214 246,210 342,236 C434,262 516,260 600,232 C700,198 792,186 880,204 C970,222 1046,270 1144,284 C1236,296 1334,270 1440,236 V840 H0 Z" opacity="0.9"/>
        </g>

        <g opacity="0.8">
          <path d="M126,148 C82,206 76,254 108,308 C138,360 150,412 122,468 C94,522 74,576 102,632 C128,684 174,726 164,804" fill="none" stroke="#ffd06e" stroke-width="8" stroke-linecap="round"/>
          <path d="M560,60 C506,118 500,170 534,228 C568,288 574,346 544,404 C514,462 492,520 526,580 C556,632 602,676 596,780" fill="none" stroke="#2bc9e0" stroke-width="8" stroke-linecap="round"/>
          <path d="M1016,80 C968,138 956,192 986,244 C1018,300 1030,348 1004,408 C976,470 952,528 980,590 C1008,652 1054,694 1048,812" fill="none" stroke="#ffd06e" stroke-width="7" stroke-linecap="round"/>
          <path d="M1278,168 C1230,228 1222,286 1250,342 C1282,404 1292,464 1268,522 C1244,580 1224,632 1248,708" fill="none" stroke="#2bc9e0" stroke-width="7" stroke-linecap="round"/>
        </g>

        <g>
          <circle cx="162" cy="176" r="24" fill="url(#glowGold)"/>
          <circle cx="400" cy="630" r="26" fill="url(#glowGold)"/>
          <circle cx="1042" cy="146" r="28" fill="url(#glowCyan)"/>
          <circle cx="1230" cy="636" r="28" fill="url(#glowCyan)"/>
        </g>

        <g>
          <g fill="#ffd06e">
            <rect x="138" y="158" width="10" height="20"/>
            <rect x="148" y="152" width="8" height="24"/>
            <rect x="156" y="156" width="10" height="18"/>
          </g>
          <g fill="#2bc9e0">
            <rect x="1030" y="120" width="8" height="18"/>
            <rect x="1038" y="114" width="10" height="26"/>
            <rect x="1048" y="122" width="8" height="16"/>
          </g>
          <g fill="#ffd06e">
            <rect x="1222" y="616" width="8" height="16"/>
            <rect x="1230" y="610" width="10" height="24"/>
            <rect x="1240" y="618" width="8" height="16"/>
          </g>
          <g fill="#2bc9e0">
            <rect x="482" y="616" width="8" height="16"/>
            <rect x="490" y="610" width="10" height="24"/>
            <rect x="500" y="618" width="8" height="16"/>
          </g>
        </g>

        <g opacity="0.3">
          <circle cx="220" cy="232" r="180" fill="#142023"/>
          <circle cx="982" cy="214" r="170" fill="#15252b"/>
          <circle cx="722" cy="446" r="220" fill="#0f1720"/>
        </g>
        """,
    )


def game_overlay_background() -> str:
    return svg(
        1440,
        840,
        """
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#0a0914"/>
            <stop offset="55%" stop-color="#11162d"/>
            <stop offset="100%" stop-color="#06060d"/>
          </linearGradient>
          <radialGradient id="nebulaGreen" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#89f27c" stop-opacity="0.22"/>
            <stop offset="100%" stop-color="#89f27c" stop-opacity="0"/>
          </radialGradient>
          <radialGradient id="nebulaBlue" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#45d8ff" stop-opacity="0.20"/>
            <stop offset="100%" stop-color="#45d8ff" stop-opacity="0"/>
          </radialGradient>
          <radialGradient id="nebulaGold" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#ffd06e" stop-opacity="0.85"/>
            <stop offset="100%" stop-color="#ffd06e" stop-opacity="0"/>
          </radialGradient>
        </defs>
        <rect width="1440" height="840" fill="url(#sky)"/>

        <g opacity="0.95">
          <path d="M0,120 C120,76 240,64 360,86 C500,112 636,154 784,134 C940,112 1060,58 1200,64 C1318,70 1386,110 1440,132 V0 H0 Z" fill="#17192c"/>
          <path d="M0,220 C120,176 240,154 356,166 C486,180 616,242 754,238 C900,234 1010,158 1140,154 C1264,150 1352,184 1440,218 V0 H0 Z" fill="#1d2036" opacity="0.7"/>
          <path d="M0,360 C126,312 246,296 372,302 C510,308 610,352 744,354 C882,356 1010,300 1140,286 C1274,272 1366,308 1440,340 V0 H0 Z" fill="#131425" opacity="0.8"/>
        </g>

        <g opacity="0.8">
          <path d="M0,840 C104,760 194,722 286,698 C408,664 494,682 604,722 C722,764 808,776 918,746 C1044,712 1148,640 1264,624 C1346,612 1398,626 1440,642 V840 Z" fill="#080910"/>
          <path d="M0,688 C112,648 220,648 330,672 C458,700 558,744 666,748 C796,754 908,706 1018,680 C1128,654 1242,654 1440,686 V840 H0 Z" fill="#151024" opacity="0.7"/>
          <path d="M0,610 C116,568 224,560 336,578 C470,600 566,648 684,656 C804,664 910,614 1018,588 C1140,558 1270,556 1440,596 V840 H0 Z" fill="#201232" opacity="0.6"/>
        </g>

        <g fill="none" stroke-linecap="round">
          <path d="M140,170 C82,250 78,360 122,468 C160,556 158,652 116,768" stroke="#d9b36a" stroke-width="7" opacity="0.85"/>
          <path d="M530,0 C492,100 500,210 548,318 C596,428 600,528 564,620" stroke="#45d8ff" stroke-width="8" opacity="0.82"/>
          <path d="M1052,58 C986,150 984,256 1038,366 C1090,472 1090,574 1048,760" stroke="#d9b36a" stroke-width="7" opacity="0.82"/>
        </g>

        <g opacity="0.9">
          <circle cx="148" cy="184" r="34" fill="url(#nebulaGold)"/>
          <circle cx="1120" cy="150" r="38" fill="url(#nebulaBlue)"/>
          <circle cx="480" cy="666" r="42" fill="url(#nebulaGreen)"/>
          <circle cx="1228" cy="686" r="34" fill="url(#nebulaBlue)"/>
        </g>

        <g opacity="0.9">
          <rect x="96" y="164" width="16" height="16" fill="#f1c765"/>
          <rect x="104" y="148" width="12" height="12" fill="#ffd87b"/>
          <rect x="124" y="176" width="8" height="8" fill="#cda353"/>
          <rect x="1100" y="124" width="16" height="16" fill="#3fc6ff"/>
          <rect x="1118" y="144" width="10" height="10" fill="#9beaff"/>
          <rect x="1180" y="682" width="12" height="12" fill="#ffd06e"/>
          <rect x="1198" y="690" width="8" height="8" fill="#ffef9b"/>
        </g>

        <g opacity="0.25">
          <circle cx="280" cy="240" r="180" fill="#14182a"/>
          <circle cx="866" cy="220" r="230" fill="#10162b"/>
          <circle cx="740" cy="520" r="280" fill="#0c1020"/>
        </g>
        """,
    )


def main() -> None:
    ensure_dirs()

    icons = {
        "helper.svg": icon_helper(),
        "economy.svg": icon_economy(),
        "rebirth.svg": icon_rebirth(),
        "test.svg": icon_test(),
        "close.svg": icon_close(),
        "speed.svg": icon_speed(),
        "area.svg": icon_area(),
        "buy.svg": icon_buy(),
        "loot.svg": icon_loot(),
      "stardust.svg": icon_stardust(),
    }
    for name, content in icons.items():
      write(ICONS_DIR / name, content)

    write(IMAGES_DIR / "skill_icons.svg", skill_icons_sheet())
    write(IMAGES_DIR / "cave_bg.svg", cave_background())
    write(IMAGES_DIR / "game_overlay.svg", game_overlay_background())

    print(f"Wrote {len(icons)} UI icons, skill_icons.svg, cave_bg.svg and game_overlay.svg")


if __name__ == "__main__":
    main()