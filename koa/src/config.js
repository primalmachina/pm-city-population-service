import dotenv from "dotenv";
dotenv.config();

export const api = {
  name: process.env.API_NAME ?? "city-population-api",
  version: process.env.API_VERSION ?? "0.1.0",
  description:
    process.env.API_DESCRIPTION ??
    "Service for retrieving and updating a population for a city,state",
};

export const server = {
  port: process.env.API_PORT ?? 5555,
};

export const routeConfig = {
  baseRoute: process.env.BASE_ROUTE ?? "/api/",
  populationsRoute:
    process.env.POPULATIONS_ROUTE ?? "population/state/:state/city/:city",
};

export const data = {
  basePath: process.env.DATA_BASE_PATH ?? "data/",
  populationDataFilename: process.env.DATA_FILENAME ?? "city_populations.csv",
};
