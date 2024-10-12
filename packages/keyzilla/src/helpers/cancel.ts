import { cancel } from "@clack/prompts";

// this function handles the cancellation of an operation
// it logs a message and exits the process
export function handleCancellation() {
  cancel("Operation cancelled. Goodbye!");
  process.exit(0);
}