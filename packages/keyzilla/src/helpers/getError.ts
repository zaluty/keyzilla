// this function returns the error message
// it is used to get the error message from an unknown error
// it was meant to be used to get the error and log it to sentry but the bundle size was too big around 5mb
// so we decided to remove it 
// if you have any suggestion for a for a good error logging software open an issue with an `enhancement` label at https://github.com/zaluty/keyzilla/issues/new 

export function getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
        return error.message;
    }
    return String(error);
}
