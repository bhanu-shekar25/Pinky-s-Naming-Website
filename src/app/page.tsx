"use client";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { NameSubmission } from "@/components/features/NameSubmission";
import { NameList } from "@/components/features/NameList";
import { Podium } from "@/components/features/Podium";
import { useNames } from "@/lib/hooks/useNames";
import { Sparkles } from "lucide-react";
import { UserActivityModal } from "@/components/features/UserActivityModal";
import { NameSuggestions } from "@/components/features/NameSuggestions";
import { useState } from "react";

export default function Home() {
  const { names, loading, votedIds, submittedIds, addName, voteName } = useNames();
  const [isActivityOpen, setIsActivityOpen] = useState(false);

  // Get top 3 for podium
  const topNames = [...names]
    .sort((a, b) => {
      // 1. Priority: Names starting with L or V
      const isPriorityA = /^[LV]/i.test(a.name);
      const isPriorityB = /^[LV]/i.test(b.name);

      if (isPriorityA && !isPriorityB) return -1;
      if (!isPriorityA && isPriorityB) return 1;

      // 2. Vote Count (Descending)
      if (b.votes !== a.votes) return b.votes - a.votes;

      // 3. Creation Time (Ascending - Older is better)
      const timeA = a.createdAt ? (typeof a.createdAt === 'number' ? a.createdAt : 0) : 0;
      const timeB = b.createdAt ? (typeof b.createdAt === 'number' ? b.createdAt : 0) : 0;
      return timeA - timeB;
    })
    .slice(0, 3)
    .filter(n => n.votes > 0); // Only show on podium if they have votes

  return (
    <div className="min-h-screen flex flex-col items-center relative overflow-x-hidden">

      {/* Background Decor */}
      <div className="fixed inset-0 -z-10 bg-cream pointer-events-none">
        <div className="absolute top-0 left-0 w-64 h-64 bg-pink-soft/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute top-1/2 right-0 w-80 h-80 bg-lavender/10 rounded-full blur-3xl translate-x-1/2"></div>
        <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-peach/10 rounded-full blur-3xl translate-y-1/3"></div>
      </div>

      <Header />

      <main className="flex-1 w-full max-w-4xl px-4 flex flex-col items-center">

        {/* Podium - Only show if we have votes */}
        {topNames.length > 0 && (
          <section className="w-full animate-in fade-in slide-in-from-bottom-4 duration-700 relative z-10">
            <Podium topNames={topNames} />
          </section>
        )}

        <section className="w-full mb-2 md:mb-4 mt-6 animate-in fade-in slide-in-from-bottom-8 duration-700 relative z-40">
          <NameSuggestions onAddName={addName} existingNames={names} />
        </section>

        <section className="w-full mb-4 mt-1 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100 relative z-30">
          <NameSubmission onSubmit={addName} />
        </section>

        <section className="w-full animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200 relative z-20">
          <div className="flex items-center justify-center gap-2 mb-1 opacity-50">
            <span className="h-px w-12 bg-foreground/20"></span>
            <Sparkles className="w-4 h-4" />
            <span className="h-px w-12 bg-foreground/20"></span>
          </div>
          {loading ? (
            <div className="text-center py-20 text-foreground/50 animate-pulse">
              Loading names...
            </div>
          ) : (
            <NameList
              names={names}
              votedIds={votedIds}
              submittedIds={submittedIds}
              onVote={voteName}
              onOpenActivity={() => setIsActivityOpen(true)}
            />
          )}
        </section>

      </main>

      <UserActivityModal
        isOpen={isActivityOpen}
        onClose={() => setIsActivityOpen(false)}
        names={names}
        votedIds={votedIds}
        submittedIds={submittedIds}
        onVote={voteName}
      />

      <Footer />
    </div>
  );
}
