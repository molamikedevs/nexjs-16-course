"use client"

import * as React from "react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { themes } from "@/constants"
import { MoonIcon, ServerIcon, SunIcon } from "../icons"



export function ThemeSwitch() {
  const { theme, setTheme } = useTheme();
  

  return (
    <DropdownMenu>
     <DropdownMenuTrigger asChild>
  <Button variant="outline" size="icon">
    <SunIcon className={cn(
      "h-[1.2rem] w-[1.2rem] transition-all",
      theme === "light" ? "scale-100 rotate-0 text-yellow-600" : "scale-0 -rotate-90"
    )} />
    <MoonIcon size={34} className={cn(
      "absolute h-[1.2rem] w-[1.2rem] transition-all",
      theme === "dark" ? "scale-100 rotate-0 text-yellow-600" : "scale-0 rotate-90"
    )} />
    <ServerIcon className={cn(
      "absolute h-[1.2rem] w-[1.2rem] transition-all",
      theme === "system" ? "scale-100 text-yellow-600" : "scale-0"
    )} />
    <span className="sr-only">Toggle theme</span>
  </Button>
</DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {themes.map(({ value, icon: Icon, label }) => (
          <DropdownMenuItem 
            key={value} 
            onClick={() => setTheme(value)}
            className="flex items-center gap-2"
          >
            <Icon className={cn(
              "size-5",
              theme === value ? "text-primary-500" : "text-dark300_light900"
            )} />
            <span className={cn(
              theme === value ? "primary-text-gradient" : "text-dark300_light900"
            )}>
              {label}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}