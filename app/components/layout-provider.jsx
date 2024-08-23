"use client";
import { usePathname } from "next/navigation";
import NavBar from "./navbar";
import Footer from "./footer";
import { ThemeProvider } from "@/components/theme-provider";

export default function LayoutProvider({ children }) {
  const pathname = usePathname();
  const shouldShowFooter = pathname !== "/chat" && pathname !== "/submit-data";

  return (
    <ThemeProvider attribute="class" defaultTheme="system">
      <NavBar />
      {children}
      {shouldShowFooter && <Footer />}
    </ThemeProvider>
  );
}
