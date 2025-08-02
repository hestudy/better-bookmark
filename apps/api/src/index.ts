import { auth } from "@/lib/auth.js";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import bookmarksRouter from "./routes/bookmarks.js";
import { showRoutes } from "hono/dev";

const app = new Hono()
  .get("/", (c) => {
    return c.text("Hello Hono!");
  })
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
