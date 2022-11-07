import { Application } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import { InMemoryTodoListRepository } from "./adaptors/dummy/InMemoryTodoListRepository.ts";
import { SQLiteTodoListRepository } from "./adaptors/sqlite/sqlite.ts";
import { DiagnosticControler } from "./adaptors/web/DiagnosticControler.ts";
import { errorHandler } from "./adaptors/web/ErrorHandler.ts";
import { TestControler } from "./adaptors/web/TestControler.ts";
import { TodoListControler } from "./adaptors/web/TodoListControler.ts";
import { Todo } from "./domain/Todo.ts";
import { TodoListRepository } from "./domain/TodoListRepository.ts";
import { TodoListService } from "./domain/TodoListService.ts";

let todoListRepository: TodoListRepository = new InMemoryTodoListRepository();
todoListRepository.addTodo(new Todo('1', 'Test'));
todoListRepository = SQLiteTodoListRepository.open('main.db');

const todoListService = new TodoListService(todoListRepository);

const app = new Application();
app.use(errorHandler);
app.use(new TodoListControler(todoListService).routes());
app.use(new TestControler().routes());
app.use(new DiagnosticControler(todoListRepository).routes());

app.listen({ port: 8000 });
