
import { checkAuthentication } from "./lib/authCache";
import { authenticate } from "./index"

/**
 * Decorator to require authentication for a function
 * @param func - The function to decorate
 * @returns The decorated function
 * 
 * 
 * the authDecorator is a function that takes a function as an argument
 * and returns a new function that will check if the user is authenticated
 * if the user is not authenticated, it will authenticate the user
 * and then call the original function
 * if at any point the authentication fails, it will throw an error
 */
export function requireAuth<T extends (...args: any[]) => Promise<any>>(
  func: T
): (...args: Parameters<T>) => Promise<ReturnType<T>> {
  return async (...args: Parameters<T>): Promise<ReturnType<T>> => {
    let userData = await checkAuthentication();
    if (!userData) {
      if (process.env.NODE_ENV === "production") {
        userData = await authenticate(true);
      } else {
        userData = await authenticate(false);
      }
      if (!userData) {
        throw new Error("Authentication required");
      }
    }
    return func(...args);
  };
}
