import { Box } from '@chakra-ui/react';
import { useCallback, useEffect, useReducer } from 'react';
import { initState, reducer } from './hooks';
import { Menu } from './Menu';

export default function Console() {
  const [state, dispatch] = useReducer(reducer, initState);

  const handleAdd = useCallback(
    async (id: string) => {
      const playerId = __IS_ELECTRON__
        ? await window.addPlayer(id)
        : Math.random().toString().slice(2);

      if (playerId === null) {
        return;
      }

      dispatch({ type: 'ADD_PLAYER', payload: { videoId: id, playerId } });
      window.changeVolume(playerId, 50);
    },
    [dispatch, state]
  );
  const handleVolume = useCallback(
    (id: string, volume: number) => {
      dispatch({ type: 'CHANGE_VOLUME', payload: { id, volume } });
      if (__IS_ELECTRON__) {
        window.changeVolume(id, volume);
      }
    },
    [dispatch]
  );
  const handlePlay = useCallback(
    (id: string) => {
      dispatch({ type: 'PLAY_PLAYER', payload: { id } });
      if (__IS_ELECTRON__) {
        window.playVideo(id);
      }
    },
    [dispatch]
  );
  const handleStop = useCallback(
    (id: string) => {
      dispatch({ type: 'STOP_PLAYER', payload: { id } });
      if (__IS_ELECTRON__) {
        window.stopVideo(id);
      }
    },
    [dispatch]
  );
  const handleClose = useCallback((id: string) => {
    window.closeWindow(id);
  }, []);

  useEffect(() => {
    if (__IS_ELECTRON__) {
      return onCloseWindow((id) => {
        dispatch({ type: 'REMOVE_PLAYER', payload: { id } });
      });
    }
  }, [dispatch]);

  return (
    <Box w="full" h="full" p="4">
      <Menu
        players={state.player}
        onAddPlayer={handleAdd}
        onChangeVolume={handleVolume}
        onPlay={handlePlay}
        onStop={handleStop}
        onClose={handleClose}
      />
    </Box>
  );
}
