import { Todo } from "../../domain/Todo.ts";
import { TodoListRepository } from "../../domain/TodoListRepository.ts";

export class InMemoryTodoListRepository implements TodoListRepository {
  private readonly todos: Todo[] = [];

  loadTodos(): Todo[] {
    return this.todos.slice(0);
  }

  addTodo(todo: Todo): void {
    this.todos.push(todo);
  }

  runDiagnostic(): void {
      
  }
}
