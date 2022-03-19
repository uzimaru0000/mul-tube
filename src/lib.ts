import { useMemo } from 'react';

export const validator = (str: string) =>
  /https:\/\/(www.)?youtube\.com\/watch\?v=\S{11}/.test(str);

export const getVideoId = (urlStr: string) => {
  const url = new URL(urlStr);
  return url.searchParams.get('v');
};

export const thumbnailUrl = (id: string) =>
  `https://img.youtube.com/vi/${id}/mqdefault.jpg`;

const isElectron = window.addPlayer !== undefined;
const voidFunc = () => void 0;
const valuableFunc =
  <T>(v: T) =>
  () =>
    v;
export const useElectron = () => {
  const {
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
  } = window;

  return useMemo(
    () => ({
      isElectron,
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
    }),
    []
  );
};
