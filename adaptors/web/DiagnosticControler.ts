import {
  Response,
  Router,
} from "https://deno.land/x/oak@v11.1.0/mod.ts";
import { TodoListRepository } from "../../domain/TodoListRepository.ts";

function runMemoryDiagnostic() {
  if (Deno.systemMemoryInfo().free < 2000000) {
    throw new Error("Running low in memory: " + Deno.systemMemoryInfo().free);
  }
}

export class DiagnosticControler extends Router {
  constructor(private repo: TodoListRepository) {
    super();
    this.get("/diagnostic", (ctx) => {this.runDiagnostic(ctx.response)});
  }

  runDiagnostic(response: Response): void {
    const diagnostics = new Map<string, ()=>void>([
      ['repo', () => this.repo.runDiagnostic()],
      ['memory', () => runMemoryDiagnostic()]
    ]);

    let success = true;
    const results: Record<string, string> = {};

    diagnostics.forEach((callback, name) => {
      try {
        callback();
        results[name] = "SUCCESS";
      } catch(error) {
        console.warn(error);
        success = false;
        results[name] = "FAILED";
      }
    });

    response.status = success ? 200 : 500;
    response.body = results;
  }
}
