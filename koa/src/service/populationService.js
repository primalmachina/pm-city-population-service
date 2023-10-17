import * as populationDao from "../dao/populations/populationsDao.js";

export async function getPopulation(city, state) {
  return await populationDao.getPopulationDao(city, state);
}

export async function editPopulation(city, state, population) {
  return await populationDao.editPopulationDao(city, state, population);
}
