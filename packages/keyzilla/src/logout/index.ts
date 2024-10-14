#!/usr/bin/env node
import { confirm, isCancel } from "@clack/prompts";
import { handleCancellation } from "../helpers/cancel";
import { clearAuthData, isAlreadyLoggedOut } from "./lib/deleteTmp";

async function logout() {
  // Check if the user is already logged out
  if (await isAlreadyLoggedOut()) {
    console.log("You are already logged out.");
    return;
  }

  const shouldLogout = await confirm({
    message: "Are you sure you want to log out?",
    initialValue: false,
  });
  if (isCancel(shouldLogout)) {
    handleCancellation();
  }
  if (shouldLogout) {
    clearAuthData();
    console.log("✅ You have been successfully logged out.");
  } else {
    console.log("❌ Logout cancelled.");
  }
}

logout().catch((error) => {
  console.error("An error occurred during logout:", error);
  process.exit(1);
});