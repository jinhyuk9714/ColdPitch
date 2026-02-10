"use client";

import { useState, useRef } from "react";
import Header from "@/components/Header";
import EmailForm from "@/components/EmailForm";
import EmailResult from "@/components/EmailResult";
import HowItWorks from "@/components/HowItWorks";
import PricingSection from "@/components/PricingSection";
import FAQ from "@/components/FAQ";
import type { GenerateResult } from "@/lib/openai";
import type { Tone } from "@/lib/prompt";

export default function Home() {
  const [result, setResult] = useState<GenerateResult | null>(null);
  const [error, setError] = useState("");
  const [warning, setWarning] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [lastRequest, setLastRequest] = useState<{
    url: string;
    myProduct: string;
    tone: Tone;
  } | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  function handleResult(data: GenerateResult & { warning?: string }) {
    setWarning(data.warning ?? "");
    setResult(data);
    setError("");
    setTimeout(
      () => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
      100
    );
  }

  async function handleRegenerate() {
    if (!lastRequest) return;
    setIsLoading(true);
    setError("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lastRequest),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setWarning(data.warning ?? "");
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Regeneration failed");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <Header />
      <main>
        {/* Hero Section */}
        <section
          id="generate"
          className="flex min-h-screen flex-col items-center justify-center px-4 pt-24 pb-16"
        >
          <div className="mb-10 text-center">
            <h1 className="text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl md:text-6xl">
              Paste a URL.
              <br />
              <span className="text-primary">Get a cold email.</span>
              <br />
              In seconds.
            </h1>
            <p className="mx-auto mt-6 max-w-lg text-lg text-muted-foreground">
              AI analyzes their website and crafts personalized cold emails
              instantly.
            </p>
          </div>

          <EmailForm
            onResult={handleResult}
            onError={setError}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            onRequestSaved={setLastRequest}
          />

          {/* Error display */}
          {error && (
            <div className="mt-6 w-full max-w-xl animate-fade-in rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-center text-sm text-red-400">
              {error}
            </div>
          )}

          {/* Warning display */}
          {warning && (
            <div className="mt-6 w-full max-w-xl animate-fade-in rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-4 text-center text-sm text-yellow-400">
              {warning}
            </div>
          )}

          {/* Result display */}
          <div ref={resultRef} className="mt-8 w-full max-w-xl">
            {result && (
              <EmailResult
                data={result}
                onRegenerate={handleRegenerate}
                isLoading={isLoading}
              />
            )}
          </div>
        </section>

        <HowItWorks />
        <PricingSection />
        <FAQ />

        {/* Footer */}
        <footer className="border-t border-border/50 py-8">
          <div className="mx-auto max-w-5xl px-4 text-center text-sm text-muted-foreground sm:px-6">
            <p>
              Built with AI.{" "}
              <span className="text-primary font-medium">ColdPitch</span> — Paste
              a URL, get a cold email.
            </p>
          </div>
        </footer>
      </main>
    </>
  );
}
