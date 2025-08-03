import { Queue } from "bullmq";
import { Redis } from "ioredis";
import "./worker/scrapy.js";

const connection = new Redis(process.env.REDIS_URL ?? "", {
  maxRetriesPerRequest: null,
});

export const scrapyQueue = new Queue("scrapy", {
  connection,
});
