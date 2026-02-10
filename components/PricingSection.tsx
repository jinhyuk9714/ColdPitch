"use client";

import { useSession, signIn } from "next-auth/react";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { useState } from "react";

const freePlan = {
  name: "Free",
  price: "$0",
  period: "",
  description: "Get started with no commitment",
  features: [
    "3 emails per day (guest)",
    "5 emails per day (signed in)",
    "3 email variations",
    "All tone options",
    "Copy to clipboard",
  ],
};

const proPlan = {
  name: "Pro",
  price: "$9",
  period: "/month",
  description: "For serious outreach",
  features: [
    "Unlimited emails",
    "All tone options",
    "Priority generation",
    "Email history & dashboard",
  ],
};

export default function PricingSection() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);

  async function handleProClick() {
    if (!session?.user) {
      signIn("google");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/lemon/checkout", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      // Silently handle error
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="pricing" className="py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
            Simple pricing
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Start free. Upgrade when you need more.
          </p>
        </div>
        <div className="mx-auto grid max-w-3xl grid-cols-1 gap-8 md:grid-cols-2">
          {/* Free Plan */}
          <div className="relative rounded-xl border border-border/50 bg-card/50 p-8">
            <h3 className="text-xl font-semibold text-foreground">
              {freePlan.name}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {freePlan.description}
            </p>
            <div className="mt-6 flex items-baseline">
              <span className="text-4xl font-bold text-foreground">
                {freePlan.price}
              </span>
            </div>
            <ul className="mt-6 space-y-3">
              {freePlan.features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-center gap-2 text-sm text-muted-foreground"
                >
                  <Check className="h-4 w-4 text-primary" />
                  {feature}
                </li>
              ))}
            </ul>
            <a
              href="#generate"
              className="mt-8 block rounded-lg bg-secondary py-2.5 text-center text-sm font-medium text-secondary-foreground transition-colors hover:bg-secondary/80"
            >
              Start Free
            </a>
          </div>

          {/* Pro Plan */}
          <div className="relative rounded-xl border border-primary bg-card p-8 shadow-lg shadow-primary/5">
            <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground">
              Popular
            </Badge>
            <h3 className="text-xl font-semibold text-foreground">
              {proPlan.name}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {proPlan.description}
            </p>
            <div className="mt-6 flex items-baseline">
              <span className="text-4xl font-bold text-foreground">
                {proPlan.price}
              </span>
              <span className="ml-1 text-muted-foreground">
                {proPlan.period}
              </span>
            </div>
            <ul className="mt-6 space-y-3">
              {proPlan.features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-center gap-2 text-sm text-muted-foreground"
                >
                  <Check className="h-4 w-4 text-primary" />
                  {feature}
                </li>
              ))}
            </ul>
            <button
              onClick={handleProClick}
              disabled={loading}
              className="mt-8 block w-full rounded-lg bg-primary py-2.5 text-center text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
            >
              {loading
                ? "Redirecting..."
                : session?.user
                  ? "Upgrade to Pro"
                  : "Sign in to Upgrade"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
