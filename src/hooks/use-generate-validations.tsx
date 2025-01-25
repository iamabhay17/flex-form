import { IFormField, useFormStore } from "@/store";
import { useMemo } from "react";
import { z, ZodDate, ZodString, ZodType } from "zod";

const createZodFieldSchema = (field: IFormField): ZodType<any> => {
  let fieldSchema: ZodType<any>;

  // Determine base schema based on field type and subType
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
        case "password":
        case "url":
          fieldSchema = z.string({ message: "Enter a valid string" });
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
      fieldSchema = z.boolean({ message: "This field is required" });
      break;

    case "checkbox-group":
      fieldSchema = z.array(z.string({ message: "Select a valid option" }));
      break;

    case "radio-group":
    case "select":
      fieldSchema = z.string({ message: "Select an option" });
      break;

    default:
      throw new Error(`Unsupported field type: ${field.type}`);
  }

  if (!fieldSchema) {
    throw new Error(`Failed to create schema for field: ${field.key}`);
  }

  // Apply validations
  const { validations } = field;
  if (validations) {
    // Required
    if (validations.required === false) {
      fieldSchema = fieldSchema.optional();
    }

    // Min and Max for Strings or Arrays
    if (validations.minLength !== undefined) {
      fieldSchema = (fieldSchema as ZodString).min(validations.minLength, {
        message: `${field.title} must be at least ${validations.minLength} characters`,
      });
    }
    if (validations.maxLength !== undefined) {
      fieldSchema = (fieldSchema as ZodString).max(validations.maxLength, {
        message: `${field.title} must be at most ${validations.maxLength} characters`,
      });
    }

    // Min and Max for Strings or Arrays
    if (validations.minItems !== undefined) {
      fieldSchema = (fieldSchema as ZodString).min(validations.minItems, {
        message: `${field.title} must be at least ${validations.minItems} characters`,
      });
    }
    if (validations.maxItems !== undefined) {
      fieldSchema = (fieldSchema as ZodString).max(validations.maxItems, {
        message: `${field.title} must be at most ${validations.maxItems} characters`,
      });
    }

    // Regex Pattern (for Strings)
    if (validations.pattern) {
      fieldSchema = (fieldSchema as ZodString).regex(
        new RegExp(validations.pattern),
        { message: `${field.title} must match the required pattern` }
      );
    }

    // Min and Max for Numbers
    if (field.type === "input" && field.subType === "number") {
      if (validations.min !== undefined) {
        fieldSchema = (fieldSchema as z.ZodNumber).min(validations.min, {
          message: `${field.title} must be at least ${validations.min}`,
        });
      }
      if (validations.max !== undefined) {
        fieldSchema = (fieldSchema as z.ZodNumber).max(validations.max, {
          message: `${field.title} must be at most ${validations.max}`,
        });
      }
    }

    // Min and Max for Dates
    if (field.type === "datetime") {
      if (validations.gte) {
        fieldSchema = (fieldSchema as ZodDate).min(new Date(validations.gte), {
          message: `${field.title} must be on or after ${validations.gte}`,
        });
      }
      if (validations.lte) {
        fieldSchema = (fieldSchema as ZodDate).max(new Date(validations.lte), {
          message: `${field.title} must be on or before ${validations.lte}`,
        });
      }
    }
  }

  return fieldSchema;
};

export const useGenerateValidations = () => {
  const store = useFormStore();

  // Compute fields using memoization for performance
  const fields = useMemo(() => {
    return store.sections.flatMap((section) => section.fields);
  }, [store.sections]);

  try {
    // Build the schema shape dynamically
    const schemaShape: Record<string, ZodType<any>> = {};
    fields.forEach((field) => {
      schemaShape[field.key] = createZodFieldSchema(field);
    });

    // Return the generated Zod schema
    return z.object(schemaShape);
  } catch (error) {
    console.error("Error generating validations:", error);
    // Return an empty schema as fallback to prevent application crash
    return z.object({});
  }
};
