import { extendTheme, withDefaultColorScheme } from '@chakra-ui/react';

export const theme = extendTheme({
  styles: {
    global: {
      'html, body, #root': {
        height: '100%',
      },
    },
  },
  config: {
    useSystemColorMode: true,
  },
});
