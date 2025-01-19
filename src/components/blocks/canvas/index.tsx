"use client";

import { FC, useState } from "react";
import { cn } from "@/lib/utils";
import { useDrop } from "react-dnd";
import { useFormStore } from "@/store";

import { Show } from "@/components/ui/show";
import { Code, Code2, RefreshCcw, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptySplash } from "@/components/ui/empty-splash";
import { SectionCard } from "@/components/blocks/section-card";

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
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { CodeGenerator } from "@/components/blocks/code-generator";

enum Tab {
  FORM = "FORM",
  CODE = "CODE",
}

export const Canvas = () => {
  const store = useFormStore();
  const [tab, setTab] = useState(Tab.FORM);
  const previousDataExists = store.previousDataExists();

  return (
    <div className="px-2 space-y-4">
      <div className="flex justify-end gap-2">
        {/**
         * reset
         */}
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
                This action cannot be undone. This will permanently delete your
                section and remove your data.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => store.reset()}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <Button variant="outline" onClick={() => store.save()}>
          <Save className="w-4 h-4" /> Save Locally
        </Button>
        <Button onClick={() => setTab(Tab.CODE)}>
          <Code className="w-4 h-4" /> Get Code
        </Button>
      </div>
      <div className="border rounded-lg">
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
                <AlertDialogCancel onClick={() => store.clear()}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction onClick={() => store.restore()}>
                  Restore Data
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </Show>
        <Show if={!previousDataExists && tab === Tab.FORM}>
          <Droppable />
        </Show>
        <Show if={tab === Tab.CODE}>
          <CodeGenerator />
        </Show>
      </div>
    </div>
  );
};

export const Droppable: FC = () => {
  const form = useForm({});
  const store = useFormStore();

  const onSubmit = (data: any) => {
    console.log("data", data);
  };

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

  return (
    <div
      ref={drop as any}
      className={cn(
        "p-4 min-h-[75vh]",
        isActive ? "bg-sky-50 opacity-0.5" : ""
      )}
    >
      <Show if={store.sections.length === 0}>
        <EmptySplash />
      </Show>
      <Show if={store.sections.length > 0}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Form {...form}>
            <div className="flex flex-col gap-4">
              {store.sections.map((section) => {
                return (
                  <SectionCard form={form} key={section.id} section={section} />
                );
              })}
            </div>
          </Form>
        </form>
      </Show>
    </div>
  );
};
