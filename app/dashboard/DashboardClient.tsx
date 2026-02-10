"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import SubscriptionCard from "@/components/SubscriptionCard";
import HistoryList from "@/components/HistoryList";
import { ArrowLeft } from "lucide-react";

interface HistoryItem {
  id: string;
  targetUrl: string;
  myProduct: string;
  tone: string;
  companyName: string;
  companyDescription: string;
  result: string;
  createdAt: string;
}

interface DashboardClientProps {
  user: {
    name: string | null;
    email: string | null;
    image: string | null;
  };
  tier: "free" | "pro";
  currentPeriodEnd: string | null;
  usage: number;
  limit: number;
  initialHistory: {
    items: HistoryItem[];
    total: number;
    page: number;
    totalPages: number;
  };
}

export default function DashboardClient({
  tier,
  currentPeriodEnd,
  usage,
  limit,
  initialHistory,
}: DashboardClientProps) {
  const [history, setHistory] = useState(initialHistory);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const fetchHistory = useCallback(async (page: number) => {
    setLoadingHistory(true);
    try {
      const res = await fetch(`/api/history?page=${page}`);
      const data = await res.json();
      setHistory({
        items: data.items.map((item: HistoryItem) => ({
          ...item,
          createdAt: item.createdAt,
        })),
        total: data.total,
        page: data.page,
        totalPages: data.totalPages,
      });
    } catch {
      // Silently handle
    } finally {
      setLoadingHistory(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-5xl px-4 pt-24 pb-16 sm:px-6">
        <div className="mb-8 flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        </div>

        <div className="space-y-8">
          <SubscriptionCard
            status={tier}
            currentPeriodEnd={currentPeriodEnd}
            usage={usage}
            limit={limit}
          />

          <div>
            <h2 className="mb-4 text-lg font-semibold text-foreground">
              Email History
            </h2>
            <div className={loadingHistory ? "opacity-60" : ""}>
              <HistoryList
                items={history.items}
                total={history.total}
                page={history.page}
                totalPages={history.totalPages}
                onPageChange={fetchHistory}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
