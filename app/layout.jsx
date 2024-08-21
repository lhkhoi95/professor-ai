import "./globals.css";
import { Roboto } from "next/font/google";
import { cn } from "@/lib/utils";
import LayoutProvider from "./components/layout-provider";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

const fontSans = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  variable: "--font-sans",
});

export const metadata = {
  title: "ProfessorAI",
  description: "Ask a chatbot about your professor",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <ClerkProvider
          appearance={{
            baseTheme: dark,
          }}
        >
          <LayoutProvider>{children}</LayoutProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
