import * as crypto from 'crypto';
import { ipcRenderer } from 'electron';

// ランダムなIDを作成する
// 1セッションの中でユニークならいいので適当
export const generateId = () => crypto.randomBytes(16).toString('hex');

export const generateIPCHandler =
  <Args extends any[]>(key: string) =>
  (f: (...args: Args) => void) => {
    const handler = (_: Electron.IpcRendererEvent, ...args: Args) => f(...args);

    ipcRenderer.on(key, handler as any);
    return () => ipcRenderer.off(key, handler as any);
  };
