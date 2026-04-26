const { app, BrowserWindow } = require("electron");

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    icon: __dirname + "/../public/icon.ico",
    webPreferences: { nodeIntegration: false },
  });
  win.loadURL("https://ration.nishantsoftwares.in");
  win.setMenuBarVisibility(false);
}

app.whenReady().then(createWindow);
app.on("window-all-closed", () => app.quit());