import { IFormField } from "@/store";
import { FieldTypes } from "@/components/blocks/app-sidebar/sidebar-const";

// Function to render the correct JSX for each field type
export const generateFieldJSX = (field: IFormField, fieldInstance: any) => {
  switch (field.type) {
    case FieldTypes.INPUT:
      return `
        <FormItem className="mb-4">
          <Label>${field.title}</Label>
          <FormDescription>${field.description}</FormDescription>
          <FormControl>
            <Input className="max-w-[302px]" placeholder="Enter text" {...fieldInstance} />
          </FormControl>
          <FormMessage />
        </FormItem>
      `;

    case FieldTypes.TEXT_AREA:
      return `
        <FormItem className="mb-4">
          <Label>${field.title}</Label>
          <FormDescription>${field.description}</FormDescription>
          <FormControl>
            <Textarea placeholder="Enter content" className="max-w-[302px] h-[100px]" {...fieldInstance} />
          </FormControl>
          <FormMessage />
        </FormItem>
      `;

    case FieldTypes.DATE_TIME:
      return `
        <FormItem className="flex flex-col mb-4">
          <Label>${field.title}</Label>
          <FormDescription>${field.description}</FormDescription>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant={"outline"}
                  className={cn("max-w-[302px] pl-3 text-left font-normal", !fieldInstance.value && "text-muted-foreground")}
                >
                  {isValid(fieldInstance.value) ? format(fieldInstance.value, "PPP") : <span>Pick a date</span>}
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
      `;

    case FieldTypes.CHECKBOX_GROUP:
      return `
        <FormItem className="mb-4">
          <Label>${field.title}</Label>
          <FormDescription>${field.description}</FormDescription>
          <Show if={(field?.options || []).length > 0}>
            <FormControl>
              <div className="flex flex-col pt-3 space-y-2">
                ${(field.options || [])
                  .map(
                    (option: string) => `
                  <FormItem key={option} className="flex items-center space-x-3 space-y-0">
                    <Checkbox
                      checked={fieldInstance.value?.includes(option)}
                      onCheckedChange={(checked) => {
                        fieldInstance.onChange(
                          checked ? [...(fieldInstance.value || []), option] : fieldInstance.value?.filter((item: string) => item !== option)
                        );
                      }}
                    />
                    <Label className="font-normal text-sm">${option}</Label>
                  </FormItem>
                `
                  )
                  .join("\n")}
              </div>
            </FormControl>
          </Show>
          <Show if={(field?.options || []).length === 0}>
            <FormDescription>No Options Provided</FormDescription>
          </Show>
          <FormMessage />
        </FormItem>
      `;

    case FieldTypes.CHECKBOX:
      return `
        <FormItem className="flex flex-col space-y-2 mb-4">
          <Label>${field.title}</Label>
          <div className="flex items-center gap-4">
            <FormControl>
              <Checkbox checked={fieldInstance.value} onCheckedChange={fieldInstance.onChange} />
            </FormControl>
            <FormDescription>${field.description}</FormDescription>
          </div>
          <FormMessage />
        </FormItem>
      `;

    case FieldTypes.SELECT:
      return `
        <FormItem className="mb-4">
          <Label>${field.title}</Label>
          <FormDescription>${field.description}</FormDescription>
          <Show if={(field?.options || []).length > 0}>
            <FormControl>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    ${(field?.options || [])
                      .map(
                        (option: any, idx: any) => `
                      <SelectItem key={idx} value={option}>
                        ${option}
                      </SelectItem>
                    `
                      )
                      .join("\n")}
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
      `;

    case FieldTypes.RADIO_GROUP:
      return `
        <FormItem className="mb-4">
          <Label>${field.title}</Label>
          <Show if={(field?.options || []).length === 0}>
            <FormDescription>No Options Provided</FormDescription>
          </Show>
          <Show if={(field?.options || []).length > 0}>
            <FormControl>
              <RadioGroup onValueChange={fieldInstance.onChange} value={fieldInstance.value} className="flex w-full gap-4">
                ${(field?.options || [])
                  .map(
                    (option) => `
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value={option} />
                    </FormControl>
                    <Label className="font-normal">${option}</Label>
                  </FormItem>
                `
                  )
                  .join("\n")}
              </RadioGroup>
            </FormControl>
          </Show>
          <FormMessage />
        </FormItem>
      `;

    case FieldTypes.SWITCH:
      return `
        <FormItem className="flex flex-col mb-4">
          <Label>${field.title}</Label>
          <FormDescription>${field.description}</FormDescription>
          <FormControl>
            <Switch checked={fieldInstance.value} onCheckedChange={fieldInstance.onChange} />
          </FormControl>
        </FormItem>
      `;

    default:
      return "";
  }
};

// Generate sections JSX dynamically
export const generateSectionsJSX = (store: any) => {
  const getClasses = (grid: string) => {
    switch (grid) {
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

  return store.sections
    .map((section: any) => {
      const fieldsJSX = section.fields
        .map((field: IFormField) => {
          return `
            <FormField
              control={form.control}
              name="${field.key}"
              render={({ field: fieldInstance }) => (${generateFieldJSX(
                field,
                "fieldInstance"
              )})}
            />
          `;
        })
        .join("\n");

      return `
        <Card key="${section.id}">
          <CardHeader>
            <CardTitle className="text-xl">${section.title}</CardTitle>
            <CardDescription>${section.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 ${getClasses(section.grid)}">
              ${fieldsJSX}
            </div>
          </CardContent>
        </Card>`;
    })
    .join("\n");
};

// Generate the complete form code
export const generateCompleteCode = (store: any) => {
  return `
// Import all necessary components and dependencies
import { z } from "zod";
import { schema } from "./validations";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export default function GeneratedForm() {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {},
  });

  const onSubmit = (data: z.infer<typeof schema>) => {
    console.log(data);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <Form {...form}>
        <div className="flex flex-col gap-4">
          ${generateSectionsJSX(store)}
        </div>
      </Form>
    </form>
  );
}`;
};
