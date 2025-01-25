import { useState } from "react";
import { cn } from "@/lib/utils";
import { useDrop } from "react-dnd";

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

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

import { toast } from "sonner";
import { Show } from "@/components/ui/show";
import { FormField } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/blocks/field";
import { type ISection, useFormStore } from "@/store";
import type { UseFormReturn } from "react-hook-form";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { ConfigDialog } from "@/components/blocks/config-dialog";
import { Edit2, GripVertical, PenBox, Trash2 } from "lucide-react";

export const SectionCard = ({
  viewMode,
  section,
  form,
}: {
  viewMode: boolean;
  section: ISection;
  form: UseFormReturn;
}) => {
  const store = useFormStore();

  const [isHovered, setIsHovered] = useState(false);

  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    accept: "field",
    drop: (data: { title: string; type: string }) => {
      const uniqueKey = crypto.randomUUID();
      const field = {
        id: uniqueKey,
        key: uniqueKey,
        type: data.type,
        title: data.title,
        description: "Add some description here",
        validations: { required: false },
        subType: "text" as const,
      };
      store.insertItem(section.id, field);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));

  const isActive = canDrop && isOver;

  const getClasses = () => {
    switch (section.grid) {
      case "one":
        return "grid-cols-1";
      case "two":
        return "grid-cols-2";
      case "three":
        return "grid-cols-3";
      case "four":
        return "grid-cols-4";
    }
  };

  return (
    <div
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card
        ref={drop as any}
        className={cn("shadow-none", isActive ? "bg-sky-50 opacity-0.5" : "")}
      >
        <CardHeader>
          <CardTitle className="text-xl">{section.title}</CardTitle>
          <CardDescription>{section.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div
            key={section.id}
            className={cn("grid gap-2 grid-cols-1", getClasses())}
          >
            {section.fields.map((field) => {
              if (viewMode) {
                return (
                  <FormField
                    key={field.id}
                    control={form.control}
                    name={field.key}
                    render={({ field: fieldInstance }) => (
                      <Field
                        field={field}
                        form={form}
                        fieldInstance={fieldInstance}
                      />
                    )}
                  />
                );
              }
              return (
                <div
                  key={field.id}
                  className="flex p-4 border w-full rounded-lg"
                >
                  <div className="flex flex-col items-center gap-2 pr-2 border-r mr-4">
                    <button
                      className="p-2 rounded-lg hover:bg-primary/10 active:bg-primary/20 transition-colors duration-200 cursor-move touch-none"
                      aria-label="Drag to reorder"
                    >
                      <GripVertical className="h-4 w-4 text-primary/60" />
                    </button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <button className="p-2 rounded-lg hover:bg-primary/10 active:bg-primary/20 transition-colors duration-200">
                          <Edit2 className="h-4 w-4 text-primary/60" />
                        </button>
                      </DialogTrigger>
                      <ConfigDialog type="field" id={field.id} />
                    </Dialog>

                    <button
                      onClick={() => store.removeItem(section.id, field.id)}
                      className="p-2 rounded-lg hover:bg-destructive/10 active:bg-destructive/20 transition-colors duration-200"
                    >
                      <Trash2 className="h-4 w-4 text-destructive/70" />
                    </button>
                  </div>

                  {/* Field Content */}
                  <FormField
                    key={field.id}
                    control={form.control}
                    name={field.key}
                    render={({ field: fieldInstance }) => (
                      <Field
                        field={field}
                        form={form}
                        fieldInstance={fieldInstance}
                      />
                    )}
                  />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
      <Show if={isHovered && !viewMode}>
        <CardActions cardId={section.id} />
      </Show>
    </div>
  );
};

export const CardActions = ({ cardId }: { cardId: string }) => {
  const store = useFormStore();

  const handleDeleteSection = () => {
    store.removeSection(cardId);
    toast("Section deleted", {
      description: "Your section has been deleted",
    });
  };

  return (
    <div className="flex gap-2 absolute top-2 right-2">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="icon" title="Edit section">
            <PenBox />
          </Button>
        </DialogTrigger>
        <ConfigDialog type="card" id={cardId} />
      </Dialog>

      {/**
       * Confirmation dialog to delete section
       */}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline" size="icon" title="Delete section">
            <Trash2 />
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
            <AlertDialogAction onClick={handleDeleteSection}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
