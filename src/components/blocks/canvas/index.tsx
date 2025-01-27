"use client";

import { type FC, useState } from "react";
import { cn } from "@/lib/utils";
import { useDrop } from "react-dnd";
import { useFormStore } from "@/store";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";

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
import { useGenerateValidations } from "@/hooks/use-generate-validations";
import { zodResolver } from "@hookform/resolvers/zod";

// Animation variants
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
  exit: {
    opacity: 0,
    transition: {
      duration: 0.2,
      ease: "easeIn",
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
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.2,
    },
  },
};

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

  const handleReset = () => store.reset();
  const handleSave = () => store.save();

  return (
    <motion.div
      className="px-4 space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <AnimatePresence mode="wait">
        {tab === Tab.FORM && (
          <motion.div
            variants={itemVariants}
            className="flex items-center justify-between bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10"
          >
            <div className="flex items-center space-x-3">
              <Switch
                id="preview-mode"
                checked={viewMode}
                onCheckedChange={setViewMode}
              />
              <Label
                htmlFor="preview-mode"
                className="text-muted-foreground font-medium"
              >
                Preview Mode
              </Label>
            </div>

            <div className="flex justify-end gap-3">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 transition-colors hover:bg-muted"
                  >
                    <RefreshCcw className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Reset form?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete your sections and remove all
                      data.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleReset}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Reset
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <Button
                variant="outline"
                onClick={handleSave}
                className="gap-2 h-9"
              >
                <Save className="w-4 h-4" />
                Save
              </Button>

              <Button onClick={() => setTab(Tab.CODE)} className="gap-2 h-9">
                <Code className="w-4 h-4" />
                Get Code
              </Button>
            </div>
          </motion.div>
        )}

        {tab === Tab.CODE && (
          <motion.div
            variants={itemVariants}
            className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-2"
          >
            <Button
              onClick={() => setTab(Tab.FORM)}
              variant="secondary"
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Form
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {tab === Tab.FORM && (
          <motion.div
            variants={itemVariants}
            className="rounded-lg border bg-card text-card-foreground shadow-sm"
          >
            <Droppable viewMode={viewMode} />
          </motion.div>
        )}

        {tab === Tab.CODE && (
          <motion.div variants={itemVariants}>
            <CodeGenerator />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Droppable Component
export const Droppable: FC<{ viewMode: boolean }> = ({ viewMode }) => {
  const store = useFormStore();
  const validations = useGenerateValidations();
  const form = useForm({
    resolver: zodResolver(validations),
  });

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
    alert(JSON.stringify(data));
  };

  return (
    <motion.div
      ref={drop as any}
      animate={{
        backgroundColor: isActive ? "hsl(var(--accent)/0.2)" : "transparent",
        transition: {
          duration: 0.3,
          ease: "easeInOut",
        },
      }}
      className={cn(
        "p-6 min-h-[75vh] relative rounded-lg",
        "transition-all duration-300 ease-in-out"
      )}
    >
      {isActive && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{
            opacity: 1,
            scale: 1,
            transition: {
              type: "spring",
              stiffness: 400,
              damping: 30,
            },
          }}
          className={cn(
            "absolute inset-4 rounded-lg pointer-events-none",
            "border-2 border-dashed border-accent",
            "bg-accent/5 dark:bg-accent/10"
          )}
        />
      )}

      <AnimatePresence mode="wait">
        {store.sections.length === 0 && (
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <EmptySplash />
          </motion.div>
        )}

        {store.sections.length > 0 && (
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Form {...form}>
              <motion.div
                className="flex flex-col gap-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <AnimatePresence>
                  {store.sections.map((section) => (
                    <motion.div
                      key={section.id}
                      layout
                      layoutId={section.id}
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="relative"
                    >
                      <SectionCard
                        viewMode={viewMode}
                        form={form}
                        section={section}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
                <Show if={store.sections.length > 0}>
                  <div className=" my-4 flex justify-end gap-2">
                    <Button variant="outline" onClick={() => form.reset()}>
                      Cancel
                    </Button>
                    <Button type="submit">Submit</Button>
                  </div>
                </Show>
              </motion.div>
            </Form>
          </form>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
