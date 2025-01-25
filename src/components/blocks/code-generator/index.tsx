"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CodeBlock } from "@/components/ui/code-block";
import { CodePreview } from "@/components/ui/code-preview";
import { useStringifiedSchema } from "@/hooks/use-stringified-schema";
import { type IFormField, useFormStore } from "@/store";
import { FieldTypes } from "@/components/blocks/app-sidebar/sidebar-const";
import { generateCompleteCode } from "@/hooks/useGetFormCode";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      duration: 0.3,
      ease: "easeOut",
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 30,
    },
  },
};

export const CodeGenerator = () => {
  return (
    <motion.div
      className="w-full mb-16 p-6 space-y-12"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Installation Guide Section */}
      <motion.div className="space-y-4" variants={itemVariants}>
        <h1 className="text-3xl font-bold tracking-tight">
          Installation Guide
        </h1>
        <InstallationSteps />
      </motion.div>

      {/* Generated Code Section */}
      <motion.div className="space-y-4" variants={itemVariants}>
        <h1 className="text-3xl font-bold tracking-tight">Generated Code</h1>
        <p className="text-muted-foreground text-sm">
          Copy and paste the code below into your project.
        </p>
        <GeneratedCode />
      </motion.div>
    </motion.div>
  );
};

const InstallationSteps = () => {
  const store = useFormStore();
  const [fields, setFields] = useState<IFormField[]>([]);

  useEffect(() => {
    const fieldsFromStore = store.sections.flatMap((section) => section.fields);
    setFields(fieldsFromStore);
  }, [store.sections]);

  const initialize = "npx shadcn@latest init";
  const installZod = "npm install zod react-hook-form";
  const installComponents = getComponentsInstallationCode(fields);

  return (
    <motion.ol className="list-none space-y-8" variants={containerVariants}>
      <motion.li variants={itemVariants} className="space-y-3">
        <div className="flex items-center gap-3">
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-muted-foreground font-medium">
            1
          </span>
          <span className="text-sm font-medium">
            Initialize the project with shadcn/ui using the following command:
          </span>
        </div>
        <div className="">
          <CodeBlock code={initialize} />
        </div>
      </motion.li>

      <motion.li variants={itemVariants} className="space-y-3">
        <div className="flex items-center gap-3">
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-muted-foreground font-medium">
            2
          </span>
          <span className="text-sm font-medium">
            Install required dependencies:
          </span>
        </div>
        <div className="">
          <CodeBlock code={installZod} />
        </div>
      </motion.li>

      <motion.li variants={itemVariants} className="space-y-3">
        <div className="flex items-center gap-3">
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-muted-foreground font-medium">
            3
          </span>
          <span className="text-sm font-medium">
            Add the required components:
          </span>
        </div>
        <div className="">
          <CodeBlock code={installComponents} />
        </div>
      </motion.li>
    </motion.ol>
  );
};

const GeneratedCode = () => {
  const store = useFormStore();
  const validations = useStringifiedSchema();
  const code = generateCompleteCode(store);

  const files = {
    form: {
      name: "form.tsx",
      code: code,
      highlightLines: [6, 7, 8, 9, 10],
    },
    validations: {
      name: "validations.tsx",
      code: validations,
      highlightLines: [3, 1000],
    },
  };

  return (
    <motion.div
      variants={itemVariants}
      className="rounded-lg bg-card text-card-foreground"
    >
      <CodePreview files={files} activePage="form" />
    </motion.div>
  );
};

const getComponentsInstallationCode = (fields: IFormField[]): string => {
  let command = "npx shadcn@latest add form ";
  const uniqueComponents = new Set<string>();

  fields.forEach((field) => {
    switch (field.type) {
      case FieldTypes.INPUT:
        uniqueComponents.add("input");
        break;
      case FieldTypes.TEXT_AREA:
        uniqueComponents.add("textarea");
        break;
      case FieldTypes.DATE_TIME:
        uniqueComponents.add("calendar popover");
        break;
      case FieldTypes.CHECKBOX:
      case FieldTypes.CHECKBOX_GROUP:
        uniqueComponents.add("checkbox");
        break;
      case FieldTypes.RADIO_GROUP:
        uniqueComponents.add("radio-group");
        break;
      case FieldTypes.SELECT:
        uniqueComponents.add("select");
        break;
      case FieldTypes.SWITCH:
        uniqueComponents.add("switch");
        break;
      case FieldTypes.COMBOBOX:
        uniqueComponents.add("combobox");
        break;
      default:
        console.warn(`Unknown field type: ${field.type}`);
        break;
    }
  });

  if (uniqueComponents.size > 0) {
    command += Array.from(uniqueComponents).join(" ");
  } else {
    command += "input textarea"; // Default components if no fields are selected
  }

  return command;
};
