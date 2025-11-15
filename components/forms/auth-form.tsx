"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { DefaultValues, FieldValues, Path, Resolver, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z, ZodType } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import AuthSwitch from "../auth-switch";
import { siteConfig } from "@/config/site";

interface AuthFormProps<T extends FieldValues> {
  schema: ZodType<T> | any;
  defaultValues: T;
  onSubmit: (data: T) => Promise<{ success: boolean; error?: string }>;
  formType: "SIGN_IN" | "SIGN_UP";
}

const AuthForm = <T extends FieldValues>({ schema, defaultValues, formType, onSubmit }: AuthFormProps<T>) => {
  const router = useRouter();

  // Initialize the form with react-hook-form and zod resolver
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema) as Resolver<T>,
    defaultValues: defaultValues as DefaultValues<T>,
  });

  const handleSubmit: SubmitHandler<T> = async (data) => {
    const result = (await onSubmit(data)) as { success: boolean; error?: string };

    if (result?.success) {
      toast("Successfully submitted the form!", {
        description: `Welcome back, ${data["username"] || data["name"]}!`,
      });

      router.push(siteConfig.ROUTES.HOME);
    } else {
      toast("Submission failed. Please try again.", {
        description: result?.error || "An unexpected error occurred.",
      });
    }
  };

  const authState = formType === "SIGN_IN" ? "Sign In" : "Sign Up";

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="mt-10 space-y-6">
        {Object.keys(defaultValues).map((field) => (
          <FormField
            key={field}
            control={form.control}
            name={field as Path<T>}
            render={({ field: formField }) => (
              <FormItem className="flex w-full flex-col gap-2.5">
                <FormLabel className="paragraph-medium text-dark400_light700">
                  {formField.name === "email"
                    ? "Email Address"
                    : formField.name.charAt(0).toUpperCase() + formField.name.slice(1)}
                </FormLabel>

                <FormControl>
                  <Input
                    required
                    type={formField.name === "password" ? "password" : "text"}
                    {...formField}
                    className="paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 no-focus rounded-1.5 min-h-12 border"
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        ))}

        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="primary-gradient paragraph-medium rounded-2 font-inter text-light-900! min-h-12 w-full px-4 py-3"
        >
          {form.formState.isSubmitting ? (authState === "Sign In" ? "Signing In..." : "Signing Up...") : authState}
        </Button>
        <AuthSwitch formType={formType} />
      </form>
    </Form>
  );
};

export default AuthForm;
