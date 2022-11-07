import { ValidationError } from "./ValidationError.ts";

export class Todo {
  public static createNew(title: string): Todo {
    return new Todo(crypto.randomUUID(), title);
  }

  constructor(private idTodo: string, private title: string) {
  }

  checkValidity(): void {
    const validationError = new ValidationError(this);

    validationError.check("TODO_ID_MANDATORY", () => !!this.idTodo);
    validationError.check("TODO_TITLE_MANDATORY", () => !!this.title);

    validationError.throwErrorIfInvalid();
  }

  exportId(): string {
    return this.idTodo;
  }

  exportTitle(): string {
    return this.title;
  }
}
