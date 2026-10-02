/**
 * Error codes the API can return. Clients switch on these exhaustively,
 * so adding a code is a deliberate, type-checked change.
 */
export const ERROR_CODES = [
  'VALIDATION_FAILED',
  'UNAUTHENTICATED',
  'TOKEN_EXPIRED',
  'FORBIDDEN',
  'NOT_FOUND',
  'CONFLICT',
  'RATE_LIMITED',
  'INTERNAL_ERROR',
  'SERVICE_UNAVAILABLE',
] as const;

export type ErrorCode = (typeof ERROR_CODES)[number];

export interface FieldError {
  path: string;
  message: string;
}

export interface ApiErrorBody {
  code: ErrorCode;
  message: string;
  details: Record<string, unknown>;
}

export interface PageMeta {
  nextCursor: string | null;
  limit: number;
}

export interface ApiSuccess<TData, TMeta = undefined> {
  success: true;
  data: TData;
  meta?: TMeta;
  requestId: string;
}

export interface ApiFailure {
  success: false;
  error: ApiErrorBody;
  requestId: string;
}

export type ApiResponse<TData, TMeta = undefined> = ApiSuccess<TData, TMeta> | ApiFailure;

export function isApiFailure<TData, TMeta>(
  response: ApiResponse<TData, TMeta>,
): response is ApiFailure {
  return !response.success;
}
