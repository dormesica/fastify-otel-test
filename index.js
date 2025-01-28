import { initializeWebServer, stopWebServer } from './src/app.js';

const server = await initializeWebServer(3000);
console.log(`Listening on port ${server.getPort()}`);

/** @param {NodeJS.Signals} signal */
async function closeGracefully(signal) {
  console.log(`Got ${signal}, Shutdown gracefully...`);
  await stopWebServer();

  console.log('About to exit');
  // eslint-disable-next-line no-process-exit
  process.exit();
}
process.on('SIGTERM', closeGracefully);
