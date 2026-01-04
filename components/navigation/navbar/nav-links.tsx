"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { SheetClose } from "@/components/ui/sheet";
import { sidebarLinks } from "@/constants";
import { cn } from "@/lib/utils";

interface NavLinksProps {
  isMobileNav?: boolean;
  userId?: string;
}

const NavLinks = ({ isMobileNav = false, userId }: NavLinksProps) => {
  const pathname = usePathname();

  return (
    <nav className="mt-4 flex flex-col gap-3">
      {sidebarLinks.map((item) => {
        const isActive = (pathname.includes(item.route) && item.route.length > 1) || pathname === item.route;

        // ✅ Do NOT mutate item.route
        let route = item.route;
        if (route === "/profile" && userId) {
          route = `${route}/${userId}`;
        }

        const link = (
          <Link
            key={item.label}
            href={route}
            className={cn(
              "flex items-center gap-4 rounded-lg p-3 transition",
              isActive
                ? "primary-gradient text-light-900"
                : "text-dark300_light900 hover:bg-light-800 dark:hover:bg-dark-300"
            )}
          >
            <Image
              src={item.imgURL}
              alt={item.label}
              width={20}
              height={20}
              className={cn({ "invert-colors": !isActive })}
            />

            <span className={cn(isActive ? "base-bold" : "base-medium", !isMobileNav && "max-lg:hidden")}>
              {item.label}
            </span>
          </Link>
        );

        return isMobileNav ? (
          <SheetClose asChild key={route}>
            {link}
          </SheetClose>
        ) : (
          <React.Fragment key={route}>{link}</React.Fragment>
        );
      })}
    </nav>
  );
};

export default NavLinks;
