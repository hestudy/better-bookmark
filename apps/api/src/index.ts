import { auth } from "@/lib/auth.js";
import { scrapyQueue } from "@/queue/index.js";
import { createBullBoard } from "@bull-board/api";
import { HonoAdapter } from "@bull-board/hono";
import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { Hono } from "hono";
import { showRoutes } from "hono/dev";
import bookmarksRouter from "./routes/bookmark/bookmarks.js";
// @ts-ignore
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import app from "./app.js";

const serverAdapter = new HonoAdapter(serveStatic);

createBullBoard({
  queues: [new BullMQAdapter(scrapyQueue)],
  serverAdapter,
});

const basePath = "/ui";
serverAdapter.setBasePath(basePath);

app.use("*", async (c, next) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });

  if (!session) {
    c.set("user", null);
    c.set("session", null);
    return next();
  }

  c.set("user", session.user);
  c.set("session", session.session);
  return next();
});

const api = app
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

export type ApiType = typeof api;
export default api;
