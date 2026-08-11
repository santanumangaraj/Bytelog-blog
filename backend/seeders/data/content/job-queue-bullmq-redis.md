## Why Move Work Off the Request Path

Some operations — sending emails, resizing images, processing likes, generating reports — don't need to finish before you respond to the client. Doing them synchronously inside a request handler makes your API slower and more fragile.

A job queue lets you accept the request, enqueue the work, and respond immediately while a separate worker process does the actual job in the background.

## How BullMQ Fits In

BullMQ is a Redis-backed queue library for Node.js. It gives you queues, workers, retries, and backoff strategies out of the box.

```
Client
   ↓
API (enqueue job)
   ↓
Redis (queue storage)
   ↓
Worker process (processes job)
   ↓
Database / external service
```

The API and the worker are two separate processes that only communicate through Redis, so the worker can be scaled independently of the API.

## Example: Enqueuing a Job

```
import { Queue } from "bullmq";
import redis from "./redis.js";

const emailQueue = new Queue("send-email", { connection: redis });

await emailQueue.add("welcome-email", {
    to: user.email,
    name: user.fullName,
}, {
    attempts: 5,
    backoff: { type: "exponential", delay: 5000 },
    removeOnComplete: true,
});
```

## Example: Processing a Job

```
import { Worker } from "bullmq";
import redis from "./redis.js";

const worker = new Worker("send-email", async (job) => {
    await sendEmail(job.data.to, job.data.name);
}, {
    connection: redis,
    concurrency: 10,
});

worker.on("completed", (job) => {
    console.log(`Job ${job.id} completed`);
});

worker.on("failed", (job, err) => {
    console.error(`Job ${job.id} failed: ${err.message}`);
});
```

## Handling Failures

Jobs fail — a third-party API times out, a database connection drops. BullMQ retries failed jobs automatically using the `attempts` and `backoff` options, and keeps failed jobs around (`removeOnFail: false`) so you can inspect what went wrong instead of silently losing work.

## Important Considerations

- Idempotency: a job might run more than once, so handlers should be safe to repeat
- Concurrency: how many jobs a worker processes in parallel
- Ordering: high concurrency means jobs are not guaranteed to run in the order they were added
- Monitoring: dashboards like Bull Board make it easier to see queue health
- Separating queues by domain so one slow job type doesn't block another

## Conclusion

Queues are one of the most effective tools for keeping an API responsive under load. By moving non-critical work to a background worker, the request/response cycle stays fast, and failures are retried instead of silently dropped.
