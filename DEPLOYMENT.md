# GroundBreaker — Desktop Deployment

## Fertige Installer

### Gewuenschter Installer-Flow (wie bei Spielen)
- Windows: kleine `.exe` als Web-Installer, die beim Start die App herunterlaedt
- Linux: `install-groundbreaker.sh` als One-File Installer, der beim Start die AppImage herunterlaedt

Schnellablauf fuer Release:
```bash
# 1) Linux Artefakte bauen
npm run dist:linux

# 2) Linux One-File Installer mit fester Download-URL erzeugen
RELEASE_BASE_URL="https://dein-server/releases/v1.0.0" npm run bundle:linux-installer:web

# 3) Windows Web-Installer-EXE bauen (auf Windows)
RELEASE_BASE_URL="https://dein-server/releases/v1.0.0" npm run dist:win:web
```

Danach verteilst du im Release z. B.:
- `GroundBreaker-Web-Setup-<version>.exe` (Windows Downloader)
- `install-groundbreaker.sh` (Linux Downloader)
- `GroundBreaker-<version>.AppImage` (wird vom Linux-Installer geladen)

### Linux
✅ **AppImage** (`dist-desktop/GroundBreaker-1.0.0.AppImage`) — 212 MB
- Universell auf allen Linux-Distributionen ausführbar
- Keine Installation erforderlich, einfach ausführen: `./GroundBreaker-1.0.0.AppImage`
- Desktop-Verknüpfung wird automatisch erstellt

✅ **Debian/Ubuntu** (`dist-desktop/groundbreaker_1.0.0_amd64.deb`) — 134 MB
- Installation mit Paketmanager:
  ```bash
  sudo apt install ./groundbreaker_1.0.0_amd64.deb
  ```
- App im Start-Menü verfügbar

✅ **Linux Installer-Skript** (`dist-desktop/install-groundbreaker.sh`)
- Endnutzer-Installation wie bei Game-Launchern
- Download + lokale Installation unter `~/.local/opt/GroundBreaker`
- Erstellt Startmenue-Eintrag und Launcher `~/.local/bin/groundbreaker`
- Startet ohne zusaetzliche Parameter, wenn bei der Erstellung `RELEASE_BASE_URL` gesetzt wurde

Beispiel fuer Endnutzer:
```bash
chmod +x install-groundbreaker.sh
./install-groundbreaker.sh
```

### Windows
✅ **Web-Installer-Option**: kleine Downloader-EXE via NSIS Web

Build auf Windows-Maschine (empfohlen):
```bash
npm install
npm run dist:win:web
```

Erzeugt eine kleine Setup-Datei im Output-Ordner (`dist-desktop/`), die beim Start die eigentliche App herunterlaedt.

Wichtig:
- Die Download-Quelle fuer den Windows-Web-Installer wird aus `RELEASE_BASE_URL` gelesen.
- Diese URL muss auf deinen echten Release-Host zeigen.

## Build-Prozess

### Automatischer Build (Linux)
```bash
cd /media/windows/HTL_Leoben/VOid
PATH="$PWD/.nodeenv/bin:$PATH" npm run dist:linux
# Erzeugt AppImage und deb in dist-desktop/
```

### Vollständiger Cross-Plattform-Build (benötigt Wine für Windows)
```bash
PATH="$PWD/.nodeenv/bin:$PATH" npm run dist
# Versucht Linux UND Windows zu bauen
```

### Nur Windows-Build (auf Windows)
```bash
npm run dist:win
```

## App-Details

| Eigenschaft | Wert |
|---|---|
| App Name | GroundBreaker |
| Version | 1.0.0 |
| Electron | 31.7.7 |
| Fenster | 1600×960 (min 1280×720) |
| Icon | 1024×1024 PNG (aus SVG generiert) |
| Entwickler | HTL Leoben |

## Verzeichnisstruktur

```
dist-desktop/
├── GroundBreaker-1.0.0.AppImage       ✓ Linux portable
├── groundbreaker_1.0.0_amd64.deb      ✓ Linux package
├── win-unpacked/
│   └── GroundBreaker.exe              ✓ Windows executable
└── linux-unpacked/                    (Build artifacts)
```

## Änderungen für Desktop-Distribution

### `package.json`
- AppId: `com.htlleoben.groundbreaker`
- Beschreibung: Desktop Edition mit Electron
- Autor & Maintainer: HTL Leoben

### `electron/main.js`
- Lädt `index.html` in BrowserWindow
- Minimum 1280×720, Default 1600×960
- Entfernt Standard-Menü

### `build/icon.svg` + `scripts/generate-desktop-icon.js`
- SVG → PNG (1024×1024) Konvertierung vor jedem Build
- Grüner Gradient mit Gold-Coin und Schaufel-Symbol

## Playtesting & Distribution

1. **Vor Verbreitung**: In beiden Installern testen (`dist-desktop/`)
2. **Neue Slot**: Slot 3 oder dedicated Test-Slot nutzen
3. **Abpacken**: 
   ```bash
   tar czf GroundBreaker-1.0.0-setup.tar.gz dist-desktop/
   # oder
   zip -r GroundBreaker-1.0.0-setup.zip dist-desktop/
   ```
4. **Verteilen**: Zip/Tar an Tester senden

## Notizen

- **Linux AppImage**: Benötigt FUSE für Ausführung (meist vorinstalliert)
- **Windows Installer**: Benötigt Wine auf Linux zum Cross-Build (kompliziert, native Windows-Build empfohlen)
- **Save-Daten**: Bleiben in systemspezifischen Electron-Verzeichnissen persistent
  - Linux: `~/.config/GroundBreaker/` (localStorage)
  - Windows: `AppData/Roaming/GroundBreaker/` (localStorage)

---

**Build erstellt am**: 5. Mai 2024, 10:28 UTC
