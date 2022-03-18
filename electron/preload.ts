import { contextBridge, ipcRenderer } from 'electron';
import { generateIPCHandler } from './lib';

contextBridge.exposeInMainWorld('addPlayer', (id: string) => {
  return ipcRenderer.invoke('ADD_PLAYER', id);
});

contextBridge.exposeInMainWorld(
  'changeVolume',
  (id: string, volume: number) => {
    return ipcRenderer.invoke('CHANGE_VOLUME', id, volume);
  }
);

contextBridge.exposeInMainWorld('playVideo', (id: string) => {
  return ipcRenderer.invoke('PLAY', id);
});

contextBridge.exposeInMainWorld('stopVideo', (id: string) => {
  return ipcRenderer.invoke('STOP', id);
});

contextBridge.exposeInMainWorld('auth', () => {
  ipcRenderer.invoke('AUTH');
});

contextBridge.exposeInMainWorld('closeWindow', (id: string) => {
  ipcRenderer.invoke('CLOSE', id);
});

contextBridge.exposeInMainWorld(
  'onChangeVolume',
  generateIPCHandler<[string, number]>('CHANGE_VOLUME')
);

contextBridge.exposeInMainWorld(
  'onCloseWindow',
  generateIPCHandler<[string]>('CLOSE_PLAYER')
);

contextBridge.exposeInMainWorld('onPlay', generateIPCHandler<[]>('PLAY'));

contextBridge.exposeInMainWorld('onStop', generateIPCHandler<[]>('STOP'));
