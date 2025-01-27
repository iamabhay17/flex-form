"use client";

import { toast } from "sonner";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface IFormField {
  id: string;
  type: string;
  title: string;
  key: string;
  description: string;
  subType?: "text" | "password" | "number" | "email" | "tel" | "url";
  validations: {
    required: boolean;
    min?: number;
    max?: number;
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    gte?: number;
    lte?: number;
    minItems?: number;
    maxItems?: number;
  };
  options?: string[];
}

export interface ISection {
  id: string;
  title: string;
  description: string;
  grid: string;
  fields: IFormField[];
}

interface IFormStore {
  sections: ISection[];
  addSection: (section: ISection) => void;
  removeSection: (sectionId: string) => void;
  updateSection: (section: ISection) => void;
  insertItem: (sectionId: string, field: IFormField) => void;
  removeItem: (sectionId: string, fieldId: string) => void;
  updateItem: (field: IFormField) => void;
  reset: () => void;
  save: () => void;
  restore: () => void;
  clear: () => void;
}

export const useFormStore = create<IFormStore>()(
  persist(
    (set, get) => ({
      sections: [],

      addSection: (section) =>
        set((state) => ({ sections: [...state.sections, section] })),

      removeSection: (sectionId) =>
        set((state) => ({
          sections: state.sections.filter((s) => s.id !== sectionId),
        })),

      updateSection: (section) =>
        set((state) => ({
          sections: state.sections.map((s) =>
            s.id === section.id ? section : s
          ),
        })),

      insertItem: (sectionId, field) =>
        set((state) => ({
          sections: state.sections.map((section) =>
            section.id === sectionId
              ? { ...section, fields: [...section.fields, field] }
              : section
          ),
        })),

      updateItem: (field) =>
        set((state) => ({
          sections: state.sections.map((section) => ({
            ...section,
            fields: section.fields.map((f) =>
              f.id === field.id ? { ...f, ...field } : f
            ),
          })),
        })),

      removeItem: (sectionId, fieldId) =>
        set((state) => ({
          sections: state.sections.map((section) =>
            section.id === sectionId
              ? {
                  ...section,
                  fields: section.fields.filter((f) => f.id !== fieldId),
                }
              : section
          ),
        })),

      reset: () => set({ sections: [] }),

      save: () => {
        toast.success("Form saved", {
          description:
            "Your form has been saved to your browser's local storage",
        });
      },

      restore: () => {
        toast.success("Form restored", {
          description:
            "Your form has been restored from your browser's local storage",
        });
      },

      clear: () => {
        set({ sections: [] });
        toast.success("Form cleared", {
          description: "Your form data has been removed from local storage",
        });
      },
    }),
    {
      name: "flexform-storage",
    }
  )
);
