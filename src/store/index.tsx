import useLocalStorage from "@/hooks/use-local-storage";
import { toast } from "sonner";
import { create } from "zustand";

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
  previousDataExists: () => boolean;
  restore: () => void;
  clear: () => void;
}

export const useFormStore = create<IFormStore>((set, get) => ({
  sections: [],

  /**
   * Add a section
   * @param section - The section to add
   * @returns The updated sections
   */
  addSection: (section: any) =>
    set((state) => ({ sections: [...state.sections, section] })),

  /**
   * Remove a section
   * @param sectionId - The section to remove
   * @returns The updated sections
   */
  removeSection: (sectionId: string) =>
    set((state) => ({
      sections: state.sections.filter((s) => s.id !== sectionId),
    })),

  /**
   * Update a section
   * @param section - The section to update
   * @returns The updated sections
   */
  updateSection: (section: ISection) =>
    set((state) => ({
      sections: state.sections.map((s) => (s.id === section.id ? section : s)),
    })),

  /**
   * Insert a field into a section
   * @param sectionId - The ID of the section to insert the field into
   * @param field - The field to insert
   * @returns The updated sections
   */
  insertItem: (sectionId: string, field: IFormField) =>
    set((state) => ({
      sections: state.sections.map((section) =>
        section.id === sectionId
          ? { ...section, fields: [...section.fields, field] }
          : section
      ),
    })),

  /**
   * Update a field
   * @param field - The field to update
   * @returns The updated sections
   */
  updateItem: (field: IFormField) =>
    set((state) => ({
      sections: state.sections.map((section) => ({
        ...section,
        fields: section.fields.map((f) =>
          f.id === field.id ? { ...f, ...field } : f
        ),
      })),
    })),

  /**
   * Remove a field from a section
   * @param sectionId - The ID of the section to remove the field from
   * @param fieldId - The ID of the field to remove
   * @returns The updated sections
   */
  removeItem: (sectionId: string, fieldId: string) =>
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

  /**
   * Reset the form
   * @returns The updated sections
   */
  reset: () => set({ sections: [] }),

  /**
   * Save the form
   */
  save: () => {
    const [_, setValue] = useLocalStorage("flexform-data", []);
    if (typeof window !== "undefined") {
      setValue(get().sections);
      toast.success("Form saved", {
        description: "Your form has been saved to your browser's local storage",
      });
    }
  },

  /**
   * Restore the form
   */
  restore: () => {
    const [storedValue, setValue] = useLocalStorage("flexform-data", []);
    if (typeof window !== "undefined" && storedValue) {
      set({ sections: storedValue });
      setValue([]); // Clear after restore
      toast.success("Form restored", {
        description:
          "Your form has been restored from your browser's local storage",
      });
    } else {
      set({ sections: [] });
    }
  },

  /**
   * Clear the form
   */
  clear: () => {
    const [_, __, removeValue] = useLocalStorage("flexform-data", []);
    if (typeof window !== "undefined") {
      removeValue();
      set({ sections: [] });
      toast.success("Form cleared", {
        description: "Your form data has been removed from local storage",
      });
    }
  },

  /**
   * Check if previous data exists
   */
  previousDataExists: () => {
    const [storedValue] = useLocalStorage("flexform-data", []);
    if (typeof window !== "undefined") {
      return !!storedValue;
    }
    return false;
  },
}));
