import { AspectRatio, Box } from '@chakra-ui/react';
import { useEffect, useRef } from 'react';
import { useParams } from 'react-router';
import YouTube from 'react-youtube';

export default function Video() {
  const { id } = useParams();
  const playerRef = useRef<YouTube>(null);

  useEffect(() => {
    if (!id || !playerRef.current) {
      return;
    }
    const instance = playerRef.current?.getInternalPlayer();

    const changeVolumeHandler = onChangeVolume((volume) => {
      instance?.setVolume(volume);
    });
    const playHandler = onPlay(() => {
      instance?.playVideo();
    });
    const stopHandler = onStop(async () => {
      instance?.pauseVideo();
    });

    return () => {
      changeVolumeHandler();
      playHandler();
      stopHandler();
    };
  }, [id, playerRef]);

  return (
    <div>
      <Box
        sx={{ '-webkit-app-region': 'drag' }}
        position="absolute"
        top={0}
        left={0}
        w="100%"
        h="32px"
        zIndex={1}
      />
      <AspectRatio w="100%" ratio={16 / 9}>
        <YouTube
          videoId={id}
          ref={playerRef}
          opts={{
            width: '100%',
            height: '100%',
            playerVars: {
              autoplay: 1,
            },
          }}
        />
      </AspectRatio>
    </div>
  );
}
