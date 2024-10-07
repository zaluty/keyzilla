import fs from "fs";
import path from "path";
import os from "os";
import { UserData } from "../../types/userData";   
import { getErrorMessage } from "../../helpers/getError";
const CACHE_FILE = "keyzilla_auth_cache.json";
const AUDIT_FILE = "keyzilla_audit.json";

export function getCachePath(): string {
  return path.join(os.tmpdir(), CACHE_FILE);
}

export function getAuditPath(): string {
  return path.join(os.tmpdir(), AUDIT_FILE);
}

export function saveAuthCache(userData: UserData): void {
  try {
    fs.writeFileSync(getCachePath(), JSON.stringify(userData));
  } catch (error) {
    getErrorMessage(error);
  }
}

export function getAuthCache(): UserData | null {
  try {
    const data = fs.readFileSync(getCachePath(), "utf8");
    return JSON.parse(data) as UserData;
  } catch (error) {
    getErrorMessage(error);  
    return null;
  }
}

export function clearAuthCache(): void {
  try {
    fs.unlinkSync(getCachePath());
  } catch (error) {
    getErrorMessage(error);  
  }
}

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

export async function checkAuthentication(): Promise<UserData | null> {
  const cachedAuth = getAuthCache();
  if (cachedAuth) {
    return cachedAuth;
  }
  return null;
}