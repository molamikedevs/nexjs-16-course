"use client";

import AuthForm from "@/components/forms/auth-form";
import { SignInSchema } from "@/lib/validation";

export default function SignInPage() {
  return (
    <AuthForm
      formType="SIGN_IN"
      schema={SignInSchema}
      defaultValues={{ email: "", password: "" }}
      onSubmit={(values) =>
        Promise.resolve({
          success: true,
          data: values,
        })
      }
    />
  );
}
