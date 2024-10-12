// this function returns the error message
// it is used to get the error message from an unknown error
// it was meant to be used to get the error and log it to sentry but the bundle size was too big around 5mb
// so we decided to remove it
export function getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
        return error.message;
    }
    return String(error);
}