import handler from "./handlers/editPopulationByCityStateHandler.js";
import { routeConfig } from "../../config.js";

const route = {
  method: "put",
  path: `${routeConfig.baseRoute}${routeConfig.populationsRoute}`,
  handler,
};

export default route;
