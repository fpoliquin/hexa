import {
  Router,
} from "https://deno.land/x/oak@v11.1.0/mod.ts";
import { ValidationError } from "../../domain/ValidationError.ts";


export class TestControler extends Router {
  constructor() {
    super();
    const validationError = new ValidationError("This is bad.");
    validationError.check('TEST_CODE', () => false);

    this.get("/test/400", () => {throw validationError});
    this.get("/test/500", () => {throw new Error("This is bad.")});
  }
}
