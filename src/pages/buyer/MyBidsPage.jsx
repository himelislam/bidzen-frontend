import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getUserBids } from "@/api/user.api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import PriceDisplay from "@/components/shared/PriceDisplay";
import AuctionStatusBadge from "@/components/auction/AuctionStatusBadge";
import EmptyState from "@/components/shared/EmptyState";
import { extractBidsData } from "@/api/apiHelpers";

export default function MyBidsPage() {
  const [userBids, setUserBids] = useState([]);
  const [loading, setLoading] = useState(true);

  // Set page title
  useEffect(() => {
    document.title = "My Bids - BidZen";
  }, []);

  useEffect(() => {
    const fetchUserBids = async () => {
      try {
        setLoading(true);
        // Use dedicated user API for efficient data fetching
        const response = await getUserBids();
        const userBids = response.data || [];
        setUserBids(userBids.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      } catch (error) {
        console.error("Failed to fetch user bids:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserBids();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading your bids...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">My Bids</h1>
          <p className="text-muted-foreground">View your bidding history and track your active auctions</p>
        </div>

        {userBids.length === 0 ? (
          <EmptyState
            title="No bids yet"
            description="Start bidding on auctions to see your bidding history here"
          />
        ) : (
          <div className="space-y-6">
            {userBids.map((bid) => (
              <Card key={`${bid.auction._id}-${bid._id}`} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg mb-2">
                        <Link
                          to={`/auctions/${bid.auction._id}`}
                          className="hover:text-primary transition-colors"
                        >
                          {bid.auction.title}
                        </Link>
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <AuctionStatusBadge
                          status={bid.auction.status}
                          endTime={bid.auction.endTime}
                        />
                        <span className="text-sm text-muted-foreground">
                          Placed on {new Date(bid.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground mb-1">Your Bid</div>
                      <PriceDisplay
                        amount={bid.amount}
                        className="text-lg font-bold text-primary"
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">
                        Starting Price: <PriceDisplay amount={bid.auction.startingPrice} />
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Current Highest: <PriceDisplay amount={bid.auction.currentHighestBid || bid.auction.startingPrice} />
                      </div>
                    </div>
                    <Button asChild variant="outline" size="sm">
                      <Link to={`/auctions/${bid.auction._id}`}>View Auction</Link>
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
