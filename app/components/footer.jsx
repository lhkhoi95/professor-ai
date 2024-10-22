import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="not-prose mt-56 border-t">
      <div className="container py-24">
        <div className="grid gap-6">
          <div className="grid gap-6">
            <Link href="/" className="flex items-center">
              <Image
                src={"/images/logojpg.jpg"}
                alt="Logo"
                width={100}
                height={100}
                className="rounded-full hover:brightness-125"
              />

              <span className="ml-2 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-2xl font-bold text-transparent">
                ProfessorAI
              </span>
            </Link>
          </div>
          <div className="flex flex-col gap-3 text-sm text-muted-foreground md:flex-row">
            <p className="mr-2">Created by: </p>
            <p>
              <a
                href="https://www.linkedin.com/in/lhkhoi95/"
                className="underline hover:text-slate-700"
                target="_blank"
              >
                Khoi Ly
              </a>
            </p>

            <p>
              <a
                href="https://nisargoza.github.io/dev/"
                className="underline hover:text-slate-700"
                target="_blank"
              >
                Nisarg Oza
              </a>
            </p>
            <p>
              <a
                href="https://www.raglandconnor.com/"
                className="underline hover:text-slate-700"
                target="_blank"
              >
                Connor Ragland
              </a>
            </p>
            <p>
              <a
                href="https://www.linkedin.com/in/angel39706/"
                className="underline hover:text-slate-700"
                target="_blank"
              >
                Angel Martinez
              </a>
            </p>
            <p>@ 2024. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
