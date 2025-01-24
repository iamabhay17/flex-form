import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CodeBlock } from "@/components/ui/code-block";

export const CodeGenerator = () => {
  return (
    <div className="w-full h-[80vh] p-4 space-y-8">
      {/* Installation Guide Section */}
      <div className="space-y-3">
        <h1 className="text-2xl font-bold">Installation Guide</h1>
        <p className="text-muted-foreground">
          Follow the steps below to install the blocks in your project.
        </p>
        <InstallationSteps />
      </div>

      {/* Generated Code Section */}
      <div className="space-y-3">
        <h1 className="text-2xl font-bold">Generated Code</h1>
        <p className="text-muted-foreground">
          Copy and paste the code below into your project.
        </p>
        <GeneratedCode />
      </div>
    </div>
  );
};

const InstallationSteps = () => {
  return (
    <ol className="list-decimal list-inside space-y-2 text-gray-600">
      <li>
        Install the required dependencies using{" "}
        <code className="bg-gray-100 px-1 py-0.5 rounded">npm install</code>.
      </li>
      <li>Import the components into your project files.</li>
      <li>Use the components in your application as needed.</li>
    </ol>
  );
};

const GeneratedCode = () => {
  const componentCode = {
    codeBlock: getCode(),
    validations: getValidations(),
  };

  return (
    <div>
      <Tabs defaultValue="component" className="space-y-4">
        {/* Tab Triggers */}
        <TabsList>
          <TabsTrigger value="component">form.tsx</TabsTrigger>
          <TabsTrigger value="validations">validations.tsx</TabsTrigger>
        </TabsList>

        {/* Tab Contents */}
        <TabsContent value="component">
          <CodeBlock
            language="typescript"
            filename="form.tsx"
            code={componentCode.codeBlock}
            highlightLines={[6, 7, 8, 9, 10]}
          />
        </TabsContent>
        <TabsContent value="validations">
          <CodeBlock
            language="typescript"
            filename="validations.tsx"
            code={componentCode.validations}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Function to get the code for form.tsx
const getCode = (): string => {
  return `
import React from 'react';
import { useForm } from 'react-hook-form';

export const FormComponent = () => {
  const { register, handleSubmit } = useForm();

  const onSubmit = (data: any) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="name">Name</label>
        <input id="name" {...register('name')} />
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};
`.trim();
};

// Function to get the validations for validations.tsx
const getValidations = (): string => {
  return `
import * as z from 'zod';

export const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
});
`.trim();
};
