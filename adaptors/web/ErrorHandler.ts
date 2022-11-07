import { Context } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import { ValidationError } from "../../domain/ValidationError.ts";

export const errorHandler = async (
  ctx: Context<Record<string, unknown>, Record<string, unknown>>,
  next: () => Promise<unknown>,
) => {
  try {
    await next();
  } catch (error) {
    console.info("Handling error...");
    if (error instanceof ValidationError) {
      ctx.response.status = 400;
      ctx.response.body = {
        errorCodes: error.exportErrorCodes(),
      };
    } else {
      ctx.response.status = 500;
      ctx.response.body = {
        errorCodes: ["UNKNOWN"],
      };
    }
  }
};
