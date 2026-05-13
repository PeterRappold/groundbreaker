const canvas = document.getElementById("scratchCanvas");
const ctx = canvas.getContext("2d", { willReadFrequently: true });

const overlayCanvas = document.createElement("canvas");
overlayCanvas.width = canvas.width;
overlayCanvas.height = canvas.height;
const overlayCtx = overlayCanvas.getContext("2d", { willReadFrequently: true });

const groundCanvas = document.createElement("canvas");
groundCanvas.width = canvas.width;
groundCanvas.height = canvas.height;
const groundCtx = groundCanvas.getContext("2d", { willReadFrequently: true });

ctx.imageSmoothingEnabled = false;
overlayCtx.imageSmoothingEnabled = false;
groundCtx.imageSmoothingEnabled = false;

const fragmentsValue = document.getElementById("fragmentsValue");
const rebirthValue = document.getElementById("rebirthValue");
const rebirthMenuValue = document.getElementById("rebirthMenuValue");
const boardStatus = document.getElementById("boardStatus");
const lootFeed = document.getElementById("lootFeed");
const upgradeHint = document.getElementById("upgradeHint");
const nextMeadowBtn = document.getElementById("rebirthBtn");
const resetRunBtn = document.getElementById("resetRunBtn");
const closeRebirthMenuBtn = document.getElementById("closeRebirthMenuBtn");
const rebirthActionBtn = document.getElementById("rebirthActionBtn");
const rebirthResetUpgradesBtn = document.getElementById("rebirthResetUpgradesBtn");
const rebirthReqMoneyBar = document.getElementById("rebirthReqMoneyBar");
const rebirthReqTierBar = document.getElementById("rebirthReqTierBar");
const rebirthReqMoneyText = document.getElementById("rebirthReqMoneyText");
const rebirthReqTierText = document.getElementById("rebirthReqTierText");
const rebirthStatTier = document.getElementById("rebirthStatTier");
const rebirthStatHandwerker = document.getElementById("rebirthStatHandwerker");
const rebirthStatTotalMoney = document.getElementById("rebirthStatTotalMoney");
const rebirthMenu = document.getElementById("rebirthMenu");
const helperMenu = document.getElementById("helperMenu");
const closeHelperMenuBtn = document.getElementById("closeHelperMenuBtn");
const helperMenuTitle = document.getElementById("helperMenuTitle");
const helperMenuInfo = document.getElementById("helperMenuInfo");
const helperWakeBtn = document.getElementById("helperWakeBtn");
const helperUpgradeStrengthBtn = document.getElementById("helperUpgradeStrengthBtn");
const helperUpgradeSpeedBtn = document.getElementById("helperUpgradeSpeedBtn");
const helperUpgradeAreaBtn = document.getElementById("helperUpgradeAreaBtn");
const tabHelperBtn = document.getElementById("tabHelperBtn");
const tabEconomyBtn = document.getElementById("tabEconomyBtn");
const tabRebirthBtn = document.getElementById("tabRebirthBtn");
const testRebirthUnlockBtn = document.getElementById("testRebirthUnlockBtn");
const coinValueBtn = document.getElementById("manualMultBtn");
const meadowTierBtn = document.getElementById("meadowTierBtn");

const inGameSaveBtn = document.getElementById("inGameSaveBtn");
const inGameSettingsBtn = document.getElementById("inGameSettingsBtn");
const inGameMainMenuBtn = document.getElementById("inGameMainMenuBtn");
const settingFPS = document.getElementById("settingFPS");
const settingLanguage = document.getElementById("settingLanguage");
const settingResolution = document.getElementById("settingResolution");
const fpsCounter = document.getElementById("fpsCounter");
const mainPlayBtn = document.getElementById("mainPlayBtn");
const mainSettingsBtn = document.getElementById("mainSettingsBtn");
const mainQuitBtn = document.getElementById("mainQuitBtn");

// Helfer-Buttons
const knechtsBtn = document.getElementById("radiusBtn");
const knechtsSpeedBtn = document.getElementById("autoSpeedBtn");
const knechtsAreaBtn = document.getElementById("autoPowerBtn");
const knechtsStrengthBtn = document.getElementById("knechtsStrengthBtn");
const handwerkerBtn = document.getElementById("replenishBtn");
const handwerkerSpeedBtn = document.getElementById("handwerkerSpeedBtn");
const handwerkerAreaBtn = document.getElementById("handwerkerAreaBtn");
const handwerkerStrengthBtn = document.getElementById("handwerkerStrengthBtn");
const meisterBtn = document.getElementById("meisterBuyBtn");
const meisterSpeedBtn = document.getElementById("meisterSpeedBtn");
const meisterAreaBtn = document.getElementById("meisterAreaBtn");
const meisterStrengthBtn = document.getElementById("meisterStrengthBtn");

// Storage Helper Functions
async function loadStorage(key) {
  if (window.electronAPI) return await window.electronAPI.loadData(key);
  return localStorage.getItem(key);
}

async function saveStorage(key, data) {
  if (window.electronAPI) await window.electronAPI.saveData(key, data);
  else localStorage.setItem(key, data);
}

async function removeStorage(key) {
  if (window.electronAPI) await window.electronAPI.removeData(key);
  else localStorage.removeItem(key);
}

const getLimit = () => 10 + (state.rebirth?.count || 0) * 5;


// Old individual rebirth nodes removed - now using generic skill-tree system

const STORAGE_KEY_PREFIX = "groundbreaker-slot-";
let activeSlot = 0;
function getStorageKey() { return STORAGE_KEY_PREFIX + activeSlot; }
const COIN_ASSET_VERSION = "pixel-2026-04-30";
const OFFLINE_GAIN_MAX_SECONDS = 8 * 60 * 60;

const COIN_TIERS = [
  { key: "bronze", image: "images/bronze_coin-removebg-preview.png", value: 15, baseWeight: 58, hue: "#bf874f" },
  { key: "silver", image: "images/silber_coin-removebg-preview.png", value: 40, baseWeight: 28, hue: "#bcc8d5" },
  { key: "gold", image: "images/gold_coin-removebg-preview.png", value: 120, baseWeight: 12, hue: "#ffd76a" },
  { key: "titanium", image: "images/titanium_coin-removebg-preview.png", value: 350, baseWeight: 4, hue: "#b0f8ff" },
  { key: "emerald", image: "images/emerald_coin.png", value: 800, baseWeight: 0, hue: "#50ff50" },
  { key: "diamond", image: "images/diamond_coin-removebg-preview.png", value: 1200, baseWeight: 0, hue: "#d8f6ff" },
  { key: "ruby", image: "images/ruby_coin.png", value: 3500, baseWeight: 0, hue: "#ff4060" }
];

// 10 Wiesen-Farbpaletten
const MEADOW_COLORS = [
  ["#78b54d", "#4c8f39", "#2d5f27"],     // 0: Waldwiese (Grün)
  ["#a8e063", "#78b54d", "#4c8f39"],     // 1: Hellgrün
  ["#4c8f39", "#2d5f27", "#1a3a1a"],     // 2: Dunkelgrün
  ["#ff8787", "#ff6b6b", "#d15c5a"],     // 3: Rotblock (Rot)
  ["#6b9dff", "#4a7dd9", "#2a4d99"],     // 4: Meerblau (Blau)
  ["#4dd0e1", "#26c6da", "#00acc1"],     // 5: Türkisland (Türkis)
  ["#ba68c8", "#9c27b0", "#6a1b9a"],     // 6: Violettraum (Violett)
  ["#ffd54f", "#ffca28", "#fbc02d"],     // 7: Goldwiese (Gold)
  ["#f06292", "#ec407a", "#c2185b"],     // 8: Rosengarten (Pink)
  ["#ffb74d", "#ffa726", "#ff7043"],     // 9: Orangenfeuer (Orange)
  ["#80cbc4", "#4db6ac", "#00897b"],     // 10: Seegrün (Teal)
  ["#c5e1a5", "#9ccc65", "#7cb342"],     // 11: Frühlingslicht (Lime)
  ["#f8bbd0", "#f48fb1", "#ec407a"],     // 12: Zuckerblüte (Rose)
  ["#ffe082", "#ffca28", "#f9a825"],     // 13: Sonnenring (Amber)
  ["#b39ddb", "#9575cd", "#673ab7"],     // 14: Nebelviolett (Purple)
  ["#ffab91", "#ff8a65", "#ff7043"]      // 15: Glutwiese (Orange)
];

// Erde-Farbpaletten (unabhängig von meadowTier, immer Brauntöne)
const SOIL_COLORS = [
  ["#a69384", "#8b7355", "#6b5236"],     // 0: Standard Erde
  ["#a89070", "#8b7560", "#6b5550"],     // 1: Helle Erde
  ["#9d8670", "#7d6b5b", "#5d4b3b"],     // 2: Dunkle Erde
  ["#a68860", "#866830", "#5c4620"],     // 3: Rötliche Erde
  ["#9d8770", "#7d7060", "#5d5040"],     // 4: Graubraun
  ["#a8936d", "#8b7860", "#6b6350"],     // 5: Helles Graubraun
  ["#9d8b75", "#7d7560", "#5d5545"],     // 6: Mittelbraun
  ["#a8826f", "#876555", "#67483b"],     // 7: Warmes Braun
  ["#9d8670", "#7d6950", "#5d4c30"],     // 8: Dunkles Braun
  ["#a5947d", "#857d6d", "#65665b"]      // 9: Grauerde
];

const HELPER_TYPES = {
  knecht: {
    name: "Knecht",
    baseRadius: 21,
    baseStrength: 0.14,
    areaPowerPerLevel: 0.03,
    baseSpeed: 110,
    speedPerLevel: 26,
    baseDig: 0.34,
    digFactor: 0.9,
    costBuy: 35,
    costSpeed: 40,
    costArea: 50,
    color: "#8B7355"
  },
  handwerker: {
    name: "Handwerker",
    baseRadius: 34,
    baseStrength: 0.16,
    areaPowerPerLevel: 0.032,
    baseSpeed: 130,
    speedPerLevel: 34,
    baseDig: 0.26,
    digFactor: 0.88,
    costBuy: 180,
    costSpeed: 100,
    costArea: 130,
    color: "#E87820"
  },
  meister: {
    name: "Meister",
    baseRadius: 50,
    baseStrength: 0.19,
    areaPowerPerLevel: 0.042,
    baseSpeed: 165,
    speedPerLevel: 44,
    baseDig: 0.18,
    digFactor: 0.85,
    costBuy: 800,
    costSpeed: 300,
    costArea: 400,
    color: "#B8A47C"
  }
};

class SpriteSheet {
  constructor(img, frameW, frameH, frameCount, hotspot=[0,0]) {
    this.img = img;
    this.frameW = frameW;
    this.frameH = frameH;
    this.frameCount = frameCount;
    this.hotspot = hotspot;
  }

  draw(ctx, frame, x, y, scale=1, flip=false) {
    if (!this.img) return false;
    frame = Math.floor(frame) % this.frameCount;
    const sx = frame * this.frameW;
    const sy = 0;
    ctx.save();
    if (flip) ctx.scale(-1,1);
    const drawX = flip ? -x - this.frameW * scale + this.hotspot[0]*scale : x - this.hotspot[0]*scale;
    const drawY = y - this.hotspot[1]*scale;
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(this.img, sx, sy, this.frameW, this.frameH, drawX, drawY, this.frameW * scale, this.frameH * scale);
    ctx.restore();
    return true;
  }
}

const spriteManager = {
  sheets: {},
  async loadAll() {
    try {
      const res = await fetch("/assets/asset_manifest.json");
      if (!res.ok) return;
      const manifest = await res.json();
      const promises = [];
      const pushLoader = (entry, pathPrefix="") => {
        const path = pathPrefix + entry.file;
        promises.push(new Promise((resolve) => {
          const img = new Image();
          img.onload = () => {
            this.sheets[entry.file] = new SpriteSheet(img, entry.frameW, entry.frameH, entry.frameCount, entry.hotspot || [0,0]);
            resolve();
          };
          img.onerror = () => resolve();
          img.src = path;
        }));
      };

      if (manifest.assets) {
        for (const h of manifest.assets.helpers || []) pushLoader(h, "/assets/");
        for (const c of manifest.assets.coins || []) pushLoader(c, "/assets/");
        for (const p of manifest.assets.particles || []) pushLoader(p, "/assets/");
        for (const i of manifest.assets.uiIcons || []) pushLoader(i, "/assets/");
        for (const b of manifest.assets.backgrounds || []) pushLoader(b, "/assets/");
      }

      await Promise.all(promises);
      console.log("SpriteManager: loaded", Object.keys(this.sheets));
    } catch (e) {
      console.warn("SpriteManager: failed to load manifest", e);
    }
  },
  sheetFor(path) {
    return this.sheets[path] || null;
  }
};


const MAX_HELPERS_PER_TYPE = 20;
const HELPER_COIN_SCAN_INTERVAL = 0.14;
const HELPER_COIN_DETECT_RADIUS = 54;
const HELPER_COIN_VISIBLE_ALPHA = 150;
const MAX_DUST_PER_HELPER = 20;

const state = {
  money: 0,
  totalMoney: 0,
  rebirth: {
    count: 0,
    shards: 0,
    upgrades: {
      digPower: 0,
      coinBoost: 0,
      speedBoost: 0,
      mastery: 0,
      diamondBoost: 0,
      bloomBoost: 0
    }
  },
  upgrades: {
    coinValue: 0,
    meadowTier: 0
  },
  helperUpgrades: {
    knecht: { count: 1, speed: 0, area: 0, strength: 0 },
    handwerker: { count: 0, speed: 0, area: 0, strength: 0 },
    meister: { count: 0, speed: 0, area: 0, strength: 0 }
  },
  board: {
    coins: [],
    clearedPct: 0,
    requiredPct: 70,
    clearBonusPaid: false,
    readyForReset: false
  },
  helpers: [],
  assets: {
    coinImages: new Map(),
    loaded: false
  },
  lastCoinCollectTime: 0,
  lastClearPercentageTime: 0,
  floatingNumbers: [],
  settings: { particles: true, autoSave: true, fps: false, language: "en", resolution: "1", volume: 0.5 }
};

const i18n = {
  de: { money: "Geld", shards: "Sternenstaub", settings: "Einstellungen", save: "Speichern", mainmenu: "Hauptmenü", cost: "Kosten" },
  en: { money: "Money", shards: "Stardust", settings: "Settings", save: "Save", mainmenu: "Main Menu", cost: "Cost" },
  es: { money: "Dinero", shards: "Polvo estelar", settings: "Ajustes", save: "Guardar", mainmenu: "Menú Principal", cost: "Costo" }
};

function applySettings() {
  if (!state.settings) state.settings = { particles: true, autoSave: true, fps: false, language: "en", resolution: "1", volume: 0.5 };
  const lang = state.settings.language || "en";
  if (state.settings.volume === undefined) state.settings.volume = 0.5;
  const dict = i18n[lang] || i18n.en;
  document.querySelectorAll(".lang-money").forEach(e => e.textContent = dict.money);
  document.querySelectorAll(".lang-shards").forEach(e => e.textContent = dict.shards);
  
  if (inGameSaveBtn) inGameSaveBtn.title = dict.save;
  if (inGameSettingsBtn) inGameSettingsBtn.title = dict.settings;
  if (inGameMainMenuBtn) inGameMainMenuBtn.title = dict.mainmenu;
  
  // Resolution scaling is removed to allow fullscreen CSS 100% fit.
  
  if (state.settings.fps) {
    if (fpsCounter) fpsCounter.classList.remove("hidden");
  } else {
    if (fpsCounter) fpsCounter.classList.add("hidden");
  }
  
  const cbParticles = document.getElementById("settingParticles");
  const cbAutoSave = document.getElementById("settingAutoSave");
  const settingVolume = document.getElementById("settingVolume");
  if (cbParticles) cbParticles.checked = state.settings.particles;
  if (cbAutoSave) cbAutoSave.checked = state.settings.autoSave;
  if (settingVolume) settingVolume.value = String(state.settings.volume);
  if (settingFPS) settingFPS.checked = state.settings.fps;
  if (settingLanguage) settingLanguage.value = lang;
  if (settingResolution) settingResolution.value = state.settings.resolution || "1";
}

let lastFrame = performance.now();
let saveClock = 0;
let hasScratchedThisFrame = false;
let selectedHelper = null;
let pendingRebirthMenuOpen = false;
let gameStarted = false;
let isScratching = false;
let lastPoint = null;
let inputsBound = false;

// Main menu logic
async function initMainMenu() {
  const menu = document.getElementById("slotSelectScreen");
  const container = document.getElementById("slotContainer");
  const playBtn = document.getElementById("mainPlayBtn");
  const settingsBtn = document.getElementById("mainSettingsBtn");
  const quitBtn = document.getElementById("mainQuitBtn");
  const playPanel = document.getElementById("mainMenuPlayPanel");
  const quitPanel = document.getElementById("mainMenuQuitPanel");
  const settingsPanel = document.getElementById("settingsPanel");
  const closeSettingsBtn = document.getElementById("closeSettingsBtn");
  const resetSaveBtn = document.getElementById("resetSaveBtn");

  const showMainMenuSection = (section) => {
    if (playPanel) playPanel.classList.toggle("hidden", section !== "play");
    if (quitPanel) quitPanel.classList.toggle("hidden", section !== "quit");
  };

  if (container) {
    container.innerHTML = "";
    for (let i = 0; i < 3; i++) {
      const raw = await loadStorage(STORAGE_KEY_PREFIX + i);
      const wrapper = document.createElement("div");
      wrapper.style.display = "flex";
      wrapper.style.gap = "0.5rem";
      wrapper.style.marginBottom = "0.5rem";
      wrapper.style.width = "100%";
      wrapper.style.alignItems = "center";
      
      const btn = document.createElement("button");
      btn.className = "slot-btn";
      btn.dataset.slot = i;
      btn.style.flex = "1";
      btn.style.minWidth = "0";
      
      let infoText = "Empty";
      if (raw) {
        try {
          const d = JSON.parse(raw);
          const rebirths = d.rebirth?.count || 0;
          const money = d.money || 0;
          infoText = `Money: ${formatNumber(money)} | Rebirths: ${rebirths}`;
        } catch(_) { infoText = "Corrupted"; }
      }
      
      btn.innerHTML = `<span>Slot ${i + 1}</span> <strong style="font-size: 0.8rem;">${infoText}</strong>`;
      btn.addEventListener("click", () => {
        activeSlot = i;
        if (menu) menu.classList.add("hidden");
        startGame();
      });
      wrapper.appendChild(btn);
      
      // Add reset button
      const resetBtn = document.createElement("button");
      resetBtn.className = "menu-btn small";
      resetBtn.textContent = "Reset";
      resetBtn.title = "Clear this save slot";
      resetBtn.style.width = "auto";
      resetBtn.style.padding = "0.75rem 1rem";
      resetBtn.style.flexShrink = "0";
      resetBtn.addEventListener("click", async (e) => {
        e.stopPropagation();
        if (confirm(`Clear Slot ${i + 1}? This cannot be undone.`)) {
          await removeStorage(STORAGE_KEY_PREFIX + i);
          initMainMenu();
        }
      });
      wrapper.appendChild(resetBtn);
      
      container.appendChild(wrapper);
    }
  }

  if (playBtn) playBtn.onclick = () => {
    showMainMenuSection("play");
    if (settingsPanel) settingsPanel.classList.add("hidden");
  };
  if (settingsBtn) settingsBtn.onclick = () => settingsPanel.classList.toggle("hidden");
  if (quitBtn) quitBtn.onclick = () => {
    if (gameStarted) saveState();
    showMainMenuSection("quit");
    if (settingsPanel) settingsPanel.classList.add("hidden");
    if (menu) menu.classList.remove("hidden");
  };
  if (closeSettingsBtn) closeSettingsBtn.onclick = () => settingsPanel.classList.add("hidden");
  if (resetSaveBtn) resetSaveBtn.onclick = async () => {
    if (confirm("Clear current save? This cannot be undone.")) {
      await removeStorage(getStorageKey());
      settingsPanel.classList.add("hidden");
      location.reload();
    }
  };

  showMainMenuSection("none");
}

async function startGame() {
  if (gameStarted) return;
  gameStarted = true;
  await loadState();
  await loadCoinImages();
  newBoard();
  syncHelpersCount();
  setupUI();
  refreshUI();
  requestAnimationFrame(gameLoop);
}

// Draw pixel art portraits on sidebar canvases — matches in-game helper models
function drawHelperPortraits() {
  // --- COIN ICON ---
  const coinCanvas = document.getElementById("coinIconCanvas");
  if (coinCanvas) {
    const c = coinCanvas.getContext("2d");
    c.clearRect(0, 0, 40, 40);
    const cx = 20, cy = 20, r = 16;
    const grad = c.createRadialGradient(cx - 4, cy - 4, 2, cx, cy, r);
    grad.addColorStop(0, "#fff8b0");
    grad.addColorStop(0.3, "#ffd700");
    grad.addColorStop(0.7, "#daa520");
    grad.addColorStop(1, "#996b12");
    c.fillStyle = grad;
    c.beginPath();
    c.arc(cx, cy, r, 0, Math.PI * 2);
    c.fill();
    c.strokeStyle = "#8B6914";
    c.lineWidth = 2;
    c.stroke();
    c.fillStyle = "#fff8b0";
    c.font = "bold 16px 'Press Start 2P', monospace";
    c.textAlign = "center";
    c.textBaseline = "middle";
    c.fillText("G", cx, cy + 1);
  }

  // --- KNECHT PORTRAIT ---
  const knechtCanvas = document.getElementById("knechtPortrait");
  if (knechtCanvas) {
    const c = knechtCanvas.getContext("2d");
    c.clearRect(0, 0, 40, 48);
    c.save();
    c.translate(20, 30);
    // Body
    c.fillStyle = "#9B7B4F";
    c.fillRect(-7, 2, 15, 14);
    // Belt
    c.fillStyle = "#5C3A1E";
    c.fillRect(-7, 13, 15, 3);
    c.fillStyle = "#C8A632";
    c.fillRect(-1, 13, 3, 3);
    // Arms
    c.fillStyle = "#9B7B4F";
    c.fillRect(-10, 4, 4, 10);
    c.fillRect(7, 4, 4, 10);
    // Hands
    c.fillStyle = "#DEB887";
    c.fillRect(-10, 13, 4, 3);
    c.fillRect(7, 13, 4, 3);
    // Head
    c.fillStyle = "#DEB887";
    c.fillRect(-5, -8, 11, 10);
    // Eyes
    c.fillStyle = "#2F1B0E";
    c.fillRect(-3, -4, 2, 2);
    c.fillRect(2, -4, 2, 2);
    // Smile
    c.fillStyle = "#8B4513";
    c.fillRect(-2, -1, 5, 1);
    // Hat
    c.fillStyle = "#6B4226";
    c.fillRect(-7, -13, 15, 6);
    c.fillStyle = "#A52A2A";
    c.fillRect(-4, -15, 9, 4);
    c.restore();
  }

  // --- HANDWERKER PORTRAIT ---
  const handwerkerCanvas = document.getElementById("handwerkerPortrait");
  if (handwerkerCanvas) {
    const c = handwerkerCanvas.getContext("2d");
    c.clearRect(0, 0, 40, 48);
    c.save();
    c.translate(20, 30);
    // Body
    c.fillStyle = "#7A6545";
    c.fillRect(-7, 2, 15, 14);
    // Vest
    c.fillStyle = "#FF8C00";
    c.fillRect(-7, 2, 4, 12);
    c.fillRect(4, 2, 4, 12);
    // Reflective stripes
    c.fillStyle = "#FFE040";
    c.fillRect(-7, 6, 4, 2);
    c.fillRect(4, 6, 4, 2);
    // Arms
    c.fillStyle = "#7A6545";
    c.fillRect(-10, 4, 4, 10);
    c.fillRect(7, 4, 4, 10);
    // Gloves
    c.fillStyle = "#8B6914";
    c.fillRect(-10, 13, 4, 3);
    c.fillRect(7, 13, 4, 3);
    // Head
    c.fillStyle = "#C8A070";
    c.fillRect(-5, -8, 11, 10);
    // Eyes
    c.fillStyle = "#2F1B0E";
    c.fillRect(-3, -5, 2, 2);
    c.fillRect(2, -5, 2, 2);
    // Mustache
    c.fillStyle = "#5C4030";
    c.fillRect(-3, -2, 7, 1);
    // Hard hat
    c.fillStyle = "#E8B820";
    c.fillRect(-7, -14, 15, 7);
    c.fillStyle = "#FFD030";
    c.fillRect(-6, -13, 13, 3);
    // Brim
    c.fillStyle = "#D0A018";
    c.fillRect(-8, -8, 17, 2);
    // Headlamp
    c.fillStyle = "#A0A0A0";
    c.fillRect(-2, -14, 4, 3);
    c.fillStyle = "#FFFF80";
    c.fillRect(-1, -13, 2, 2);
    c.restore();
  }

  // --- MEISTER PORTRAIT ---
  const meisterCanvas = document.getElementById("meisterPortrait");
  if (meisterCanvas) {
    const c = meisterCanvas.getContext("2d");
    c.clearRect(0, 0, 40, 48);
    c.save();
    c.translate(20, 32);
    // Body
    c.fillStyle = "#B8A47C";
    c.fillRect(-8, 0, 17, 16);
    // Pockets
    c.fillStyle = "#A09068";
    c.fillRect(-6, 4, 5, 4);
    c.fillRect(2, 4, 5, 4);
    // Arms
    c.fillStyle = "#B8A47C";
    c.fillRect(-11, 3, 4, 12);
    c.fillRect(8, 3, 4, 12);
    // Hands
    c.fillStyle = "#C8A070";
    c.fillRect(-11, 14, 4, 3);
    c.fillRect(8, 14, 4, 3);
    // Head
    c.fillStyle = "#C8A070";
    c.fillRect(-5, -10, 11, 11);
    // Beard
    c.fillStyle = "#A0A0A0";
    c.fillRect(-3, -1, 7, 3);
    // Glasses
    c.fillStyle = "#6080A0";
    c.fillRect(-4, -6, 3, 3);
    c.fillRect(2, -6, 3, 3);
    c.strokeStyle = "#808080";
    c.lineWidth = 0.8;
    c.strokeRect(-4, -6, 3, 3);
    c.strokeRect(2, -6, 3, 3);
    // Bridge
    c.fillStyle = "#808080";
    c.fillRect(-1, -5, 3, 1);
    // Eyes
    c.fillStyle = "#2F4F2F";
    c.fillRect(-3, -5, 1, 1);
    c.fillRect(3, -5, 1, 1);
    // Hat
    c.fillStyle = "#6B4A30";
    c.fillRect(-5, -16, 11, 7);
    c.fillStyle = "#7A5A3A";
    c.fillRect(-4, -15, 9, 3);
    // Brim
    c.fillStyle = "#5C3A22";
    c.fillRect(-9, -10, 19, 2);
    // Hat band
    c.fillStyle = "#8B6914";
    c.fillRect(-5, -11, 11, 1);
    c.restore();
  }
}

// Draw portraits immediately and on game start
drawHelperPortraits();

initMainMenu();
window.addEventListener("beforeunload", () => { if (gameStarted) saveState(); });

function gameLoop(now) {
  const dt = Math.min((now - lastFrame) / 1000, 0.1);
  lastFrame = now;

  if (state.settings && state.settings.fps && fpsCounter && Math.floor(now) % 10 === 0) {
    fpsCounter.textContent = Math.round(1 / dt) + " FPS";
  }

  updateHelpers(dt);

  if (hasScratchedThisFrame && now - state.lastCoinCollectTime > 50) {
    collectVisibleCoins();
    state.lastCoinCollectTime = now;
  }
  
  if (hasScratchedThisFrame && now - state.lastClearPercentageTime > 120) {
    updateClearPercentage();
    state.lastClearPercentageTime = now;
    
    if (state.board.clearedPct >= state.board.requiredPct && !state.board.readyForReset) {
      state.board.readyForReset = true;
      boardStatus.textContent = `Meadow cleared enough (${state.board.clearedPct.toFixed(1)}%).`;
    }
  }
  
  hasScratchedThisFrame = false;

  renderBoard();
  drawHelperDust();
  drawHelpers();
  updateAndDrawFloatingNumbers(dt);
  saveClock += dt;
  if (saveClock > 30) {
    if (state.settings?.autoSave !== false) {
      saveState();
    }
    saveClock = 0;
  }

  refreshUI();
  if (pendingRebirthMenuOpen) {
    toggleRebirthMenu(true);
    pendingRebirthMenuOpen = false;
  }
  requestAnimationFrame(gameLoop);
}

function addMoney(amount) {
  if (amount <= 0) return;
  state.money += amount;
  state.totalMoney += amount;
}

function spendMoney(cost) {
  if (state.money < cost) return false;
  state.money -= cost;
  playSFX('upgrade');
  return true;
}

function getCoinValueMultiplier() {
  const golden = state.rebirth.upgrades.goldenTouch || 0;
  const eternal = state.rebirth.upgrades.eternalBonus || 0;
  const rebirthMult = 1 + (state.rebirth.count * 0.1); // +10% money per Rebirth
  return (1 + state.upgrades.coinValue * 0.35)
    * (1 + state.rebirth.upgrades.coinBoost * 0.15)
    * (1 + state.rebirth.upgrades.bloomBoost * 0.04)
    * (1 + golden * 0.25)
    * (1 + eternal * 0.10)
    * rebirthMult;
}

function getHelperRadiusByType(type) {
  const base = HELPER_TYPES[type];
  return base.baseRadius + state.helperUpgrades[type].area * 5;
}

function getHelperStrengthByType(type) {
  const base = HELPER_TYPES[type];
  const strengthLevel = state.helperUpgrades[type].strength || 0;
  const strengthScale = type === "meister" ? 0.27 : type === "handwerker" ? 0.25 : 0.23;
  const raw = (base.baseStrength + state.helperUpgrades[type].area * base.areaPowerPerLevel)
    * (1 + strengthLevel * strengthScale)
    * (1 + state.rebirth.upgrades.speedBoost * 0.12)
    * (1 + state.rebirth.upgrades.mastery * 0.16);
  return Math.max(0.02, Math.min(0.34, raw));
}

function getHelperTooWeakThreshold(type) {
  const meadowTier = state.upgrades.meadowTier || 0;
  const baseThreshold = {
    knecht: 0.10,
    handwerker: 0.12,
    meister: 0.14,
  }[type] || 0.022;
  if (meadowTier <= 0) return baseThreshold * 0.55;
  return Math.min(0.34, baseThreshold + meadowTier * 0.03 + Math.max(0, meadowTier - 1) * 0.006);
}

function getHelperStrengthUpgradeCost(type, level) {
  const costConfig = {
    knecht: [120, 1.72],
    handwerker: [320, 1.8],
    meister: [900, 1.88],
  }[type] || [120, 1.72];
  return effectiveCost(costConfig[0], costConfig[1], level);
}

function getHelperCoinVisibleAlphaThreshold() {
  const meadowTier = state.upgrades.meadowTier || 0;
  return Math.max(130, 255 - Math.min(110, meadowTier * 11));
}

function getHelperMeadowEfficiency(type) {
  const meadowTier = state.upgrades.meadowTier || 0;
  const tierPower = {
    knecht: 1.12,
    handwerker: 1.03,
    meister: 1.06
  }[type] || 1;
  const upgradeScaling = 1 + state.helperUpgrades[type].area * 0.16 + state.helperUpgrades[type].speed * 0.03;
  const strengthBonus = 1 + (state.helperUpgrades[type].strength || 0) * 0.18;
  const rebirthSupport = 1 + (state.rebirth.upgrades.mastery || 0) * 0.03;
  const meadowResistance = Math.pow(1 + meadowTier * 0.18, 0.95 + meadowTier * 0.04);
  const strengthFloor = type === "meister" ? 0.18 : type === "handwerker" ? 0.12 : 0.1;
  return Math.max(strengthFloor, (tierPower * upgradeScaling * strengthBonus * rebirthSupport) / meadowResistance);
}

function getHelperSpeedByType(type) {
  const base = HELPER_TYPES[type];
  let mult = (1 + state.rebirth.upgrades.speedBoost * 0.16)
    * (1 + state.rebirth.upgrades.mastery * 0.1)
    * (1 + (state.rebirth.upgrades.eternalBonus || 0) * 0.10);
  // Knecht mastery: +50% speed per level for Knecht
  if (type === "knecht") mult *= (1 + (state.rebirth.upgrades.knechtMastery || 0) * 0.5);
  // Archaeologist instinct: Meister 2x faster per level
  if (type === "meister") mult *= (1 + (state.rebirth.upgrades.archaeologistInstinct || 0) * 1.0);
  return (base.baseSpeed + state.helperUpgrades[type].speed * base.speedPerLevel) * mult;
}

function getHelperDigIntervalByType(type) {
  const base = HELPER_TYPES[type];
  const turbo = state.rebirth.upgrades.turboDig || 0;
  const interval = base.baseDig * Math.pow(base.digFactor, state.helperUpgrades[type].speed) * (1 - turbo * 0.12);
  return Math.max(0.06, interval);
}

function getShovelDigRadius() {
  const digPower = state.rebirth.upgrades.digPower || 0;
  const ultimateDigging = state.rebirth.upgrades.ultimateDigging || 0;
  const clickPower = state.rebirth.upgrades.clickPower || 0;
  return 24 + digPower * 2.2 + ultimateDigging * 4 + clickPower * 4.5;
}

function getShovelBrushStrength() {
  const digPower = state.rebirth.upgrades.digPower || 0;
  const ultimateDigging = state.rebirth.upgrades.ultimateDigging || 0;
  const mastery = state.rebirth.upgrades.mastery || 0;
  return 0.22 + digPower * 0.018 + mastery * 0.01 + ultimateDigging * 0.04;
}

function getTotalHelperCount() {
  return state.helperUpgrades.knecht.count + state.helperUpgrades.handwerker.count + state.helperUpgrades.meister.count;
}

function effectiveCost(base, growth, level) {
  const efficiencyDiscount = 1 - Math.min(0.25, (state.rebirth.upgrades.efficiency || 0) * 0.05);
  return Math.floor(base * Math.pow(growth, level) * efficiencyDiscount);
}

function getRebirthRequirementMoney() {
  return Math.floor(5000 * Math.pow(1.7, state.rebirth.count));
}

function getRebirthRequirementTier() {
  return 3 + state.rebirth.count;
}

function canRebirth() {
  return state.money >= getRebirthRequirementMoney() && state.upgrades.meadowTier >= getRebirthRequirementTier();
}

function calculateRebirthGain() {
  if (!canRebirth()) return 0;
  const reqMoney = getRebirthRequirementMoney();
  const reqTier = getRebirthRequirementTier();
  const moneyPart = Math.floor((state.money / reqMoney) * 0.85);
  const tierPart = Math.floor((state.upgrades.meadowTier - reqTier + 1) * 0.6);
  const prestigeMult = 1 + (state.rebirth.upgrades.prestigeMultiplier || 0) * 0.5;
  const expBonus = state.rebirth.upgrades.experience || 0;
  return Math.max(1, Math.floor((1 + moneyPart + tierPart) * prestigeMult) + expBonus);
}

function getRebirthUpgradeCost(kind, level) {
  const costs = {
    digPower: () => Math.pow(level + 1, 2),
    coinBoost: () => 10 * (level + 1),
    speedBoost: () => 14 * (level + 1),
    mastery: () => 24 * (level + 1),
    diamondBoost: () => 36 * (level + 1),
    // Tier 2
    doubleDrop: () => 18 * (level + 1),
    knechtMastery: () => 25 * (level + 1),
    autoCollect: () => 20 * (level + 1),
    rareFinder: () => 22 * (level + 1),
    bloomBoost: () => 30 * (level + 1),
    turboDig: () => 28 * (level + 1),
    // Tier 3
    goldenTouch: () => 45 * (level + 1),
    handwerkerMastery: () => 50 * (level + 1),
    megaMagnet: () => 40 * (level + 1),
    rubyNose: () => 55 * (level + 1),
    efficiency: () => 35 * (level + 1),
    experience: () => 42 * (level + 1),
    // Tier 4
    archaeologistInstinct: () => 80 * (level + 1),
    treasureRain: () => 65 * (level + 1),
    eternalBonus: () => 100 * (level + 1),
    emeraldFever: () => 70 * (level + 1),
    prestigeMultiplier: () => 90 * (level + 1),
    ultimateDigging: () => 200 * (level + 1),
  };
  return Math.floor((costs[kind] || (() => 24 * (level + 1)))());
}

function isRebirthNodeUnlocked(kind) {
  if (kind === "digPower") return true;
  if (kind === "coinBoost") return state.rebirth.upgrades.digPower >= 1;
  if (kind === "speedBoost") return state.rebirth.upgrades.coinBoost >= 1;
  if (kind === "mastery") return state.rebirth.upgrades.speedBoost >= 1;
  if (kind === "diamondBoost") return state.rebirth.upgrades.mastery >= 1;
  if (kind === "bloomBoost") return state.rebirth.upgrades.diamondBoost >= 1;
  return false;
}

function getRebirthStartBonusKnecht() {
  const lv = state.rebirth.upgrades.digPower || 0;
  return lv * lv;
}

function getRebirthStartBonusHandwerker() {
  return state.rebirth.upgrades.coinBoost || 0;
}

function getRebirthDiamondChanceBonus() {
  return state.rebirth.upgrades.diamondBoost || 0;
}

function getRebirthBloomBonus() {
  return state.rebirth.upgrades.bloomBoost || 0;
}

function getHelperScanInterval() {
  const total = getTotalHelperCount();
  if (total >= 45) return 0.34;
  if (total >= 30) return 0.24;
  return HELPER_COIN_SCAN_INTERVAL;
}

function clamp01(v) {
  return Math.max(0, Math.min(1, v));
}

function toggleRebirthMenu(open) {
  if (!rebirthMenu) return;
  if (!open) pendingRebirthMenuOpen = false;
  rebirthMenu.classList.toggle("hidden", !open);
  rebirthMenu.setAttribute("aria-hidden", open ? "false" : "true");
}

function toggleHelperMenu(open) {
  if (!helperMenu) return;
  helperMenu.classList.toggle("hidden", !open);
  helperMenu.setAttribute("aria-hidden", open ? "false" : "true");
}

function setActiveTab(tabKey) {
  const map = {
    helper: tabHelperBtn,
    economy: tabEconomyBtn,
    rebirth: tabRebirthBtn
  };

  for (const [key, btn] of Object.entries(map)) {
    if (!btn) continue;
    btn.classList.toggle("active", key === tabKey);
  }

  const panels = document.querySelectorAll(".tab-panel");
  for (const panel of panels) {
    panel.classList.toggle("hidden", panel.dataset.tabPanel !== tabKey);
  }
}

function updateHelperMenu() {
  if (!selectedHelper || !helperMenuTitle) return;
  const type = selectedHelper.type;
  const cfg = HELPER_TYPES[type];
  const up = state.helperUpgrades[type];

  helperMenuTitle.textContent = `${cfg.name} Helfer`;
  if (selectedHelper.isSleeping) {
    helperMenuInfo.textContent = `Status: schläft (${Math.ceil(selectedHelper.sleepRemaining)}s) - Klick auf Wecken spart Zeit.`;
  } else {
    helperMenuInfo.textContent = `Status: aktiv - wird nach ${Math.ceil(selectedHelper.awakeRemaining)}s müde.`;
  }

  helperWakeBtn.textContent = selectedHelper.isSleeping ? "Jetzt aufwecken (15s Cooldown skippen)" : "Aktiv - kein Wecken nötig";
  helperWakeBtn.disabled = !selectedHelper.isSleeping;

  const strengthCost = getHelperStrengthUpgradeCost(type, up.strength || 0);
  if (helperUpgradeStrengthBtn) {
    helperUpgradeStrengthBtn.textContent = `Strength Lv.${up.strength || 0}\nCost: ${formatNumber(strengthCost)} Money`;
    helperUpgradeStrengthBtn.disabled = state.money < strengthCost;
  }

  const speedCost = effectiveCost(cfg.costSpeed, 1.55, up.speed);
  helperUpgradeSpeedBtn.textContent = `Speed Lv.${up.speed}\nCost: ${formatNumber(speedCost)} Money`;
  helperUpgradeSpeedBtn.disabled = state.money < speedCost;

  const areaCost = effectiveCost(cfg.costArea, 1.6, up.area);
  helperUpgradeAreaBtn.textContent = `Area Lv.${up.area}\nCost: ${formatNumber(areaCost)} Money`;
  helperUpgradeAreaBtn.disabled = state.money < areaCost;
}

function getCanvasPos(clientX, clientY) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  return {
    x: (clientX - rect.left) * scaleX,
    y: (clientY - rect.top) * scaleY
  };
}

function drawInterpolatedLineShovel(a, b) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const distance = Math.hypot(dx, dy);
  const radius = getShovelDigRadius();
  const steps = Math.max(1, Math.ceil(distance / Math.max(4, radius * 0.35)));

  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const x = a.x + dx * t;
    const y = a.y + dy * t;
    scratchAt(x, y, radius, getShovelBrushStrength());
  }
}

function bindInputs() {
  if (inputsBound) return;
  inputsBound = true;

  const stopScratching = () => {
    isScratching = false;
    lastPoint = null;
  };

  canvas.addEventListener("mousedown", (e) => {
    if (e.button !== 0) return;
    const p = getCanvasPos(e.clientX, e.clientY);
    const clickedHelper = findClickedHelper(p.x, p.y);
    if (clickedHelper) return;
    isScratching = true;
    lastPoint = p;
    scratchAt(lastPoint.x, lastPoint.y, getShovelDigRadius(), getShovelBrushStrength());
    triggerLuckyCharm(lastPoint.x, lastPoint.y);
    playSFX('scratch');
    e.preventDefault();
  });

  window.addEventListener("mousemove", (e) => {
    if (!isScratching || !lastPoint) return;
    const p = getCanvasPos(e.clientX, e.clientY);
    drawInterpolatedLineShovel(lastPoint, p);
    lastPoint = p;
  });

  window.addEventListener("mouseup", stopScratching);

  canvas.addEventListener("touchstart", (e) => {
    e.preventDefault();
    const t = e.touches[0];
    if (!t) return;
    const p = getCanvasPos(t.clientX, t.clientY);
    const clickedHelper = findClickedHelper(p.x, p.y);
    if (clickedHelper) return;
    isScratching = true;
    lastPoint = p;
    scratchAt(lastPoint.x, lastPoint.y, getShovelDigRadius(), getShovelBrushStrength());
    triggerLuckyCharm(lastPoint.x, lastPoint.y);
    playSFX('scratch');
  }, { passive: false });

  canvas.addEventListener("touchmove", (e) => {
    e.preventDefault();
    if (!isScratching || !lastPoint) return;
    const t = e.touches[0];
    if (!t) return;
    const p = getCanvasPos(t.clientX, t.clientY);
    drawInterpolatedLineShovel(lastPoint, p);
    lastPoint = p;
  }, { passive: false });

  canvas.addEventListener("touchend", stopScratching);
  canvas.addEventListener("touchcancel", stopScratching);

  canvas.addEventListener("pointerdown", (e) => {
    if (e.button !== 0 && e.pointerType === "mouse") return;
    const p = getCanvasPos(e.clientX, e.clientY);
    const clickedHelper = findClickedHelper(p.x, p.y);
    if (clickedHelper) return;
    isScratching = true;
    lastPoint = p;
    if (canvas.setPointerCapture) {
      try { canvas.setPointerCapture(e.pointerId); } catch (_) {}
    }
    scratchAt(lastPoint.x, lastPoint.y, getShovelDigRadius(), getShovelBrushStrength());
    triggerLuckyCharm(lastPoint.x, lastPoint.y);
    playSFX('scratch');
    e.preventDefault();
  });

  window.addEventListener("pointermove", (e) => {
    if (!isScratching || !lastPoint) return;
    const p = getCanvasPos(e.clientX, e.clientY);
    drawInterpolatedLineShovel(lastPoint, p);
    lastPoint = p;
  });

  window.addEventListener("pointerup", stopScratching);
  window.addEventListener("pointercancel", stopScratching);
  canvas.addEventListener("lostpointercapture", stopScratching);
}

function findClickedHelper(x, y) {
  let best = null;
  let bestDist = Infinity;
  for (const helper of state.helpers) {
    const dx = helper.x - x;
    const dy = helper.y - y;
    const d = Math.sqrt(dx * dx + dy * dy);
    if (d < 26 && d < bestDist) {
      best = helper;
      bestDist = d;
    }
  }
  return best;
}

function hexToRgb(hex) {
  const raw = hex.replace("#", "");
  const n = Number.parseInt(raw, 16);
  return {
    r: (n >> 16) & 255,
    g: (n >> 8) & 255,
    b: n & 255
  };
}

function mixHexColors(a, b, t) {
  const c1 = hexToRgb(a);
  const c2 = hexToRgb(b);
  const clamped = Math.max(0, Math.min(1, t));
  const r = Math.round(c1.r + (c2.r - c1.r) * clamped);
  const g = Math.round(c1.g + (c2.g - c1.g) * clamped);
  const bch = Math.round(c1.b + (c2.b - c1.b) * clamped);
  return `rgb(${r}, ${g}, ${bch})`;
}

function applyMeadowThemeToPage() {
  // Fixed GroundBreaker brand colors (earthy tones - don't change with meadow tier)
  const root = document.documentElement;
  root.style.setProperty("--meadow-tint-a", "#6B8F3C");
  root.style.setProperty("--meadow-tint-b", "#4A6D2A");
  root.style.setProperty("--accent", "#84AA58");
  root.style.setProperty("--accent-warm", "#3D5C1E");
  root.style.setProperty("--panel-border", "#5A7A34");
}

function spendShards(cost) {
  if (state.rebirth.shards < cost) return false;
  state.rebirth.shards -= cost;
  return true;
}

function getSpentShardsForLevel(kind, level) {
  let spent = 0;
  for (let i = 0; i < level; i++) {
    spent += getRebirthUpgradeCost(kind, i);
  }
  return spent;
}

function resetRebirthUpgradesWithRefund() {
  state.rebirth.count = 0;
  state.rebirth.shards = 0;
  state.rebirth.upgrades = {
    digPower: 0, coinBoost: 0, speedBoost: 0, mastery: 0, diamondBoost: 0,
    doubleDrop: 0, knechtMastery: 0, autoCollect: 0, rareFinder: 0, bloomBoost: 0, turboDig: 0,
    goldenTouch: 0, handwerkerMastery: 0, megaMagnet: 0, rubyNose: 0, efficiency: 0, experience: 0,
    archaeologistInstinct: 0, treasureRain: 0, eternalBonus: 0, emeraldFever: 0, prestigeMultiplier: 0, ultimateDigging: 0
  };
  state.helperUpgrades.knecht = { count: 1, speed: 0, area: 0, strength: 0 };
  state.helperUpgrades.handwerker = { count: 0, speed: 0, area: 0, strength: 0 };
  state.helperUpgrades.meister = { count: 0, speed: 0, area: 0, strength: 0 };
  syncHelpersCount();
  state.money = 0;
  state.totalMoney = 0;
  state.upgrades.coinValue = 0;
  state.upgrades.meadowTier = 0;
  newBoard();
  showLootPopup("Rebirth komplett zurückgesetzt");
}

function isHelperUnlocked(type) {
  if (type === "knecht") return true;
  // Handwerker: ab 5+ Knechte
  if (type === "handwerker") {
    return state.helperUpgrades.knecht.count >= 5;
  }
  // Meister: ab 8+ Handwerker
  if (type === "meister") {
    return state.helperUpgrades.handwerker.count >= 8;
  }
  return false;
}

function getHelperUnlockInfo(type) {
  // Gibt zurück wie viele noch benötigt werden
  if (type === "handwerker") {
    if (isHelperUnlocked("handwerker")) return { locked: false };
    const need = Math.max(0, 5 - state.helperUpgrades.knecht.count);
    return { locked: true, need, reason: `Benötigt ${need} mehr Knechte` };
  }
  if (type === "meister") {
    if (isHelperUnlocked("meister")) return { locked: false };
    const need = Math.max(0, 8 - state.helperUpgrades.handwerker.count);
    return { locked: true, need, reason: `Benötigt ${need} mehr Handwerker` };
  }
  return { locked: false };
}

function performRebirth() {
  if (!canRebirth()) return;

  const gain = calculateRebirthGain();
  state.rebirth.shards += gain;
  state.rebirth.count += 1;
  playSFX('rebirth');

  state.money = 0;
  state.totalMoney = 0;
  state.upgrades.coinValue = 0;
  state.upgrades.meadowTier = 0;
  const startKnecht = Math.min(MAX_HELPERS_PER_TYPE, 1 + getRebirthStartBonusKnecht());
  const startHandwerker = Math.min(MAX_HELPERS_PER_TYPE, getRebirthStartBonusHandwerker());
  state.helperUpgrades.knecht = { count: startKnecht, speed: 0, area: 0, strength: 0 };
  state.helperUpgrades.handwerker = { count: startHandwerker, speed: 0, area: 0, strength: 0 };
  state.helperUpgrades.meister = { count: 0, speed: 0, area: 0, strength: 0 };

  syncHelpersCount();
  newBoard();
  boardStatus.textContent = `Rebirth complete! +${gain} Stardust gained.`;
  pendingRebirthMenuOpen = true;
  setActiveTab("rebirth");
  toggleHelperMenu(false);
}

function loadCoinImages() {
  const loaders = COIN_TIERS.map((tier) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        state.assets.coinImages.set(tier.key, img);
        resolve();
      };
      img.onerror = () => resolve();
      img.src = `${tier.image}?v=${COIN_ASSET_VERSION}`;
    });
  });

  return Promise.all(loaders).then(() => {
    state.assets.loaded = true;
  });
}

function getCurrentMeadowPalette() {
  return MEADOW_COLORS[Math.min(MEADOW_COLORS.length - 1, state.upgrades.meadowTier)];
}

function paletteLabel(index) {
  const labels = [
    "Waldwiese",
    "Hellgrün",
    "Dunkelgrün",
    "Rotblock",
    "Meerblau",
    "Türkisland",
    "Violettraum",
    "Goldwiese",
    "Rosengarten",
    "Orangenfeuer",
    "Seegrün",
    "Frühlingslicht",
    "Zuckerblüte",
    "Sonnenring",
    "Nebelviolett",
    "Glutwiese"
  ];
  return labels[Math.min(index, labels.length - 1)];
}

function setUpgradeHint(text) {
  if (!upgradeHint) return;
  upgradeHint.textContent = text;
}

function getCoinWeightsForTier() {
  const t = state.upgrades.meadowTier;
  const diamondBase = state.rebirth.upgrades.diamondBoost || 0;
  const bloom = state.rebirth.upgrades.bloomBoost || 0;
  const rare = state.rebirth.upgrades.rareFinder || 0;
  const rubyBoost = state.rebirth.upgrades.rubyNose || 0;
  return {
    bronze: Math.max(8, COIN_TIERS[0].baseWeight - t * 5.5 - bloom * 1.2 - rare * 2),
    silver: Math.max(4, COIN_TIERS[1].baseWeight + t * 1.35 - Math.max(0, 2 - t) * 7 + bloom * 0.5),
    gold: Math.max(2, COIN_TIERS[2].baseWeight + t * 1.9 - Math.max(0, 3 - t) * 4 + bloom * 0.8),
    titanium: t >= 3 ? COIN_TIERS[3].baseWeight + (t - 3) * 1.8 + bloom * 0.6 + rare * 0.5 : 0,
    emerald: t >= 5 ? 1.5 + (t - 5) * 1.0 + bloom * 0.4 + rare * 0.6 : 0,
    diamond: t >= 6 ? COIN_TIERS[5].baseWeight + diamondBase * 0.75 + (t - 6) * 1.2 + bloom * 0.35 + rare * 0.5 : 0,
    ruby: t >= 8 ? 0.6 + (t - 8) * 0.5 + bloom * 0.2 + rubyBoost * 0.8 + rare * 0.3 : 0
  };
}

function pickCoinTier() {
  const weights = getCoinWeightsForTier();
  const weighted = [
    { key: "bronze", weight: weights.bronze },
    { key: "silver", weight: weights.silver },
    { key: "gold", weight: weights.gold },
    { key: "titanium", weight: weights.titanium },
    { key: "emerald", weight: weights.emerald },
    { key: "diamond", weight: weights.diamond },
    { key: "ruby", weight: weights.ruby }
  ];

  const total = weighted.reduce((sum, c) => sum + c.weight, 0);
  let r = Math.random() * total;
  for (const item of weighted) {
    r -= item.weight;
    if (r <= 0) {
      return COIN_TIERS.find((c) => c.key === item.key) || COIN_TIERS[0];
    }
  }
  return COIN_TIERS[0];
}

function newBoard() {
  state.board.coins = [];

  const treasureBonus = state.rebirth.upgrades.treasureRain || 0;
  const coinCount = 14 + Math.floor(Math.random() * 9) + Math.min(8, state.rebirth.upgrades.bloomBoost || 0) + treasureBonus * 2;
  for (let i = 0; i < coinCount; i++) {
    const tier = pickCoinTier();
    state.board.coins.push({
      x: 64 + Math.random() * (canvas.width - 128),
      y: 76 + Math.random() * (canvas.height - 150),
      radius: 16 + Math.random() * 9,
      tier,
      collected: false
    });
  }

  state.board.clearedPct = 0;
  state.board.requiredPct = 67 + Math.min(20, state.upgrades.meadowTier * 1.35);
  state.board.clearBonusPaid = false;
  state.board.readyForReset = false;

  drawGroundBase();
  drawOverlayLayer();
  applyMeadowThemeToPage();
  resetHelpersPosition();
  updateClearPercentage();

  boardStatus.textContent = "Die Helfer graben automatisch. Kaufe bessere Helfer um schneller voranzukommen!";
}

function renderBoard() {
  ctx.globalCompositeOperation = "source-over";
  ctx.drawImage(groundCanvas, 0, 0);
  drawCoins();
  ctx.drawImage(overlayCanvas, 0, 0);
}

function drawGroundBase() {
  // Verwende SOIL_COLORS (unabhängig von meadowTier - Erde ist immer braun)
  const soilIndex = Math.min(state.upgrades.meadowTier, SOIL_COLORS.length - 1);
  const [light, mid, dark] = SOIL_COLORS[soilIndex];
  groundCtx.globalCompositeOperation = "source-over";
  groundCtx.fillStyle = light;
  groundCtx.fillRect(0, 0, canvas.width, canvas.height);

  // Basis-Textur mit natürlicherer Variation
  const tile = 16; // Kleinere Tiles für feinere Struktur
  for (let y = 0; y < canvas.height; y += tile) {
    for (let x = 0; x < canvas.width; x += tile) {
      const gx = x / tile;
      const gy = y / tile;
      const hash1 = Math.abs(((gx * 73856093) ^ (gy * 19349663)) % 7);
      const hash2 = Math.abs(((gx * 19 + gy * 37) * 982451653) % 5);
      
      let tint;
      if (hash1 < 2) tint = light;
      else if (hash1 < 4) tint = mid;
      else if (hash1 < 6) tint = mixHexColors(light, mid, 0.4);
      else tint = mixHexColors(mid, dark, 0.5);
      
      groundCtx.fillStyle = tint;
      groundCtx.fillRect(x, y, tile, tile);
    }
  }
  
  // Detaillierte Textur-Layer
  groundCtx.globalAlpha = 0.15;
  for (let i = 0; i < 600; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    groundCtx.fillStyle = i % 3 === 0 ? "#000000" : "#ffffff";
    const size = 1 + Math.random() * 1.5;
    groundCtx.fillRect(x, y, size, size);
  }
  groundCtx.globalAlpha = 1;
  
  // Schattierung und Struktur
  groundCtx.globalAlpha = 0.08;
  groundCtx.fillStyle = "#000000";
  for (let y = 0; y < canvas.height; y += 8) {
    for (let x = 0; x < canvas.width; x += 8) {
      if (((x + y) % 16) === 0) {
        groundCtx.fillRect(x, y, 3, 3);
      }
    }
  }
  groundCtx.globalAlpha = 1;
}

function drawCoinArtifact(coin) {
  const key = coin.tier.key || coin.tier;
  const t = performance.now() / 1000;
  const wobble = Math.sin(t * 2.8 + coin.x * 0.02 + coin.y * 0.03) * 0.07;
  const pulse = 1 + Math.sin(t * 4 + coin.x * 0.01) * 0.04;
  const size = coin.radius * 2.35 * pulse;
  const coinImage = state.assets.coinImages.get(key);

  ctx.save();
  ctx.translate(coin.x, coin.y);
  ctx.rotate(wobble);
  ctx.shadowColor = coin.tier.hue;
  ctx.shadowBlur = 0;

  if (coinImage) {
    const drawSize = Math.max(18, size);
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(coinImage, -drawSize / 2, -drawSize / 2, drawSize, drawSize);
  } else {
    const base = key === "titanium" ? "#d5fbff" : coin.tier.hue;
    ctx.fillStyle = base;
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.48, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

function drawCoins() {
  for (const coin of state.board.coins) {
    if (coin.collected) continue;
    drawCoinArtifact(coin);
  }
}

function drawOverlayLayer() {
  overlayCtx.globalCompositeOperation = "source-over";
  const [light, mid, dark] = getCurrentMeadowPalette();
  overlayCtx.fillStyle = light;
  overlayCtx.fillRect(0, 0, canvas.width, canvas.height);

  // Mehrschichtiges Gras-Rendering für natürlicheres Aussehen
  // Layer 1: Basis-Grastöne
  const tile = 12;
  for (let y = 0; y < canvas.height; y += tile) {
    for (let x = 0; x < canvas.width; x += tile) {
      const gx = x / tile;
      const gy = y / tile;
      const hash = Math.abs(((gx * 104729) ^ (gy * 2654435761)) % 8);
      
      let shade;
      if (hash < 3) shade = light;
      else if (hash < 5) shade = mid;
      else if (hash < 7) shade = mixHexColors(light, mid, 0.3);
      else shade = mixHexColors(light, mid, 0.7);
      
      overlayCtx.fillStyle = shade;
      overlayCtx.fillRect(x, y, tile, tile);
    }
  }
  
  // Layer 2: Organische Grashalme-Textur
  overlayCtx.globalAlpha = 0.38;
  for (let i = 0; i < 1200; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const noise = Math.sin(x * 0.008 + y * 0.012) * Math.cos(x * 0.005 + y * 0.008);
    const hash = ((noise + 1) * 50) % 100;
    if (hash < 45) overlayCtx.fillStyle = dark;
    else if (hash < 75) overlayCtx.fillStyle = mid;
    else overlayCtx.fillStyle = light;
    const height = 2 + Math.random() * 5;
    const width = 0.6 + Math.random() * 0.7;
    overlayCtx.fillRect(x, y, width, height);
  }
  overlayCtx.globalAlpha = 1;
  
  // Layer 3: Feindetails und Schatten
  overlayCtx.globalAlpha = 0.06;
  for (let i = 0; i < 400; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    overlayCtx.fillStyle = "#000000";
    const size = 1 + Math.random() * 2.5;
    overlayCtx.fillRect(x, y, size, size);
  }
  overlayCtx.globalAlpha = 1;

  const vignette = overlayCtx.createRadialGradient(
    canvas.width / 2,
    canvas.height / 2,
    Math.min(canvas.width, canvas.height) * 0.2,
    canvas.width / 2,
    canvas.height / 2,
    Math.max(canvas.width, canvas.height) * 0.72
  );
  vignette.addColorStop(0, "rgba(255, 255, 255, 0)");
  vignette.addColorStop(1, "rgba(33, 58, 26, 0.0)");
  overlayCtx.fillStyle = vignette;
  overlayCtx.fillRect(0, 0, canvas.width, canvas.height);
}

function triggerLuckyCharm(x, y) {
  const charmLvl = state.rebirth.upgrades.luckyCharm || 0;
  if (charmLvl === 0) return;
  
  if (Math.random() < charmLvl * 0.02) {
    let collectedCount = 0;
    for (const coin of state.board.coins) {
      if (!coin.collected && getCoinOverlayAlpha(coin) < 250) {
        coin.collected = true;
        let payout = coin.tier.value * getCoinValueMultiplier();
        addMoney(payout);
        spawnFloatingNumber(coin.x, coin.y, `+${formatNumber(payout)}`, coin.tier.color);
        collectedCount++;
        if (collectedCount >= 10) break;
      }
    }
    if (collectedCount > 0) {
      spawnDustPuff({x, y}, x, y, 60);
      showLootPopup(`Glücksbringer! + ${collectedCount} Coins!`);
    }
  }
}

function scratchAt(x, y, radius, brushStrength) {
  initAudio();
  overlayCtx.save();
  overlayCtx.globalCompositeOperation = "destination-out";

  const inner = radius * 0.2;
  const coreStrength = Math.max(0.02, Math.min(0.34, brushStrength));
  const midStrength = Math.max(0.01, Math.min(0.24, coreStrength * 0.62));
  const grad = overlayCtx.createRadialGradient(x, y, inner, x, y, radius);
  grad.addColorStop(0, `rgba(0, 0, 0, ${coreStrength})`);
  grad.addColorStop(0.6, `rgba(0, 0, 0, ${midStrength})`);
  grad.addColorStop(1, "rgba(0, 0, 0, 0)");

  overlayCtx.fillStyle = grad;
  overlayCtx.beginPath();
  overlayCtx.arc(x, y, radius, 0, Math.PI * 2);
  overlayCtx.fill();
  overlayCtx.restore();

  hasScratchedThisFrame = true;
}

function collectVisibleCoins() {
  const valueMult = getCoinValueMultiplier();

  for (const coin of state.board.coins) {
    if (coin.collected) continue;

    const alpha = getCoinOverlayAlpha(coin);

    if (alpha < 130) {
      coin.collected = true;
      let payout = coin.tier.value * valueMult;
      // Emerald Fever: 2x emerald value
      if (coin.tier.key === "emerald" && (state.rebirth.upgrades.emeraldFever || 0) > 0) {
        payout *= (1 + (state.rebirth.upgrades.emeraldFever || 0) * 1.0);
      }
      // Double Drop chance
      const ddLvl = state.rebirth.upgrades.doubleDrop || 0;
      const ddChance = ddLvl * 0.08; // 8% per level
      let dropLabel = "1x";
      if (ddLvl > 0 && Math.random() < ddChance) {
        payout *= 2;
        dropLabel = "2x";
      }
      addMoney(payout);
      playSFX('collect');
      spawnFloatingNumber(coin.x, coin.y, `+${formatNumber(payout)}`, coin.tier.color || "#FFD700");
      showLootPopup(`${dropLabel} ${coinLabel(coin.tier.key)}  +${formatNumber(payout)} Geld`);
    }
  }

  if (!state.board.clearBonusPaid && allCoinsCollected()) {
    state.board.clearBonusPaid = true;
    const tier = state.upgrades.meadowTier;
    const bonus = 200 * (1 + tier * 0.5) * (1 + state.rebirth.count * 0.15);
    addMoney(bonus);
    showLootPopup(`Alle Coins gefunden! +${formatNumber(bonus)} Bonus (Tier ${tier})`);
    // Auto-reset: Neue Wiese nach kurzer Verzögerung
    setTimeout(() => {
      newBoard();
    }, 1200);
  }
}

function coinLabel(key) {
  if (key === "bronze") return "Bronze";
  if (key === "silver") return "Silber";
  if (key === "gold") return "Gold";
  if (key === "titanium") return "Titan";
  if (key === "emerald") return "Smaragd";
  if (key === "diamond") return "Diamant";
  if (key === "ruby") return "Rubin";
  return key ? key.charAt(0).toUpperCase() + key.slice(1) : "Münze";
}

function showLootPopup(text) {
  if (!lootFeed) return;
  const item = document.createElement("div");
  item.className = "loot-popup";
  item.textContent = text;
  lootFeed.prepend(item);

  while (lootFeed.children.length > 4) {
    lootFeed.lastElementChild.remove();
  }

  setTimeout(() => {
    item.remove();
  }, 1300);
}

function allCoinsCollected() {
  for (const coin of state.board.coins) {
    if (!coin.collected) return false;
  }
  return true;
}

function getCoinOverlayAlpha(coin) {
  const cx = Math.floor(coin.x);
  const cy = Math.floor(coin.y);
  const samples = [
    [0, 0],
    [3, 0],
    [-3, 0],
    [0, 3],
    [0, -3],
    [2, 2],
    [-2, -2]
  ];

  let minAlpha = 255;
  for (const [ox, oy] of samples) {
    const x = Math.max(0, Math.min(canvas.width - 1, cx + ox));
    const y = Math.max(0, Math.min(canvas.height - 1, cy + oy));
    const px = overlayCtx.getImageData(x, y, 1, 1).data;
    if (px[3] < minAlpha) minAlpha = px[3];
  }

  return minAlpha;
}

// Coin restriction per helper type
const HELPER_CAN_DIG = {
  knecht: ["bronze", "silver", "gold"],
  handwerker: ["bronze", "silver", "gold", "titanium", "emerald"],
  meister: ["bronze", "silver", "gold", "titanium", "emerald", "diamond", "ruby"]
};

// Dig time penalty for rarer coins (multiplier, 1.0 = normal)
const COIN_DIG_PENALTY = {
  bronze: 1.0, silver: 1.0, gold: 1.3, titanium: 1.5,
  emerald: 1.8, diamond: 2.0, ruby: 2.5
};

function canHelperDigCoin(helperType, coinKey) {
  if (state.rebirth.upgrades.ultimateDigging) return true;
  if (helperType === "handwerker" && coinKey === "diamond" && (state.rebirth.upgrades.handwerkerMastery || 0) > 0) return true;
  
  // Strength based unlocking of higher coins
  const strength = state.helperUpgrades[helperType].strength || 0;
  let allowed = [...HELPER_CAN_DIG[helperType]];
  
  // Example: every 2 levels of strength unlocks one higher coin tier
  const allTiers = ["bronze", "silver", "gold", "titanium", "emerald", "diamond", "ruby"];
  let maxIdx = -1;
  for (const a of allowed) {
    maxIdx = Math.max(maxIdx, allTiers.indexOf(a));
  }
  
  maxIdx += Math.floor(strength / 2);
  maxIdx = Math.min(maxIdx, allTiers.length - 1);
  
  const coinIdx = allTiers.indexOf(coinKey);
  return coinIdx <= maxIdx;
}

function getDigTimePenalty(helperType, coinKey) {
  const basePenalty = COIN_DIG_PENALTY[coinKey] || 1.0;
  if (helperType === "meister") return 1.0; // Meister has no penalty
  // Speed upgrades reduce penalty: each speed level reduces penalty by 8%
  const speedLvl = state.helperUpgrades[helperType].speed;
  const reduction = 1 - Math.min(0.6, speedLvl * 0.08);
  return 1.0 + (basePenalty - 1.0) * reduction;
}

function findNearbyVisibleCoin(helper) {
  let bestCoin = null;
  let bestDistSq = Infinity;
  const detectRadius = HELPER_COIN_DETECT_RADIUS + (state.rebirth.upgrades.megaMagnet || 0) * 30
    + (state.rebirth.upgrades.mastery || 0) * 10;
  const visibleAlphaThreshold = getHelperCoinVisibleAlphaThreshold();
  const helperBonusRadius = helper.type === "knecht" ? Math.max(28, 40 - (state.upgrades.meadowTier || 0) * 2) : helper.type === "handwerker" ? 10 : 0;
  const searchRadius = detectRadius + helperBonusRadius;

  for (const coin of state.board.coins) {
    if (coin.collected) continue;

    // Check if this helper type can dig this coin
    const coinKey = coin.tier.key || coin.tier;
    if (!canHelperDigCoin(helper.type, coinKey)) continue;

    const dx = coin.x - helper.x;
    const dy = coin.y - helper.y;
    const distSq = dx * dx + dy * dy;
    if (distSq > searchRadius * searchRadius) continue;

    // Auf frühen Wiesen dürfen Helfer Coins sofort finden, später brauchen sie mehr Freilegung.
    if (getCoinOverlayAlpha(coin) > visibleAlphaThreshold) continue;

    if (distSq < bestDistSq) {
      bestDistSq = distSq;
      bestCoin = coin;
    }
  }

  return bestCoin;
}

function updateHelpers(dt) {
  const scanInterval = getHelperScanInterval();
  const tooWeakHelpers = [];
  
  for (const helper of state.helpers) {
    const type = helper.type;
    const speed = getHelperSpeedByType(type);
    const interval = getHelperDigIntervalByType(type);
    const strength = getHelperStrengthByType(type) * getHelperMeadowEfficiency(type);

    // Check if helper is too weak
    if (strength < getHelperTooWeakThreshold(type)) {
      if (!tooWeakHelpers.find(h => h.type === type)) {
        tooWeakHelpers.push({ type, strength });
      }
      helper.isSleeping = true;
      helper.sleepRemaining = 0;
      helper.digPulse = Math.max(0, helper.digPulse - dt * 2.8);
      helper.swing = Math.max(0, helper.swing - dt * 3.8);
      continue;
    }

    if (helper.isSleeping) {
      helper.sleepRemaining -= dt;
      if (helper.sleepRemaining <= 0) {
        helper.isSleeping = false;
        helper.sleepRemaining = 0;
        helper.awakeRemaining = 24 + Math.random() * 10;
      } else {
        helper.digPulse = Math.max(0, helper.digPulse - dt * 2.8);
        helper.swing = Math.max(0, helper.swing - dt * 3.8);
        continue;
      }
    }

    helper.awakeRemaining -= dt;
    if (helper.awakeRemaining <= 0) {
      helper.isSleeping = true;
      helper.sleepRemaining = 15;
      helper.targetCoin = null;
      continue;
    }

    helper.scanCooldown -= dt;
    if (helper.scanCooldown <= 0) {
      helper.scanCooldown = scanInterval;
      if (!helper.targetCoin || helper.targetCoin.collected) {
        helper.targetCoin = findNearbyVisibleCoin(helper);
      }
    }

    if (helper.targetCoin && helper.targetCoin.collected) {
      helper.targetCoin = null;
    }

    if (helper.targetCoin) {
      helper.targetX = helper.targetCoin.x;
      helper.targetY = helper.targetCoin.y;
    }

    const dx = helper.targetX - helper.x;
    const dy = helper.targetY - helper.y;
    const dist = Math.sqrt(dx * dx + dy * dy) || 1;

    if (dist < 8 && !helper.targetCoin) {
      chooseHelperTarget(helper);
    } else if (dist >= 1.5) {
      const step = Math.min(dist, speed * dt);
      helper.x += (dx / dist) * step;
      helper.y += (dy / dist) * step;
    }

    helper.walkPhase += dt * (7.5 + state.helperUpgrades[type].speed * 0.25);

    helper.digCooldown -= dt;
    if (helper.digCooldown <= 0) {
      helper.digPulse = 1;
      helper.swing = 1;
      const radius = getHelperRadiusByType(type);
      spawnDustPuff(helper, helper.x + 10, helper.y + 8, 12 + state.helperUpgrades[type].area * 1.5);
      if (helper.targetCoin) {
        scratchAt(helper.targetCoin.x, helper.targetCoin.y, radius, strength);
        scratchAt(helper.targetCoin.x + 4, helper.targetCoin.y + 2, radius * 0.76, strength * 0.9);
      } else {
        scratchAt(helper.x + 6, helper.y + 8, radius, strength);
        scratchAt(helper.x - 4, helper.y + 4, radius * 0.8, strength * 0.92);
      }
      helper.digCooldown += interval;
      // Apply coin rarity dig penalty
      if (helper.targetCoin) {
        const coinKey = helper.targetCoin.tier.key || helper.targetCoin.tier;
        helper.digCooldown *= getDigTimePenalty(type, coinKey);
      }
    }

    helper.digPulse = Math.max(0, helper.digPulse - dt * 2.8);
    helper.swing = Math.max(0, helper.swing - dt * 3.8);
  }
  
  // Display too weak message
  const tooWeakMsg = document.getElementById("tooWeakMsg");
  if (tooWeakMsg) {
    if (tooWeakHelpers.length > 0) {
      const helperNames = tooWeakHelpers.map(h => {
        const cfg = HELPER_TYPES[h.type];
        return cfg.name.toUpperCase();
      }).join(", ");
      tooWeakMsg.textContent = `Following helpers are too weak: ${helperNames}`;
      tooWeakMsg.style.display = "block";
    } else {
      tooWeakMsg.style.display = "none";
    }
  }
}

function drawHelpers() {
  for (const helper of state.helpers) {
    const bob = Math.sin(helper.walkPhase) * 2.5;
    const isWalking = Math.abs(helper.targetX - helper.x) > 1.5 || Math.abs(helper.targetY - helper.y) > 1.5;
    const legSwing = isWalking ? Math.sin(helper.walkPhase * 4) * 4 : 0;
    const armSwing = isWalking ? Math.sin(helper.walkPhase * 4 + 1) * 3 : 0;
    const digBob = helper.digPulse * 4;

    ctx.save();
    ctx.translate(helper.x, helper.y + bob);

    // Shadow
    ctx.fillStyle = "rgba(0,0,0,0.18)";
    ctx.beginPath();
    ctx.ellipse(0, 30, 14, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    if (helper.type === "knecht") {
      // === KNECHT: Brown farmer with hat and shovel ===
      // Legs (brown pants)
      ctx.fillStyle = "#6B4226";
      ctx.fillRect(-5, 16 + legSwing, 4, 12);
      ctx.fillRect(2, 16 - legSwing, 4, 12);
      // Boots
      ctx.fillStyle = "#4A2E1A";
      ctx.fillRect(-6, 26 + legSwing, 6, 4);
      ctx.fillRect(1, 26 - legSwing, 6, 4);
      // Body (brown tunic)
      ctx.fillStyle = "#9B7B4F";
      ctx.fillRect(-7, 2, 15, 16);
      // Belt
      ctx.fillStyle = "#5C3A1E";
      ctx.fillRect(-7, 14, 15, 3);
      ctx.fillStyle = "#C8A632";
      ctx.fillRect(-1, 14, 3, 3); // buckle
      // Arms
      ctx.fillStyle = "#9B7B4F";
      ctx.fillRect(-10, 4 + armSwing, 4, 10);
      ctx.fillRect(7, 4 - armSwing, 4, 10);
      // Hands (skin)
      ctx.fillStyle = "#DEB887";
      ctx.fillRect(-10, 13 + armSwing, 4, 3);
      ctx.fillRect(7, 13 - armSwing, 4, 3);
      // Head (skin)
      ctx.fillStyle = "#DEB887";
      ctx.fillRect(-5, -8, 11, 10);
      // Eyes
      ctx.fillStyle = "#2F1B0E";
      ctx.fillRect(-3, -4, 2, 2);
      ctx.fillRect(2, -4, 2, 2);
      // Smile
      ctx.fillStyle = "#8B4513";
      ctx.fillRect(-2, -1, 5, 1);
      // Hat (brown)
      ctx.fillStyle = "#6B4226";
      ctx.fillRect(-7, -13, 15, 6);
      ctx.fillStyle = "#A52A2A";
      ctx.fillRect(-4, -15, 9, 4);
      // Shovel (held right)
      ctx.save();
      ctx.translate(10, 6 - armSwing + digBob);
      ctx.rotate(-0.2 + helper.swing * 0.5);
      ctx.fillStyle = "#8B6914";
      ctx.fillRect(-1, -14, 3, 18);
      ctx.fillStyle = "#A0A0A0";
      ctx.fillRect(-4, 4, 9, 5);
      ctx.fillStyle = "#C8C8C8";
      ctx.fillRect(-3, 4, 7, 2);
      ctx.restore();

    } else if (helper.type === "handwerker") {
      // === HANDWERKER: Miner with hard hat and pickaxe ===
      // Legs (brown work pants)
      ctx.fillStyle = "#5C4A32";
      ctx.fillRect(-5, 16 + legSwing, 4, 12);
      ctx.fillRect(2, 16 - legSwing, 4, 12);
      // Work boots (heavy)
      ctx.fillStyle = "#3D2B1A";
      ctx.fillRect(-6, 26 + legSwing, 6, 4);
      ctx.fillRect(1, 26 - legSwing, 6, 4);
      ctx.fillStyle = "#5C4A32";
      ctx.fillRect(-5, 28 + legSwing, 4, 2);
      ctx.fillRect(2, 28 - legSwing, 4, 2);
      // Body (brown work shirt)
      ctx.fillStyle = "#7A6545";
      ctx.fillRect(-7, 2, 15, 16);
      // Orange safety vest
      ctx.fillStyle = "#FF8C00";
      ctx.fillRect(-7, 2, 4, 14);
      ctx.fillRect(4, 2, 4, 14);
      // Reflective stripes on vest
      ctx.fillStyle = "#FFE040";
      ctx.fillRect(-7, 6, 4, 2);
      ctx.fillRect(4, 6, 4, 2);
      ctx.fillRect(-7, 11, 4, 2);
      ctx.fillRect(4, 11, 4, 2);
      // Arms
      ctx.fillStyle = "#7A6545";
      ctx.fillRect(-10, 4 + armSwing, 4, 10);
      ctx.fillRect(7, 4 - armSwing, 4, 10);
      // Work gloves
      ctx.fillStyle = "#8B6914";
      ctx.fillRect(-10, 13 + armSwing, 4, 3);
      ctx.fillRect(7, 13 - armSwing, 4, 3);
      // Head (tanned skin)
      ctx.fillStyle = "#C8A070";
      ctx.fillRect(-5, -8, 11, 10);
      // Stubble
      ctx.fillStyle = "#9B8060";
      ctx.fillRect(-4, -1, 9, 2);
      // Eyes (focused)
      ctx.fillStyle = "#2F1B0E";
      ctx.fillRect(-3, -5, 2, 2);
      ctx.fillRect(2, -5, 2, 2);
      // Mustache
      ctx.fillStyle = "#5C4030";
      ctx.fillRect(-3, -2, 7, 1);
      // Yellow hard hat
      ctx.fillStyle = "#E8B820";
      ctx.fillRect(-7, -14, 15, 7);
      ctx.fillStyle = "#FFD030";
      ctx.fillRect(-6, -13, 13, 3);
      // Hard hat brim
      ctx.fillStyle = "#D0A018";
      ctx.fillRect(-8, -8, 17, 2);
      // Headlamp
      ctx.fillStyle = "#A0A0A0";
      ctx.fillRect(-2, -14, 4, 3);
      ctx.fillStyle = "#FFFF80";
      ctx.fillRect(-1, -13, 2, 2);
      // Pickaxe (held right)
      ctx.save();
      ctx.translate(10, 6 - armSwing + digBob);
      ctx.rotate(-0.25 + helper.swing * 0.6);
      // Handle
      ctx.fillStyle = "#6B4226";
      ctx.fillRect(-1, -14, 3, 20);
      // Pickaxe head
      ctx.fillStyle = "#808890";
      ctx.beginPath();
      ctx.moveTo(-8, -14);
      ctx.lineTo(8, -14);
      ctx.lineTo(10, -12);
      ctx.lineTo(-2, -10);
      ctx.lineTo(-10, -12);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = "#A0AAB0";
      ctx.fillRect(-6, -14, 12, 2);
      ctx.restore();

    } else if (helper.type === "meister") {
      // === MEISTER: Archaeologist / Master excavator ===
      // Legs (khaki pants)
      ctx.fillStyle = "#A09070";
      ctx.fillRect(-5, 16 + legSwing * 0.7, 4, 12);
      ctx.fillRect(2, 16 - legSwing * 0.7, 4, 12);
      // Leather boots
      ctx.fillStyle = "#6B4226";
      ctx.fillRect(-6, 26 + legSwing * 0.7, 6, 4);
      ctx.fillRect(1, 26 - legSwing * 0.7, 6, 4);
      // Body (khaki expedition jacket)
      ctx.fillStyle = "#B8A47C";
      ctx.fillRect(-8, 0, 17, 18);
      // Jacket pockets
      ctx.fillStyle = "#A09068";
      ctx.fillRect(-6, 4, 5, 4);
      ctx.fillRect(2, 4, 5, 4);
      ctx.fillRect(-6, 11, 5, 4);
      ctx.fillRect(2, 11, 5, 4);
      // Pocket flaps
      ctx.fillStyle = "#90805A";
      ctx.fillRect(-6, 4, 5, 1);
      ctx.fillRect(2, 4, 5, 1);
      ctx.fillRect(-6, 11, 5, 1);
      ctx.fillRect(2, 11, 5, 1);
      // Belt with tools
      ctx.fillStyle = "#5C3A1E";
      ctx.fillRect(-8, 15, 17, 3);
      ctx.fillStyle = "#C8A632";
      ctx.fillRect(-1, 15, 3, 3); // belt buckle
      // Arms (khaki sleeves)
      ctx.fillStyle = "#B8A47C";
      ctx.fillRect(-11, 3 + armSwing * 0.5, 4, 12);
      ctx.fillRect(8, 3 - armSwing * 0.5, 4, 12);
      // Hands (weathered skin)
      ctx.fillStyle = "#C8A070";
      ctx.fillRect(-11, 14 + armSwing * 0.5, 4, 3);
      ctx.fillRect(8, 14 - armSwing * 0.5, 4, 3);
      // Head (weathered face)
      ctx.fillStyle = "#C8A070";
      ctx.fillRect(-5, -10, 11, 11);
      // Gray beard (short)
      ctx.fillStyle = "#A0A0A0";
      ctx.fillRect(-3, -1, 7, 3);
      // Glasses
      ctx.fillStyle = "#6080A0";
      ctx.fillRect(-4, -6, 3, 3);
      ctx.fillRect(2, -6, 3, 3);
      ctx.fillStyle = "#405060";
      ctx.strokeStyle = "#808080";
      ctx.lineWidth = 0.8;
      ctx.strokeRect(-4, -6, 3, 3);
      ctx.strokeRect(2, -6, 3, 3);
      // Glasses bridge
      ctx.fillStyle = "#808080";
      ctx.fillRect(-1, -5, 3, 1);
      // Eyes behind glasses
      ctx.fillStyle = "#2F4F2F";
      ctx.fillRect(-3, -5, 1, 1);
      ctx.fillRect(3, -5, 1, 1);
      // Explorer hat (brown leather)
      ctx.fillStyle = "#6B4A30";
      ctx.fillRect(-5, -16, 11, 7);
      ctx.fillStyle = "#7A5A3A";
      ctx.fillRect(-4, -15, 9, 3);
      // Hat brim (wide)
      ctx.fillStyle = "#5C3A22";
      ctx.fillRect(-9, -10, 19, 2);
      // Hat band
      ctx.fillStyle = "#8B6914";
      ctx.fillRect(-5, -11, 11, 1);
      // Magnifying glass (held left)
      ctx.save();
      ctx.translate(-10, 8 + armSwing * 0.5);
      ctx.rotate(0.2);
      // Handle
      ctx.fillStyle = "#5C3A1E";
      ctx.fillRect(-1, -2, 3, 10);
      // Glass rim
      ctx.strokeStyle = "#C8A632";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, -6, 5, 0, Math.PI * 2);
      ctx.stroke();
      // Glass lens
      ctx.fillStyle = "rgba(150,200,255,0.35)";
      ctx.beginPath();
      ctx.arc(0, -6, 4, 0, Math.PI * 2);
      ctx.fill();
      // Lens glint
      ctx.fillStyle = "rgba(255,255,255,0.6)";
      ctx.fillRect(-2, -8, 2, 2);
      ctx.restore();
      // Excavation brush (held right)
      ctx.save();
      ctx.translate(10, 6 - armSwing + digBob);
      ctx.rotate(-0.15 + helper.swing * 0.4);
      ctx.fillStyle = "#6B4226";
      ctx.fillRect(-1, -10, 3, 14);
      // Brush bristles
      ctx.fillStyle = "#C8A060";
      ctx.fillRect(-3, 4, 7, 3);
      ctx.fillStyle = "#B89050";
      ctx.fillRect(-2, 6, 5, 2);
      ctx.restore();
    }

    // Sleeping indicator
    if (helper.isSleeping) {
      ctx.fillStyle = "rgba(255, 236, 170, 0.92)";
      ctx.font = "bold 9px 'Press Start 2P', monospace";
      ctx.fillText("Zz", 12, -16);
    }

    ctx.restore();
  }
}

function createHelper(type) {
  const helper = {
    type,
    x: 40 + Math.random() * (canvas.width - 80),
    y: 40 + Math.random() * (canvas.height - 80),
    targetX: 40 + Math.random() * (canvas.width - 80),
    targetY: 40 + Math.random() * (canvas.height - 80),
    digCooldown: Math.random() * getHelperDigIntervalByType(type),
    scanCooldown: 0,
    targetCoin: null,
    walkPhase: Math.random() * Math.PI * 2,
    awakeRemaining: type === "knecht" ? 34 + Math.random() * 12 : 24 + Math.random() * 10,
    isSleeping: false,
    sleepRemaining: 0,
    digPulse: 0,
    swing: 0,
    dust: []
  };
  return helper;
}

function chooseHelperTarget(helper) {
  helper.targetX = 32 + Math.random() * (canvas.width - 64);
  helper.targetY = 32 + Math.random() * (canvas.height - 64);
}

function resetHelpersPosition() {
  for (const helper of state.helpers) {
    helper.x = 40 + Math.random() * (canvas.width - 80);
    helper.y = 40 + Math.random() * (canvas.height - 80);
    chooseHelperTarget(helper);
    helper.digCooldown = Math.random() * getHelperDigIntervalByType(helper.type);
    helper.scanCooldown = 0;
    helper.targetCoin = null;
    helper.walkPhase = Math.random() * Math.PI * 2;
    helper.awakeRemaining = helper.type === "knecht" ? 34 + Math.random() * 12 : 24 + Math.random() * 10;
    helper.isSleeping = false;
    helper.sleepRemaining = 0;
    helper.digPulse = 0;
    helper.swing = 0;
    helper.dust = [];
  }
}

function syncHelpersCount() {
  const knecht = Math.min(MAX_HELPERS_PER_TYPE, Math.max(1, state.helperUpgrades.knecht.count));
  const handwerker = Math.min(MAX_HELPERS_PER_TYPE, Math.max(0, state.helperUpgrades.handwerker.count));
  const meister = Math.min(MAX_HELPERS_PER_TYPE, Math.max(0, state.helperUpgrades.meister.count));

  state.helperUpgrades.knecht.count = knecht;
  state.helperUpgrades.handwerker.count = handwerker;
  state.helperUpgrades.meister.count = meister;

  state.helpers = [];
  for (let i = 0; i < knecht; i++) state.helpers.push(createHelper("knecht"));
  for (let i = 0; i < handwerker; i++) state.helpers.push(createHelper("handwerker"));
  for (let i = 0; i < meister; i++) state.helpers.push(createHelper("meister"));

  resetHelpersPosition();
}

function spawnDustPuff(helper, x, y, amount) {
  if (!helper) return;
  const total = getTotalHelperCount();
  const particleBurst = total >= 35 ? 1 : 3;
  const roomLeft = Math.max(0, MAX_DUST_PER_HELPER - helper.dust.length);
  const emit = Math.min(particleBurst, roomLeft);
  for (let i = 0; i < emit; i++) {
    helper.dust.push({
      x,
      y,
      vx: (Math.random() - 0.5) * amount,
      vy: -Math.random() * amount * 0.55,
      life: 0.32 + Math.random() * 0.16,
      size: 5 + Math.random() * 8
    });
  }
}

function drawHelperDust() {
  for (const helper of state.helpers) {
    const remaining = [];
    for (const particle of helper.dust) {
      particle.life -= 0.016;
      particle.x += particle.vx * 0.016;
      particle.y += particle.vy * 0.016;
      particle.vy += 36 * 0.016;
      particle.size *= 0.985;

      if (particle.life > 0) {
        ctx.fillStyle = `rgba(85, 61, 33, ${Math.max(0, particle.life * 0.82)})`;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * 0.5, 0, Math.PI * 2);
        ctx.fill();
        remaining.push(particle);
      }
    }
    helper.dust = remaining;
  }
}

function spawnFloatingNumber(x, y, text, color) {
  state.floatingNumbers.push({
    x,
    y,
    text,
    color,
    life: 1.0,
    vy: -40 - Math.random() * 20
  });
}

function updateAndDrawFloatingNumbers(dt) {
  const remaining = [];
  ctx.save();
  ctx.textAlign = "center";
  ctx.font = "bold 18px 'Outfit', sans-serif";
  for (const fn of state.floatingNumbers) {
    fn.life -= dt;
    fn.y += fn.vy * dt;
    fn.vy *= 0.96;
    if (fn.life > 0) {
      remaining.push(fn);
      ctx.globalAlpha = Math.min(1, fn.life * 2);
      ctx.fillStyle = fn.color;
      ctx.strokeStyle = "black";
      ctx.lineWidth = 3;
      ctx.strokeText(fn.text, fn.x, fn.y);
      ctx.fillText(fn.text, fn.x, fn.y);
    }
  }
  ctx.restore();
  state.floatingNumbers = remaining;
}

let audioCtx = null;
function initAudio() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
}

function playSFX(type) {
  initAudio();
  if (!audioCtx) return;
  if (audioCtx.state === "suspended") {
    audioCtx.resume().catch(() => {});
  }
  const vol = (state.settings.volume !== undefined ? state.settings.volume : 0.5);
  if (vol === 0) return;

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);

  gain.gain.setValueAtTime(vol * 0.15, audioCtx.currentTime);

  if (type === 'scratch') {
    osc.type = 'sine';
    osc.frequency.setValueAtTime(150, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, audioCtx.currentTime + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.1);
  } else if (type === 'upgrade') {
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(440, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.2);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.2);
  } else if (type === 'collect') {
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800 + Math.random() * 400, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.1);
  } else if (type === 'rebirth') {
    osc.type = 'square';
    osc.frequency.setValueAtTime(200, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.5);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.5);
  }
}



function updateClearPercentage() {
  const data = overlayCtx.getImageData(0, 0, canvas.width, canvas.height).data;
  let transparent = 0;

  for (let i = 3; i < data.length; i += 4 * 8) {
    if (data[i] < 48) transparent++;
  }

  const totalSamples = data.length / (4 * 8);
  state.board.clearedPct = (transparent / totalSamples) * 100;
}

function goToNextMeadow() {
  if (!state.board.readyForReset) return;
  newBoard();
}

function setupUI() {
  toggleRebirthMenu(false);
  toggleHelperMenu(false);
  bindInputs();

  closeRebirthMenuBtn.addEventListener("click", () => toggleRebirthMenu(false));
  // Rebirth menu can ONLY be closed via the Zurück button (no click-outside)

  if (closeHelperMenuBtn) closeHelperMenuBtn.addEventListener("click", () => toggleHelperMenu(false));
  if (helperMenu) helperMenu.addEventListener("click", (e) => {
    if (e.target === helperMenu) toggleHelperMenu(false);
  });

  tabHelperBtn.addEventListener("click", () => setActiveTab("helper"));
  tabEconomyBtn.addEventListener("click", () => setActiveTab("economy"));
  tabRebirthBtn.addEventListener("click", () => setActiveTab("rebirth"));
  setActiveTab("helper");
  if (spriteManager && spriteManager.loadAll) spriteManager.loadAll();

  const upgradeHints = new Map([
    [knechtsBtn, "Knecht erweitert deine Grundarbeit: mehr Helfer auf der Wiese."],
    [helperUpgradeStrengthBtn, "Strength erhöht, wie stark dein Helfer die Erde aufbricht."],
    [knechtsSpeedBtn, "Speed macht den Knecht schneller beim Suchen und Graben."],
    [knechtsAreaBtn, "Area vergrößert die Grabfläche des Knechts."],
    [handwerkerBtn, "Handwerker werden erst mit höherer Wiese oder Rebirth freigeschaltet."],
    [handwerkerSpeedBtn, "Handwerker-Speed beschleunigt das automatische Bearbeiten der Coins."],
    [handwerkerAreaBtn, "Handwerker-Area erhöht ihre Reichweite für größere Treffer."],
    [meisterBtn, "Meister sind die stärksten Helfer und werden später freigeschaltet."],
    [meisterSpeedBtn, "Meister-Speed gibt deinem stärksten Helfer mehr Tempo."],
    [meisterAreaBtn, "Meister-Area macht den größten Grabbereich im Feld."],
    [coinValueBtn, "Coin Value erhöht den Geldwert pro Coin."],
    [meadowTierBtn, "Meadow level changes the color and coin chances on the field."],
    [nextMeadowBtn, "Rebirth öffnet die Prestige-Ansicht mit Voraussetzungen und Upgrades."],
    [resetRunBtn, "Neu starten setzt den Fortschritt zurück."],
  ]);

  for (const [button, text] of upgradeHints.entries()) {
    if (!button) continue;
    button.addEventListener("mouseenter", () => setUpgradeHint(text));
    button.addEventListener("mouseleave", () => setUpgradeHint(""));
    button.addEventListener("focus", () => setUpgradeHint(text));
    button.addEventListener("blur", () => setUpgradeHint(""));
  }

  if (inGameSaveBtn) inGameSaveBtn.addEventListener("click", () => { saveState(); showLootPopup((i18n[state.settings?.language||"de"]?.save || "Saved") + " OK"); });
  if (inGameSettingsBtn) inGameSettingsBtn.addEventListener("click", () => document.getElementById("settingsPanel").classList.toggle("hidden"));
  if (inGameMainMenuBtn) inGameMainMenuBtn.addEventListener("click", () => { saveState(); document.getElementById("slotSelectScreen").classList.remove("hidden"); initMainMenu(); gameStarted = false; });
  

  const settingLanguage = document.getElementById("settingLanguage");
  const settingResolution = document.getElementById("settingResolution");
  const settingVolume = document.getElementById("settingVolume");
  const settingParticles = document.getElementById("settingParticles");
  const settingAutoSave = document.getElementById("settingAutoSave");

  if (settingVolume) {
    settingVolume.value = state.settings.volume !== undefined ? state.settings.volume : 0.5;
    settingVolume.addEventListener("input", (e) => {
      state.settings.volume = parseFloat(e.target.value);
      initAudio();
    });
    settingVolume.addEventListener("change", () => {
      saveState();
    });
  }

  if (settingParticles) settingParticles.addEventListener("change", (e) => { state.settings.particles = e.target.checked; applySettings(); saveState(); });
  if (settingAutoSave) settingAutoSave.addEventListener("change", (e) => { state.settings.autoSave = e.target.checked; applySettings(); saveState(); });
  if (settingFPS) settingFPS.addEventListener("change", (e) => { state.settings.fps = e.target.checked; applySettings(); saveState(); });
  if (settingLanguage) settingLanguage.addEventListener("change", (e) => { state.settings.language = e.target.value; applySettings(); saveState(); });
  if (settingResolution) settingResolution.addEventListener("change", (e) => { state.settings.resolution = e.target.value; applySettings(); saveState(); });

  testRebirthUnlockBtn.addEventListener("click", () => {
    addMoney(1_000_000);
    setActiveTab("rebirth");
    showLootPopup("Test aktiv: +1.000.000 Geld");
  });

  canvas.addEventListener("click", (e) => {
    const p = getCanvasPos(e.clientX, e.clientY);
    const helper = findClickedHelper(p.x, p.y);
    if (!helper) return;
    selectedHelper = helper;
    if (helper.isSleeping) {
      helper.isSleeping = false;
      helper.sleepRemaining = 0;
      helper.awakeRemaining = 24 + Math.random() * 10;
      showLootPopup(`${HELPER_TYPES[helper.type].name} geweckt!`);
    }
    updateHelperMenu();
    toggleHelperMenu(true);
  });

  if (helperWakeBtn) helperWakeBtn.addEventListener("click", () => {
    if (!selectedHelper) return;
    selectedHelper.isSleeping = false;
    selectedHelper.sleepRemaining = 0;
    selectedHelper.awakeRemaining = 24 + Math.random() * 10;
    updateHelperMenu();
  });

  if (helperUpgradeSpeedBtn) helperUpgradeSpeedBtn.addEventListener("click", () => {
    if (!selectedHelper) return;
    const type = selectedHelper.type;
    const cost = effectiveCost(HELPER_TYPES[type].costSpeed, 1.55, state.helperUpgrades[type].speed);
    if (spendMoney(cost)) state.helperUpgrades[type].speed++;
    updateHelperMenu();
  });

  if (helperUpgradeAreaBtn) helperUpgradeAreaBtn.addEventListener("click", () => {
    if (!selectedHelper) return;
    const type = selectedHelper.type;
    const cost = effectiveCost(HELPER_TYPES[type].costArea, 1.6, state.helperUpgrades[type].area);
    if (spendMoney(cost)) state.helperUpgrades[type].area++;
    updateHelperMenu();
  });

  knechtsBtn.addEventListener("click", () => {
    if (state.helperUpgrades.knecht.count >= MAX_HELPERS_PER_TYPE) return;
    const cost = effectiveCost(35, 1.3, state.helperUpgrades.knecht.count);
    if (spendMoney(cost)) {
      state.helperUpgrades.knecht.count++;
      syncHelpersCount();
    }
  });

  knechtsSpeedBtn.addEventListener("click", () => {
    const cost = effectiveCost(40, 1.4, state.helperUpgrades.knecht.speed);
    if (spendMoney(cost)) state.helperUpgrades.knecht.speed++;
  });

  
  knechtsStrengthBtn.addEventListener("click", () => {
    const cost = getHelperStrengthUpgradeCost("knecht", state.helperUpgrades.knecht.strength || 0);
    if (spendMoney(cost) && (state.helperUpgrades.knecht.strength || 0) < getLimit()) state.helperUpgrades.knecht.strength = (state.helperUpgrades.knecht.strength || 0) + 1;
  });

  handwerkerStrengthBtn.addEventListener("click", () => {
    if (!isHelperUnlocked("handwerker")) return;
    const cost = getHelperStrengthUpgradeCost("handwerker", state.helperUpgrades.handwerker.strength || 0);
    if (spendMoney(cost) && (state.helperUpgrades.handwerker.strength || 0) < getLimit()) state.helperUpgrades.handwerker.strength = (state.helperUpgrades.handwerker.strength || 0) + 1;
  });

  meisterStrengthBtn.addEventListener("click", () => {
    if (!isHelperUnlocked("meister")) return;
    const cost = getHelperStrengthUpgradeCost("meister", state.helperUpgrades.meister.strength || 0);
    if (spendMoney(cost) && (state.helperUpgrades.meister.strength || 0) < getLimit()) state.helperUpgrades.meister.strength = (state.helperUpgrades.meister.strength || 0) + 1;
  });

  knechtsAreaBtn.addEventListener("click", () => {
    const cost = effectiveCost(50, 1.45, state.helperUpgrades.knecht.area);
    if (spendMoney(cost)) state.helperUpgrades.knecht.area++;
  });

  handwerkerBtn.addEventListener("click", () => {
    if (!isHelperUnlocked("handwerker")) return;
    if (state.helperUpgrades.handwerker.count >= MAX_HELPERS_PER_TYPE) return;
    const cost = effectiveCost(180, 1.45, state.helperUpgrades.handwerker.count);
    if (spendMoney(cost)) {
      state.helperUpgrades.handwerker.count++;
      syncHelpersCount();
    }
  });

  handwerkerSpeedBtn.addEventListener("click", () => {
    if (!isHelperUnlocked("handwerker")) return;
    const cost = effectiveCost(100, 1.45, state.helperUpgrades.handwerker.speed);
    if (spendMoney(cost)) state.helperUpgrades.handwerker.speed++;
  });

  handwerkerAreaBtn.addEventListener("click", () => {
    if (!isHelperUnlocked("handwerker")) return;
    const cost = effectiveCost(130, 1.5, state.helperUpgrades.handwerker.area);
    if (spendMoney(cost)) state.helperUpgrades.handwerker.area++;
  });

  meisterBtn.addEventListener("click", () => {
    if (!isHelperUnlocked("meister")) return;
    if (state.helperUpgrades.meister.count >= MAX_HELPERS_PER_TYPE) return;
    const cost = effectiveCost(800, 1.55, state.helperUpgrades.meister.count);
    if (spendMoney(cost)) {
      state.helperUpgrades.meister.count++;
      syncHelpersCount();
    }
  });

  meisterSpeedBtn.addEventListener("click", () => {
    if (!isHelperUnlocked("meister")) return;
    const cost = effectiveCost(300, 1.5, state.helperUpgrades.meister.speed);
    if (spendMoney(cost)) state.helperUpgrades.meister.speed++;
  });

  meisterAreaBtn.addEventListener("click", () => {
    if (!isHelperUnlocked("meister")) return;
    const cost = effectiveCost(400, 1.55, state.helperUpgrades.meister.area);
    if (spendMoney(cost)) state.helperUpgrades.meister.area++;
  });

  // ===== SKILL TREE HANDLER =====
  function getSkillTreeTierCount(tierNum) {
    // Count how many skills in a tier have at least 1 level
    const tierEl = document.querySelector(`.skill-tree-tier[data-tier="${tierNum}"]`);
    if (!tierEl) return 0;
    let count = 0;
    tierEl.querySelectorAll(".skill-node").forEach(n => {
      const skill = n.dataset.skill;
      if ((state.rebirth.upgrades[skill] || 0) > 0) count++;
    });
    return count;
  }

  function isTierUnlocked(tierNum) {
    if (tierNum <= 1) return true;
    return getSkillTreeTierCount(tierNum - 1) >= 3;
  }

  function refreshSkillTree() {
    document.querySelectorAll(".skill-tree-tier").forEach(tierEl => {
      const tierNum = parseInt(tierEl.dataset.tier);
      const unlocked = isTierUnlocked(tierNum);
      tierEl.classList.toggle("locked", !unlocked);
      tierEl.classList.toggle("unlocked", unlocked);
    });
    document.querySelectorAll(".skill-node").forEach(node => {
      const skill = node.dataset.skill;
      const max = parseInt(node.dataset.max);
      const lvl = state.rebirth.upgrades[skill] || 0;
      const lvlSpan = node.querySelector(".node-lvl");
      if (lvlSpan) lvlSpan.textContent = `${lvl}/${max}`;
      node.classList.toggle("maxed", lvl >= max);
    });
  }

  const skillInfoTitles = {
    digPower: "Grabkraft+", coinBoost: "Coin-Wert+", speedBoost: "Helfer-Speed+", mastery: "Münz-Magnet", diamondBoost: "Diamant-Boost", clickPower: "Big Hands",
    doubleDrop: "Doppel-Drop", knechtMastery: "Knecht-Meisterung", autoCollect: "Auto-Collect", rareFinder: "Seltener Finder", bloomBoost: "Blüten-Boost", turboDig: "Turbo-Graben", luckyCharm: "Glücksbringer",
    goldenTouch: "Goldener Touch", handwerkerMastery: "Handwerker-Meisterung", megaMagnet: "Mega-Magnet", rubyNose: "Ruby-Spürnase", efficiency: "Effizienz", experience: "Erfahrung",
    archaeologistInstinct: "Archäologen-Instinkt", treasureRain: "Schatz-Regen", eternalBonus: "Eternaler Bonus", emeraldFever: "Smaragd-Fieber", prestigeMultiplier: "Prestige-Multiplikator", ultimateDigging: "Ultimative Grabung"
  };
  const skillInfoDescs = {
    digPower: "Höhere Grab-Stärke pro Level", coinBoost: "Coins sind mehr wert", speedBoost: "Helfer bewegen sich schneller", mastery: "Helfer finden Coins von weiter weg", diamondBoost: "Mehr Diamanten spawnen", clickPower: "Dein manueller Kratz-Radius steigt",
    doubleDrop: "Chance auf doppelte Coins", knechtMastery: "Knecht gräbt 50% schneller", autoCollect: "Coins werden schneller eingesammelt", rareFinder: "Höhere Chance auf seltene Coins", bloomBoost: "Mehr Coins pro Wiese", turboDig: "Grab-Geschwindigkeit +20%", luckyCharm: "Chance auf Coin-Explosion beim Kratzen",
    goldenTouch: "Alle Coins +25% Wert", handwerkerMastery: "Handwerker kann Diamant graben", megaMagnet: "Riesiger Scan-Radius", rubyNose: "Ruby Spawn-Rate erhöht", efficiency: "Upgrade-Kosten -5%", experience: "Rebirth gibt +1 extra Shard",
    archaeologistInstinct: "Meister gräbt 2x schneller", treasureRain: "Extra Coins pro Wiese", eternalBonus: "Permanent +10% alle Stats", emeraldFever: "Emerald Wert 2x", prestigeMultiplier: "Shards earned 1.5x", ultimateDigging: "ALLE Helfer können ALLE Coins graben!"
  };

  const skillInfoPanel = document.getElementById("skillInfoPanel");
  
  function updateSkillInfo(node) {
    if (!skillInfoPanel) return;
    const skill = node.dataset.skill;
    const max = parseInt(node.dataset.max);
    const tierEl = node.closest(".skill-tree-tier");
    const tierNum = parseInt(tierEl.dataset.tier);
    const currentLvl = state.rebirth.upgrades[skill] || 0;
    
    if (!isTierUnlocked(tierNum)) {
      skillInfoPanel.innerHTML = `<div class="skill-info-content"><span class="skill-info-title">🔒 Gesperrt</span><span class="skill-info-desc">Benötigt 3 Upgrades aus Tier ${tierNum - 1}</span></div>`;
      return;
    }
    
    const cost = getRebirthUpgradeCost(skill, currentLvl);
    const costClass = state.rebirth.shards >= cost ? "" : "cannot-afford";
    const costLabel = (i18n[state.settings?.language||"de"]?.cost || "Kosten");
    const costText = currentLvl >= max ? "Max Level" : `${costLabel}: ${cost} Sternenstaub`;
    
    skillInfoPanel.innerHTML = `
      <div class="skill-info-content">
        <span class="skill-info-title">${skillInfoTitles[skill] || skill}</span>
        <span class="skill-info-desc">${skillInfoDescs[skill] || ""}</span>
        Level: ${currentLvl} / ${max}<br>
        <span class="skill-info-cost ${costClass}">${costText}</span>
      </div>
    `;
  }

  document.querySelectorAll(".skill-node").forEach(node => {
    node.addEventListener("mouseenter", () => updateSkillInfo(node));
    node.addEventListener("focus", () => updateSkillInfo(node));
    
    node.addEventListener("click", () => {
      const skill = node.dataset.skill;
      const max = parseInt(node.dataset.max);
      const tierEl = node.closest(".skill-tree-tier");
      const tierNum = parseInt(tierEl.dataset.tier);

      if (!isTierUnlocked(tierNum)) return;
      const currentLvl = state.rebirth.upgrades[skill] || 0;
      if (currentLvl >= max) return;

      const cost = getRebirthUpgradeCost(skill, currentLvl);
      if (spendShards(cost)) {
        state.rebirth.upgrades[skill] = currentLvl + 1;
        playSFX('upgrade');
        refreshSkillTree();
        refreshUI();
        updateSkillInfo(node);
      }
    });
  });

  // Refresh on menu open
  const origToggle = toggleRebirthMenu;
  toggleRebirthMenu = function(open) {
    origToggle(open);
    if (open) refreshSkillTree();
  };

  coinValueBtn.addEventListener("click", () => {
    const cost = effectiveCost(60, 1.45, state.upgrades.coinValue);
    if (spendMoney(cost)) state.upgrades.coinValue++;
  });

  meadowTierBtn.addEventListener("click", () => {
    const cost = effectiveCost(180, 1.7, state.upgrades.meadowTier);
    if (spendMoney(cost)) {
      state.upgrades.meadowTier++;
      newBoard();
      boardStatus.textContent = "Wiesen-Level erhoeht. Neue Wiese mit besseren Coin-Chancen aktiv.";
    }
  });

  nextMeadowBtn.addEventListener("click", () => {
    toggleRebirthMenu(true);
  });

  if (rebirthActionBtn) {
    rebirthActionBtn.addEventListener("click", () => {
      if (!canRebirth()) return;
      performRebirth();
    });
  }

  if (rebirthResetUpgradesBtn) {
    rebirthResetUpgradesBtn.addEventListener("click", () => {
      if (confirm("Rebirth-Fortschritt wirklich zuruecksetzen? Dieser Schritt kann nicht rueckgaengig gemacht werden.")) {
        resetRebirthUpgradesWithRefund();
        saveState();
      }
    });
  }

  if (resetRunBtn) {
    resetRunBtn.addEventListener("click", async () => {
      if (confirm("Gesamten Spielstand wirklich loeschen? Dieser Schritt kann nicht rueckgaengig gemacht werden.")) {
        await removeStorage(getStorageKey());
        localStorage.removeItem("wiesen-scratcher-v4-idle");
        localStorage.removeItem("wiesen-scratcher-v3");
        location.reload();
      }
    });
  }

  setUpgradeHint("");
}

function formatNumber(n) {
  if (n < 1000) return n.toFixed(1);
  const units = ["K", "M", "B", "T", "Qa"];
  let value = n;
  let i = -1;
  while (value >= 1000 && i < units.length - 1) {
    value /= 1000;
    i++;
  }
  return `${value.toFixed(2)} ${units[i]}`;
}

function refreshUI() {
  const limit = getLimit();
  const limitStr = (val) => val >= limit ? "MAX" : val + "/" + limit;

  fragmentsValue.textContent = formatNumber(state.money);
  rebirthValue.textContent = `${formatNumber(state.rebirth.shards)}`;
  if (rebirthMenuValue) rebirthMenuValue.textContent = formatNumber(state.rebirth.shards);

  nextMeadowBtn.disabled = false;
  nextMeadowBtn.textContent = canRebirth() ? "✦ Perform Rebirth!" : "Rebirth (Not Ready)";

  const rebirthNeedMoney = getRebirthRequirementMoney();
  const rebirthNeedTier = getRebirthRequirementTier();
  nextMeadowBtn.title = `Rebirth goal: meadow level ${rebirthNeedTier} and ${formatNumber(rebirthNeedMoney)} money`;

  // Sidebar rebirth panel
  const sideShards = document.getElementById("rebirthSidebarShards");
  const sideCount = document.getElementById("rebirthSidebarCount");
  const sideMoneyBar = document.getElementById("rebirthSidebarMoneyBar");
  const sideTierBar = document.getElementById("rebirthSidebarTierBar");
  const sideMoneyText = document.getElementById("rebirthSidebarMoneyText");
  const sideTierText = document.getElementById("rebirthSidebarTierText");
  if (sideShards) sideShards.textContent = formatNumber(state.rebirth.shards);
  if (sideCount) sideCount.textContent = state.rebirth.count;
  const moneyProg = clamp01(state.money / Math.max(1, rebirthNeedMoney));
  const tierProg = clamp01(state.upgrades.meadowTier / Math.max(1, rebirthNeedTier));
  if (sideMoneyBar) sideMoneyBar.style.width = `${(moneyProg * 100).toFixed(1)}%`;
  if (sideTierBar) sideTierBar.style.width = `${(tierProg * 100).toFixed(1)}%`;
  if (sideMoneyText) sideMoneyText.textContent = `${formatNumber(state.money)} / ${formatNumber(rebirthNeedMoney)}`;
  if (sideTierText) sideTierText.textContent = `${state.upgrades.meadowTier} / ${rebirthNeedTier}`;

  if (rebirthStatTier) rebirthStatTier.textContent = `${state.upgrades.meadowTier}`;
  if (rebirthStatHandwerker) rebirthStatHandwerker.textContent = `${state.helperUpgrades.handwerker.count}`;
  if (rebirthStatTotalMoney) rebirthStatTotalMoney.textContent = formatNumber(state.money);

  const moneyProgress = clamp01(state.money / Math.max(1, rebirthNeedMoney));
  const tierProgress = clamp01(state.upgrades.meadowTier / Math.max(1, rebirthNeedTier));
  if (rebirthReqMoneyText) rebirthReqMoneyText.textContent = `${formatNumber(state.money)} / ${formatNumber(rebirthNeedMoney)}`;
  if (rebirthReqTierText) rebirthReqTierText.textContent = `${state.upgrades.meadowTier} / ${rebirthNeedTier}`;
  if (rebirthReqMoneyBar) rebirthReqMoneyBar.style.width = `${(moneyProgress * 100).toFixed(1)}%`;
  if (rebirthReqTierBar) rebirthReqTierBar.style.width = `${(tierProgress * 100).toFixed(1)}%`;

  if (rebirthActionBtn) {
    if (canRebirth()) {
      rebirthActionBtn.disabled = false;
      rebirthActionBtn.textContent = `Rebirth now (+${calculateRebirthGain()} Stardust)`;
    } else {
      rebirthActionBtn.disabled = true;
      rebirthActionBtn.textContent = "Rebirth not ready";
    }
  }

  const knechts = state.helperUpgrades.knecht.count;
  const knechtsC = effectiveCost(35, 1.3, knechts);
  knechtsBtn.textContent = `👤 Worker | ${knechts}/${MAX_HELPERS_PER_TYPE}\nCost: ${formatNumber(knechtsC)}`;
  knechtsBtn.disabled = knechts >= MAX_HELPERS_PER_TYPE || state.money < knechtsC;

  const kSpeed = effectiveCost(40, 1.4, state.helperUpgrades.knecht.speed);
  knechtsSpeedBtn.textContent = `⚡ Speed Lv${limitStr(state.helperUpgrades.knecht.speed)}\nCost: ${formatNumber(kSpeed)}`;
  knechtsSpeedBtn.disabled = state.money < kSpeed || state.helperUpgrades.knecht.speed >= limit;

  const kArea = effectiveCost(50, 1.45, state.helperUpgrades.knecht.area);
  knechtsAreaBtn.textContent = `📏 Area Lv${limitStr(state.helperUpgrades.knecht.area)}\nCost: ${formatNumber(kArea)}`;
  knechtsAreaBtn.disabled = state.money < kArea || state.helperUpgrades.knecht.area >= limit;

  // Builder
  const handwerkers = state.helperUpgrades.handwerker.count;
  const handwerkersC = effectiveCost(180, 1.45, handwerkers);
  const handwerkerInfo = getHelperUnlockInfo("handwerker");
  if (!handwerkerInfo.locked) {
    handwerkerBtn.textContent = `🛠 Builder | ${handwerkers}/${MAX_HELPERS_PER_TYPE}\nCost: ${formatNumber(handwerkersC)}`;
    handwerkerBtn.disabled = handwerkers >= MAX_HELPERS_PER_TYPE || state.money < handwerkersC;
  } else {
    handwerkerBtn.textContent = `🔒 Builder\n${handwerkerInfo.reason || "Requires: 5 Workers"}`;
    handwerkerBtn.disabled = true;
  }

  const hSpeed = effectiveCost(100, 1.45, state.helperUpgrades.handwerker.speed);
  if (isHelperUnlocked("handwerker")) {
    handwerkerSpeedBtn.textContent = `⚡ Speed Lv${limitStr(state.helperUpgrades.handwerker.speed)}\nCost: ${formatNumber(hSpeed)}`;
  } else {
    handwerkerSpeedBtn.textContent = `🔒 Speed\nRequires: Builder`;
  }
  handwerkerSpeedBtn.disabled = !isHelperUnlocked("handwerker") || state.money < hSpeed || state.helperUpgrades.handwerker.speed >= limit;

  const hArea = effectiveCost(130, 1.5, state.helperUpgrades.handwerker.area);
  if (isHelperUnlocked("handwerker")) {
    handwerkerAreaBtn.textContent = `📏 Area Lv${limitStr(state.helperUpgrades.handwerker.area)}\nCost: ${formatNumber(hArea)}`;
  } else {
    handwerkerAreaBtn.textContent = `🔒 Area\nRequires: Builder`;
  }
  handwerkerAreaBtn.disabled = !isHelperUnlocked("handwerker") || state.money < hArea || state.helperUpgrades.handwerker.area >= limit;

  // Master
  const meisters = state.helperUpgrades.meister.count;
  const meistersC = effectiveCost(800, 1.55, meisters);
  const meisterInfo = getHelperUnlockInfo("meister");
  if (!meisterInfo.locked) {
    meisterBtn.textContent = `✨ Master | ${meisters}/${MAX_HELPERS_PER_TYPE}\nCost: ${formatNumber(meistersC)}`;
    meisterBtn.disabled = meisters >= MAX_HELPERS_PER_TYPE || state.money < meistersC;
  } else {
    meisterBtn.textContent = `🔒 Master\n${meisterInfo.reason || "Requires: 8 Builders"}`;
    meisterBtn.disabled = true;
  }

  const mSpeed = effectiveCost(300, 1.5, state.helperUpgrades.meister.speed);
  if (isHelperUnlocked("meister")) {
    meisterSpeedBtn.textContent = `⚡ Speed Lv${limitStr(state.helperUpgrades.meister.speed)}\nCost: ${formatNumber(mSpeed)}`;
  } else {
    meisterSpeedBtn.textContent = `🔒 Speed\nRequires: Master`;
  }
  meisterSpeedBtn.disabled = !isHelperUnlocked("meister") || state.money < mSpeed || state.helperUpgrades.meister.speed >= limit;

  const mArea = effectiveCost(400, 1.55, state.helperUpgrades.meister.area);
  if (isHelperUnlocked("meister")) {
    meisterAreaBtn.textContent = `📏 Area Lv${limitStr(state.helperUpgrades.meister.area)}\nCost: ${formatNumber(mArea)}`;
  } else {
    meisterAreaBtn.textContent = `🔒 Area\nRequires: Master`;
  }
  meisterAreaBtn.disabled = !isHelperUnlocked("meister") || state.money < mArea || state.helperUpgrades.meister.area >= limit;

  // Coin & Meadow
  
  const kStr = getHelperStrengthUpgradeCost("knecht", state.helperUpgrades.knecht.strength || 0);
  if(knechtsStrengthBtn) {
    knechtsStrengthBtn.textContent = `💪 Strength Lv${limitStr(state.helperUpgrades.knecht.strength || 0)}\nCost: ${formatNumber(kStr)}`;
    knechtsStrengthBtn.disabled = state.money < kStr || (state.helperUpgrades.knecht.strength || 0) >= limit;
  }
  
  const hStr = getHelperStrengthUpgradeCost("handwerker", state.helperUpgrades.handwerker.strength || 0);
  if(handwerkerStrengthBtn) {
    if (isHelperUnlocked("handwerker")) {
      handwerkerStrengthBtn.textContent = `💪 Strength Lv${limitStr(state.helperUpgrades.handwerker.strength || 0)}\nCost: ${formatNumber(hStr)}`;
      handwerkerStrengthBtn.disabled = state.money < hStr || (state.helperUpgrades.handwerker.strength || 0) >= limit;
    } else {
      handwerkerStrengthBtn.textContent = `🔒 Strength\nRequires: Builder`;
      handwerkerStrengthBtn.disabled = true;
    }
  }

  const mStr = getHelperStrengthUpgradeCost("meister", state.helperUpgrades.meister.strength || 0);
  if(meisterStrengthBtn) {
    if (isHelperUnlocked("meister")) {
      meisterStrengthBtn.textContent = `💪 Strength Lv${limitStr(state.helperUpgrades.meister.strength || 0)}\nCost: ${formatNumber(mStr)}`;
      meisterStrengthBtn.disabled = state.money < mStr || (state.helperUpgrades.meister.strength || 0) >= limit;
    } else {
      meisterStrengthBtn.textContent = `🔒 Strength\nRequires: Master`;
      meisterStrengthBtn.disabled = true;
    }
  }

  const coinValueCost = effectiveCost(60, 1.45, state.upgrades.coinValue);
  coinValueBtn.textContent = `💰 Coin Value Lv${limitStr(state.upgrades.coinValue)} | +35% per Coin\nCost: ${formatNumber(coinValueCost)}`;
  coinValueBtn.disabled = state.money < coinValueCost || state.upgrades.coinValue >= limit;

  const meadowTierCost = effectiveCost(180, 1.7, state.upgrades.meadowTier);
  meadowTierBtn.textContent = `🌿 Meadow Lv${limitStr(state.upgrades.meadowTier)} | Color: ${paletteLabel(state.upgrades.meadowTier)}\nCost: ${formatNumber(meadowTierCost)}`;
  meadowTierBtn.disabled = state.money < meadowTierCost || state.upgrades.meadowTier >= limit;

  // Skill tree nodes are now handled by refreshSkillTree() in setupUI

  if (helperMenu && !helperMenu.classList.contains("hidden")) {
    updateHelperMenu();
  }
}

async function saveState() {
  const payload = {
    money: state.money,
    totalMoney: state.totalMoney,
    rebirth: state.rebirth,
    upgrades: state.upgrades,
    helperUpgrades: state.helperUpgrades,
    settings: state.settings,
    lastSavedAt: Date.now()
  };
  await saveStorage(getStorageKey(), JSON.stringify(payload));

  const indicator = document.getElementById("autoSaveIndicator");
  if (indicator) {
    indicator.classList.add("visible");
    setTimeout(() => indicator.classList.remove("visible"), 1500);
  }
}

async function loadState() {
  try {
    const raw = await loadStorage(getStorageKey());
    if (!raw) return;

    const data = JSON.parse(raw);

    state.money = data.money || 0;
    state.totalMoney = data.totalMoney || 0;
    state.settings = data.settings || { particles: true, autoSave: true, fps: false, language: "en", resolution: "1", volume: 0.5 };
    state.settings.language = state.settings.language || "en";
    if (state.settings.volume === undefined) state.settings.volume = 0.5;
    applySettings();
    state.rebirth = data.rebirth || { count: 0, shards: 0, upgrades: { digPower: 0, coinBoost: 0, speedBoost: 0, mastery: 0, diamondBoost: 0, bloomBoost: 0, ultimateDigging: 0 } };
    state.rebirth.upgrades = state.rebirth.upgrades || {};
    state.rebirth.upgrades.digPower = state.rebirth.upgrades.digPower || 0;
    state.rebirth.upgrades.coinBoost = state.rebirth.upgrades.coinBoost || 0;
    state.rebirth.upgrades.speedBoost = state.rebirth.upgrades.speedBoost || 0;
    state.rebirth.upgrades.mastery = state.rebirth.upgrades.mastery || 0;
    state.rebirth.upgrades.diamondBoost = state.rebirth.upgrades.diamondBoost || 0;
    state.rebirth.upgrades.bloomBoost = state.rebirth.upgrades.bloomBoost || 0;
    state.rebirth.upgrades.ultimateDigging = state.rebirth.upgrades.ultimateDigging || 0;
    state.upgrades = data.upgrades || { coinValue: 0, meadowTier: 0 };
    state.helperUpgrades = data.helperUpgrades || { knecht: { count: 1, speed: 0, area: 0 }, handwerker: { count: 0, speed: 0, area: 0 }, meister: { count: 0, speed: 0, area: 0 } };
    state.helperUpgrades.knecht.count = Math.min(MAX_HELPERS_PER_TYPE, Math.max(1, state.helperUpgrades.knecht.count || 0));
    state.helperUpgrades.handwerker.count = Math.min(MAX_HELPERS_PER_TYPE, Math.max(0, state.helperUpgrades.handwerker.count || 0));
    state.helperUpgrades.meister.count = Math.min(MAX_HELPERS_PER_TYPE, Math.max(0, state.helperUpgrades.meister.count || 0));

    if (data.lastSavedAt) {
      const offlineSec = Math.max(0, (Date.now() - data.lastSavedAt) / 1000);
      const effectiveOfflineSec = Math.min(offlineSec, OFFLINE_GAIN_MAX_SECONDS);
      let offlineGain = 0;

      for (const type of ["knecht", "handwerker", "meister"]) {
        const count = state.helperUpgrades[type].count;
        if (count === 0) continue;
        const speed = getHelperSpeedByType(type);
        const interval = getHelperDigIntervalByType(type);
        const digRate = (speed * interval) / interval;
        const radius = getHelperRadiusByType(type);
        const strength = getHelperStrengthByType(type) * getHelperMeadowEfficiency(type);
        const avgCoin = (20 + state.upgrades.meadowTier * 9) * (1 + state.upgrades.coinValue * 0.2);
        offlineGain += effectiveOfflineSec * count * (1 / interval) * avgCoin * 0.5;
      }

      addMoney(offlineGain);
      if (offlineGain > 0) {
        showLootPopup(`AFK-Einnahmen: +${formatNumber(offlineGain)} Geld`);
      }
    }
  } catch (_) {
    console.error("Error loading state:", _);
  }
}
