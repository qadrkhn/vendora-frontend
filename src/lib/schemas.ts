import * as z from "zod";

export const CategoryFormSchema = z.object({
  name: z
    .string({
      invalid_type_error: "Name must be a string.",
      required_error: "Name is required.",
    })
    .min(2, { message: "Name must be at least 2 characters long." })
    .max(50, { message: "Name can not have more than 50 characters." })
    .regex(/^[a-zA-Z0-9\s]+$/, {
      message: "Only letters, numbers and spaces are allowed in Name.",
    }),
  file: z
    .object({
      id: z.number(),
      url: z.string(),
    })
    .array()
    .length(1, { message: "Choose at least 1 image." }),
  url: z
    .string({
      invalid_type_error: "URL must be a string.",
      required_error: "URL is required.",
    })
    .min(2, { message: "URL must be at least 2 characters long." })
    .max(255, { message: "URL can not have more than 50 characters." })
    .regex(/^(?!.*(?:[-_]){2,})[a-zA-Z0-9_-]+$/, {
      message:
        "Only letters, numbers, hyphen and underscore are allowed in URL. Also consecutive occurances of hyphens, underscores and spaces are not allowed.",
    }),
  featured: z.boolean(),
});
