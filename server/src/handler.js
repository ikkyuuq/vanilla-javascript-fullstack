import { parse, fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { routes } from "./routes/userRoutes.js";
import { DEFAULT_HEADERS } from "./utils/util.js";
import { generateInstance } from "./factory/userFactory.js";

// import data from "../database/data.json" assert { type: "json" };

const currentDir = dirname(fileURLToPath(import.meta.url));
const filePath = join(currentDir, "../", "database", "data.json");
const userFactory = generateInstance({ filePath });
const userRoutes = routes({
  userFactory,
});

// create thing routes
const Routes = {
  ...userRoutes,
  defaultRoute(request, response) {
    response.writeHead(404, DEFAULT_HEADERS);
    response.write(
      JSON.stringify({
        message: "not found",
      }),
    );

    response.end();
  },
};
// a function to create route
// with error handling inside of handler to ensure that
// server it will getting down from getting error from routes
// that doesn't implement the error handling it self.
const handler = async (request, response) => {
  const { url, method } = request;

  const { pathname } = parse(url, true);
  const key = `${pathname}:${method.toLowerCase()}`;

  const route = Routes[key] ?? Routes.defaultRoute;

  return Promise.resolve(route(request, response)).catch(
    handlerError(response),
  );
};

const handlerError = (response) => {
  return (error) => {
    console.log("Something went wrong!", error.stack);
    response.writeHead(500, DEFAULT_HEADERS);
    response.write(JSON.stringify({ error: "Internal Server Error!" }));
    return response.end();
  };
};

export default handler;
