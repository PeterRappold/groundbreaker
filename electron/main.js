const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");

function createWindow() {
  const iconPath = path.join(__dirname, "..", "build", "icon.png");
  const window = new BrowserWindow({
    width: 1600,
    height: 960,
    minWidth: 1280,
    minHeight: 720,
    backgroundColor: "#142116",
    icon: iconPath,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
      preload: path.join(__dirname, "preload.js")
    }
  });

  window.removeMenu();
  window.loadFile(path.join(__dirname, "..", "index.html"));
}

app.whenReady().then(() => {
  app.setAppUserModelId("com.htlleoben.groundbreaker");
  
  // Setup IPC handlers for save files
  const savesDir = path.join(app.getPath("userData"), "saves");
  if (!fs.existsSync(savesDir)) {
    fs.mkdirSync(savesDir, { recursive: true });
  }

  ipcMain.handle("saveData", async (event, key, data) => {
    try {
      fs.writeFileSync(path.join(savesDir, `${key}.json`), data, "utf-8");
      return true;
    } catch (e) {
      console.error("Save failed", e);
      return false;
    }
  });

  ipcMain.handle("loadData", async (event, key) => {
    try {
      const p = path.join(savesDir, `${key}.json`);
      if (fs.existsSync(p)) {
        return fs.readFileSync(p, "utf-8");
      }
      return null;
    } catch (e) {
      console.error("Load failed", e);
      return null;
    }
  });

  ipcMain.handle("removeData", async (event, key) => {
    try {
      const p = path.join(savesDir, `${key}.json`);
      if (fs.existsSync(p)) {
        fs.unlinkSync(p);
      }
      return true;
    } catch (e) {
      return false;
    }
  });

  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});