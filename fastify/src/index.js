import buildApp from "./app.js";
import { api, server } from "./config.js";

const run = async () => {
  try {
    const app = await buildApp();
    app.listen(server.port, "0.0.0.0", (err) => {
      if (err) {
        console.log(err);
        throw err;
      }
      console.log(`${api.name} started at http://localhost:${server.port}`);
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
};

run();
