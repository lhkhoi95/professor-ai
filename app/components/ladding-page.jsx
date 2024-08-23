import React from "react";

export default function LandingPage() {
  return (
    <div className="min-h-screen dark bg-background text-foreground">

      <section className="py-20 mt-16 mb-16 text-center bg-card text-card-foreground">
        <h1 className="text-4xl font-bold">Professor Ai</h1>
        <p className="mt-4 text-lg">
          Get instant ratings, reviews, and insights on your professors with the power of AI.
        </p>
        <button className="mt-6 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-full shadow hover:bg-secondary hover:text-secondary-foreground">
          Get Started
        </button>
      </section>

      <section className="py-16 mt-16 mb-16 text-center bg-card text-card-foreground">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-6">
          <div className="p-6 rounded-lg shadow bg-secondary text-secondary-foreground">
            <h3 className="text-xl font-bold mb-3">Instant Feedback</h3>
            <p>Get immediate professor ratings and reviews from our extensive database.</p>
          </div>
          <div className="p-6 rounded-lg shadow bg-secondary text-secondary-foreground">
            <h3 className="text-xl font-bold mb-3">Submit Your Rating</h3>
            <p>Rate and review professors easily through our chatbot’s intuitive interface.</p>
          </div>
          <div className="p-6 rounded-lg shadow bg-secondary text-secondary-foreground">
            <h3 className="text-xl font-bold mb-3">Anonymous Feedback</h3>
            <p>Provide feedback anonymously to ensure your privacy and honesty.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
