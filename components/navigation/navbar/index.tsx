
import Image from "next/image";
import Link from "next/link";
import { ThemeSwitch } from "../../theme/theme-switch";
import MobileNavigation from "./mobile-navigation";

export default function Navbar() {
  return (
    <nav className="flex-between background-light900_dark200 shadow-light-300 fixed z-50 w-full gap-5 p-6 sm:px-12 dark:shadow-none">
      <Link href="/" className="flex items-center gap-1">
        <Image src="/images/site-logo.svg" width={23} height={23} alt="Dev Overflow Logo" />

        <p className="h2-bold font-space-grotesk text-dark-100 dark:text-light-900 max-sm:hidden">
          Dev<span className="text-primary-500">Overflow</span>
        </p>
      </Link>

      <p>Global Search</p>

      <div className="flex-between gap-5">
        <ThemeSwitch />

        <MobileNavigation />
      </div>
    </nav>
  );
}
