import routes from "./routes/index.js";

export default function router(fastify, options, done) {
  for (let route of routes) {
    if (route.method === "get") {
      fastify.get(route.path, route.handler);
    } else if (route.method === "put") {
      fastify.put(route.path, route.handler);
    }
    // ... add other HTTP methods if needed
  }
  done();
}
