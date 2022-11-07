import { Todo } from "./Todo.ts";

export interface TodoListRepository {
  loadTodos(): Todo[];
  addTodo(todo: Todo): void;
  runDiagnostic(): void;
}
