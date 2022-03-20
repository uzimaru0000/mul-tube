import { useMemo } from 'react';

export const validator = (str: string) =>
  /https:\/\/(www.)?youtube\.com\/watch\?v=\S{11}/.test(str);

export const getVideoId = (urlStr: string) => {
  const url = new URL(urlStr);
  return url.searchParams.get('v');
};

export const thumbnailUrl = (id: string) =>
  `https://img.youtube.com/vi/${id}/mqdefault.jpg`;

const voidFunc = () => void 0;
const valuableFunc =
  <T>(v: T) =>
  () =>
    v;
export const useElectron = () => {
  const {
    isElectron,
    ready,
    addPlayer,
    changeVolume,
    playVideo,
    stopVideo,
    auth,
    closeWindow,
    openChat,
    changeChat,
    closeChat,
    onChangeVolume,
    onCloseWindow,
    onCloseChat,
    onPlay,
    onStop,
    onOpenPlayer,
  } = window;

  return useMemo(
    () => ({
      isElectron: isElectron ? isElectron() : false,
      ready: ready ?? voidFunc,
      addPlayer: addPlayer ?? valuableFunc(Promise.resolve('mock')),
      changeVolume: changeVolume ?? voidFunc,
      playVideo: playVideo ?? voidFunc,
      stopVideo: stopVideo ?? voidFunc,
      auth: auth ?? voidFunc,
      closeWindow: closeWindow ?? voidFunc,
      openChat: openChat ?? voidFunc,
      changeChat: changeChat ?? voidFunc,
      closeChat: closeChat ?? voidFunc,
      onChangeVolume: onChangeVolume ?? voidFunc,
      onCloseWindow: onCloseWindow ?? voidFunc,
      onPlay: onPlay ?? voidFunc,
      onStop: onStop ?? voidFunc,
      onCloseChat: onCloseChat ?? voidFunc,
      onOpenPlayer: onOpenPlayer ?? voidFunc,
    }),
    []
  );
};
