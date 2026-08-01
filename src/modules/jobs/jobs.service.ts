import { prisma } from "../../lib/prisma.js";
import { jobsQueue } from "./jobs.queue.js";
import type { CreateJobInput } from "./jobs.validator.js";

export async function createJob(input: CreateJobInput) {

    if(input.idempotencyKey){
        const existing =  await prisma.job.findUnique({
        where: {
            idempotencyKey: input.idempotencyKey,
        }
    })
    if(existing){
        return existing;
    }
    }
    const job = await prisma.job.create({
        data: {
            type: input.type,
            payload: input.payload,
            idempotencyKey: input.idempotencyKey ?? null,
        }
    })
    await jobsQueue.add("process-job", { jobId: job.id }, {
        backoff: {
            type: 'exponential',
            delay: 1000,
        },
        attempts: job.maxAttempts,
    })
    return job;
}