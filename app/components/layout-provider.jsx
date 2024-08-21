"use client";
import { usePathname } from "next/navigation";
import NavBar from "./navbar";
import Footer from "./footer";
import { ThemeProvider } from "@/components/theme-provider";

export default function LayoutProvider({ children }) {
  const pathname = usePathname();
  return (
    <ThemeProvider attribute="class" defaultTheme="system">
      <NavBar />
      {children}
      {pathname !== "/chat" && <Footer />}
    </ThemeProvider>
  );
}
