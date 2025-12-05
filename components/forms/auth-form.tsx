"use client";

import { useRouter } from "next/navigation";
import { DefaultValues, FieldValues, Path, Resolver, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z, ZodType } from "zod";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { siteConfig } from "@/config/site";
import { ActionResponse } from "@/types/global";
import AuthSwitch from "../common/auth-switch";

// 1. Define the props for the AuthForm component
interface AuthFormProps<T extends FieldValues> {
  schema: ZodType<T> | any;
  defaultValues: T;
  onSubmit: (data: T) => Promise<ActionResponse>;
  formType: "SIGN_IN" | "SIGN_UP";
}

// 2. Create the AuthForm component
const AuthForm = <T extends FieldValues>({ schema, defaultValues, formType, onSubmit }: AuthFormProps<T>) => {
  const router = useRouter();

  // 3. Initialize the form using react-hook-form and zodResolver
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema) as Resolver<T>,
    defaultValues: defaultValues as DefaultValues<T>,
  });

  // 4. Define the submit handler
  const handleSubmit: SubmitHandler<T> = async (data) => {
    const result = (await onSubmit(data)) as ActionResponse;

    if (result?.success) {
      toast(`Successfully ${formType === "SIGN_IN" ? "Signed in successfully" : "Signed up successfully"}!`);
      router.push(siteConfig.ROUTES.HOME);
    } else {
      toast(`Error: ${result?.error || "Something went wrong. Please try again."}`);
    }
  };

  // 5. Determine the auth state for button text
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
