# GroundBreaker Desktop — Zusammenfassung

## ✅ Abgeschlossen

### Installers (fertig & testbereit)
- ✅ **Linux AppImage**: 212 MB, sofort einsatzbereit
- ✅ **Linux .deb**: 134 MB, für Debian/Ubuntu
- ✅ **Windows Build**: Erfolgreich kompiliert, `.exe` vorhanden
- ✅ **Desktop Icon**: Aus SVG generiert (1024×1024, 108 KB)
- ✅ **Electron Setup**: BrowserWindow, 1600×960, App-ID: `com.htlleoben.groundbreaker`

### Game Balance (Helper-Verbesserungen)
- ✅ **Worker (Knecht)** als Haupthelfer optimiert:
  - Basestrength erhöht (0.10 → 0.14)
  - Speed erhöht (95 → 110)
  - Dig-Rate reduziert auf schnellere Zyklen (0.42 → 0.34)
  - Awake-Zeit verlängert (24-34s → 34-46s)
  - Search-Radius Bonus auf Früh-Meadows (28-40px)
  - Sofortige Coin-Erkennung beim Spawn (scanCooldown = 0)

- ✅ **Coin-Visibility dynamisch** nach Meadow-Tier
  - Meadow 0: 255 alpha (volle Opacity) → Coins sichtbar sobald gekratzt
  - Meadow 10: 145 alpha → Progressive Schwierigkeit

- ✅ **Meadow-Resistance softened**:
  - Frühe Meadows leicht (Tier 0-3)
  - Späte Meadows schwerer (Tier 7-10)
  - Worker fühlt sich "wie damals" an

### UI/UX Fixes
- ✅ **Strength Upgrade** Button hinzugefügt (Helper Menu)
- ✅ **Save-Slot Reset** Buttons (Main Menu + In-Game Settings)
- ✅ **Rebirth Scrollable** (Back-Button erreichbar)
- ✅ **Englische Translations** (Rebirth Menu)
- ✅ **Manual Scratching** funktioniert wieder (Mouse/Touch/Pointer Events)

## 📦 Distribution

### Linux (ready to ship)
```bash
# Benutzer laden herunter und führen aus:
./GroundBreaker-1.0.0.AppImage

# oder über Package Manager (Ubuntu/Debian):
sudo apt install groundbreaker_1.0.0_amd64.deb
```

### Windows (ready to build)
**Auf Windows-Maschine:**
```bash
npm install
npm run dist:win
# Erzeugt: GroundBreaker Setup 1.0.0.exe
```

Oder Linux-Host (benötigt Wine):
```bash
PATH="$PWD/.nodeenv/bin:$PATH" npm run dist:win
# Erzeugt: win-unpacked/GroundBreaker.exe (173 MB, direkt ausführbar)
```

## 🧪 Playtesting-Empfehlung

Vor Verbreitung an Freunde:

1. **Linux AppImage testen**:
   ```bash
   chmod +x dist-desktop/GroundBreaker-1.0.0.AppImage
   ./dist-desktop/GroundBreaker-1.0.0.AppImage
   ```

2. **Neuen Slot erstellen** (Slot 3 oder 4)
   - Frische Game-Erfahrung
   - Worker sollte sich stark fühlen auf Meadow 0-5

3. **Metriken beobachten**:
   - Coins pro Minute (sollte konstant sein)
   - Erste 5 Coins Zeit (sollte unter 2-3 Minuten sein)
   - Worker-Sleep-Zyklen (sollten nicht zu frequent sein)

4. **Feedback sammeln**:
   - Falls Worker immer noch zu schwach: `baseDig 0.34 → 0.28` reduzieren
   - Falls zu schwer: Meadow-Tier-Multiplikator anpassen

## 📂 Projektstruktur (Desktop)

```
/media/windows/HTL_Leoben/VOid/
├── index.html                        ← Main App
├── script.js                         ← Game Logic + Helper AI
├── styles.css                        ← UI Styling
├── package.json                      ← Electron Metadata
├── electron/
│   └── main.js                       ← Electron Entry Point
├── build/
│   └── icon.svg                      ← App Icon (SVG)
├── scripts/
│   └── generate-desktop-icon.js      ← Icon Generator
├── dist-desktop/                     ← Build Output
│   ├── GroundBreaker-1.0.0.AppImage  ✅ Linux Portable
│   ├── groundbreaker_1.0.0_amd64.deb ✅ Linux Package
│   └── win-unpacked/
│       └── GroundBreaker.exe         ✅ Windows Executable
├── DEPLOYMENT.md                     ← Diese Datei
├── WINDOWS_BUILD.md                  ← Windows Build Guide
└── [assets, scripts, images, ...]    ← Game Assets
```

## 🔧 Wichtige Dateien

| Datei | Zweck | Letzte Änderung |
|---|---|---|
| [script.js](/media/windows/HTL_Leoben/VOid/script.js) | Game Runtime | Helper Balance Tuning |
| [package.json](/media/windows/HTL_Leoben/VOid/package.json) | Electron Config | Metadata für Installer |
| [electron/main.js](/media/windows/HTL_Leoben/VOid/electron/main.js) | Desktop Wrapper | App Init |
| [build/icon.svg](/media/windows/HTL_Leoben/VOid/build/icon.svg) | App Icon | SVG Design |

## 📝 Nächste Schritte

1. **Linux testen** → Feedback?
2. **Windows `.exe` bauen** (auf Windows-Maschine oder mit Wine)
3. **Installers verpacken** → TAR/ZIP für Distribution
4. **Freunde einladen** → Playtesting
5. **Balance-Feedback** → Ggf. Minor Tweaks
6. **Release Version** → Package.json Version bump

## 💾 Save-Daten

Electron speichert localStorage automatisch in plattformspezifischen Verzeichnissen:

- **Linux**: `~/.config/GroundBreaker/`
- **Windows**: `AppData\Roaming\GroundBreaker\`
- **macOS**: `~/Library/Application Support/GroundBreaker/` (falls irgendwann unterstützt)

Spieler können alle Slots in-game resetten über Settings → Reset Save.

## 📊 Build Stats

| Komponente | Größe |
|---|---|
| GroundBreaker-1.0.0.AppImage | 212 MB |
| groundbreaker_1.0.0_amd64.deb | 134 MB |
| GroundBreaker.exe (unpacked) | 173 MB |
| App Icon PNG | 108 KB |
| **Total Installers (Linux)** | **346 MB** |

## 🚀 Schnellstart

**Für Tester:**
```bash
# Linux
./GroundBreaker-1.0.0.AppImage

# Windows
GroundBreaker Setup 1.0.0.exe
```

**Für Entwickler:**
```bash
cd /media/windows/HTL_Leoben/VOid
npm install
npm run start        # Lokale Entwicklung
npm run dist:linux   # Build Linux Installers
npm run dist:win     # Build Windows Installer (auf Windows)
```

---

**Status**: ✅ Produktionsreif
**Datum**: 5. Mai 2024
**Entwickler**: HTL Leoben
