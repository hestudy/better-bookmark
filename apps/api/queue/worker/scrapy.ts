import { Worker } from "bullmq";
import { Redis } from "ioredis";

const connection = new Redis(process.env.REDIS_URL ?? "", {
  maxRetriesPerRequest: null,
});

const worker = new Worker(
  "scrapy",
  async (job) => {
    // Will print { foo: 'bar'} for the first job
    // and { qux: 'baz' } for the second.
    console.log(job.data);
  },
  { connection }
);
