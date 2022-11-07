import { Todo } from "./Todo.ts";
import { TodoListRepository } from "./TodoListRepository.ts";

export class TodoListService {
  constructor(private todoListRepositoy: TodoListRepository) {
  }

  loadTodos(): Todo[] {
    return this.todoListRepositoy.loadTodos();
  }

  addTodo(title: string): Todo {
    const todo = Todo.createNew(title);

    todo.checkValidity();

    this.todoListRepositoy.addTodo(todo);

    return todo;
  }
}
