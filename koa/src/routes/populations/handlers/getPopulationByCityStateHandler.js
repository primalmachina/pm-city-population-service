import HttpStatus from "http-status-codes";
import { getPopulation } from "../../../service/populationService.js";

export default async function handler(ctx) {
  try {
    let { city, state } = ctx.params;
    city = city.toLowerCase();
    state = state.toLowerCase();

    const population = await getPopulation(city, state);
    ctx.status = HttpStatus.OK;
    ctx.body = { population: population };
  } catch (error) {
    if (error.message) {
      console.log(error.message);
      ctx.throw(HttpStatus.BAD_REQUEST, error);
    } else {
      ctx.throw(HttpStatus.INTERNAL_SERVER_ERROR, error);
    }
  }
}
