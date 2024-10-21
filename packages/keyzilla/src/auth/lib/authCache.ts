import fs from "fs";
import path from "path";
import os from "os";
import { UserData } from "../../types/userData";   
import { getErrorMessage } from "../../helpers/getError";
const CACHE_FILE = "keyzilla_auth_cache.json";
const AUDIT_FILE = "keyzilla_audit.json";

// this function returns the path to the cache file
// basic stuff
export function getCachePath(): string {
  return path.join(os.tmpdir(), CACHE_FILE);
}

// this function returns the path to the audit file
// basic stuff
export function getAuditPath(): string {
  return path.join(os.tmpdir(), AUDIT_FILE);
}

// this function saves the user data to the cache file
// if there is an error saving the file, it logs the error
// and asks the user to try again
export function saveAuthCache(userData: UserData): void {
  try {
    fs.writeFileSync(getCachePath(), JSON.stringify(userData));
  } catch (error) {
    getErrorMessage(error);
  }
}

// this function reads the user data from the cache file
// if the file does not exist, it returns null
// if there is an error reading the file, it logs the error and returns null
export function getAuthCache(): UserData | null {
  try {
    const data = fs.readFileSync(getCachePath(), "utf8");
    return JSON.parse(data) as UserData;
  } catch (error) {
    getErrorMessage(error);  
    return null;
  }
}

// this function clears the cache file
// it is used when the user logs out
// if there is an error clearing the file, it logs the error
export function clearAuthCache(): void {
  try {
    fs.unlinkSync(getCachePath());
  } catch (error) {
    getErrorMessage(error);  
  }
}

// this function saves the audit data to the audit file
// it is used to log the user's email and userId
export function saveAudit(credentials: {
  email: string;
  userId: string;
}): void {
  try {
    fs.writeFileSync(getAuditPath(), JSON.stringify(credentials));
  } catch (error) {
    getErrorMessage(error);  
  }
}

// this function checks if the user is authenticated
// by reading the cache file
// if the file exists, it returns the user data
// if the file does not exist, it returns null
export async function checkAuthentication(): Promise<UserData | null> {
  const cachedAuth = getAuthCache();
  if (cachedAuth) {
    return cachedAuth;
  }
  return null;
}