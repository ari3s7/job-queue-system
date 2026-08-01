import { emailProvider } from "./emailProvider.js";
import { mockProvider } from "./mockProvider.js";

export const registry = {
    email: emailProvider,
    sms: mockProvider,
    push: mockProvider,
  };