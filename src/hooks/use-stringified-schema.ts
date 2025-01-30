import { IFormField, useFormStore } from "@/store";
import { useEffect, useState } from "react";

export const useStringifiedSchema = () => {
  const store = useFormStore();
  const [schemaString, setSchemaString] = useState<string>("");
  const [fields, setFields] = useState<IFormField[]>([]);

  useEffect(() => {
    // Extract fields from the store
    const fieldsFromStore = store.sections.flatMap((section) => section.fields);
    setFields(fieldsFromStore);
  }, [store.sections]);

  useEffect(() => {
    // Generate schema when fields are updated
    const schema = generateSchema(fields);
    setSchemaString(schema);
  }, [fields]);

  return schemaString;
};

const generateSchema = (fields: IFormField[]): string => {
  let schema = "import { z } from 'zod';\n";
  schema += `\nexport const schema = z.object({\n`;

  // Iterate through fields to generate schema lines
  fields.forEach((field) => {
    const { key, title, type, subType, validations } = field;
    let fieldSchema = `z`;

    // Determine base type
    switch (subType || type) {
      case "text":
      case "password":
      case "email":
      case "tel":
      case "url":
        fieldSchema += `.string()`;
        break;
      case "number":
        fieldSchema += `.number()`;
        break;
      case "checkbox":
        fieldSchema += `.boolean()`;
        break;
      case "checkbox-group":
        fieldSchema += `.array(z.string())`;
        break;
      case "datetime":
        fieldSchema += `.coerce.number()`;
        break;
      case "switch":
        fieldSchema += `.boolean()`;
        break;
      default:
        fieldSchema += `.string()`;
    }

    // Apply required validation
    if (validations?.required) {
      fieldSchema += `.min(1, { message: "${title} is required" })`;
    }

    // Apply specific validations
    if (validations?.min !== undefined && subType === "number") {
      fieldSchema += `.min(${validations.min}, { message: "${title} must be at least ${validations.min}" })`;
    }
    if (validations?.max !== undefined && subType === "number") {
      fieldSchema += `.max(${validations.max}, { message: "${title} must be at most ${validations.max}" })`;
    }
    if (validations?.minLength !== undefined && subType === "text") {
      fieldSchema += `.min(${validations.minLength}, { message: "${title} must have at least ${validations.minLength} characters" })`;
    }
    if (validations?.maxLength !== undefined && subType === "text") {
      fieldSchema += `.max(${validations.maxLength}, { message: "${title} must have at most ${validations.maxLength} characters" })`;
    }
    if (validations?.pattern) {
      fieldSchema += `.regex(/${validations.pattern}/, { message: "Invalid ${title}" })`;
    }
    if (validations?.minItems !== undefined && type === "checkbox-group") {
      fieldSchema += `.min(${validations.minItems}, { message: "Select at least ${validations.minItems} items" })`;
    }
    if (validations?.maxItems !== undefined && type === "checkbox-group") {
      fieldSchema += `.max(${validations.maxItems}, { message: "Select at most ${validations.maxItems} items" })`;
    }
    if (validations?.gte !== undefined && type === "datetime") {
      fieldSchema += `.min(new Date(${JSON.stringify(
        validations.gte
      )}), { message: "${title} must be on or after ${validations.gte}" })`;
    }
    if (validations?.lte !== undefined && type === "datetime") {
      fieldSchema += `.max(new Date(${JSON.stringify(
        validations.lte
      )}), { message: "${title} must be on or before ${validations.lte}" })`;
    }
    if (!validations?.required) {
      fieldSchema += `.optional()`;
    }

    // Add the field schema to the output
    schema += `\t${key} : ${fieldSchema};\n`;
  });

  schema += `});\n`;
  return schema;
};
