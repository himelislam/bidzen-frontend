import { useState, useEffect, useMemo } from "react";
import { getAuctions } from "@/api/auction.api";
import AuctionGrid from "@/components/auction/AuctionGrid";
import EmptyState from "@/components/shared/EmptyState";
import { usePolling } from "@/hooks/usePolling";
import { POLLING_INTERVAL_LIST } from "@/utils/constants";
import { extractAuctionsData } from "@/api/apiHelpers";

export default function ExploreAuctionsPage() {
  useEffect(() => {
    document.title = "Explore Auctions - BidZen";
  }, []);

  const [allAuctions, setAllAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);

  const fetchAuctions = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getAuctions();
      const data = extractAuctionsData(response);

      setAllAuctions(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to fetch auctions");
    } finally {
      setLoading(false);
    }
  };

  usePolling(fetchAuctions, POLLING_INTERVAL_LIST);

  useEffect(() => {
    fetchAuctions();
  }, []);

  // Smart filtering (FAST + CLEAN)
  const filteredAuctions = useMemo(() => {
    if (!searchTerm) return allAuctions;

    return allAuctions.filter((auction) =>
      auction.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [allAuctions, searchTerm]);

  return (
    <div className="min-h-screen pt-20 bg-slate-950 text-white">

      {/* HERO SECTION */}
      <section className="relative py-16 bg-gradient-to-r from-indigo-700 via-purple-700 to-slate-900">

        <div className="absolute inset-0 bg-black/30"></div>

        <div className="relative max-w-7xl mx-auto px-6 text-center">

          <h1 className="text-4xl md:text-5xl font-bold mb-3">
            Explore Live Auctions
          </h1>

          <p className="text-slate-200 mb-8">
            Discover thousands of real-time bidding opportunities
          </p>

          {/* SEARCH BOX */}
          <div className="max-w-2xl mx-auto">
            <input
              type="text"
              placeholder="Search auctions by title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-5 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-slate-300 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>

        </div>
      </section>

      {/* CONTENT */}
      <section className="py-16">

        <div className="max-w-7xl mx-auto px-6">

          {/* ERROR */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300">
              {error}
            </div>
          )}

          {/* RESULTS HEADER */}
          <div className="flex items-center justify-between mb-8">

            <h2 className="text-2xl font-semibold">
              {searchTerm ? "Search Results" : "All Auctions"}
            </h2>

            <p className="text-slate-400 text-sm">
              {filteredAuctions.length} items found
            </p>

          </div>

          {/* GRID CONTAINER */}
          <div className="rounded-3xl bg-slate-900/40 border border-white/10 backdrop-blur-xl p-6">

            {filteredAuctions.length === 0 && !loading ? (
              <EmptyState
                title="No Auctions Found"
                description="Try searching with different keywords"
              />
            ) : (
              <AuctionGrid
                auctions={filteredAuctions}
                loading={loading}
              />
            )}

          </div>

        </div>

      </section>

    </div>
  );
}