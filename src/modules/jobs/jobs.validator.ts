import { z } from 'zod';

export const createJobSchema = z.object({
    type: z.enum(["email", "sms", "push"]),
    payload: z.record(z.string(), z.any()),
    idempotencyKey: z.string().optional(),
})

export type CreateJobInput = z.infer<typeof createJobSchema>;