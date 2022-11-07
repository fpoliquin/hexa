import { assert, assertEquals } from "https://deno.land/std@0.152.0/testing/asserts.ts";
import { Application } from "https://deno.land/x/oak@v11.1.0/application.ts";
import { Todo } from "../../domain/Todo.ts";
import { TodoListRepository } from "../../domain/TodoListRepository.ts";
import { TodoListService } from "../../domain/TodoListService.ts";
import { InMemoryTodoListRepository } from "../dummy/InMemoryTodoListRepository.ts";
import { errorHandler } from "./ErrorHandler.ts";
import { TestControler } from "./TestControler.ts";
import { TodoListControler } from "./TodoListControler.ts";
import { parse } from "https://deno.land/std@0.162.0/flags/mod.ts";

Deno.test("Web Framework integration test", async (t) => {

  let todoServerUrl: string = parse(Deno.args)['serverUrl'];
  let server;

  if (!todoServerUrl) {
    todoServerUrl = "http://localhost:10000";
    server = startServer();
  }
  
  await t.step({
    name: "Test 404",
    sanitizeOps: false,
    sanitizeResources: false,
    fn: async () => {
      // When
      const response = await fetch(`${todoServerUrl}/doesnotexist`);
      await response.body?.cancel();

      // Then
      assertEquals(response.status, 404);
    },
  });


  await t.step({
    name: "Test 400",
    sanitizeOps: false,
    sanitizeResources: false,
    fn: async () => {
      // When
      const response = await fetch(`${todoServerUrl}/test/400`);
      const result = await response.json();

      // Then
      assertEquals(response.status, 400);
      assertEquals(result.errorCodes, ["TEST_CODE"]);
    },
  });

  await t.step({
    name: "Test 500",
    sanitizeOps: false,
    sanitizeResources: false,
    fn: async () => {
      // When
      const response = await fetch(`${todoServerUrl}/test/500`);
      const result = await response.json();

      // Then
      assertEquals(response.status, 500);
      assertEquals(result.errorCodes, ["UNKNOWN"]);
    },
  });

  await t.step({
    name: "Test Contrat Add Todo",
    sanitizeOps: false,
    sanitizeResources: false,
    fn: async () => {
      // When
      const response = await fetch(`${todoServerUrl}/todos/add?title=Test`);
      const result = await response.json();

      // Then
      assertEquals(response.status, 200);
      assert(result.idTodo);
      assertEquals(result.title, "Test");
    },
  });

  await t.step({
    name: "Test Contrat Load Todos",
    sanitizeOps: false,
    sanitizeResources: false,
    fn: async () => {
      // When
      const response = await fetch(`${todoServerUrl}/todos`);
      const result = await response.json();

      // Then
      assertEquals(response.status, 200);
      assert(result.todos.length > 0, "Todo list is empty" + result);
      assert(result.todos[0].idTodo, "idTodo is empty: " + JSON.stringify(result.todos[0], null, 2));
      assert(result.todos[0].title, "title is empty" + JSON.stringify(result.todos[0], null, 2));
    },
  });

  await server?.abort();
});

function startServer(): {abort: ()=>Promise<void>} {
  const todoListRepository: TodoListRepository =
    new InMemoryTodoListRepository();
  todoListRepository.addTodo(new Todo("1", "Test"));
  todoListRepository.addTodo(new Todo("2", "Test"));

  const todoListService = new TodoListService(todoListRepository);

  const app = new Application();
  app.use(errorHandler);
  app.use(new TodoListControler(todoListService).routes());
  app.use(new TestControler().routes());

  const controller = new AbortController();
  const server = app.listen({ port: 10000, signal: controller.signal });

  return {
    abort: async () => {
      controller.abort();
      await server;
    }
  }
}