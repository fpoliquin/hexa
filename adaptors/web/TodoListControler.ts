import {
  Response,
  Router,
} from "https://deno.land/x/oak@v11.1.0/mod.ts";
import { Todo } from "../../domain/Todo.ts";
import { TodoListService } from "../../domain/TodoListService.ts";


export type TodoWebDto = {
  idTodo: string,
  title: string
};

export type TodoListWebDto = {
  todoCount: number,
  todos: TodoWebDto[]
}

export function todoToDto(todo: Todo): TodoWebDto {
  return {
    idTodo: todo.exportId(),
    title: todo.exportTitle()
  }
}

export function todoListToDto(todos: Todo[]): TodoListWebDto {
  return {
    todoCount: todos.length,
    todos: todos.map(todoToDto)
  }
}

export class TodoListControler extends Router {
  constructor(private todoListService: TodoListService) {
    super();
    this.get("/", (ctx) => ctx.response.body = "Welcome");
    this.get("/todos", (context) => this.loadTodos(context.response));
    this.get(
      "/todos/add",
      (context) => this.addTodo(context.request.url.searchParams, context.response),
    );
  }

  loadTodos(response: Response): void {
    const todos = this.todoListService.loadTodos();
    response.body = todoListToDto(todos);
  }

  addTodo(params: URLSearchParams, response: Response): void {
    const todo = this.todoListService.addTodo(params.get('title') || '');
    response.body = todoToDto(todo);
  }
}
