import db from "@/db/index.js";
import { bookmark } from "@/db/schema.js";
import { zValidator } from "@hono/zod-validator";
import { eq } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";
import z from "zod";
import app from "../../app.js";

const bookmarksRouter = app
  .post(
    "/create",
    zValidator(
      "json",
      z.object({
        url: z.url(),
      })
    ),
    async (c) => {
      const { url } = c.req.valid("json");

      const user = c.get("user");
      if (!user?.id) {
        throw new HTTPException(401, { message: "Unauthorized" });
      }

      const record = await db.query.bookmark.findFirst({
        where(fields, operators) {
          return operators.eq(fields.url, url);
        },
      });

      if (!!record) {
        return c.json(record);
      }

      const result = await db
        .insert(bookmark)
        .values({
          url,
          userId: user!.id,
        })
        .returning();

      return c.json(result.at(0));
    }
  )
  .post(
    "/delete",
    zValidator(
      "json",
      z.object({
        id: z.string(),
      })
    ),
    async (c) => {
      const { id } = c.req.valid("json");

      const user = c.get("user");
      if (!user?.id) {
        throw new HTTPException(401, { message: "Unauthorized" });
      }

      const record = await db.query.bookmark.findFirst({
        where(fields, operators) {
          return operators.and(
            operators.eq(fields.id, id),
            operators.eq(fields.userId, user!.id)
          );
        },
      });

      if (!record) {
        throw new HTTPException(404, { message: "Not Found" });
      }

      const result = await db
        .delete(bookmark)
        .where(eq(bookmark.id, id))
        .returning();

      return c.json(result.at(0));
    }
  );

export default bookmarksRouter;
