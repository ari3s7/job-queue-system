
export async function mockProvider(jobType: string, payload: any): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const willFail = Math.random() < 0.3;

  if (willFail) {
    throw new Error(`Mock provider failed to send ${jobType}`);
  }
}