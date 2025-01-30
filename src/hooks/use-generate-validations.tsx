import { IFormField, useFormStore } from "@/store";
import { format } from "date-fns";
import { useMemo } from "react";
import { z } from "zod";
const createZodFieldSchema = (field: IFormField): z.ZodType<any> => {
  let fieldSchema: z.ZodType<any>;

  // Base schema based on field type
  switch (field.type) {
    case "input":
      switch (field.subType) {
        case "email":
          fieldSchema = z.string().email("Please enter a valid email address");
          if (field.validations.pattern) {
            fieldSchema = (fieldSchema as z.ZodString).regex(
              new RegExp(field.validations.pattern),
              {
                message: `${field.title} must match the required pattern`,
              }
            );
          }
          break;
        case "number":
          fieldSchema = z
            .string()
            .transform((val) => (val === "" ? undefined : Number(val)))
            .pipe(
              z.number({
                invalid_type_error: "Please enter a valid number",
                required_error: "This field is required",
              })
            );
          if (field.validations.min !== undefined) {
            fieldSchema = (fieldSchema as z.ZodNumber).min(
              field.validations.min,
              {
                message: `${field.title} must be at least ${field.validations.min}`,
              }
            );
          }
          if (field.validations.max !== undefined) {
            fieldSchema = (fieldSchema as z.ZodNumber).max(
              field.validations.max,
              {
                message: `${field.title} must be at most ${field.validations.max}`,
              }
            );
          }
          break;
        case "text":
        case "password":
          fieldSchema = z.string();
          if (field.validations.pattern) {
            fieldSchema = (fieldSchema as z.ZodString).regex(
              new RegExp(field.validations.pattern),
              {
                message: `${field.title} must match the required pattern`,
              }
            );
          }
          if (field.validations.minLength !== undefined) {
            fieldSchema = (fieldSchema as z.ZodString).min(
              field.validations.minLength,
              {
                message: `${field.title} must be at least ${field.validations.minLength} characters`,
              }
            );
          }
          if (field.validations.maxLength !== undefined) {
            fieldSchema = (fieldSchema as z.ZodString).max(
              field.validations.maxLength,
              {
                message: `${field.title} must be at most ${field.validations.maxLength} characters`,
              }
            );
          }
          break;
        case "tel":
        case "url":
          fieldSchema = z.string();
          break;
        default:
          fieldSchema = z.string();
      }
      break;

    case "text-area":
      fieldSchema = z.string();
      if (field.validations.minLength !== undefined) {
        fieldSchema = (fieldSchema as z.ZodString).min(
          field.validations.minLength,
          {
            message: `${field.title} must be at least ${field.validations.minLength} characters`,
          }
        );
      }
      if (field.validations.maxLength !== undefined) {
        fieldSchema = (fieldSchema as z.ZodString).max(
          field.validations.maxLength,
          {
            message: `${field.title} must be at most ${field.validations.maxLength} characters`,
          }
        );
      }
      break;

    case "datetime":
      fieldSchema = z.coerce.number();
      if (field.validations.gte) {
        fieldSchema = (fieldSchema as any).gte(field.validations.gte, {
          message: `${field.title} must be after ${format(
            new Date(field.validations.gte),
            "dd-MMM-yyyy"
          )}`,
        });
      }
      if (field.validations.lte) {
        fieldSchema = (fieldSchema as any).lte(field.validations.lte, {
          message: `${field.title} must be before ${format(
            new Date(field.validations.lte),
            "dd-MMM-yyyy"
          )}`,
        });
      }
      break;

    case "checkbox":
      fieldSchema = z.boolean();
      break;

    case "checkbox-group":
      fieldSchema = z.array(z.string());
      if (field.validations.minItems !== undefined) {
        fieldSchema = (fieldSchema as z.ZodArray<z.ZodAny>).min(
          field.validations.minItems,
          {
            message: `Please select at least ${field.validations.minItems} options`,
          }
        );
      }
      if (field.validations.maxItems !== undefined) {
        fieldSchema = (fieldSchema as z.ZodArray<z.ZodAny>).max(
          field.validations.maxItems,
          {
            message: `Please select at most ${field.validations.maxItems} options`,
          }
        );
      }
      break;

    case "radio-group":
    case "select":
      fieldSchema = z.string();
      break;
    case "switch":
      fieldSchema = z.boolean();
      break;
    default:
      fieldSchema = z.string();
  }

  // Apply required validation
  if (!field.validations.required) {
    fieldSchema = fieldSchema.optional();
  }

  return fieldSchema;
};

export const useGenerateValidations = (): z.ZodObject<any> => {
  const store = useFormStore();

  const schema = useMemo(() => {
    try {
      const fields = store.sections.flatMap((section) => section.fields);
      const schemaShape: Record<string, z.ZodType<any>> = {};

      fields.forEach((field) => {
        schemaShape[field.key] = createZodFieldSchema(field);
      });

      return z.object(schemaShape);
    } catch (error) {
      console.error("Error generating validations:", error);
      return z.object({});
    }
  }, [store.sections]);

  return schema;
};
