import {
assert,
  assertEquals,
  assertFalse,
  assertThrows,
} from "https://deno.land/std@0.161.0/testing/asserts.ts";
import { ValidationError } from "./ValidationError.ts";

Deno.test("Does not throw if valid", () => {
  // Given
  const error = new ValidationError("1");
  error.check("BAD", () => true);

  // When
  error.throwErrorIfInvalid();

  // Then nothing
  assert(error.isValid());
});

Deno.test("Throws if invalid", () => {
  // Given
  const error = new ValidationError("1");
  error.check("BAD", () => false);

  // When
  assertFalse(error.isValid());
  assertThrows(() => error.throwErrorIfInvalid(), ValidationError);

  // Then nothing
});

Deno.test("Exports proper error codes", () => {
  // Given
  const error = new ValidationError("1");
  error.check("BAD", () => false);
  error.check("VERY_BAD", () => false);

  // When
  const errorCodes = error.exportErrorCodes();

  // Then
  assertEquals(errorCodes, ['BAD', 'VERY_BAD']);
});
