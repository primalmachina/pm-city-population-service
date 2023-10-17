import { throwValidationError } from "../validationUtils.js";

export async function validatePayloadToEditPopulation(populationPayload) {
  const population = parseInt(populationPayload, 10);

  if (population === null || isNaN(population)) {
    throwValidationError(
      "Invalid population data. Population should be an integer."
    );
  }

  return population;
}
