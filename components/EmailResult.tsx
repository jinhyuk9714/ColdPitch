"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy, Check, RefreshCw, Loader2 } from "lucide-react";
import type { GenerateResult } from "@/lib/openai";

interface EmailResultProps {
  data: GenerateResult;
  onRegenerate: () => void;
  isLoading: boolean;
}

export default function EmailResult({
  data,
  onRegenerate,
  isLoading,
}: EmailResultProps) {
  const [copiedId, setCopiedId] = useState<number | null>(null);

  async function handleCopy(email: { id: number; subject: string; body: string }) {
    const text = `Subject: ${email.subject}\n\n${email.body}`;
    await navigator.clipboard.writeText(text);
    setCopiedId(email.id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  return (
    <div className="w-full max-w-xl animate-fade-in-up space-y-4">
      {/* Company Info Card */}
      <div className="rounded-xl border border-border/50 bg-card/50 p-5 backdrop-blur-sm">
        <div className="mb-2 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 text-sm">
            🏢
          </div>
          <h3 className="text-lg font-semibold text-foreground">
            {data.company.name}
          </h3>
        </div>
        <p className="mb-3 text-sm text-muted-foreground">
          {data.company.description}
        </p>
        <div className="flex flex-wrap gap-2">
          {data.company.keyPoints.map((point, i) => (
            <Badge
              key={i}
              variant="secondary"
              className="bg-primary/10 text-primary"
            >
              {point}
            </Badge>
          ))}
        </div>
      </div>

      {/* Email Tabs */}
      <Tabs defaultValue="1" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-card">
          {data.emails.map((email) => (
            <TabsTrigger
              key={email.id}
              value={String(email.id)}
              className="text-xs sm:text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              {email.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {data.emails.map((email) => (
          <TabsContent key={email.id} value={String(email.id)}>
            <div className="rounded-xl border border-border/50 bg-card/50 p-5 backdrop-blur-sm">
              <div className="mb-4">
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Subject
                </span>
                <p className="mt-1 text-base font-semibold text-primary">
                  {email.subject}
                </p>
              </div>
              <div className="mb-4">
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Body
                </span>
                <div className="mt-2 whitespace-pre-wrap font-mono text-sm leading-relaxed text-foreground/90">
                  {email.body}
                </div>
              </div>
              <div className="flex items-center justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopy(email)}
                  className="border-border bg-card text-foreground hover:bg-secondary"
                >
                  {copiedId === email.id ? (
                    <>
                      <Check className="mr-1.5 h-3.5 w-3.5 text-green-400" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="mr-1.5 h-3.5 w-3.5" />
                      Copy
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onRegenerate}
                  disabled={isLoading}
                  className="border-border bg-card text-foreground hover:bg-secondary"
                >
                  {isLoading ? (
                    <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
                  )}
                  Regenerate
                </Button>
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
