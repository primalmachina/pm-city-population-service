import HttpStatus from "http-status-codes";
import { editPopulation } from "../../../service/populationService.js";
import { validatePayloadToEditPopulation } from "../../../helpers/populations/populationHelper.js";

export default async function handler(ctx) {
  try {
    let { state, city } = ctx.params;
    state = state.toLowerCase();
    city = city.toLowerCase();

    const population = await validatePayloadToEditPopulation(ctx.request.body);
    const isCreated = await editPopulation(city, state, population);

    ctx.status = isCreated ? HttpStatus.CREATED : HttpStatus.OK;
  } catch (error) {
    if (error.message) {
      ctx.throw(HttpStatus.BAD_REQUEST, error);
    } else {
      ctx.throw(HttpStatus.INTERNAL_SERVER_ERROR, error);
    }
  }
}
