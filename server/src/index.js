import http from "node:http";
import handler from "./handler.js";

const server = http.createServer(handler);

server
  .listen(3000)
  .on("listening", () => console.log(`app is running on 3000`));
