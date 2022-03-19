import { join } from 'path';
import { app, BrowserWindow, ipcMain, screen } from 'electron';
import { generateId } from './lib';
import { Grid } from './grid';

const isDev = process.env.IS_DEV == 'true' ? true : false;

type State = {
  mainWindow: BrowserWindow | null;
  playerWindow: {
    [id: string]: {
      window: BrowserWindow;
      videoId: string;
    };
  };
};
const state: State = {
  mainWindow: null,
  playerWindow: {},
};

function getCurrentDisplay() {
  const pointerPos = screen.getCursorScreenPoint();
  return screen.getDisplayNearestPoint(pointerPos);
}

function createMainWindow() {
  const currentDisplay = getCurrentDisplay();
  const width = currentDisplay.workAreaSize.width;
  const height = currentDisplay.workAreaSize.height * 0.2;

  const mainWindow = new BrowserWindow({
    x: currentDisplay.workArea.x,
    y: currentDisplay.workArea.y + currentDisplay.workAreaSize.height - height,
    width,
    height,
    webPreferences: {
      nodeIntegration: true,
      preload: join(__dirname, 'preload.js'),
    },
    titleBarStyle: 'hidden',
    resizable: false,
  });
  mainWindow.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${join(__dirname, '../index.html')}`
  );

  return mainWindow;
}

function createVideoWindow(parent: BrowserWindow, id: string) {
  const videoWindow = new BrowserWindow({
    parent,
    useContentSize: true,
    frame: false,
    titleBarStyle: 'hidden',
    titleBarOverlay: true,
    hasShadow: false,
    webPreferences: {
      nodeIntegration: true,
      preload: join(__dirname, 'preload.js'),
    },
  });
  videoWindow.setAspectRatio(16 / 9);

  videoWindow.loadURL(
    isDev
      ? `http://localhost:3000/#/__video/${id}`
      : `file://${join(__dirname, '../index.html', '#', '__video', id)}`
  );

  return videoWindow;
}

function createAuthWindow() {
  const window = new BrowserWindow();
  window.loadURL('https://accounts.google.com/signin/v2/identifier');

  return window;
}

function calcLayout() {
  const currentDisplay = getCurrentDisplay();
  const base = {
    width: currentDisplay.workAreaSize.width,
    height: currentDisplay.workAreaSize.height * 0.8,
  };
  const gridSize = Grid.calcGridSize(Object.values(state.playerWindow).length);
  const grid = new Grid(base.width, base.height, gridSize, 16 / 9);
  const layout = grid.calcLayout();
  const offs = {
    x: currentDisplay.workArea.x,
    y: currentDisplay.workArea.y,
  };

  Object.values(state.playerWindow).forEach(({ window }, idx) => {
    window.setSize(layout[idx].width, layout[idx].height);
    window.setPosition(layout[idx].x + offs.x, layout[idx].y + offs.y);
  });
}

app.whenReady().then(() => {
  state.mainWindow = createMainWindow();
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) {
      state.mainWindow = createMainWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

ipcMain.handle('ADD_PLAYER', (_, id: string) => {
  if (state.mainWindow) {
    if (
      Object.values(state.playerWindow)
        .map((x) => x.videoId)
        .includes(id)
    ) {
      return null;
    }

    const windowId = generateId();
    const player = createVideoWindow(state.mainWindow, id);

    state.playerWindow[windowId] = {
      window: player,
      videoId: id,
    };

    player.on('close', () => {
      const { [windowId]: _, ...rest } = state.playerWindow;
      state.playerWindow = rest;
      calcLayout();
      state.mainWindow?.webContents.send('CLOSE_PLAYER', windowId);
    });

    calcLayout();

    return windowId;
  }

  return null;
});

ipcMain.handle('CHANGE_VOLUME', (_, windowId: string, volume: number) => {
  const { window } = state.playerWindow[windowId];
  window.webContents.send('CHANGE_VOLUME', volume);
});

ipcMain.handle('PLAY', (_, windowId: string) => {
  const { window } = state.playerWindow[windowId];
  window.webContents.send('PLAY');
});

ipcMain.handle('STOP', (_, windowId: string) => {
  const { window } = state.playerWindow[windowId];
  window.webContents.send('STOP');
});

ipcMain.handle('AUTH', () => {
  const window = createAuthWindow();
});

ipcMain.handle('CLOSE', (_, windowId: string) => {
  const { window } = state.playerWindow[windowId];
  window.close();
});
