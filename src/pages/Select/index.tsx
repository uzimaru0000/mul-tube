import {
  Box,
  Button,
  Center,
  Collapse,
  Container,
  FormControl,
  FormLabel,
  Icon,
  IconButton,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  SimpleGrid,
  useDisclosure,
  useToast,
  VStack,
} from '@chakra-ui/react';
import React, { useCallback, useMemo, useState } from 'react';
import { FaArrowDown, FaLaptop, FaPlus, FaShareAlt } from 'react-icons/fa';
import { getVideoId, thumbnailUrl, validator } from '../../lib';

export default function Select() {
  const [input, setInput] = useState('');
  const [urls, setUrls] = useState<string[]>([]);
  const toast = useToast();
  const { isOpen, onToggle } = useDisclosure();
  const addDisabled = useMemo(() => {
    return !validator(input) || urls.includes(input);
  }, [input, urls]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.currentTarget.value);
  }, []);
  const handleAdd = useCallback(() => {
    setInput('');

    if (!isOpen) {
      onToggle();
    }
    setUrls((x) => [...x, input]);
  }, [input, isOpen, onToggle]);
  const handleShare = useCallback(async () => {
    await navigator.clipboard.writeText(urls.join(' '));

    toast({
      title: 'コピーしました',
      description: 'mut-tubeの入力欄に入れてください',
      duration: 3000,
      status: 'success',
    });
  }, [urls]);
  const handleOpenApp = useCallback(() => {}, []);

  return (
    <Container minW="5xl" py="40">
      <VStack gap="16" w="full">
        <VStack gap="4" w="full">
          <FormControl>
            <FormLabel htmlFor="url">YouTubeのURLを入力</FormLabel>
            <InputGroup>
              <Input
                id="url"
                placeholder="https://youtube.com/watch?v=xxxxxxxxxxx"
                value={input}
                onChange={handleChange}
                roundedRight="none"
              />
              <IconButton
                aria-label="add"
                disabled={addDisabled}
                icon={<Icon as={FaPlus} onClick={handleAdd} />}
                roundedLeft="none"
              />
            </InputGroup>
          </FormControl>
          <FormControl boxShadow="base">
            <FormLabel>Preview</FormLabel>
            <SimpleGrid columns={Math.ceil(Math.sqrt(urls.length))} spacing={8}>
              {urls
                .map(getVideoId)
                .filter((x): x is string => x !== null)
                .map((id) => (
                  <Image key={id} src={thumbnailUrl(id)} alt={id} w="full" />
                ))}
            </SimpleGrid>
          </FormControl>
        </VStack>
        <Collapse in={isOpen} animateOpacity>
          <VStack gap="16">
            <Icon boxSize="16" as={FaArrowDown} />
            <VStack>
              <Button
                leftIcon={<Icon as={FaShareAlt} />}
                minW="xl"
                onClick={handleShare}
              >
                Share
              </Button>
              <Button
                leftIcon={<Icon as={FaLaptop} />}
                minW="xl"
                onClick={handleOpenApp}
              >
                アプリで開く
              </Button>
            </VStack>
          </VStack>
        </Collapse>
      </VStack>
    </Container>
  );
}
