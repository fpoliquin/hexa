import { DB } from "https://deno.land/x/sqlite@v3.7.0/mod.ts";
import { Todo } from "../../domain/Todo.ts";
import { TodoListRepository } from "../../domain/TodoListRepository.ts";

export class SQLiteTodoListRepository implements TodoListRepository {
  public static open(databaseFilename: string): SQLiteTodoListRepository {
    const db = new DB(databaseFilename);

    db.execute(`
      CREATE TABLE IF NOT EXISTS todos (
        idTodo VARCHAR(100) PRIMARY KEY,
        title VARCHAR(200)
      )
    `);

    return new SQLiteTodoListRepository(db);
  }

  constructor(private readonly db: DB) {
  }

  loadTodos(): Todo[] {
    return this.db.query("SELECT idTodo, title FROM todos")
      .map(record => new Todo(record[0] as string, record[1] as string));
  }

  addTodo(todo: Todo): void {
    this.db.query("INSERT INTO todos (idTodo, title) VALUES (?, ?)", [todo.exportId(), todo.exportTitle()]);
  }

  runDiagnostic(): void {
      this.db.query("select idTodo, title from todos limit 1");
  }

  close(): void {
    this.db.close();
  }
}
