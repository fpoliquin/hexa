import { assertEquals } from "https://deno.land/std@0.161.0/testing/asserts.ts";
import { TodoListService } from "./TodoListService.ts";
import { InMemoryTodoListRepository } from "../adaptors/dummy/InMemoryTodoListRepository.ts";
import { Todo } from "./Todo.ts";

Deno.test("Test load todos", () => {
  // Given
  const repo = new InMemoryTodoListRepository();
  repo.addTodo(new Todo("1", "Test 1"));
  repo.addTodo(new Todo("2", "Test 2"));
  const service = new TodoListService(repo);

  // When
  const todos = service.loadTodos();

  // Then
  assertEquals(todos.length, 2);
  assertEquals(todos[0].exportId(), "1");
  assertEquals(todos[1].exportId(), "2");
});

Deno.test("Test add todo", () => {
  // Given
  const repo = new InMemoryTodoListRepository();
  const service = new TodoListService(repo);

  // When
  service.addTodo("Do something");

  // Then
  assertEquals(repo.loadTodos().length, 1);
});
