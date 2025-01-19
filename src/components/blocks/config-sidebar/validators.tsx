import { FieldTypes } from "@/components/blocks/app-sidebar/sidebar-const";
import { z } from "zod";

export const sectionValidator = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  grid: z.string().min(1, { message: "Grid is required" }),
});

export const fieldValidator = z
  .object({
    title: z.string().min(1, { message: "Label is required" }),
    description: z.string().min(1, { message: "Description is required" }),
    type: z.string().min(1, { message: "Type is required" }),
    options: z.array(z.string().min(1, { message: "Required" })).optional(),
    key: z.string().min(1, { message: "Key is required" }),
    subType: z
      .enum(["text", "number", "email", "password", "tel", "url"])
      .optional()
      .default("text"),
    validations: z.object({
      required: z.boolean().optional().default(false),
      min: z.number().optional().default(0),
      max: z.number().optional(),
      minLength: z.number().optional().default(0),
      maxLength: z.number().optional(),
      pattern: z.string().optional(),
    }),
  })
  .superRefine((values, ctx) => {
    if (
      [
        FieldTypes.SELECT,
        FieldTypes.CHECKBOX_GROUP,
        FieldTypes.RADIO_GROUP,
      ].includes(values.type)
    ) {
      if (values.options?.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Options are required",
          path: ["options"],
        });
      }
    }
  });
