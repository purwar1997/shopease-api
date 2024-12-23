import config from './config/env.config.js';
import connectToDB from './db/index.js';
import app from './app.js';

(async () => {
  try {
    await connectToDB();

    const initializeServer = error => {
      if (error) {
        throw error;
      }
      console.log(`Server is running on http://localhost:${config.server.port}`);
    };

    app.listen(config.server.port, initializeServer);
  } catch (error) {
    console.error('ERROR:', error);
    process.exit(1);
  }
})();
