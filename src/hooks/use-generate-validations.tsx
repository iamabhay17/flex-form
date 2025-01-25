import { z, ZodString, ZodType, ZodDate } from "zod";
import { useState, useEffect } from "react";
import { IFormField, useFormStore } from "@/store";

const createZodFieldSchema = (field: IFormField): ZodType<any> => {
  let fieldSchema: ZodType<any> = z.string({ message: "Invalid input" }); // Default schema

  // Determine schema based on field type and subType
  switch (field.type) {
    case "input":
      switch (field.subType) {
        case "email":
          fieldSchema = z.string().email({ message: "Enter a valid email" });
          break;
        case "number":
          fieldSchema = z.number({ message: "Enter a valid number" });
          break;
        case "text":
          fieldSchema = z.string({ message: "Enter a valid string" });
          break;
        case "password":
          fieldSchema = z
            .string()
            .min(8, { message: "Password must be at least 8 characters" });
          break;
        case "url":
          fieldSchema = z.string().url({ message: "Enter a valid URL" });
          break;
        default:
          throw new Error(`Unsupported input subtype: ${field.subType}`);
      }
      break;

    case "text-area":
      fieldSchema = z.string({ message: "Enter a valid string" });
      break;

    case "datetime":
      fieldSchema = z.date({ message: "Enter a valid date" });
      break;

    case "checkbox":
      fieldSchema = z.boolean({ message: "Select an option" });
      break;

    case "checkbox-group":
      fieldSchema = z.array(z.string({ message: "Select an option" }));
      break;

    case "radio-group":
    case "select":
      fieldSchema = z.string({ message: "Select an option" });
      break;

    default:
      throw new Error(`Unsupported field type: ${field.type}`);
  }

  //   // Apply optional validation if required
  //   if (field.validations?.required === false) {
  //     fieldSchema = fieldSchema.optional();
  //   }

  // Apply min, max, and regex validations
  switch (field.type) {
    case "input":
    case "text-area":
      if (["password", "text"].includes(field.subType || "")) {
        // Apply regex validation if pattern is provided
        if (field.validations?.pattern) {
          fieldSchema = (fieldSchema as ZodString).regex(
            new RegExp(field.validations.pattern),
            { message: "Enter a valid string" }
          );
        }
      }

      // Apply minLength validation
      if (field.validations?.minLength !== undefined) {
        fieldSchema = (fieldSchema as ZodString).min(
          field.validations.minLength,
          {
            message: `${field.title} must be at least ${field.validations.minLength} characters`,
          }
        );
      }

      // Apply maxLength validation
      if (field.validations?.maxLength !== undefined) {
        fieldSchema = (fieldSchema as ZodString).max(
          field.validations.maxLength,
          {
            message: `${field.title} must be at most ${field.validations.maxLength} characters`,
          }
        );
      }
      break;

    case "datetime":
      if (field.validations?.gte) {
        fieldSchema = (fieldSchema as ZodDate).min(
          new Date(field.validations.gte),
          {
            message: `Date must be on or after ${field.validations.gte}`,
          }
        );
      }
      if (field.validations?.lte) {
        fieldSchema = (fieldSchema as ZodDate).max(
          new Date(field.validations.lte),
          {
            message: `Date must be on or before ${field.validations.lte}`,
          }
        );
      }
      break;

    default:
      break;
  }

  return fieldSchema;
};

export const useGenerateValidations = () => {
  const store = useFormStore();
  const [fields, setFields] = useState<IFormField[]>([]);

  useEffect(() => {
    const fieldsFromStore = store.sections.flatMap((section) => section.fields);
    setFields(fieldsFromStore);
  }, [store.sections]);

  // Create Zod schema shape
  const schemaShape: Record<string, ZodType<any>> = {};

  fields.forEach((field) => {
    schemaShape[field.key] = createZodFieldSchema(field);
  });

  // Return the Zod schema object
  return z.object(schemaShape);
};
