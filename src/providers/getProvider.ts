import { registry } from "./providerRegistry.js";

export function getProvider(jobType: string) {
  const provider = registry[jobType as keyof typeof registry];

  if (!provider) {
    throw new Error(`No provider found for job type: ${jobType}`);
  }

  return provider;
}