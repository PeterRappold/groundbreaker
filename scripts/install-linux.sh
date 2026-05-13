#!/usr/bin/env bash
set -euo pipefail

APP_NAME="GroundBreaker"
APP_ID="groundbreaker"
DEFAULT_VERSION="__VERSION__"
DEFAULT_BASE_URL="__BASE_URL__"
VERSION="${DEFAULT_VERSION}"
BASE_URL="${GROUNDBREAKER_BASE_URL:-${DEFAULT_BASE_URL}}"
ICON_URL="${GROUNDBREAKER_ICON_URL:-}"
APPIMAGE_NAME=""
ASSUME_YES="false"

usage() {
  cat <<'EOF'
GroundBreaker Linux Installer

Usage:
  ./install-linux.sh [options]

Default behavior:
  Uses a built-in download URL generated at release time.

Options:
  --base-url <url>        Override base URL that contains the AppImage
  --version <version>     Version for filename generation (default: 1.0.0)
  --appimage <filename>   AppImage filename (default: GroundBreaker-<version>.AppImage)
  --icon-url <url>        Optional icon URL for desktop entry
  --yes                   Non-interactive mode
  -h, --help              Show this help

Environment variables:
  GROUNDBREAKER_BASE_URL  Same as --base-url
  GROUNDBREAKER_ICON_URL  Same as --icon-url

What it does:
  1) Downloads AppImage
  2) Installs into ~/.local/opt/GroundBreaker
  3) Creates launcher at ~/.local/bin/groundbreaker
  4) Creates desktop entry in ~/.local/share/applications
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --base-url)
      BASE_URL="$2"
      shift 2
      ;;
    --version)
      VERSION="$2"
      shift 2
      ;;
    --appimage)
      APPIMAGE_NAME="$2"
      shift 2
      ;;
    --icon-url)
      ICON_URL="$2"
      shift 2
      ;;
    --yes)
      ASSUME_YES="true"
      shift
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "Unknown argument: $1" >&2
      usage
      exit 1
      ;;
  esac
done

if [[ -z "${BASE_URL}" || "${BASE_URL}" == "__BASE_URL__" ]]; then
  echo "Error: no download URL configured in installer." >&2
  echo "Hint: regenerate installer with bundle:linux-installer:web and RELEASE_BASE_URL." >&2
  usage
  exit 1
fi

if [[ -z "${APPIMAGE_NAME}" ]]; then
  APPIMAGE_NAME="GroundBreaker-${VERSION}.AppImage"
fi

if ! command -v curl >/dev/null 2>&1; then
  echo "Error: curl is required." >&2
  exit 1
fi

INSTALL_DIR="${HOME}/.local/opt/${APP_NAME}"
BIN_DIR="${HOME}/.local/bin"
DESKTOP_DIR="${HOME}/.local/share/applications"
ICON_DIR="${HOME}/.local/share/icons/hicolor/256x256/apps"

APPIMAGE_URL="${BASE_URL%/}/${APPIMAGE_NAME}"
TARGET_APPIMAGE="${INSTALL_DIR}/${APPIMAGE_NAME}"
LAUNCHER_PATH="${BIN_DIR}/${APP_ID}"
DESKTOP_FILE="${DESKTOP_DIR}/${APP_ID}.desktop"
ICON_PATH="${ICON_DIR}/${APP_ID}.png"

if [[ "${ASSUME_YES}" != "true" ]]; then
  echo "App: ${APP_NAME}"
  echo "Version: ${VERSION}"
  echo "Download: ${APPIMAGE_URL}"
  echo "Install dir: ${INSTALL_DIR}"
  read -r -p "Continue installation? [y/N] " reply
  if [[ ! "${reply}" =~ ^[Yy]$ ]]; then
    echo "Aborted."
    exit 0
  fi
fi

mkdir -p "${INSTALL_DIR}" "${BIN_DIR}" "${DESKTOP_DIR}" "${ICON_DIR}"

echo "Downloading AppImage..."
curl -fL "${APPIMAGE_URL}" -o "${TARGET_APPIMAGE}"
chmod +x "${TARGET_APPIMAGE}"

ln -sfn "${TARGET_APPIMAGE}" "${LAUNCHER_PATH}"

if [[ -n "${ICON_URL}" ]]; then
  echo "Downloading icon..."
  if curl -fL "${ICON_URL}" -o "${ICON_PATH}"; then
    true
  else
    echo "Warning: icon download failed, continuing without icon." >&2
    ICON_PATH=""
  fi
fi

DESKTOP_ICON_VALUE="${ICON_PATH}"
if [[ -z "${DESKTOP_ICON_VALUE}" ]]; then
  DESKTOP_ICON_VALUE="application-x-executable"
fi

cat > "${DESKTOP_FILE}" <<EOF
[Desktop Entry]
Type=Application
Name=${APP_NAME}
Comment=GroundBreaker desktop game
Exec=${TARGET_APPIMAGE}
Icon=${DESKTOP_ICON_VALUE}
Terminal=false
Categories=Game;
StartupNotify=true
EOF

if command -v update-desktop-database >/dev/null 2>&1; then
  update-desktop-database "${DESKTOP_DIR}" >/dev/null 2>&1 || true
fi

echo "Installation complete."
echo "Start from app menu or run: ${LAUNCHER_PATH}"
