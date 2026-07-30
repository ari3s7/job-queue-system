import { Queue } from 'bullmq';
import { redisConnection } from '../../lib/redis.js';

export const jobsQueue = new Queue('jobs', {
    connection: redisConnection
})