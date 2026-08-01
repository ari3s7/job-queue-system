import { Worker } from 'bullmq';
import { prisma } from "../../lib/prisma.js"
import { redisConnection } from "../../lib/redis.js"
import { getProvider } from '../../providers/getProvider.js';

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
   const update = await prisma.job.update({
      where: {
         id: job.data.jobId
      }, data:{
         status: "PROCESSING",
      }
   })
   try {
   const provider = getProvider(dbJob.type);
   await provider(dbJob.payload);
   await prisma.job.update({
      where: {
        id: dbJob.id,
      }, data: {
         status: "COMPLETED",
         processedAt: new Date(),
      },
   });

   await prisma.jobLog.create({
      data: {
         jobId: dbJob.id,
         attempt: dbJob.attempts + 1,
         status: "COMPLETED",
         message: "Job completed successfully"
      }
   })
} catch (error) {
  const message = error instanceof Error ? error.message : String(error)

  const isFinalAttempt = job.attemptsMade >= (job.opts.attempts ?? 1);

  await prisma.job.update({
    where: { id: dbJob.id },
    data: {
      status: isFinalAttempt ? "FAILED" : "PENDING",
      attempts: { increment: 1 },
    },
  });

  await prisma.jobLog.create({
   data: {
      jobId: dbJob.id,
      attempt: dbJob.attempts + 1,
      status: "FAILED",
      message,
   },
  });

  throw error;
}
}, {
   connection: redisConnection,
});