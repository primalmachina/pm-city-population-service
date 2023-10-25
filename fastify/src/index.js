import buildApp from "./app.js";
import { api, server } from "./config.js";

const run = async () => {
  try {
    const app = await buildApp();
    app.listen({
      port: server.port,
      host: '0.0.0.0'
    }, (err, address) => {
      if (err) {
        console.log(err);
        throw err;
      }
      console.log(`${api.name} started at ${address}`);
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
};

run();
