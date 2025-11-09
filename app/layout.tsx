import "./globals.css";
import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { inter, spaceGrotesk } from "@/config/font";
import { siteConfig } from "@/config/site";
import ThemeProvider from "@/context/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { auth } from "@/auth";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: siteConfig.icons.icon,
  },
};


export default async function GlobalLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          type="text/css"
          href="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css"
        />
      </head>
      <SessionProvider session={session}>
        <body className={`${inter.className} ${spaceGrotesk.variable} antialiased`} suppressHydrationWarning>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            {children}
            <Toaster />
          </ThemeProvider>
        </body>
      </SessionProvider>
    </html>
  );
}
