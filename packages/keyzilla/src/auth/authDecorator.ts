import { checkAuthentication } from "./lib/authCache";
import { authenticate } from "./index";

export function requireAuth<T extends (...args: any[]) => Promise<any>>(
  func: T
): (...args: Parameters<T>) => Promise<ReturnType<T>> {
  return async (...args: Parameters<T>): Promise<ReturnType<T>> => {
    let userData = await checkAuthentication();
    if (!userData) {
      userData = await authenticate();
      if (!userData) {
        throw new Error("Authentication required");
      }
    }
    return func(...args);
  };
}