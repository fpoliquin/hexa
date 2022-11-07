import { assertThrows } from "https://deno.land/std@0.161.0/testing/asserts.ts";
import { Todo } from "./Todo.ts";
import { ValidationError } from "./ValidationError.ts";

Deno.test("Todo title is mandatory", () => {
  // Given
  const todo = Todo.createNew("");

  // When
  assertThrows(() => todo.checkValidity(), ValidationError);
});
