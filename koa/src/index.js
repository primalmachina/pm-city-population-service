import buildApp from "./app.js";
import { api, server } from "./config.js";

const run = async () => {
  try {
    const app = await buildApp();
    const apiServer = app.listen(server.port);
    const apiAddress = apiServer.address();

    if (!apiAddress) {
      throw new Error("There was an issue invoking app.listen");
    }

    const success = `${api.name} started at http://localhost:${String(
      apiAddress.port
    )}`;

    console.log(success);

    return apiServer;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export default run();
