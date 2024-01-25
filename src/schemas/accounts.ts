import * as z from "zod";

export const NewDematAccountSchema = z.object({
  id: z.string(),
  name: z.string().min(1, {
    message: "Name is required",
  }),
  code: z.string().min(1, {
    message: "Code is required",
  }),
  broker: z.string().min(1, {
    message: "Broker is required",
  }),
});
