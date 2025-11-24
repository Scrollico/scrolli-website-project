"use client";

import ComponentShowcase from "../ComponentShowcase";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { gap } from "@/lib/design-tokens";
import { cn } from "@/lib/utils";

export default function FormShowcase() {
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  return (
    <>
      <ComponentShowcase
        id="forms"
        title="Forms"
        description="Form components built with React Hook Form and Radix UI. Includes Input, Label, and form validation components."
        demo={
          <div className={cn("w-full space-y-8", gap.lg)}>
            {/* Basic Input */}
            <div className="space-y-2 w-full max-w-md">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="Enter your email" />
            </div>

            {/* Input with Description */}
            <div className="space-y-2 w-full max-w-md">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="Enter your password" />
              <p className="text-sm text-muted-foreground">
                Must be at least 8 characters long
              </p>
            </div>

            {/* Form with Validation */}
            <Form {...form}>
              <form className="space-y-4 w-full max-w-md">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="email@example.com" {...field} />
                      </FormControl>
                      <FormDescription>
                        We'll never share your email with anyone else.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>

            {/* Disabled Input */}
            <div className="space-y-2 w-full max-w-md">
              <Label htmlFor="disabled">Disabled Input</Label>
              <Input id="disabled" disabled placeholder="Disabled input" />
            </div>
          </div>
        }
        code={`import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";

// Basic Input
<Label htmlFor="email">Email</Label>
<Input id="email" type="email" placeholder="Enter your email" />

// Form with Validation
const form = useForm();

<Form {...form}>
  <FormField
    control={form.control}
    name="email"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Email</FormLabel>
        <FormControl>
          <Input placeholder="email@example.com" {...field} />
        </FormControl>
        <FormDescription>
          We'll never share your email.
        </FormDescription>
        <FormMessage />
      </FormItem>
    )}
  />
</Form>`}
        props={{
          "Input": {
            type: "React.InputHTMLAttributes<HTMLInputElement>",
            default: "—",
            description: "Input element with styling"
          },
          "Label": {
            type: "React.LabelHTMLAttributes<HTMLLabelElement>",
            default: "—",
            description: "Label component"
          },
          "FormField": {
            type: "ControllerProps",
            default: "—",
            description: "Form field wrapper with validation"
          },
          "FormItem": {
            type: "React.HTMLAttributes<HTMLDivElement>",
            default: "—",
            description: "Form item container"
          },
          "FormLabel": {
            type: "React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>",
            default: "—",
            description: "Form label with error state"
          },
          "FormControl": {
            type: "React.ComponentPropsWithoutRef<typeof Slot>",
            default: "—",
            description: "Form control wrapper"
          },
          "FormDescription": {
            type: "React.HTMLAttributes<HTMLParagraphElement>",
            default: "—",
            description: "Form description text"
          },
          "FormMessage": {
            type: "React.HTMLAttributes<HTMLParagraphElement>",
            default: "—",
            description: "Form error message"
          }
        }}
      />
    </>
  );
}

















