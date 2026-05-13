# Windows Installer Build — Anleitung

## Voraussetzungen
- Node.js 16+ installiert
- `npm` verfügbar
- Administratorrechte zum Signen nicht erforderlich (optional)

## Schritte

### 1. Projekt klonen/kopieren
```bash
cd path\to\GroundBreaker
```

### 2. Dependencies installieren
```bash
npm install
```

### 3. Windows-Web-Installer bauen
```bash
RELEASE_BASE_URL="https://dein-server/releases/v1.0.0" npm run dist:win:web
```

Das Skript wird automatisch:
- Desktop-Icon aus SVG generieren
- Electron mit electron-builder bauen
- NSIS-Web-Installer erzeugen (kleine Downloader-EXE)

### 4. Ausgabe
Die fertige `.exe`-Installer-Datei befindet sich in:
```
dist-desktop/GroundBreaker Setup 1.0.0.exe
```

Größe: ~180 MB

### 5. Installation testen
- `GroundBreaker Setup 1.0.0.exe` doppelklicken
- Mit "Install for all users" oder "Install for me" installieren
- App startet automatisch nach Installation

## Troubleshooting

### Problem: `npm run dist:win` schlägt fehl
**Lösung**: Sicherstellen dass:
1. Node.js korrekt installiert ist
2. `package.json` vorhanden ist
3. `electron/main.js` existiert
4. `index.html` im Wurzelverzeichnis ist

### Problem: Installer zu groß (~180 MB)
Das ist normal! Electron + Chromium + App = große Dateigrößen.

### Wenn Signatur erforderlich ist
```bash
npm run dist:win -- --publish never --win nsis
```

## Linux Pendant (.sh Installer)

Fuer Linux steht ein One-File Installer bereit, der beim Start AppImage-Dateien herunterlaedt und lokal installiert.

Erzeugung mit fester Download-URL:

```bash
RELEASE_BASE_URL="https://dein-server/releases/v1.0.0" npm run bundle:linux-installer:web
```

Datei:
```
dist-desktop/install-groundbreaker.sh
```

Endnutzer-Beispiel:
```bash
chmod +x install-groundbreaker.sh
./install-groundbreaker.sh
```

## Linux-Kompatibilität

Auf Linux ist ein Cross-Build für Windows möglich, benötigt aber Wine:
```bash
# Wine installieren (Arch Linux)
sudo pacman -S wine

# Dann:
npm run dist:win
```

**Hinweis**: Der Linux-Host kann das `.exe` nicht nativ ausführen, aber der Build-Prozess funktioniert.

## Ausgabe-Ordner
```
dist-desktop/
├── GroundBreaker Setup 1.0.0.exe    ← Installer (die wichtigste Datei!)
├── GroundBreaker-1.0.0.AppImage     ← Linux portable (wenn auf Linux gebaut)
├── groundbreaker_1.0.0_amd64.deb    ← Linux package (wenn auf Linux gebaut)
├── win-unpacked/                    ← Rohe ausgepackte Dateien
└── builder-effective-config.yaml    ← Build-Konfiguration
```

## Version aktualisieren

Um die Version zu ändern (z.B. für Release v1.1.0):

1. **package.json** öffnen
2. `"version": "1.0.0"` → `"version": "1.1.0"` ändern
3. Speichern & neu bauen:
   ```bash
   npm run dist:win
   ```

Neue Datei: `GroundBreaker Setup 1.1.0.exe`

---

**Für automatisierte CI/CD-Builds**: Siehe `.github/workflows/` (wenn vorhanden) oder erstelle GitHub Actions Workflow.
