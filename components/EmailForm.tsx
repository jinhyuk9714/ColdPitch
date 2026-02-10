"use client";

import { useState, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import type { GenerateResult } from "@/lib/openai";
import type { Tone } from "@/lib/prompt";

interface EmailFormProps {
  onResult: (data: GenerateResult) => void;
  onError: (error: string) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  onRequestSaved: (req: { url: string; myProduct: string; tone: Tone }) => void;
}

const tones: { value: Tone; label: string }[] = [
  { value: "casual", label: "Casual" },
  { value: "professional", label: "Professional" },
  { value: "bold", label: "Bold" },
];

export default function EmailForm({
  onResult,
  onError,
  isLoading,
  setIsLoading,
  onRequestSaved,
}: EmailFormProps) {
  const [url, setUrl] = useState("");
  const [myProduct, setMyProduct] = useState("");
  const [tone, setTone] = useState<Tone>("professional");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!url.trim() || !myProduct.trim()) return;

    setIsLoading(true);
    onError("");
    const requestData = { url: url.trim(), myProduct: myProduct.trim(), tone };
    onRequestSaved(requestData);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      onResult(data);
    } catch (err) {
      onError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xl space-y-4">
      <div>
        <Input
          type="url"
          placeholder="https://their-company.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
          disabled={isLoading}
          className="h-12 border-border bg-card text-foreground placeholder:text-muted-foreground"
        />
      </div>
      <div>
        <Textarea
          placeholder="e.g. AI chatbot that handles customer support"
          value={myProduct}
          onChange={(e) => setMyProduct(e.target.value)}
          required
          disabled={isLoading}
          rows={2}
          className="resize-none border-border bg-card text-foreground placeholder:text-muted-foreground"
        />
      </div>
      <div className="flex items-center gap-2">
        {tones.map((t) => (
          <button
            key={t.value}
            type="button"
            onClick={() => setTone(t.value)}
            disabled={isLoading}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              tone === t.value
                ? "bg-primary text-primary-foreground"
                : "bg-card text-muted-foreground hover:bg-secondary hover:text-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <Button
        type="submit"
        disabled={isLoading || !url.trim() || !myProduct.trim()}
        className="h-12 w-full bg-primary text-base font-semibold text-primary-foreground hover:bg-primary/90"
        size="lg"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Analyzing & Generating...
          </>
        ) : (
          "Generate Cold Email"
        )}
      </Button>
    </form>
  );
}
