import {
  BoxIcon,
  Calendar,
  CheckSquare,
  List,
  ChevronDown,
  ToggleRight,
  Text,
} from "lucide-react";

export const FieldTypes = {
  INPUT: "input",
  TEXT_AREA: "text-area",
  DATE_TIME: "datetime",
  CHECKBOX: "checkbox",
  CHECKBOX_GROUP: "checkbox-group",
  RADIO_GROUP: "radio-group",
  SELECT: "select",
  SWITCH: "switch",
  COMBOBOX: "combobox",
};

export const sidebarItems = [
  {
    title: "Input",
    id: "input",
    icon: Text,
    isActive: true,
  },
  {
    title: "Textarea",
    id: "text-area",
    icon: BoxIcon,
  },
  {
    title: "Datetime",
    id: "datetime",
    icon: Calendar, // Matches a datetime picker visually
  },
  {
    title: "Checkbox",
    id: "checkbox",
    icon: CheckSquare,
  },
  {
    title: "Checkbox Group",
    id: "checkbox-group",
    icon: List, // Represents a group/list visually
  },
  {
    title: "Radio Group",
    id: "radio-group",
    icon: List, // Represents a group/list visually
  },
  {
    title: "Select",
    id: "select",
    icon: ChevronDown, // Dropdown-like icon
  },
  {
    title: "Switch",
    id: "switch",
    icon: ToggleRight, // Matches a switch visually
  },
  // {
  //   title: "Combobox",
  //   id: "combobox",
  //   icon: Search, // Suggests a searchable dropdown
  // },
];
