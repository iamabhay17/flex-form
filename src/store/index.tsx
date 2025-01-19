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
   * @returns The updated sections
   */
  save: () => {
    if (typeof window === "undefined") return;
    const data = JSON.stringify(get().sections);
    localStorage.setItem("flexform-data", data);
    toast.success("Form saved", {
      description: "Your form has been saved to your browser's local storage",
    });
  },
  /**
   * Restore the form
   * @returns The updated sections
   */
  restore: () => {
    if (typeof window === "undefined") return;
    const data = localStorage.getItem("flexform-data");
    if (data) {
      set({ sections: JSON.parse(data) });
      localStorage.removeItem("flexform-data");
    }
    toast.success("Form restored", {
      description:
        "Your form has been restored from your browser's local storage",
    });
  },

  /**
   * Clear the form
   * @returns The updated sections
   */
  clear: () => {
    if (typeof window === "undefined") return;
    localStorage.removeItem("flexform-data");
    set({ sections: [] });
  },

  /**
   * Check if previous data exists
   * @returns Whether previous data exists
   */
  previousDataExists: () => {
    if (typeof window === "undefined") return false;
    const data = localStorage.getItem("flexform-data");
    return data !== null;
  },
}));
