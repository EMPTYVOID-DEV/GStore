import { z, ZodSchema } from "zod";
import type { ActionStatus } from "./types";

export const urlSchema = z
  .string()
  .url({ message: "This must be a url" })
  .refine((path) => !path.endsWith("/"), {
    message: 'Url must not end with a "/"',
  });

export const pageIndexSchema = z
  .string()
  .nonempty()
  .refine(
    (val) => {
      const num = Number(val);
      return !isNaN(num) && num >= 0;
    },
    { message: "Must be a number that is biggger or equal to zero" }
  );

export const pageSizeSchema = z
  .string()
  .nonempty()
  .refine(
    (val) => {
      const num = Number(val);
      return !isNaN(num) && num > 0;
    },
    { message: "Must be a number that is bigger than zero" }
  );

export function getValidator(
  schema: ZodSchema
): (text: string) => ActionStatus {
  return (text: string) => {
    const parseResult = schema.safeParse(text);
    if (parseResult.success == true) return { state: "valid", errorMsg: "" };
    else
      return {
        state: "invalid",
        errorMsg: parseResult.error.errors[0].message,
      };
  };
}
