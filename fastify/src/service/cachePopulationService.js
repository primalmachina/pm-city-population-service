import { readFile, 
  renameFile,
  unlink,
  readDirectory,
  exists 
} from "../clients/file/fileClient.js";
import {convertSpacesToChar, convertCharToSpaces} from "../helpers/utils.js"
import { data } from "../config.js";

const POPULATION_DATA_FILE_PATH = `${data.basePath}${data.populationDataFilename}`;

export let populationCache = {};

export async function initializePopulationCache() {
  console.log("initializing population cache");
  try {
    const csvData = await readFile(POPULATION_DATA_FILE_PATH);
    const lines = csvData.trim().split("\n");

    lines.forEach((line) => {
      const [rawCity, rawState, population] = line.split(",");
      const city = rawCity.trim().toLowerCase();
      const state = rawState.trim().toLowerCase();
      populationCache[city] = populationCache[city] || {};
      populationCache[city][state] = parseInt(population, 10);
    });

    const directories = await readDirectory(`${data.basePath}files/`, { withFileTypes: true });
    
    for (const dirent of directories) {
      if (dirent.isDirectory()) {
        const [city, state] = dirent.name.split("_").map(convertCharToSpaces);

        const cityPath = convertSpacesToChar(city);
        const statePath = convertSpacesToChar(state);
        const cityStatePopulationPath = `${data.basePath}files/${cityPath}_${statePath}/${cityPath}_${statePath}`;

        const filePath = `${cityStatePopulationPath}.csv`;
        const tempFilePath = `${cityStatePopulationPath}_temp.csv`;
        const backupFilePath = `${cityStatePopulationPath}_backup.csv`;

        if (await exists(tempFilePath)) {
          await unlink(tempFilePath);
        }

        if (!(await exists(filePath)) && await exists(backupFilePath)) {
          await renameFile(backupFilePath, filePath);
        }

        if (await exists(filePath)) {
          const csvData = await readFile(filePath);
          const lines = csvData.trim().split("\n");
  
          lines.forEach((line) => {
            const [rawCity, rawState, population] = line.split(",");
            const city = rawCity.trim().toLowerCase();
            const state = rawState.trim().toLowerCase();
            populationCache[city] = populationCache[city] || {};
            populationCache[city][state] = parseInt(population, 10);
          }); 
        }
      }
    }

  } catch (error) {
    console.error("Failed to initialize data store:", error);
  }
}

