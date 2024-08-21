import { useState } from "react";
import { ModeToggle } from "@/components/toggle-button";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Menu, X } from "lucide-react";

export default function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="border-b">
      <div className="container mx-auto flex items-center justify-between px-4 py-3 sm:px-0">
        <Link href="/" className="flex items-center hover:brightness-125">
          <Image
            src="/images/logo.png"
            alt="logo"
            width={50}
            height={50}
            className="rounded-full"
          />

          <span className="ml-2 text-2xl font-bold">ProfessorAI</span>
        </Link>
        <div className="flex items-center">
          <div className="hidden items-center gap-4 sm:flex md:flex">
            <SignedOut>
              <Link href="/sign-in">
                <Button variant="secondary">Login</Button>
              </Link>
              <Link href="/sign-up">
                <Button>Register</Button>
              </Link>
            </SignedOut>
            {/* <ModeToggle /> */}
          </div>
          <SignedIn>
            <div className="hidden items-center gap-4 md:flex">
              <Link href="/chat">
                <Button className="hidden rounded-full md:block">Chat</Button>
              </Link>
              <UserButton
                appearance={{
                  elements: {
                    userButtonAvatarBox: "size-10",
                  },
                }}
              />
            </div>
          </SignedIn>
          <Button
            className="block pr-0 sm:hidden"
            variant="ghost"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>
      </div>

      {/* Mobile Action Buttons */}
      {isMenuOpen && (
        <MobileActionButtons
          isMenuOpen={isMenuOpen}
          setIsMenuOpen={setIsMenuOpen}
        />
      )}
    </div>
  );
}

export function MobileActionButtons({ isMenuOpen, setIsMenuOpen }) {
  return (
    <div
      className={`fixed top-0 right-0 z-50 h-screen w-1/2 transform transition-transform duration-300 ease-in-out ${
        isMenuOpen ? "translate-x-0" : "translate-x-full"
      } bg-slate-700 sm:hidden`}
    >
      <div className="container mx-auto flex flex-col items-start gap-4 px-4 py-4">
        <div className="flex w-full justify-end">
          <Button
            variant="ghost"
            className="pr-0"
            onClick={() => setIsMenuOpen(false)}
          >
            <X size={24} />
          </Button>
        </div>
        <SignedOut>
          <Link
            href="/sign-in"
            className="w-full"
            onClick={() => setIsMenuOpen(false)}
          >
            <Button variant="secondary" className="w-full">
              Login
            </Button>
          </Link>
          <Link
            href="/sign-up"
            className="w-full"
            onClick={() => setIsMenuOpen(false)}
          >
            <Button className="w-full">Register</Button>
          </Link>
        </SignedOut>
        <SignedIn>
          <Link href="/chat" className="w-full">
            <Button variant="outline" className="block w-full md:hidden">
              Chat
            </Button>
          </Link>
        </SignedIn>
        {/* <ModeToggle /> */}
      </div>
    </div>
  );
}
