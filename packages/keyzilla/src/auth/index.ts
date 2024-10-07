#!/usr/bin/env node

import { text, password, isCancel } from "@clack/prompts";
import {
  checkAuthentication,
  saveAuthCache,
  clearAuthCache,
} from "./lib/authCache";
import { UserData } from "../types/userData";
import { BASE_URL } from "../constants/urls";
import { handleCancellation } from "../helpers/cancel";
import { ErrorResponse } from "../types/error";
console.log("Starting authentication process..."); // Added logging

export async function authenticate(): Promise<UserData | null> {
  const cachedAuth = await checkAuthentication();
  if (cachedAuth) {
    console.log("Using cached authentication."); // Added logging
    return cachedAuth;
  }

  const credentials = await promptCredentials();
  if (!credentials) {
    console.log("Authentication cancelled.");
    return null;
  }

  const { email, secretCode } = credentials;

  try {
    const userData = await fetchUserId(email);
    const userId = userData.userId;
    const verifiedUserData = await verifyUser(
      userId,
      secretCode,
      userData.organizations
    );

    // At this point, verifiedUserData should always be authenticated
    saveAuthCache(verifiedUserData);
    console.log(
      `Authentication successful, run npx keyzilla pull to get your keys`
    ); // Added logging
    return verifiedUserData;
  } catch (error) {
    console.error("Authentication failed:", getErrorMessage(error));
    clearAuthCache();
    return null;
  }
}

async function fetchUserId(email: string): Promise<UserData> {
  console.log(`Fetching user ID for email: ${email}`); // Added logging
  const response = await fetch(`${BASE_URL}/api/cli?email=${email}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = (await response.json()) as UserData;

  if (typeof data.userId === "string") {
    return data;
  } else if (data.userId && typeof data.userId === "object") {
    throw new Error("Invalid user ID received from server");
  } else {
    throw new Error("Invalid user ID received from server");
  }
}

async function promptCredentials(): Promise<{
  email: string;
  secretCode: string;
} | null> {
  const email = await text({
    message: "Please enter your email:",
    validate: (input) =>
      input.trim() !== "" ? undefined : "Email cannot be empty",
  });

  if (isCancel(email)) {
    handleCancellation();
  }

  const secretCode = await password({
    message: "Please enter your secret code:",
    validate: (input) =>
      input.trim() !== "" ? undefined : "Secret code cannot be empty",
  });

  if (isCancel(secretCode)) {
    handleCancellation();
  }

  return { email: email as string, secretCode: secretCode as string };
}

async function verifyUser(
  userId: string,
  secretCode: string,
  organizations: any[]
): Promise<UserData> {
  console.log(`Verifying user ID: ${userId}`); // Added logging
  const response = await fetch(`${BASE_URL}/api/verify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId, secretKey: secretCode }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    if (isErrorResponse(errorData)) {
      throw new Error(errorData.error);
    } else {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  }

  const userData = (await response.json()) as unknown;

  if (isUserData(userData)) {
    return { ...userData, organizations } as UserData;
  } else if (
    typeof userData === "object" &&
    userData !== null &&
    "authenticated" in userData &&
    userData.authenticated === true
  ) {
    return {
      authenticated: true,
      userId: userId,
      email: "",
      organizations: organizations,
    } as UserData;
  } else {
    throw new Error("Invalid user data received from server");
  }
}

function isErrorResponse(data: unknown): data is ErrorResponse {
  return (
    typeof data === "object" &&
    data !== null &&
    "error" in data &&
    typeof (data as ErrorResponse).error === "string"
  );
}

function isUserData(data: unknown): data is UserData {
  if (typeof data !== "object" || data === null) {
    return false;
  }

  const { authenticated, userId, email, organizations } =
    data as Partial<UserData>;

  if (typeof authenticated !== "boolean") {
    return false;
  }

  if (typeof userId !== "string") {
    return false;
  }

  if (email !== null && typeof email !== "string") {
    return false;
  }

  if (!Array.isArray(organizations)) {
    return false;
  }

  return true;
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

// Start the authentication process
authenticate().catch((error) => {
  console.error("Unexpected error:", error);
});