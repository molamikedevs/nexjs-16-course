"use client";

import AuthForm from "@/components/forms/auth-form";
import { SignUpSchema } from "@/lib/validation";

export default function SignUpPage() {
  return (
    <AuthForm
      formType="SIGN_UP"
      schema={SignUpSchema}
      defaultValues={{ username: "", name: "", email: "", password: "" }}
      onSubmit={(values) =>
        Promise.resolve({
          success: true,
          data: values,
        })
      }
    />
  );
}
