import type { Context } from '../electron/preload';

declare global {
  interface Window extends Context {}
}
