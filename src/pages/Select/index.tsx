import {
  AspectRatio,
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
  SimpleGrid,
  useDisclosure,
  useToast,
  VStack,
} from '@chakra-ui/react';
import React, { useCallback, useMemo, useState } from 'react';
import {
  FaArrowDown,
  FaLaptop,
  FaPlus,
  FaQuestion,
  FaShareAlt,
} from 'react-icons/fa';
import { getVideoId, thumbnailUrl, validator } from '../../lib';

export default function Select() {
  const [input, setInput] = useState('');
  const [urls, setUrls] = useState<string[]>([]);
  const toast = useToast();
  const { isOpen, onToggle } = useDisclosure();
  const addDisabled = useMemo(() => {
    return !validator(input) || urls.includes(input);
  }, [input, urls]);
  const openUrl = useMemo(() => {
    const url = new URL('multube://open');
    urls
      .map((x) => getVideoId(x))
      .filter((x): x is string => x !== null)
      .forEach((id) => {
        url.searchParams.append('vid', id);
      });

    return url.toString();
  }, [urls]);

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
                icon={<Icon as={FaPlus} />}
                roundedLeft="none"
                onClick={handleAdd}
              />
            </InputGroup>
          </FormControl>
          {urls.length !== 0 && (
            <Box
              w="full"
              p="4"
              borderColor="black.100"
              borderWidth="1px"
              rounded="8"
            >
              <FormLabel>Preview</FormLabel>
              <SimpleGrid
                columns={Math.ceil(Math.sqrt(urls.length))}
                spacing={8}
              >
                {urls
                  .map(getVideoId)
                  .filter((x): x is string => x !== null)
                  .map((id) => (
                    <Image key={id} src={thumbnailUrl(id)} alt={id} w="full" />
                  ))}
                {[
                  ...Array(
                    Math.ceil(Math.sqrt(urls.length)) ** 2 - urls.length
                  ),
                ].map(() => (
                  <AspectRatio ratio={16 / 9}>
                    <Box w="full" h="4" bg="gray.300">
                      <Center>
                        <Icon
                          boxSize="20"
                          color="blackAlpha.500"
                          as={FaQuestion}
                        />
                      </Center>
                    </Box>
                  </AspectRatio>
                ))}
              </SimpleGrid>
            </Box>
          )}
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
                as="a"
                href={openUrl}
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
