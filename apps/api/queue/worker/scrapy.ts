import db from "@/db/index.js";
import { bookmark } from "@/db/schema.js";
import { Readability } from "@mozilla/readability";
import { Worker } from "bullmq";
import { Defuddle } from "defuddle/node";
import { eq } from "drizzle-orm";
import { Redis } from "ioredis";
import { JSDOM } from "jsdom";

const connection = new Redis(process.env.REDIS_URL ?? "", {
  maxRetriesPerRequest: null,
});

const worker = new Worker<{
  url: string;
  bookmarkId: string;
}>(
  "scrapy",
  async (job) => {
    console.log(job.name, job.data);
    const dom = await JSDOM.fromURL(job.data.url);
    const result = await Defuddle(dom);
    const reader = new Readability(dom.window.document);
    const article = reader.parse();

    await db
      .update(bookmark)
      .set({
        title: result.title,
        description: result.description,
        content: result.content,
        image: result.image,
        favicon: result.favicon,
        domain: result.domain,
        article: article?.content,
        articleText: article?.textContent,
        workId: null,
      })
      .where(eq(bookmark.id, job.data.bookmarkId));
  },
  { connection }
);
