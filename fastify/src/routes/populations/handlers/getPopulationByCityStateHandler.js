import HttpStatus from "http-status-codes";
import { getPopulation } from "../../../service/populationService.js";

export default async function handler(request, reply) {
  try {
    let { city, state } = request.params;
    city = city.toLowerCase();
    state = state.toLowerCase();

    const population = await getPopulation(city, state);
    reply.code(HttpStatus.OK).send({ population: population });
  } catch (error) {
    if (error.message) {
      reply.code(HttpStatus.BAD_REQUEST).send(error);
    } else {
      reply.code(HttpStatus.INTERNAL_SERVER_ERROR).send(error);
    }
  }
}
