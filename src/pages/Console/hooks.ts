export type Player = {
  id: string;
  volume: number;
  isPlay: boolean;
};

export interface State {
  player: {
    [id: string]: Player;
  };
}

export const initState: State = {
  player: {},
};

export type Action =
  | {
      type: 'ADD_PLAYER';
      payload: {
        videoId: string;
        playerId: string;
      };
    }
  | {
      type: 'CHANGE_VOLUME';
      payload: {
        id: string;
        volume: number;
      };
    }
  | {
      type: 'PLAY_PLAYER';
      payload: {
        id: string;
      };
    }
  | {
      type: 'STOP_PLAYER';
      payload: {
        id: string;
      };
    }
  | {
      type: 'REMOVE_PLAYER';
      payload: {
        id: string;
      };
    };

export const reducer = (st: State, action: Action): State => {
  switch (action.type) {
    case 'ADD_PLAYER':
      return {
        player: {
          ...st.player,
          [action.payload.playerId]: {
            id: action.payload.videoId,
            volume: 100,
            isPlay: true,
          },
        },
      };
    case 'CHANGE_VOLUME':
      return {
        player: {
          ...st.player,
          [action.payload.id]: {
            ...st.player[action.payload.id],
            volume: action.payload.volume,
          },
        },
      };
    case 'PLAY_PLAYER':
      return {
        player: {
          ...st.player,
          [action.payload.id]: {
            ...st.player[action.payload.id],
            isPlay: true,
          },
        },
      };
    case 'STOP_PLAYER':
      return {
        player: {
          ...st.player,
          [action.payload.id]: {
            ...st.player[action.payload.id],
            isPlay: false,
          },
        },
      };
    case 'REMOVE_PLAYER':
      const { [action.payload.id]: _, ...rest } = st.player;

      return {
        player: rest,
      };
  }
};
