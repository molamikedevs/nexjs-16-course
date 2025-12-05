import Link from "next/link";
import { siteConfig } from "@/config/site";

export default function AuthSwitch({ formType }: { formType: "SIGN_IN" | "SIGN_UP" }) {
  return (
    <>
      {formType === "SIGN_IN" ? (
        <p>
          Don&apos;t have an account?{" "}
          <Link href={siteConfig.ROUTES.SIGN_UP} className="paragraph-semibold primary-text-gradient">
            Sign up
          </Link>
        </p>
      ) : (
        <p>
          Already have an account?{" "}
          <Link href={siteConfig.ROUTES.SIGN_IN} className="paragraph-semibold primary-text-gradient">
            Sign in
          </Link>
        </p>
      )}
    </>
  );
}
