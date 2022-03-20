import { contextBridge, ipcRenderer } from 'electron';
import { generateIPCHandler } from './lib';

const context = {
  addPlayer: (id: string) => {
    return ipcRenderer.invoke('ADD_PLAYER', id);
  },
  changeVolume: (id: string, volume: number) => {
    return ipcRenderer.invoke('CHANGE_VOLUME', id, volume);
  },
  playVideo: (id: string) => {
    return ipcRenderer.invoke('PLAY', id);
  },
  stopVideo: (id: string) => {
    return ipcRenderer.invoke('STOP', id);
  },
  auth: () => {
    ipcRenderer.invoke('AUTH');
  },
  closeWindow: (id: string) => {
    ipcRenderer.invoke('CLOSE', id);
  },
  openChat: (id: string) => {
    ipcRenderer.invoke('OPEN_CHAT', id);
  },
  changeChat: (id: string) => {
    ipcRenderer.invoke('CHANGE_CHAT', id);
  },
  closeChat: () => {
    ipcRenderer.invoke('CLOSE_CHAT');
  },
  onChangeVolume: generateIPCHandler<[number]>('CHANGE_VOLUME'),
  onCloseWindow: generateIPCHandler<[string]>('CLOSE_PLAYER'),
  onPlay: generateIPCHandler<[]>('PLAY'),
  onStop: generateIPCHandler<[]>('STOP'),
  onOpenChat: generateIPCHandler<[string]>('OPEN_CHAT'),
  onCloseChat: generateIPCHandler<[]>('CLOSE_CHAT'),
};

Object.entries(context).forEach(([key, val]) => {
  contextBridge.exposeInMainWorld(key, val);
});

export type Context = typeof context;
