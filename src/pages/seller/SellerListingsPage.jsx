import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import PriceDisplay from "@/components/shared/PriceDisplay";
import AuctionStatusBadge from "@/components/auction/AuctionStatusBadge";
import EmptyState from "@/components/shared/EmptyState";
import { extractAuctionsData } from "@/api/apiHelpers";
import { useAuth } from "@/hooks/useAuth";
import { getUserAuctions } from "@/api/user.api";
import toast from "react-hot-toast";

export default function SellerListingsPage() {
  const { user } = useAuth();
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Set page title
  useEffect(() => {
    document.title = "My Listings - BidZen";
  }, []);

  useEffect(() => {
    const fetchSellerAuctions = async () => {
      try {
        setLoading(true);
        const userAuctions = await getUserAuctions();
        setAuctions(userAuctions);
      } catch (error) {
        console.error("Failed to fetch seller auctions:", error);
        toast.error("Failed to load your listings");
      } finally {
        setLoading(false);
      }
    };

    fetchSellerAuctions();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading your listings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">My Listings</h1>
          <p className="text-muted-foreground">Manage your auction listings</p>
        </div>

        {auctions.length === 0 ? (
          <EmptyState
            title="No listings yet"
            description="Create your first auction to get started"
            action={
              <Button asChild>
                <Link to="/seller/create">Create Auction</Link>
              </Button>
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {auctions.map((auction) => (
              <Card key={auction._id} className="flex flex-col h-full hover:shadow-md transition-shadow duration-200">
                <CardContent className="flex-1 p-5">
                  {/* Status badge */}
                  <div className="flex items-center justify-between mb-3">
                    <AuctionStatusBadge status={auction.status} endTime={auction.endTime} />
                    <span className="text-xs text-muted-foreground">
                      {new Date(auction.endTime).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-semibold text-foreground text-base leading-snug mb-2 line-clamp-2">
                    {auction.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {auction.description}
                  </p>

                  {/* Price */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-muted-foreground">Current Bid:</span>
                    <div className="font-bold">
                      <PriceDisplay amount={auction.currentBid || auction.startingPrice} />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/seller/listings/${auction._id}/edit`}>
                        Edit
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/auctions/${auction._id}`}>
                        View
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
