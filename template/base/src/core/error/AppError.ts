import type { ErrorCode } from '@core/error/error-codes';

export class AppError extends Error {
  readonly code: ErrorCode;
  readonly details?: string;
  readonly hint?: string;
  override readonly cause?: unknown;

  constructor({
    code,
    message,
    details,
    hint,
    cause,
  }: {
    code: ErrorCode;
    message: string;
    details?: string;
    hint?: string;
    cause?: unknown;
  }) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.details = details;
    this.hint = hint;
    this.cause = cause;
  }
}
