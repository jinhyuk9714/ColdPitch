"use client";

import { useState } from "react";
import { Crown, Zap } from "lucide-react";

interface SubscriptionCardProps {
  status: "free" | "pro";
  currentPeriodEnd?: string | null;
  usage: number;
  limit: number;
}

export default function SubscriptionCard({
  status,
  currentPeriodEnd,
  usage,
  limit,
}: SubscriptionCardProps) {
  const [loading, setLoading] = useState(false);
  const isPro = status === "pro";

  async function handleClick() {
    setLoading(true);
    try {
      const endpoint = isPro ? "/api/lemon/portal" : "/api/lemon/checkout";
      const res = await fetch(endpoint, { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      // Silently handle
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl border border-border/50 bg-card p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-lg ${
              isPro ? "bg-primary/10" : "bg-muted"
            }`}
          >
            {isPro ? (
              <Crown className="h-5 w-5 text-primary" />
            ) : (
              <Zap className="h-5 w-5 text-muted-foreground" />
            )}
          </div>
          <div>
            <h3 className="font-semibold text-foreground">
              {isPro ? "Pro Plan" : "Free Plan"}
            </h3>
            {isPro && currentPeriodEnd && (
              <p className="text-xs text-muted-foreground">
                Renews{" "}
                {new Date(currentPeriodEnd).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            )}
          </div>
        </div>
        <button
          onClick={handleClick}
          disabled={loading}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:opacity-60 ${
            isPro
              ? "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              : "bg-primary text-primary-foreground hover:bg-primary/90"
          }`}
        >
          {loading
            ? "Loading..."
            : isPro
              ? "Manage Subscription"
              : "Upgrade to Pro"}
        </button>
      </div>

      {/* Usage bar */}
      <div className="mt-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Today&apos;s usage</span>
          <span className="font-medium text-foreground">
            {isPro ? `${usage} generated` : `${usage} / ${limit}`}
          </span>
        </div>
        {!isPro && (
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${Math.min((usage / limit) * 100, 100)}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
