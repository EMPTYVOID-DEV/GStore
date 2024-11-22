import { z } from "zod";
 
export const formSchema = z.object({
    key: z.string().min(1, "API key is required")
});
 
export type FormSchema = typeof formSchema;