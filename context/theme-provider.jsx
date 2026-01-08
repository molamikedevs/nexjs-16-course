'use client'
import { TooltipProvider } from "@/components/ui/tooltip";

import { ThemeProvider as NextThemesProvider } from 'next-themes'
const ThemeProvider = ({ children, ...props }) => {
    return (
      <NextThemesProvider {...props}>
        <TooltipProvider delayDuration={200}>{children}</TooltipProvider>
      </NextThemesProvider>
    );
}

export default ThemeProvider