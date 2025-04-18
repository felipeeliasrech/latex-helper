const { app, BrowserWindow, globalShortcut, Tray } = require("electron/main");
const path = require("path");

let win;
let tray;

const createWindow = () => {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    icon: path.join(__dirname, "icon.png"),
  });

  win.loadFile("src/index.html");

  win.on("close", function (event) {
    if (!app.isQuitting) {
      event.preventDefault();
      win.hide();
    }
    return false;
  });
};

const toggleWindow = () => {
  if (win.isVisible()) {
    win.hide();
  } else {
    win.show();
  }
};

const createTray = () => {
  tray = new Tray(path.join(__dirname, "icon.png"));
  tray.setToolTip("LaTeX Helper");

  tray.on("click", () => {
    toggleWindow();
  });
};

app.whenReady().then(() => {
  createWindow();
  createTray();

  globalShortcut.register("CommandOrControl+m", () => {
    toggleWindow();
  });

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("before-quit", function () {
  app.isQuitting = true;
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
