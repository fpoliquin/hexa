import { assert } from "https://deno.land/std@0.161.0/testing/asserts.ts";
import { Todo } from "../../domain/Todo.ts";
import { SQLiteTodoListRepository } from "./sqlite.ts";

Deno.test("Test add todo", () => {
  // Given
  const repo = SQLiteTodoListRepository.open("tests.db");

  // When
  repo.addTodo(Todo.createNew("Test"));

  repo.close();
});

Deno.test("Test load todos", () => {
  // Given
  const repo = SQLiteTodoListRepository.open("tests.db");
  repo.addTodo(Todo.createNew("Test"));

  // When
  const todos = repo.loadTodos();

  repo.close();

  // Then
  assert(todos.length > 0);
  assert(!!todos[0].exportId());
  assert(!!todos[0].exportTitle());
});
