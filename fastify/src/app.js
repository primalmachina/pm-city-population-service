import Fastify from "fastify";
import router from "./router.js";

import { api } from "./config.js";
import exitHook from "async-exit-hook";
import { initializePopulationCache } from "./service/cachePopulationService.js";
import * as populationDao from "./dao/populations/populationsDao.js";

export default async function buildApp() {
  console.log(`building ${api.name}`);

  await initializePopulationCache();

  console.log("constructing exit hook");

  exitHook(async (callback) => {
    console.log(`${api.name} exit hook called`);

    try {
      await populationDao.persistPopulationData();
    } catch (error) {
      console.log(error);
    }

    callback();
  });

  exitHook.uncaughtExceptionHandler((error) => {
    console.log(error);
  });

  exitHook.unhandledRejectionHandler((error) => {
    console.log(error);
  });

  const app = Fastify({ logger: true });
  app.register(router);

  return app;
}
