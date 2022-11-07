export class ValidationError<T> extends Error {
  private errorCodes: string[] = [];

  constructor(private entity: T) {
    super("Validation Error");
  }

  check(errorCode: string, callback: () => boolean) {
    if (!callback()) {
      this.errorCodes.push(errorCode);
    }
  }

  isValid(): boolean {
    return this.errorCodes.length <= 0;
  }

  throwErrorIfInvalid(): void {
    if (!this.isValid()) {
      throw new ValidationError(this);
    }
  }

  exportErrorCodes(): string[] {
    return this.errorCodes.slice(0);
  }
}
