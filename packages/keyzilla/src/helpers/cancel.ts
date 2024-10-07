import { cancel } from "@clack/prompts";

export function handleCancellation() {
  cancel("Operation cancelled. Goodbye!");
  process.exit(0);
}