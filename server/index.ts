import envProfile from './commons/envProfile';
import { Server } from './server';
import kalturaInstance from './helpers/kalturaInstance';
import dbInstance from './helpers/mongodbInstance';
import * as express from 'express';
const ngrok = require('ngrok');

const port: number = envProfile.getProfile().PORT;
const app: express.Application = new Server().app;

dbInstance.connect()
  .then(() => {
    const server = app.listen(port, () => {
      if (process.send) {
        process.send('ready');
        console.log('Express server listening on port ' + port);
      }
    });

    process.on('SIGINT', () => {
      server.on('close', () => {
          console.log(`Connection closed.`);
        if (process.exit) {
          ngrok.disconnect();
          process.exit(0);
        }
      });
      server.close(() => {
          console.log(`Server closed.`);
        if (process.exit) {
          ngrok.disconnect();
          process.exit(0);
        }
      });
    });

    ngrok.connect({
      proto : 'http',
      addr : envProfile.getProfile().PORT,
      auth : `${envProfile.getProfile().USER}:${envProfile.getProfile().PASSWORD}`
    })
    .then((url) => {
        envProfile.getProfile().CALLBACK_URL = url;
        console.log("CALLBACK_URL:", envProfile.getProfile().CALLBACK_URL);

        kalturaInstance.startKalturalSession();
      }
    )

})