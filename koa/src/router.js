import Router from "koa-router";
import routes from "./routes/index.js";

export default function router() {
  const routerInstance = new Router();

  for (let route of routes) {
    if (route.method === "get") {
      routerInstance.get(route.path, route.handler);
    } else if (route.method === "put") {
      routerInstance.put(route.path, route.handler);
    }
    // ... add other HTTP methods if needed
  }

  return routerInstance;
}
