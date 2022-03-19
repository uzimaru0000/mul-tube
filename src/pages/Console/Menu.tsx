import {
  Box,
  Button,
  CloseButton,
  FormControl,
  FormLabel,
  HStack,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useToast,
  VStack,
} from '@chakra-ui/react';
import {
  FaCommentAlt,
  FaLink,
  FaPlay,
  FaPlus,
  FaShareAlt,
  FaStop,
  FaVolumeDown,
  FaVolumeOff,
  FaVolumeUp,
} from 'react-icons/fa';
import React, { useCallback, useState } from 'react';
import { Player } from './hooks';
import { getVideoId, validator } from '../../lib';

interface Props {
  players: {
    [id: string]: Player;
  };
  chat: string | null;
  onAddPlayer(id: string): void;
  onChangeVolume(id: string, volume: number): void;
  onPlay(id: string): void;
  onStop(id: string): void;
  onClose(id: string): void;
  onOpenChat(): void;
  onChangeChat(id: string): void;
  onCloseChat(): void;
}

export function Menu({
  players,
  chat,
  onAddPlayer,
  onChangeVolume,
  onPlay,
  onStop,
  onClose,
  onOpenChat,
  onChangeChat,
  onCloseChat,
}: Props) {
  const [input, setInput] = useState('');
  const toast = useToast();

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value),
    []
  );
  const handleAddPlayer = useCallback(() => {
    setInput('');
    const urls = input.split(' ').filter(validator);

    const ids = urls.map(getVideoId).filter((x): x is string => x !== null);
    if (ids.length === 0) {
      toast({
        title: '有効なURLが有りませんでした',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    ids.forEach((id) => onAddPlayer(id));
  }, [input, onAddPlayer]);
  const handleChangeVolume = useCallback(
    (id: string) => (volume: number) => onChangeVolume(id, volume),
    [onChangeVolume]
  );
  const handleShare = useCallback(async () => {
    await navigator.clipboard.writeText(
      Object.values(players)
        .map(({ id }) => `https://youtube.com/watch?v=${id}`)
        .join(' ')
    );

    toast({
      title: 'URLをコピーしました',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  }, [toast, players]);

  const handlePlay = useCallback((id: string) => () => onPlay(id), [onPlay]);
  const handleStop = useCallback((id: string) => () => onStop(id), [onStop]);
  const handleClose = useCallback(
    (id: string) => (e: React.MouseEvent) => {
      e.stopPropagation();
      onClose(id);
    },
    [onClose]
  );
  const handleOpenChat = useCallback(() => onOpenChat(), [onOpenChat]);

  return (
    <HStack h="full" spacing="4">
      <VStack alignItems="start">
        <FormControl>
          <FormLabel htmlFor="url">YouTube URL</FormLabel>
          <HStack spacing={1}>
            <Input
              id="url"
              w="512px"
              placeholder="https://youtube.com/watch?v=xxxxxxxxxxx"
              onChange={handleChange}
              value={input}
            />
            <IconButton
              aria-label="add"
              icon={<Icon as={FaPlus} />}
              onClick={handleAddPlayer}
            />
          </HStack>
        </FormControl>
        <HStack>
          <Button leftIcon={<Icon as={FaShareAlt} />} onClick={handleShare}>
            Share
          </Button>
          <Button
            leftIcon={<Icon as={FaCommentAlt} />}
            onClick={handleOpenChat}
          >
            チャット
          </Button>
        </HStack>
      </VStack>
      <Box h="full" flexGrow={1}>
        <Tabs colorScheme="red">
          <TabList>
            {Object.keys(players).map((id, i) => (
              <Tab key={id}>
                <HStack>
                  <Text>Player {i + 1}</Text>
                  <CloseButton size="sm" onClick={handleClose(id)} />
                </HStack>
              </Tab>
            ))}
            {chat && (
              <Tab>
                <HStack>
                  <Text>Chat</Text>
                  <CloseButton size="sm" onClick={onCloseChat} />
                </HStack>
              </Tab>
            )}
          </TabList>

          <TabPanels>
            {Object.entries(players).map(([id, player]) => (
              <TabPanel key={id}>
                <Panel
                  player={player}
                  onChangeVolume={handleChangeVolume(id)}
                  onPlay={handlePlay(id)}
                  onStop={handleStop(id)}
                />
              </TabPanel>
            ))}
            {chat && (
              <TabPanel>
                <ChatPanel
                  id={chat}
                  players={players}
                  onChange={onChangeChat}
                />
              </TabPanel>
            )}
          </TabPanels>
        </Tabs>
      </Box>
    </HStack>
  );
}

type PanelProps = {
  player: Player;
  onChangeVolume: (volume: number) => void;
  onStop: () => void;
  onPlay: () => void;
};
const Panel = ({ player, onChangeVolume, onStop, onPlay }: PanelProps) => {
  const toast = useToast();
  const handleURLClick = useCallback(async () => {
    await navigator.clipboard.writeText(
      `https://youtube.com/watch?v=${player.id}`
    );

    toast({
      title: 'URLをコピーしました',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  }, [toast, player]);

  return (
    <VStack alignItems="start">
      <HStack>
        <InputGroup w="fit-content">
          <InputLeftElement
            pointerEvents="none"
            children={<Icon as={FaLink} />}
          />
          <Input
            htmlSize={40}
            defaultValue={`https://youtube.com/watch?v=${player.id}`}
            readOnly
            cursor="pointer"
            onClick={handleURLClick}
          />
        </InputGroup>
      </HStack>
      <HStack w="full" py={2}>
        <IconButton
          aria-label="play"
          onClick={() => (player.isPlay ? onStop() : onPlay())}
          icon={player.isPlay ? <Icon as={FaStop} /> : <Icon as={FaPlay} />}
        />
        <IconButton
          aria-label="mute"
          onClick={() => onChangeVolume(player.volume > 0 ? 0 : 100)}
          icon={
            player.volume > 50 ? (
              <Icon as={FaVolumeUp} />
            ) : player.volume > 0 ? (
              <Icon as={FaVolumeDown} />
            ) : (
              <Icon as={FaVolumeOff} />
            )
          }
        />
        <Slider
          aria-label="volume-slider"
          defaultValue={player.volume}
          value={player.volume}
          min={0}
          max={100}
          step={0.1}
          onChange={onChangeVolume}
        >
          <SliderTrack>
            <SliderFilledTrack bg="red" />
          </SliderTrack>
          <SliderThumb />
        </Slider>
      </HStack>
    </VStack>
  );
};

type ChatPanelProps = {
  id: string;
  players: {
    [id: string]: Player;
  };
  onChange(id: string): void;
};
const ChatPanel = ({ id, players, onChange }: ChatPanelProps) => {
  return (
    <Select value={id} onChange={(x) => onChange(x.currentTarget.value)}>
      {Object.values(players).map((p, idx) => (
        <option value={p.id}>{`Player ${idx + 1}`}</option>
      ))}
    </Select>
  );
};
