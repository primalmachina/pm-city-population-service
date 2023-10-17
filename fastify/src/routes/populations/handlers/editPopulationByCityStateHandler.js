import HttpStatus from "http-status-codes";
import { editPopulation } from "../../../service/populationService.js";
import { validatePayloadToEditPopulation } from "../../../helpers/populations/populationHelper.js";

export default async function handler(request, reply) {
  try {
    let { state, city } = request.params;
    state = state.toLowerCase();
    city = city.toLowerCase();

    const population = await validatePayloadToEditPopulation(request.body);
    const isCreated = await editPopulation(city, state, population);

    reply.code(isCreated ? HttpStatus.CREATED : HttpStatus.OK).send();
  } catch (error) {
    if (error.message) {
      reply.code(HttpStatus.BAD_REQUEST).send(error);
    } else {
      reply.code(HttpStatus.INTERNAL_SERVER_ERROR).send(error);
    }
  }
}
