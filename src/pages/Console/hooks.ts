export type Player = {
  id: string;
  volume: number;
  isPlay: boolean;
};

export interface State {
  player: {
    [id: string]: Player;
  };
  chat: string | null;
}

export const initState: State = {
  player: {},
  chat: null,
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
      type: 'OPEN_CHAT';
      payload: {
        id: string;
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
      type: 'CHANGE_CHAT';
      payload: {
        id: string;
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
    }
  | {
      type: 'CLOSE_CHAT';
    };

export const reducer = (st: State, action: Action): State => {
  switch (action.type) {
    case 'ADD_PLAYER':
      return {
        ...st,
        player: {
          ...st.player,
          [action.payload.playerId]: {
            id: action.payload.videoId,
            volume: 100,
            isPlay: true,
          },
        },
      };
    case 'OPEN_CHAT':
      return {
        ...st,
        chat: action.payload.id,
      };
    case 'CHANGE_VOLUME':
      return {
        ...st,
        player: {
          ...st.player,
          [action.payload.id]: {
            ...st.player[action.payload.id],
            volume: action.payload.volume,
          },
        },
      };
    case 'CHANGE_CHAT':
      return {
        ...st,
        chat: action.payload.id,
      };
    case 'PLAY_PLAYER':
      return {
        ...st,
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
        ...st,
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
        ...st,
        player: rest,
      };
    case 'CLOSE_CHAT':
      return {
        ...st,
        chat: null,
      };
  }
};
