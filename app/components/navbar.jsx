import { useState } from "react";
import { ModeToggle } from "@/components/toggle-button";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Menu, X } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isLoaded } = useUser();

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

          <span className="ml-2 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-2xl font-bold text-transparent">
            ProfessorAI
          </span>
        </Link>
        <div className="flex items-center">
          <div className="hidden items-center gap-2 sm:flex md:flex">
            <SignedOut>
              <Link href="/sign-in">
                <Button variant="secondary" className="rounded-full">
                  Login
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button className="rounded-full">Register</Button>
              </Link>
            </SignedOut>
            {/* <ModeToggle /> */}
          </div>
          <SignedIn>
            <div className="hidden items-center gap-4 md:flex">
              <Link href="/submit-data">
                <Button
                  variant="secondary"
                  className="hidden rounded-full md:block"
                >
                  Review
                </Button>
              </Link>
              <Link href="/bookmarks">
                <Button
                  variant="secondary"
                  className="hidden rounded-full md:block"
                >
                  Bookmarks
                </Button>
              </Link>
              <Link href="/chat">
                <Button className="hidden rounded-full md:block">Chat</Button>
              </Link>
              {isLoaded ? (
                <UserButton
                  appearance={{
                    elements: {
                      userButtonAvatarBox: "size-10",
                    },
                  }}
                />
              ) : (
                <Avatar>
                  <AvatarFallback />
                </Avatar>
              )}
            </div>
          </SignedIn>
          <Button
            className="block p-0 sm:hidden"
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
          <div className="w-full text-center">
            <UserButton appearance={{ elements: { avatarBox: "size-10" } }} />
          </div>
          <Link href="/chat" className="w-full">
            <Button
              variant="outline"
              className="block w-full border border-none bg-yellow-500 md:hidden"
              onClick={() => setIsMenuOpen(false)}
            >
              Chat
            </Button>
          </Link>
          <Link href="/submit-data" className="w-full">
            <Button
              variant="outline"
              className="block w-full md:hidden"
              onClick={() => setIsMenuOpen(false)}
            >
              Review
            </Button>
          </Link>
          <Link href="/bookmarks" className="w-full">
            <Button
              variant="outline"
              className="block w-full md:hidden"
              onClick={() => setIsMenuOpen(false)}
            >
              Bookmarks
            </Button>
          </Link>
        </SignedIn>
        {/* <ModeToggle /> */}
      </div>
    </div>
  );
}
