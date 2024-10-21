import fs from "fs";
import { getAuditPath, getCachePath } from "../../auth/lib/authCache";

export function deleteTempFiles(): void {
  deleteFile(getCachePath());
  deleteFile(getAuditPath());
}

function deleteFile(filePath: string): void {
  try {
    fs.unlinkSync(filePath);
    console.log(`✅ Successfully deleted authentication cache`);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      console.log(`❌ Authentication cache already deleted`);
    } else {
      console.error(`❌ Error deleting ${filePath}:`, error);
    }
  }
}

export function clearAuthData(): void {
  deleteTempFiles();
  console.log("All temporary authentication data has been cleared.");
}

// Function to check if the user is already logged out
export async function isAlreadyLoggedOut(): Promise<boolean> {
  return !fs.existsSync(getCachePath());
}