import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { IFormField, ISection, useFormStore } from "@/store";
import { useEffect, useState } from "react";
import { CalendarIcon, Loader2, Trash2 } from "lucide-react";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  fieldValidator,
  sectionValidator,
} from "@/components/blocks/config-dialog/validators";
import { z } from "zod";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Show } from "@/components/ui/show";
import { FieldTypes } from "@/components/blocks/app-sidebar/sidebar-const";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { format, isValid } from "date-fns";

export function ConfigDialog({ type, id }: { type: string; id: string }) {
  const store = useFormStore();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<IFormField | ISection | null>(null);

  useEffect(() => {
    const fetchData = () => {
      if (type === "card") {
        const card = store.sections.find((s) => s.id === id);
        setData(card || null); // Handle cases where no match is found
      } else if (type === "field") {
        const section = store.sections.find((s) =>
          s.fields.some((f) => f.id === id)
        );
        const field = section?.fields.find((f) => f.id === id);
        setData(field || null); // Handle cases where no match is found
      }
      setLoading(false);
    };

    setLoading(true);
    fetchData();
  }, [type, id, store.sections]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-gray-500">No data found.</p>
      </div>
    );
  }

  return type === "card" ? (
    <CardConfigDialog data={data as ISection} />
  ) : (
    <FieldConfigDialog data={data as IFormField} />
  );
}

export function CardConfigDialog({ data }: { data: ISection }) {
  const store = useFormStore();
  const form = useForm({
    resolver: zodResolver(sectionValidator),
    values: {
      title: data.title,
      description: data.description,
      grid: data.grid,
    },
  });

  const onSubmit = (values: z.infer<typeof sectionValidator>) => {
    store.updateSection({
      ...data,
      ...values,
    });
  };
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Edit Section Details</DialogTitle>
        <DialogDescription>
          Make changes to your form section here. Click save when you're done.
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Form {...form}>
          <div className="grid gap-4 py-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <Label>Title</Label>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <Label>Description</Label>
                  <FormControl>
                    <Textarea className="h-24" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="grid"
              render={({ field }) => (
                <FormItem>
                  <Label>Select Grid</Label>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full">
                      <SelectValue
                        placeholder="Select Grid layout"
                        className="w-full"
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Grid Layout</SelectLabel>
                        <SelectItem value="one">1 Column</SelectItem>
                        <SelectItem value="two">2 Columns</SelectItem>
                        <SelectItem value="three">3 Columns</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="submit">Save changes</Button>
            </DialogClose>
          </DialogFooter>
        </Form>
      </form>
    </DialogContent>
  );
}

export function FieldConfigDialog({ data }: { data: IFormField }) {
  const store = useFormStore();
  const form = useForm({
    resolver: zodResolver(fieldValidator),
    values: {
      title: data.title,
      description: data?.description || "",
      key: data.key,
      type: data.type,
      validations: data.validations || {
        required: false,
        min: undefined,
        max: undefined,
        minLength: undefined,
        maxLength: undefined,
        pattern: undefined,
        gte: undefined,
        lte: undefined,
        minItems: undefined,
        maxItems: undefined,
      },
      options: data.options || [],
      subType: data.subType || "text",
    },
  });

  const {
    fields: fieldsArray,
    append,
    remove,
  } = useFieldArray<any>({
    control: form.control,
    name: "options",
  });

  const onSubmit = (values: any) => {
    store.updateItem({
      ...data,
      ...values,
    });
    toast.success("Field updated successfully");
  };
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Edit Field Details</DialogTitle>
        <DialogDescription>
          Make changes to your field here. Click save when you're done.
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Form {...form}>
          <ScrollArea className="h-[70vh] mb-4">
            <div className="grid gap-4 w-[92%] mx-auto py-4">
              <FormField
                control={form.control}
                name="key"
                render={({ field }) => (
                  <FormItem>
                    <Label>Key</Label>
                    <FormControl>
                      <Input {...field} placeholder="Enter unique key" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <Label>Label</Label>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <Label>Description</Label>
                    <FormControl>
                      <Textarea className="h-24" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="validations.required"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <div className="flex items-center gap-4">
                      <Label>Required </Label>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Show if={data.type === FieldTypes.INPUT}>
                <FormField
                  control={form.control}
                  name="validations.pattern"
                  render={({ field }) => (
                    <FormItem>
                      <Label>Regex Pattern</Label>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="subType"
                  render={({ field }) => (
                    <FormItem>
                      <Label>Input type</Label>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue
                            placeholder="Select subtype"
                            className="w-full"
                          />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Grid Layout</SelectLabel>
                            <SelectItem value="text">Text</SelectItem>
                            <SelectItem value="password">Pasword</SelectItem>
                            <SelectItem value="number">Number</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </Show>
              <Show
                if={[
                  FieldTypes.CHECKBOX_GROUP,
                  FieldTypes.RADIO_GROUP,
                  FieldTypes.SELECT,
                ].includes(data.type)}
              >
                <div className="flex flex-col gap-2">
                  <Label>{data.title}</Label>

                  <div className="flex flex-col gap-2">
                    {fieldsArray.map((item, idx) => (
                      <FormField
                        key={item.id}
                        control={form.control}
                        name={`options.${idx}`}
                        render={({ field: fld }) => (
                          <FormItem className="space-y-1">
                            <div className="flex gap-2 ">
                              <FormControl>
                                <Input
                                  placeholder="Enter option"
                                  onChange={fld.onChange}
                                />
                              </FormControl>
                              <Button
                                variant="outline"
                                onClick={() => remove(idx)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => append("")}
                  >
                    Add option
                  </Button>
                </div>
                <FormField
                  control={form.control}
                  name="options"
                  render={() => (
                    <FormItem>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </Show>
              <Show if={[FieldTypes.CHECKBOX_GROUP].includes(data.type)}>
                <FormField
                  control={form.control}
                  name="validations.minItems"
                  render={({ field }) => (
                    <FormItem>
                      <Label>Min Items</Label>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="validations.maxItems"
                  render={({ field }) => (
                    <FormItem>
                      <Label>Max Items</Label>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </Show>
              <Show
                if={
                  [FieldTypes.INPUT, FieldTypes.TEXT_AREA].includes(
                    data.type
                  ) && data.subType !== "number"
                }
              >
                <FormField
                  control={form.control}
                  name="validations.minLength"
                  render={({ field }) => (
                    <FormItem>
                      <Label>Min Length</Label>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="validations.maxLength"
                  render={({ field }) => (
                    <FormItem>
                      <Label>Max Length</Label>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </Show>
              <Show
                if={
                  [FieldTypes.INPUT].includes(data.type) &&
                  data.subType === "number"
                }
              >
                <FormField
                  control={form.control}
                  name="validations.min"
                  render={({ field }) => (
                    <FormItem>
                      <Label>Min Value</Label>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="validations.max"
                  render={({ field }) => (
                    <FormItem>
                      <Label>Max Value</Label>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </Show>
              <Show if={data.type === FieldTypes.DATE_TIME}>
                <FormField
                  control={form.control}
                  name="validations.gte"
                  render={({ field }) => (
                    <FormItem className="flex flex-col mb-4">
                      <Label>Greater than</Label>
                      <FormDescription>
                        Date should be greater than
                      </FormDescription>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                " pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {isValid(field.value) ? (
                                format(field.value || new Date(), "PPP")
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
                            selected={
                              field.value ? new Date(field.value) : new Date()
                            }
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="validations.lte"
                  render={({ field }) => (
                    <FormItem className="flex flex-col mb-4">
                      <Label>Less than</Label>
                      <FormDescription>
                        Date should be less than
                      </FormDescription>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                " pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {isValid(field.value) ? (
                                format(field.value || new Date(), "PPP")
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
                            selected={
                              field.value ? new Date(field.value) : new Date()
                            }
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </Show>
            </div>
          </ScrollArea>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="submit">Save changes</Button>
            </DialogClose>
          </DialogFooter>
        </Form>
      </form>
    </DialogContent>
  );
}
