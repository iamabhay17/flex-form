"use client";

import { FC, useState } from "react";
import { cn } from "@/lib/utils";
import { useDrop } from "react-dnd";
import { useFormStore } from "@/store";
import { useForm } from "react-hook-form";

// Components
import { Show } from "@/components/ui/show";
import { Button } from "@/components/ui/button";
import { EmptySplash } from "@/components/ui/empty-splash";
import { SectionCard } from "@/components/blocks/section-card";
import { CodeGenerator } from "@/components/blocks/code-generator";

// Icons
import { ArrowLeft, Code, RefreshCcw, Save } from "lucide-react";

// UI Components
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Form } from "@/components/ui/form";

// Enums
enum Tab {
  FORM = "FORM",
  CODE = "CODE",
}

// Main Canvas Component
export const Canvas = () => {
  const store = useFormStore();
  const [tab, setTab] = useState(Tab.FORM);
  const [viewMode, setViewMode] = useState(false);
  const previousDataExists = store.previousDataExists();

  const handleReset = () => store.reset();
  const handleSave = () => store.save();
  const handleRestore = () => store.restore();
  const handleClear = () => store.clear();

  return (
    <div className="px-2 space-y-4">
      <Show if={tab === Tab.FORM}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Switch
              id="preview-mode"
              checked={viewMode}
              onCheckedChange={setViewMode}
            />
            <Label htmlFor="preview-mode">Preview Mode</Label>
          </div>

          <div className="flex justify-end gap-2">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="icon" title="Reset Form">
                  <RefreshCcw className="w-4 h-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    your section and remove your data.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleReset}>
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            {/* Save Locally */}
            <Button variant="outline" onClick={handleSave}>
              <Save className="w-4 h-4" /> Save Locally
            </Button>

            {/* Get Code */}
            <Button onClick={() => setTab(Tab.CODE)}>
              <Code className="w-4 h-4" /> Get Code
            </Button>
          </div>
        </div>
      </Show>

      <Show if={tab === Tab.CODE}>
        <Button onClick={() => setTab(Tab.FORM)} variant="secondary">
          <ArrowLeft className="w-4 h-4" /> Back to Form
        </Button>
      </Show>

      <div className="border rounded-lg">
        {/* Previous Data Restore Prompt */}
        <Show if={previousDataExists}>
          <AlertDialog open={previousDataExists}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>We found previous data</AlertDialogTitle>
                <AlertDialogDescription>
                  Would you like to restore your previous data?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={handleClear}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction onClick={handleRestore}>
                  Restore Data
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </Show>

        {/* Form or Code Generator */}
        <Show if={!previousDataExists && tab === Tab.FORM}>
          <Droppable viewMode={viewMode} />
        </Show>
        <Show if={tab === Tab.CODE}>
          <CodeGenerator />
        </Show>
      </div>
    </div>
  );
};

// Droppable Component
export const Droppable: FC<{ viewMode: boolean }> = ({ viewMode }) => {
  const form = useForm({});
  const store = useFormStore();

  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    accept: "card",
    drop: () =>
      store.addSection({
        id: crypto.randomUUID(),
        title: "New Section",
        description: "Edit section title and description",
        grid: "one",
        fields: [],
      }),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));

  const isActive = canDrop && isOver;

  const onSubmit = (data: any) => {
    console.log("data", data);
  };

  return (
    <div
      ref={drop as any}
      className={cn(
        "p-4 min-h-[75vh]",
        isActive ? "bg-sky-50 opacity-0.5" : ""
      )}
    >
      {/* Empty State */}
      <Show if={store.sections.length === 0}>
        <EmptySplash />
      </Show>

      {/* Form Sections */}
      <Show if={store.sections.length > 0}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Form {...form}>
            <div className="flex flex-col gap-4">
              {store.sections.map((section) => (
                <SectionCard
                  viewMode={viewMode}
                  form={form}
                  key={section.id}
                  section={section}
                />
              ))}
            </div>
          </Form>
        </form>
      </Show>
    </div>
  );
};
