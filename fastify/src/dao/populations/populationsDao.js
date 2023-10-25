import { Mutex } from "async-mutex";
import {
  writeFile,
  renameFile,
  exists,
} from "../../clients/file/fileClient.js";
import {convertSpacesToChar} from "../../helpers/utils.js"
import {
  populationCache,
} from "../../service/cachePopulationService.js";
import { data } from "../../config.js";


let cityStateMutexes = {};

function getCityStateMutex(city, state) {
  const key = `${city}_${state}`;
  if (!cityStateMutexes[key]) {
    cityStateMutexes[key] = new Mutex();
  }
  return cityStateMutexes[key];
}

export async function getPopulationDao(city, state) {
  return populationCache[city]?.[state] ?? null;
}

async function savePopulationDataToFile(city, state, population) {
  const cityPath = convertSpacesToChar(city);
  const statePath = convertSpacesToChar(state);
  const cityStatePopulationPath = `${data.basePath}files/${cityPath}_${statePath}/${cityPath}_${statePath}`;
  const filePath = `${cityStatePopulationPath}.csv`;
  const tempFilePath = `${cityStatePopulationPath}_temp.csv`;
  const backupFilePath = `${cityStatePopulationPath}_backup.csv`;

  const csvOutput = `${city},${state},${population}`;
  try {
    await writeFile(tempFilePath, csvOutput);
    if (await exists(filePath)) {
      await renameFile(filePath, backupFilePath);
    }
    await renameFile(tempFilePath, filePath);
  } catch (error) {
    if (await exists(backupFilePath)) {
      await renameFile(backupFilePath, filePath);
    }
    throw new Error("Failed to persist data: " + error.message);
  }
}

export async function editPopulationDao(city, state, population) {
  const mutex = getCityStateMutex(city, state);

  await mutex.runExclusive(async () => {
    const currentPopulation = populationCache[city]?.[state] ?? null;
    if (currentPopulation && currentPopulation === population) {
      return;
    }

    populationCache[city] = populationCache[city] || {};
    populationCache[city][state] = population;

    await savePopulationDataToFile(city, state, population);
  });
}


export async function persistPopulationData() {
  for (const city in populationCache) {
    for (const state in populationCache[city]) {
      const mutex = getCityStateMutex(city, state);
      await mutex.runExclusive(async () => {
        const population = populationCache[city][state];
        await savePopulationDataToFile(city, state, population);
      });
    }
  }
}
