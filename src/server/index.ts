import { createReadStream, existsSync } from "node:fs";
import { createServer } from "node:http";
import path from "node:path";
import { createReport } from "./report.js";

const port = Number(process.env.PORT ?? 4177);
const isProd = process.argv.includes("--prod");
const staticRoot = isProd ? path.resolve("dist/client") : path.resolve("src/client");

const mime: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8"
};

const server = createServer(async (request, response) => {
  const url = new URL(request.url ?? "/", `http://${request.headers.host}`);
  if (url.pathname === "/api/report") {
    response.setHeader("content-type", "application/json; charset=utf-8");
    response.end(JSON.stringify(await createReport()));
    return;
  }

  const requested = url.pathname === "/" ? "/index.html" : url.pathname;
  const filePath = path.join(staticRoot, requested);
  if (!existsSync(filePath)) {
    response.statusCode = 404;
    response.end("Not found");
    return;
  }

  response.setHeader("content-type", mime[path.extname(filePath)] ?? "application/octet-stream");
  createReadStream(filePath).pipe(response);
});

server.listen(port, "127.0.0.1", () => {
  console.log(`dev-pulse running at http://127.0.0.1:${port}`);
});
