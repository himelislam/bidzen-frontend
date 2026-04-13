import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getAuctionById } from "@/api/auction.api";
import { getBids } from "@/api/bid.api";
import AuctionStatusBadge from "@/components/auction/AuctionStatusBadge";
import CountdownTimer from "@/components/auction/CountdownTimer";
import BidHistory from "@/components/auction/BidHistory";
import BidForm from "@/components/auction/BidForm";
import FeedbackForm from "@/components/feedback/FeedbackForm";
import FeedbackList from "@/components/feedback/FeedbackList";
import PriceDisplay from "@/components/shared/PriceDisplay";
import { useAuth } from "@/hooks/useAuth";
import { usePolling } from "@/hooks/usePolling";
import { POLLING_INTERVAL_DETAIL } from "@/utils/constants";

export default function AuctionDetailsPage() {
  // Set page title
  useEffect(() => {
    document.title = "Auction Details - BidZen";
  }, []);
  const { id } = useParams();
  const { user, isBuyer } = useAuth();
  const [auction, setAuction] = useState(null);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAuctionDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const [auctionResponse, bidsResponse] = await Promise.all([
        getAuctionById(id),
        getBids(id)
      ]);

      setAuction(auctionResponse.data);
      setBids(bidsResponse.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch auction details");
    } finally {
      setLoading(false);
    }
  };

  // Poll for new bids every 15 seconds while auction is active
  const isActive = auction?.status === 'active';
  usePolling(fetchAuctionDetails, POLLING_INTERVAL_DETAIL, isActive);

  // Initial fetch
  useEffect(() => {
    fetchAuctionDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading auction details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center text-destructive">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!auction) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Auction not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Auction Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {auction.title}
              </h1>
              <AuctionStatusBadge status={auction.status} endTime={auction.endTime} />
            </div>
            <div className="text-right">
              <span className="text-sm text-muted-foreground">Seller:</span>
              <p className="font-medium text-foreground">{auction.seller?.name}</p>
            </div>
          </div>

          {/* Description */}
          <p className="text-muted-foreground mb-6 leading-relaxed">
            {auction.description}
          </p>

          {/* Pricing */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Starting Price</h3>
              <PriceDisplay
                amount={auction.startingPrice}
                className="text-2xl font-bold text-foreground"
              />
            </div>
            <div className="bg-primary/10 p-4 rounded-lg border-2 border-primary">
              <h3 className="text-sm font-medium text-primary mb-2">Current Highest Bid</h3>
              <PriceDisplay
                amount={auction.currentHighestBid || auction.startingPrice}
                className="text-3xl font-bold text-primary"
              />
            </div>
          </div>

          {/* Countdown */}
          {isActive && (
            <div className="bg-muted p-4 rounded-lg text-center">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Time Remaining</h3>
              <CountdownTimer endTime={auction.endTime} />
            </div>
          )}
        </div>

        {/* Bid Form - Only for buyers when auction is active */}
        {isBuyer && isActive && (
          <div className="mb-8">
            <BidForm auction={auction} onBidSuccess={fetchAuctionDetails} />
          </div>
        )}

        {/* Bid History */}
        <div className="mb-8">
          <BidHistory bids={bids} />
        </div>

        {/* Winner Banner - When auction is closed and has winner */}
        {auction.status === 'closed' && auction.winner && (
          <div className="bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-200 dark:border-amber-800 p-6 rounded-lg text-center mb-8">
            <div className="text-2xl mb-2"></div>
            <h2 className="text-xl font-bold text-amber-800 dark:text-amber-200">
              Winner: {auction.winner.name}
            </h2>
            <p className="text-amber-700 dark:text-amber-300">
              Winning bid: <PriceDisplay amount={auction.currentHighestBid} />
            </p>
          </div>
        )}

        {/* Feedback Section - Only when auction is closed */}
        {auction.status === 'closed' && (
          <div className="space-y-8">
            {/* Feedback Form - Only for winning buyer or listing seller */}
            {(user?.role === 'buyer' || user?.role === 'seller') && (
              <FeedbackForm
                auctionId={auction._id}
                onSubmitted={fetchAuctionDetails}
              />
            )}

            {/* Feedback List - Always show for closed auctions */}
            <FeedbackList auctionId={auction._id} />
          </div>
        )}
      </div>
    </div>
  );
}
