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
import { Organization } from "../types/org";
import { getProjectConfig } from "../projects";
import * as fs from 'fs';
import * as path from 'path';
import { KeyzillaConfig } from "../types/config";


// Add this function to read and parse the config file
function readConfigFile(): KeyzillaConfig {
  const configPath = path.resolve(process.cwd(), 'keyzilla.config.ts');
  const configContent = fs.readFileSync(configPath, 'utf8');
  
  // Extract the config object from the file content
  const configMatch = configContent.match(/export\s+const\s+config\s*=\s*KeyzillaConfig\s*\(([\s\S]*?)\);/);
  
  if (configMatch && configMatch[1]) {
    let configString = configMatch[1].trim();
    
    // Remove non-null assertion operators
    configString = configString.replace(/!/g, '');
    
    // Replace process.env with a mock object 
    // for ex
    configString = configString.replace(/process\.env/g, '({})');
    
    try {
      // Use Function constructor to safely evaluate the config object
      const configObj = new Function(`return (${configString})`)();
      
      
      // Check if the resulting object has the expected structure
      if (typeof configObj === 'object' && configObj !== null && 'credentials' in configObj) {
        return configObj as KeyzillaConfig;
      } else {
        throw new Error('Invalid config structure');
      }
    } catch (error) {
      console.error('Error parsing config:', error);
      throw new Error('Unable to parse keyzilla.config.ts');
    }
  } else {
    throw new Error('Unable to find config in keyzilla.config.ts' + configPath);
  }
}

// this is the main function that handles the authentication process
// we first check if the user is authenticated by checking the cache 
// so we won't have to repeat the login 1process
// if the user  is not authenticated we prompt them for their email and secret code
// we then fetch the user data from the server
// we then verify the user data
// we then save the user data to the cache
// we then return the user data
// if any of the steps fail, we clear the cache and return null
export async function authenticate(production: boolean): Promise<UserData | null> {
  const cachedAuth = await checkAuthentication();
  if (cachedAuth) {
    console.log("✅ Using cached authentication");  
    return cachedAuth;
  }
  let credentials;

  if (production) {
    const config = readConfigFile();
    credentials = { 
      email: config.credentials.email, 
      secretCode: config.credentials.secretCode 
    };
  } else {
    credentials = await promptCredentials();
  }

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
      email as string,
      secretCode,
      userData.organizations
    );
    const AuthData = verifiedUserData as UserData;
    // At this point, verifiedUserData should always be authenticated
    saveAuthCache(AuthData);
    console.log(
      `Authentication successful, run npx keyzilla pull to get your keys`
    );  
    return verifiedUserData;
  } catch (error) {
    console.error("Authentication failed:", getErrorMessage(error));
    clearAuthCache();
    return null;
  }
}

async function fetchUserId(email: string): Promise<UserData> {
  console.log(`Fetching user ID for email: ${email}`);  
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

  if (typeof data.userId === "string" && Array.isArray(data.organizations)) {
    return data;
  } else {
    throw new Error("Invalid user data received from server");
  }
}



// this function prompts the user for their email and secret code
// it returns an object with the email and secret code
// if the user cancels the prompt, it returns null
// !!!!!!!!TODO!!!!!!: add a check to see if the email is valid
// if you have any questions about this code, please ask me in github issues
async function promptCredentials(): Promise<{
  email: string;
  secretCode: string;
} | null> {
  const email = await text({
    message: "Please enter your email:",
    validate: (input) => {
      if (input.trim() === "") return "Email cannot be empty";
      if (!isValidEmail(input)) return "Please enter a valid email address";
      return undefined;
    },
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

// Helper function to validate email format
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

async function verifyUser(
  userId: string,
  email: string,
  secretCode: string,
  organizations: Organization[]
): Promise<UserData> {
  console.log(`verifying user`); // Added logging from me
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
      throw new Error(`HTTP error! status: ${response.status} `);
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



// this function checks if the data is an error response
// you know some new-bee code wrote this (me) so don't judge too hard
function isErrorResponse(data: unknown): data is ErrorResponse {
  return (
    typeof data === "object" &&
    data !== null &&
    "error" in data &&
    typeof (data as ErrorResponse).error === "string"
  );
}

// this function checks if the data is a user data object
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

  if (!Array.isArray(organizations) || !organizations.every(isOrganization)) {
    return false;
  }

  return true;
}

// this function checks if the data is an organization object
// when we get the response from the server  we need to check if the organizations are valid
// without this check we would get a runtime error

function isOrganization(org: unknown): org is Organization {
  if (typeof org !== "object" || org === null) {
    return false;
  }

  const { id, name } = org as Partial<Organization>;

  return typeof id === "string" && typeof name === "string";
}

function getErrorMessage(error: unknown): string {
  
  if (error instanceof Error) return error.message;
  return String(error);
}

 

// Start the authentication process and catch any errors if they occur
// this is the entry point of the auth process 
 authenticate(process.env.NODE_ENV === "production").catch((error) => {
  console.error("Unexpected error:", error);
});
