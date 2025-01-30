import { IFormField } from "@/store";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ControllerRenderProps,
  FieldValues,
  useFieldArray,
  UseFormReturn,
  useWatch,
} from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Show } from "@/components/ui/show";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CalendarIcon, Check, ChevronsUpDown, Trash2 } from "lucide-react";
import { format, isValid } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  DialogTitle,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { FieldTypes } from "@/components/blocks/app-sidebar/sidebar-const";

export const Field = ({
  field,
  fieldInstance,
  form,
}: {
  field: IFormField;
  form: UseFormReturn;
  fieldInstance: ControllerRenderProps<FieldValues, string>;
}) => {
  switch (field.type) {
    // Render the appropriate field based on the type

    /**
     * @description Render an input field
     */

    case FieldTypes.INPUT:
      return (
        <FormItem className="mb-4">
          <Label>{field.title}</Label>
          <FormDescription>{field.description}</FormDescription>
          <FormControl>
            <Input
              className="max-w-[302px]"
              placeholder="Enter text"
              {...fieldInstance}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      );

    /**
     * @description Render a textarea field
     */
    case FieldTypes.TEXT_AREA:
      return (
        <FormItem className="mb-4">
          <Label>{field.title}</Label>
          <FormDescription>{field.description}</FormDescription>
          <FormControl>
            <Textarea
              placeholder="Enter content"
              className="max-w-[302px] h-[100px]"
              {...fieldInstance}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      );

    /**
     * @description Render a date field
     */

    case FieldTypes.DATE_TIME:
      return (
        <FormItem className="flex flex-col mb-4">
          <Label>{field.title}</Label>
          <FormDescription>{field.description}</FormDescription>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant={"outline"}
                  className={cn(
                    "max-w-[302px] pl-3 text-left font-normal",
                    !fieldInstance.value && "text-muted-foreground"
                  )}
                >
                  {isValid(fieldInstance.value) ? (
                    format(fieldInstance.value, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={fieldInstance.value}
                onSelect={fieldInstance.onChange}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      );

    /**
     * @description Render a checkbox group field
     */

    case FieldTypes.CHECKBOX_GROUP:
      return (
        <FormItem className="mb-4">
          <Label>{field.title}</Label>
          <FormDescription>{field.description}</FormDescription>
          <Show if={(field?.options || []).length > 0}>
            <FormControl>
              <div className="flex flex-col pt-3 space-y-2">
                {(field.options || []).map((option: string) => (
                  <FormItem
                    key={option}
                    className="flex items-center space-x-3 space-y-0"
                  >
                    <Checkbox
                      checked={fieldInstance.value?.includes(option)}
                      onCheckedChange={(checked) => {
                        fieldInstance.onChange(
                          checked
                            ? [...(fieldInstance.value || []), option]
                            : fieldInstance.value?.filter(
                                (item: string) => item !== option
                              )
                        );
                      }}
                    />
                    <Label className="font-normal text-sm">{option}</Label>
                  </FormItem>
                ))}
              </div>
            </FormControl>
          </Show>
          <Show if={(field?.options || []).length === 0}>
            <FormDescription>No Options Provided</FormDescription>
          </Show>
          <FormMessage />
        </FormItem>
      );

    /**
     * @description render a checkbox field
     */
    case FieldTypes.CHECKBOX:
      return (
        <FormItem className="flex flex-col space-y-2 mb-4 ">
          <Label>{field.title}</Label>
          <div className="flex items-center gap-4">
            <FormControl>
              <Checkbox
                checked={fieldInstance.value}
                onCheckedChange={fieldInstance.onChange}
              />
            </FormControl>
            <FormDescription>{field.description}</FormDescription>
          </div>
          <FormMessage />
        </FormItem>
      );

    /**
     * @description Render a select field
     */
    case FieldTypes.SELECT:
      return (
        <FormItem className="mb-4">
          <Label>{field.title}</Label>
          <FormDescription>{field.description}</FormDescription>
          <Show if={(field?.options || []).length > 0}>
            <FormControl>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {(field?.options || []).map((option: any, idx: any) => (
                      <SelectItem key={idx} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </FormControl>
          </Show>
          <Show if={(field?.options || []).length === 0}>
            <FormDescription>No Options Provided</FormDescription>
          </Show>
          <FormMessage />
        </FormItem>
      );

    /**
     * @description Render a radio group field
     */
    case FieldTypes.RADIO_GROUP:
      return (
        <FormItem className=" mb-4">
          <Label>{field.title}</Label>
          <Show if={(field?.options || []).length === 0}>
            <FormDescription>No Options Provided</FormDescription>
          </Show>

          <Show if={(field?.options || []).length > 0}>
            <FormControl>
              <RadioGroup
                onValueChange={fieldInstance.onChange}
                value={fieldInstance.value}
                className="flex w-full gap-4"
              >
                {(field?.options || []).map((option) => (
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value={option} />
                    </FormControl>
                    <Label className="font-normal">{option}</Label>
                  </FormItem>
                ))}
              </RadioGroup>
            </FormControl>
          </Show>
          <FormMessage />
        </FormItem>
      );

    /**
     * @description Render a switch field
     */
    case FieldTypes.SWITCH:
      return (
        <FormItem className="flex flex-col mb-4 ">
          <Label>{field.title}</Label>
          <FormDescription>{field.description}</FormDescription>
          <FormControl>
            <Switch
              checked={fieldInstance.value}
              onCheckedChange={fieldInstance.onChange}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      );

    default:
      return null;
  }
};
