import { prisma } from "./prisma.js";

export async function checkAndIncrementRateLimit (provider: string, limit: number): Promise<boolean> {
    const now = new Date();
    const windowStart = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        now.getHours(),
        now.getMinutes()
    )

    const bucket = await prisma.rateLimitBucket.upsert({
        where: {
            provider_windowStart: {
                provider,
                windowStart,
            },
        },
            update: {
                count: {increment : 1}
            }, create: {
                provider,
                windowStart,
                count: 1
            },
    });

    return bucket.count <= limit;
};