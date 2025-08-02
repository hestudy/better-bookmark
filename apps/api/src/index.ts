import { serve } from "@hono/node-server";
import { Hono } from "hono";
import bookmarksRouter from "./routes/bookmarks.js";

const app = new Hono()
  .get("/", (c) => {
    return c.text("Hello Hono!");
  })
  .route("/bookmarks", bookmarksRouter);

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
