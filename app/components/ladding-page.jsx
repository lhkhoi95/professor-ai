import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

export default function LandingPage() {
  return (
    <div className="dark min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="mb-16 mt-16 flex flex-col items-center justify-center bg-card py-20 text-center text-card-foreground">
        <h1 className="animate-fade-in bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-600 bg-clip-text text-5xl font-extrabold tracking-tight text-transparent">
          Professor AI
        </h1>
        <p className="animate-fade-in-delay mt-6 max-w-2xl text-xl leading-relaxed text-yellow-200">
          Get instant ratings, reviews, and insights on your professors with the
          power of AI.
        </p>
        <Link href="/chat">
          <Button className="mt-8 transform rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 px-8 py-3 text-lg text-slate-100 transition-transform hover:scale-105 hover:from-yellow-600 hover:to-orange-600">
            Get Started
          </Button>
        </Link>
      </section>

      {/* Features Section */}
      <section className="mb-16 mt-16 bg-card py-16 text-center text-card-foreground">
        <div className="grid grid-cols-1 gap-8 px-6 md:grid-cols-3">
          <div className="group transform rounded-lg bg-secondary p-8 text-secondary-foreground shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
            <h3 className="mb-3 text-2xl font-bold transition-colors group-hover:text-yellow-400">
              Instant Feedback
            </h3>
            <p className="text-base leading-relaxed">
              Get immediate professor ratings and reviews from our extensive
              database.
            </p>
          </div>
          <div className="group transform rounded-lg bg-secondary p-8 text-secondary-foreground shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
            <h3 className="mb-3 text-2xl font-bold transition-colors group-hover:text-yellow-400">
              Submit Your Rating
            </h3>
            <p className="text-base leading-relaxed">
              Rate and review professors easily through our chatbot’s intuitive
              interface.
            </p>
          </div>
          <div className="group transform rounded-lg bg-secondary p-8 text-secondary-foreground shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
            <h3 className="mb-3 text-2xl font-bold transition-colors group-hover:text-yellow-400">
              Anonymous Feedback
            </h3>
            <p className="text-base leading-relaxed">
              Provide feedback anonymously to ensure your privacy and honesty.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
