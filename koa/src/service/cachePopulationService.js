import { readFile } from "../clients/file/fileClient.js";
import { data } from "../config.js";

export const POPULATION_DATA_FILE_PATH = `${data.basePath}${data.populationDataFilename}`;
export const TEMP_POPULATION_DATA_FILE_PATH = POPULATION_DATA_FILE_PATH.replace(
  ".csv",
  "_temp.csv"
);

export const BACKUP_POPULATION_DATA_FILE_PATH =
  POPULATION_DATA_FILE_PATH.replace(".csv", "_backup.csv");

export let populationCache = {};
export let stagingPopulationCache = {};

export async function initializePopulationCache() {
  console.log("initializing population cache");
  try {
    const csvData = await readFile(POPULATION_DATA_FILE_PATH);
    const lines = csvData.split("\n");

    lines.forEach((line) => {
      const [rawCity, rawState, population] = line.split(",");
      const city = rawCity.trim().toLowerCase();
      const state = rawState.trim().toLowerCase();
      populationCache[city] = populationCache[city] || {};
      populationCache[city][state] = parseInt(population, 10);
    });

    stagingPopulationCache = JSON.parse(JSON.stringify(populationCache));
  } catch (error) {
    console.error("Failed to initialize data store:", error);
  }
}
