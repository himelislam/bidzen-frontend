import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAuctions } from "@/api/auction.api";
import AuctionGrid from "@/components/auction/AuctionGrid";
import { Button } from "@/components/ui/button";
import { isClosingSoon } from "@/utils/timeHelpers";
import { usePolling } from "@/hooks/usePolling";
import { POLLING_INTERVAL_LIST } from "@/utils/constants";

export default function HomePage() {
  // Set page title
  useEffect(() => {
    document.title = "BidZen - Premier Online Auction Platform";
  }, []);
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAuctions = async () => {
    try {
      setLoading(true);
      const response = await getAuctions();
      console.log("API Response:", response);
      const auctionsData = response.data?.data || response.data || [];
      console.log("Auctions data:", auctionsData);
      setAuctions(Array.isArray(auctionsData) ? auctionsData : []);
    } catch (err) {
      console.error("Failed to fetch auctions:", err);
      setAuctions([]);
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

  // Get first 6 active auctions for hero section
  const featuredAuctions = Array.isArray(auctions)
    ? auctions.filter(auction => auction.status === 'active').slice(0, 6)
    : [];

  // Get closing soon auctions
  const closingSoonAuctions = Array.isArray(auctions)
    ? auctions.filter(auction => auction.status === 'active' && isClosingSoon(auction.endTime))
      .sort((a, b) => new Date(a.endTime) - new Date(b.endTime))
    : [];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">
            Welcome to BidZen
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Your premier online auction platform for amazing deals
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary">
              <Link to="/auctions">Explore Auctions</Link>
            </Button>
            <Button asChild size="lg">
              <Link to="/register">Start Selling</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Auctions */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
            Featured Auctions
          </h2>
          <AuctionGrid auctions={featuredAuctions} loading={loading} />
        </div>
      </section>

      {/* Closing Soon */}
      {closingSoonAuctions.length > 0 && (
        <section className="py-16 bg-muted">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
              Closing Soon
            </h2>
            <AuctionGrid auctions={closingSoonAuctions} loading={false} />
          </div>
        </section>
      )}

      {/* How It Works */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-primary-foreground text-2xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">List</h3>
              <p className="text-muted-foreground">
                Sellers create auction listings with items they want to sell
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-primary-foreground text-2xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Bid</h3>
              <p className="text-muted-foreground">
                Buyers place competitive bids on items they want to purchase
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-primary-foreground text-2xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Win</h3>
              <p className="text-muted-foreground">
                Highest bidder wins the auction and gets the item
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Seller CTA */}
      <section className="py-16 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Ready to Start Selling?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of sellers who are already making money on BidZen
          </p>
          <Button asChild size="lg">
            <Link to="/register">Create Account</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
