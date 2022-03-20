import { app } from 'electron';
const CUSTOM_SCHEME = 'multube';

export default (callback: (url: string) => void) => {
  app.setAsDefaultProtocolClient(CUSTOM_SCHEME);

  app.on('open-url', (_, url) => {
    callback(url);
  });

  const gotTheLock = app.requestSingleInstanceLock();
  if (!gotTheLock) {
    app.quit();
  } else {
    app.on('second-instance', async (_, commandLineArgs) => {
      const url = commandLineArgs.find((arg) =>
        arg.startsWith(`${CUSTOM_SCHEME}://`)
      );
      if (url) {
        callback(url);
      }
    });

    const url = process.argv.find((arg) =>
      arg.startsWith(`${CUSTOM_SCHEME}://`)
    );
    if (url) {
      callback(url);
    }
  }
};
