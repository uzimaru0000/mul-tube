declare global {
  var addPlayer: (id: string) => Promise<string>;
  var changeVolume: (id: string, volume: number) => void;
  var playVideo: (id: string) => void;
  var stopVideo: (id: string) => void;
  var auth: () => void;
  var closeWindow: (id: string) => void;
  var onChangeVolume: (f: (volume: number) => void) => () => void;
  var onCloseWindow: (f: (id: string) => void) => () => void;
  var onPlay: (f: () => void) => () => void;
  var onStop: (f: () => void) => () => void;
}

export {};
