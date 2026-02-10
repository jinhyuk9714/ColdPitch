"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronDown, ChevronUp, ExternalLink } from "lucide-react";

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

interface HistoryListProps {
  items: HistoryItem[];
  total: number;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function HistoryList({
  items,
  total,
  page,
  totalPages,
  onPageChange,
}: HistoryListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-border/50 bg-card p-12 text-center">
        <p className="text-muted-foreground">
          No emails generated yet. Start by generating your first cold email!
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border/50 bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Company</TableHead>
            <TableHead>URL</TableHead>
            <TableHead>Tone</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="w-10" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => {
            const isExpanded = expandedId === item.id;
            let emails: { subject: string; body: string }[] = [];
            try {
              const parsed = JSON.parse(item.result);
              emails = parsed.emails ?? [];
            } catch {
              // Invalid JSON
            }

            return (
              <>
                <TableRow
                  key={item.id}
                  className="cursor-pointer"
                  onClick={() =>
                    setExpandedId(isExpanded ? null : item.id)
                  }
                >
                  <TableCell className="font-medium">
                    {item.companyName}
                  </TableCell>
                  <TableCell>
                    <a
                      href={item.targetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-primary hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {new URL(item.targetUrl).hostname}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </TableCell>
                  <TableCell className="capitalize">{item.tone}</TableCell>
                  <TableCell>
                    {new Date(item.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </TableCell>
                  <TableCell>
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    )}
                  </TableCell>
                </TableRow>
                {isExpanded && (
                  <TableRow key={`${item.id}-detail`}>
                    <TableCell colSpan={5} className="bg-muted/30 p-4">
                      <div className="space-y-4">
                        <div>
                          <p className="text-xs font-medium text-muted-foreground">
                            Your Product
                          </p>
                          <p className="mt-1 text-sm text-foreground">
                            {item.myProduct}
                          </p>
                        </div>
                        {emails.map(
                          (
                            email: { subject: string; body: string },
                            idx: number
                          ) => (
                            <div
                              key={idx}
                              className="rounded-lg border border-border/50 bg-card p-4"
                            >
                              <p className="text-xs font-medium text-muted-foreground">
                                Email {idx + 1}
                              </p>
                              <p className="mt-1 text-sm font-medium text-foreground">
                                {email.subject}
                              </p>
                              <p className="mt-2 text-sm text-muted-foreground whitespace-pre-wrap">
                                {email.body}
                              </p>
                            </div>
                          )
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </>
            );
          })}
        </TableBody>
      </Table>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-border/50 px-4 py-3">
          <p className="text-sm text-muted-foreground">
            {total} total results
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
              className="rounded-lg bg-secondary px-3 py-1.5 text-sm text-secondary-foreground transition-colors hover:bg-secondary/80 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages}
              className="rounded-lg bg-secondary px-3 py-1.5 text-sm text-secondary-foreground transition-colors hover:bg-secondary/80 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
