export interface CrashReporter {
  // Erro tratado que merece aparecer no painel, como uma falha de banco.
  recordError(error: unknown, context?: string): void;
  log(message: string): void;
  setAttribute(name: string, value: string): void;
}
