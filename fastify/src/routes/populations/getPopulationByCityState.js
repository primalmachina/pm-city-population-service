import handler from "./handlers/getPopulationByCityStateHandler.js";
import { routeConfig } from "../../config.js";

const route = {
  method: "get",
  path: `${routeConfig.baseRoute}${routeConfig.populationsRoute}`,
  handler,
};

export default route;
