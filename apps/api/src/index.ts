import { auth } from "@/lib/auth.js";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import bookmarksRouter from "./routes/bookmarks.js";
import { showRoutes } from "hono/dev";
import { HonoAdapter } from "@bull-board/hono";
import { serveStatic } from "@hono/node-server/serve-static";
import { createBullBoard } from "@bull-board/api";
// @ts-ignore
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import { scrapyQueue } from "@/queue/index.js";

const serverAdapter = new HonoAdapter(serveStatic);

createBullBoard({
  queues: [new BullMQAdapter(scrapyQueue)],
  serverAdapter,
});

const basePath = "/ui";
serverAdapter.setBasePath(basePath);

const app = new Hono()
  .get("/", (c) => {
    return c.text("Hello Hono!");
  })
  .route(basePath, serverAdapter.registerPlugin())
  .on(["POST", "GET"], "/api/auth/**", (c) => auth.handler(c.req.raw))
  .route("/bookmarks", bookmarksRouter);

showRoutes(app);

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);

export type ApiType = typeof app;
