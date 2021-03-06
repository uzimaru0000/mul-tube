import { Box } from '@chakra-ui/react';
import { useCallback, useEffect, useReducer } from 'react';
import { useElectron } from '../../lib';
import { initState, reducer } from './hooks';
import { Menu } from './Menu';

export default function Console() {
  const [state, dispatch] = useReducer(reducer, initState);
  const {
    ready,
    addPlayer,
    changeVolume,
    playVideo,
    stopVideo,
    closeWindow,
    onCloseWindow,
    openChat,
    changeChat,
    closeChat,
    onCloseChat,
    onOpenPlayer,
  } = useElectron();

  const handleAdd = useCallback(
    async (id: string) => {
      const playerId = await addPlayer(id);

      if (playerId === null) {
        return;
      }

      dispatch({ type: 'ADD_PLAYER', payload: { videoId: id, playerId } });
    },
    [dispatch, state]
  );
  const handleVolume = useCallback(
    (id: string, volume: number) => {
      dispatch({ type: 'CHANGE_VOLUME', payload: { id, volume } });
      changeVolume(id, volume);
    },
    [dispatch]
  );
  const handlePlay = useCallback(
    (id: string) => {
      dispatch({ type: 'PLAY_PLAYER', payload: { id } });
      playVideo(id);
    },
    [dispatch]
  );
  const handleStop = useCallback(
    (id: string) => {
      dispatch({ type: 'STOP_PLAYER', payload: { id } });
      stopVideo(id);
    },
    [dispatch]
  );
  const handleClose = useCallback((id: string) => {
    closeWindow(id);
  }, []);
  const handleOpenChat = useCallback(() => {
    const id = Object.values(state.player)[0].id;
    openChat(id);
    dispatch({ type: 'OPEN_CHAT', payload: { id } });
  }, [state]);
  const handleChangeChat = useCallback((id: string) => {
    changeChat(id);
    dispatch({ type: 'CHANGE_CHAT', payload: { id } });
  }, []);
  const handleCloseChat = useCallback(() => {
    closeChat();
  }, []);

  useEffect(() => {
    ready('MAIN');
  }, []);

  useEffect(() => {
    const closePlayer = onCloseWindow((id) => {
      dispatch({ type: 'REMOVE_PLAYER', payload: { id } });
    });
    const closeChat = onCloseChat(() => {
      dispatch({ type: 'CLOSE_CHAT' });
    });
    const openPlayer = onOpenPlayer((ids) => {
      ids.forEach((id) => handleAdd(id));
    });

    return () => {
      closePlayer();
      closeChat();
      openPlayer();
    };
  }, [dispatch]);

  return (
    <Box w="full" h="full" p="4">
      <Menu
        players={state.player}
        chat={state.chat}
        onAddPlayer={handleAdd}
        onChangeVolume={handleVolume}
        onPlay={handlePlay}
        onStop={handleStop}
        onClose={handleClose}
        onOpenChat={handleOpenChat}
        onChangeChat={handleChangeChat}
        onCloseChat={handleCloseChat}
      />
    </Box>
  );
}
