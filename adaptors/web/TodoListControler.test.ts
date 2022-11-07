import { assertEquals } from "https://deno.land/std@0.152.0/testing/asserts.ts";
import { Todo } from "../../domain/Todo.ts";
import { todoListToDto, todoToDto } from "./TodoListControler.ts";

Deno.test("Test todoToDto", () => {
  // Given
  const todo = new Todo("1", "Test");

  // When
  const dto = todoToDto(todo);

  // Then
  assertEquals(dto.idTodo, "1");
  assertEquals(dto.title, "Test");
});

Deno.test("Test todoListToDto", () => {
  // Given
  const todo1 = new Todo("1", "Test");
  const todo2 = new Todo("2", "Test");
  const todoList = [todo1, todo2];

  // When
  const dto = todoListToDto(todoList);

  // Then
  assertEquals(dto.todoCount, 2);
  assertEquals(dto.todos.length, 2);
  assertEquals(dto.todos[0].idTodo, "1");
  assertEquals(dto.todos[0].title, "Test");
});
