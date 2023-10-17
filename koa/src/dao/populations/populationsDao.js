import { Mutex } from "async-mutex";
import {
  writeFile,
  renameFile,
  exists,
} from "../../clients/file/fileClient.js";
import {
  populationCache,
  stagingPopulationCache,
  POPULATION_DATA_FILE_PATH,
  TEMP_POPULATION_DATA_FILE_PATH,
  BACKUP_POPULATION_DATA_FILE_PATH,
} from "../../service/cachePopulationService.js";

const cacheMutex = new Mutex();
const persistMutex = new Mutex();

let cacheModified = false;

export async function getPopulationDao(city, state) {
  return await cacheMutex.runExclusive(() => {
    return populationCache[city]?.[state] ?? null;
  });
}

// src/dao/populations/populationsDao.js
export async function editPopulationDao(city, state, population) {
  let isCreated = false;

  const currentPopulation = populationCache[city]?.[state] ?? null;

  if (currentPopulation) {
    if (currentPopulation === population) {
      return;
    }
  }

  await cacheMutex.runExclusive(async () => {
    if (!populationCache[city] || !populationCache[city][state]) {
      isCreated = true;
    }
    populationCache[city] = populationCache[city] || {};
    populationCache[city][state] = population;

    Object.assign(
      stagingPopulationCache,
      JSON.parse(JSON.stringify(populationCache))
    );

    cacheModified = true;
  });

  await persistPopulationData();
  return isCreated;
}

export async function persistPopulationData() {
  await persistMutex.runExclusive(async () => {
    try {
      if (!cacheModified) return;

      // Backup current data
      await renameFile(
        POPULATION_DATA_FILE_PATH,
        BACKUP_POPULATION_DATA_FILE_PATH
      );

      let csvOutput = "";
      for (const city in stagingPopulationCache) {
        for (const state in stagingPopulationCache[city]) {
          csvOutput += `${city},${state},${stagingPopulationCache[city][state]}\n`;
        }
      }
      // Write new data to a temporary file
      await writeFile(TEMP_POPULATION_DATA_FILE_PATH, csvOutput);
      // Replace the current data file with the temporary file
      await renameFile(
        TEMP_POPULATION_DATA_FILE_PATH,
        POPULATION_DATA_FILE_PATH
      );
      cacheModified = false;
    } catch (error) {
      // On failure, restore the backup
      if (await exists(BACKUP_POPULATION_DATA_FILE_PATH)) {
        await renameFile(
          BACKUP_POPULATION_DATA_FILE_PATH,
          POPULATION_DATA_FILE_PATH
        );
      }
      throw new Error("Failed to persist data: " + error.message);
    }
  });
}
