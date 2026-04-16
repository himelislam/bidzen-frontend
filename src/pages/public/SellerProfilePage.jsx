import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getAuctions } from "@/api/auction.api";
import AuctionGrid from "@/components/auction/AuctionGrid";
import EmptyState from "@/components/shared/EmptyState";

export default function SellerProfilePage() {
  // Set page title
  useEffect(() => {
    document.title = "Seller Profile - BidZen";
  }, []);
  const { id } = useParams();
  const [seller, setSeller] = useState(null);
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSellerAuctions = async () => {
      try {
        setLoading(true);
        const response = await getAuctions();
        const allAuctions = response.data || [];

        // Filter auctions by this seller
        const sellerAuctions = allAuctions.filter(auction =>
          auction.seller?._id === id
        );

        setAuctions(sellerAuctions);

        // Get seller info from first auction
        if (sellerAuctions.length > 0) {
          setSeller(sellerAuctions[0].seller);
        }
      } catch (err) {
        console.error("Failed to fetch seller auctions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSellerAuctions();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading seller profile...</p>
        </div>
      </div>
    );
  }

  if (!seller) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Seller not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Seller Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {seller.name}
          </h1>
          <p className="text-muted-foreground">Seller Profile</p>
        </div>

        {/* Auctions */}
        <div>
          <h2 className="text-2xl font-semibold text-foreground mb-6">
            {seller.name}'s Auctions
          </h2>
          <AuctionGrid auctions={auctions} loading={false} />
        </div>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-muted p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-primary">{auctions.length}</div>
            <p className="text-sm text-muted-foreground">Total Auctions</p>
          </div>
          <div className="bg-muted p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-primary">
              {auctions.filter(a => a.status === 'active').length}
            </div>
            <p className="text-sm text-muted-foreground">Active</p>
          </div>
          <div className="bg-muted p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-primary">
              {auctions.filter(a => a.status === 'closed').length}
            </div>
            <p className="text-sm text-muted-foreground">Completed</p>
          </div>
        </div>
      </div>
    </div>
  );
}
