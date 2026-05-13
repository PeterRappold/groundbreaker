const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  saveData: (key, data) => ipcRenderer.invoke('saveData', key, data),
  loadData: (key) => ipcRenderer.invoke('loadData', key),
  removeData: (key) => ipcRenderer.invoke('removeData', key)
});
