export interface ErrorResponse {
  error: string;
}

export type ErrorMessage<T extends string> = T;
