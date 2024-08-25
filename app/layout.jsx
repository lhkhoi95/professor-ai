import "./globals.css";
import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";
import LayoutProvider from "./components/layout-provider";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { Analytics } from "@vercel/analytics/react";
import { Toaster } from "@/components/ui/toaster";

const fontSans = Poppins({
  subsets: ["latin"],
  weight: ["500"],
  variable: "--font-sans",
});

export const metadata = {
  title: "ProfessorAI",
  description: "Ask a chatbot about your professor",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("font-sans", fontSans.variable)}>
        <ClerkProvider
          appearance={{
            baseTheme: dark,
          }}
        >
          <Analytics />
          <LayoutProvider>{children}</LayoutProvider>
          <Toaster />
        </ClerkProvider>
      </body>
    </html>
  );
}
