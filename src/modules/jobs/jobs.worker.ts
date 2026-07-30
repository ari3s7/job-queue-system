import { Worker } from 'bullmq';
import { prisma } from "../../lib/prisma.js"
import { redisConnection } from "../../lib/redis.js"

const worker = new Worker('jobs', async (job) => {
   const dbJob = await prisma.job.findUnique({
    where: {
        id: job.data.jobId,
    }
   })
   if(!dbJob){
    console.error(`Job ${job.data.jobId} not found in database`);
    return;
   }
}, {
   connection: redisConnection,
});