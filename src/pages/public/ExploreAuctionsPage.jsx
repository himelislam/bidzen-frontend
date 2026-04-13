import { useState, useEffect } from "react";
import { getAuctions } from "@/api/auction.api";
import AuctionGrid from "@/components/auction/AuctionGrid";
import EmptyState from "@/components/shared/EmptyState";
import { usePolling } from "@/hooks/usePolling";
import { POLLING_INTERVAL_LIST } from "@/utils/constants";

export default function ExploreAuctionsPage() {
  // Set page title
  useEffect(() => {
    document.title = "Explore Auctions - BidZen";
  }, []);
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);

  const fetchAuctions = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAuctions();
      let filteredAuctions = response.data;

      if (searchTerm) {
        filteredAuctions = filteredAuctions.filter(auction =>
          auction.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      setAuctions(filteredAuctions);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch auctions");
    } finally {
      setLoading(false);
    }
  };

  // Poll for new auctions every 30 seconds
  usePolling(fetchAuctions, POLLING_INTERVAL_LIST);

  // Initial fetch
  useEffect(() => {
    fetchAuctions();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">
            Explore Auctions
          </h1>

          {/* Search */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search auctions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full max-w-md px-4 py-2 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive p-4 rounded-lg mb-6">
              <p className="text-sm">{error}</p>
            </div>
          )}
        </div>

        {/* Auction Grid */}
        <AuctionGrid auctions={auctions} loading={loading} />
      </div>
    </div>
  );
}
