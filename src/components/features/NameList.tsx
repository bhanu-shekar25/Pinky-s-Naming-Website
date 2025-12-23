import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowDownWideNarrow, Clock, Quote, Search, ArrowDown, ListOrdered } from "lucide-react";
import { Name, SortOption } from "@/lib/types";
import { NameCard } from "./NameCard";
import { NewNamesModal } from "./NewNamesModal";

interface NameListProps {
    names: Name[];
    votedIds: string[];
    onVote: (id: string) => void;
}

export function NameList({ names, votedIds, onVote }: NameListProps) {
    const [sortBy, setSortBy] = useState<SortOption>("most-voted");
    const [searchQuery, setSearchQuery] = useState("");
    const [visibleCount, setVisibleCount] = useState(12);
    const [showTimeline, setShowTimeline] = useState(false);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setVisibleCount(12); // Reset pagination on search
    };

    const filteredAndSortedNames = useMemo(() => {
        let result = [...names];

        // 1. Filter
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase().trim();
            result = result.filter(n =>
                n.displayName.toLowerCase().includes(query) ||
                (n.meaning && n.meaning.toLowerCase().includes(query))
            );
        }

        // 2. Sort
        result.sort((a, b) => {
            if (sortBy === "most-voted") {
                if (b.votes !== a.votes) return b.votes - a.votes;
                return a.name.localeCompare(b.name);
            }
            if (sortBy === "newest") {
                return (b.createdAt || 0) - (a.createdAt || 0);
            }
            if (sortBy === "alphabetical") {
                return a.name.localeCompare(b.name);
            }
            return 0;
        });

        return result;
    }, [names, sortBy, searchQuery]);

    const displayedNames = filteredAndSortedNames.slice(0, visibleCount);
    const hasMore = visibleCount < filteredAndSortedNames.length;

    const loadMore = () => setVisibleCount(prev => prev + 12);

    return (
        <div className="w-full max-w-4xl mx-auto mt-8 px-2 space-y-6">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6">

                {/* Search Bar & View Toggle */}
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <div className="relative w-full md:max-w-xs group flex-1">
                        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                            <Search className="w-4 h-4 text-gray-400 group-focus-within:text-pink-deep transition-colors" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search names..."
                            value={searchQuery}
                            onChange={handleSearchChange}
                            className="w-full py-2.5 pl-9 pr-4 bg-white/80 backdrop-blur-sm border border-pink-100 rounded-full shadow-sm 
                                     focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-300 
                                     placeholder:text-gray-400 text-gray-700 text-sm transition-all"
                        />
                    </div>

                    <button
                        onClick={() => setShowTimeline(true)}
                        className="p-2.5 bg-white/80 backdrop-blur-sm border border-pink-100 rounded-full shadow-sm 
                                 hover:bg-white hover:text-pink-deep hover:border-pink-200 hover:shadow-md transition-all
                                 text-foreground/60"
                        title="View Timeline"
                        aria-label="View New Names Timeline"
                    >
                        <ListOrdered className="w-5 h-5" />
                    </button>
                </div>

                {/* Sort Controls */}
                <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar w-full md:w-auto justify-center md:justify-end">
                    <SortButton
                        active={sortBy === "most-voted"}
                        onClick={() => setSortBy("most-voted")}
                        icon={<ArrowDownWideNarrow className="w-3.5 h-3.5" />}
                        label="Top"
                    />
                    <SortButton
                        active={sortBy === "newest"}
                        onClick={() => setSortBy("newest")}
                        icon={<Clock className="w-3.5 h-3.5" />}
                        label="New"
                    />
                    <SortButton
                        active={sortBy === "alphabetical"}
                        onClick={() => setSortBy("alphabetical")}
                        icon={<Quote className="w-3.5 h-3.5" />}
                        label="A-Z"
                    />
                </div>
            </div>

            {/* Grid List */}
            <div className="space-y-8 pb-12">
                <motion.div
                    layout
                    className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                >
                    <AnimatePresence mode="popLayout">
                        {displayedNames.map((name) => (
                            <NameCard
                                key={name.id}
                                nameData={name}
                                onVote={onVote}
                                hasVoted={votedIds.includes(name.id)}
                            />
                        ))}
                    </AnimatePresence>
                </motion.div>

                {/* Empty States */}
                {filteredAndSortedNames.length === 0 && (
                    <div className="text-center text-foreground/50 py-12 flex flex-col items-center animate-in fade-in zoom-in-95 duration-300">
                        {searchQuery ? (
                            <>
                                <Search className="w-12 h-12 text-pink-100 mb-2" />
                                <p className="text-lg">No names match "{searchQuery}"</p>
                                <button
                                    onClick={() => setSearchQuery("")}
                                    className="text-pink-deep text-sm hover:underline mt-1"
                                >
                                    Clear search
                                </button>
                            </>
                        ) : (
                            <div className="text-center text-foreground/50 py-10 font-serif italic text-lg">
                                No names yet. Be the first to suggest one for Pinky!
                            </div>
                        )}
                    </div>
                )}

                {/* Load More Button */}
                {hasMore && (
                    <div className="flex justify-center pt-4">
                        <button
                            onClick={loadMore}
                            className="group flex items-center gap-2 px-6 py-2.5 bg-white/60 hover:bg-white border border-pink-100 
                                     rounded-full shadow-sm hover:shadow-md text-pink-deep/80 hover:text-pink-deep 
                                     transition-all duration-300 font-medium text-sm backdrop-blur-sm"
                        >
                            <span>Show more names</span>
                            <ArrowDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
                        </button>
                    </div>
                )}
            </div>

            <NewNamesModal
                isOpen={showTimeline}
                onClose={() => setShowTimeline(false)}
                names={names}
                votedIds={votedIds}
                onVote={onVote}
            />
        </div>
    );
}

function SortButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon?: React.ReactNode, label: string }) {
    return (
        <button
            onClick={onClick}
            className={`
        px-4 py-2 rounded-full text-xs font-medium transition-all duration-200 flex items-center gap-1.5 whitespace-nowrap
        ${active
                    ? "bg-pink-deep text-white shadow-md scale-105"
                    : "bg-white/80 text-foreground/70 hover:bg-white hover:text-pink-deep border border-pink-100 hover:border-pink-200"}
      `}
        >
            {icon}
            <span>{label}</span>
        </button>
    );
}
