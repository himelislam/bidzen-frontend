import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
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
import { setMetaTags, clearMetaTags } from "@/utils/seo";
import { extractAuctionData, extractBidsData } from "@/api/apiHelpers";
import { Button } from "@/components/ui/button";

export default function AuctionDetailsPage() {
  const { id } = useParams();
  const { user, isBuyer } = useAuth();

  const [auction, setAuction] = useState(null);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (auction) {
      setMetaTags(
        `${auction.title} - BidZen Auction`,
        auction.description?.substring(0, 160)
      );
    }
    return () => clearMetaTags();
  }, [auction]);

  const fetchAuctionDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      const [auctionRes, bidsRes] = await Promise.all([
        getAuctionById(id),
        getBids(id),
      ]);

      setAuction(extractAuctionData(auctionRes));
      setBids(extractBidsData(bidsRes));
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load auction");
    } finally {
      setLoading(false);
    }
  };

  const isActive = auction?.status === "active";
  usePolling(fetchAuctionDetails, POLLING_INTERVAL_DETAIL, isActive);

  useEffect(() => {
    fetchAuctionDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        <div className="animate-spin h-10 w-10 border-2 border-white border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-400">
        {error}
      </div>
    );
  }

  if (!auction) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-400">
        Auction not found
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-slate-950 text-white">

      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* HEADER */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">

            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                {auction.title}
              </h1>

              <AuctionStatusBadge status={auction.status} />

              <p className="text-slate-400 mt-3 max-w-2xl">
                {auction.description}
              </p>
            </div>

            <div className="text-right">
              <p className="text-sm text-slate-400">Seller</p>
              <p className="font-semibold">{auction.seller?.name}</p>
            </div>

          </div>
        </div>

        {/* MAIN GRID */}
        <div className="grid lg:grid-cols-3 gap-8">

          {/* LEFT CONTENT */}
          <div className="lg:col-span-2 space-y-6">

            {/* PRICING CARD */}
            <div className="grid md:grid-cols-2 gap-4">

              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
                <p className="text-slate-400 text-sm">Starting Price</p>
                <div className="text-2xl font-bold mt-2">
                  <PriceDisplay amount={auction.startingPrice} />
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-purple-900/20 border border-purple-500/30">
                <p className="text-purple-300 text-sm">Current Bid</p>
                <div className="text-3xl font-bold text-purple-300 mt-2">
                  <PriceDisplay
                    amount={auction.currentHighestBid || auction.startingPrice}
                  />
                </div>
              </div>

            </div>

            {/* COUNTDOWN */}
            {isActive && (
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 text-center">
                <p className="text-slate-400 mb-2">Time Remaining</p>
                <CountdownTimer endTime={auction.endTime} />
              </div>
            )}

            {/* BID HISTORY */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
              <BidHistory bids={bids} />
            </div>

            {/* FEEDBACK */}
            {auction.status === "closed" && (
              <div className="space-y-6">
                <FeedbackForm
                  auctionId={auction._id}
                  onSubmitted={fetchAuctionDetails}
                />
                <FeedbackList auctionId={auction._id} />
              </div>
            )}

          </div>

          {/* RIGHT SIDEBAR (STICKY BID PANEL) */}
          <div className="lg:col-span-1">

            <div className="sticky top-6 space-y-6">

              {/* BID FORM */}
              {isBuyer && isActive && (
                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
                  <h3 className="text-lg font-semibold mb-4">Place Your Bid</h3>
                  <BidForm
                    auction={auction}
                    onBidSuccess={fetchAuctionDetails}
                  />
                </div>
              )}

              {/* WINNER */}
              {auction.status === "closed" && auction.winner && (
                <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30">
                  <h3 className="text-lg font-bold text-amber-300">
                    🏆 Winner
                  </h3>

                  <p className="mt-2 font-semibold">
                    {auction.winner.name}
                  </p>

                  <p className="text-sm text-slate-300 mt-2">
                    Winning Bid:{" "}
                    <PriceDisplay amount={auction.currentHighestBid} />
                  </p>

                  {user?.role === "buyer" &&
                    auction.winner._id === user?._id && (
                      <Button asChild className="mt-4 w-full">
                        <Link to={`/auctions/${auction._id}/feedback`}>
                          Leave Feedback
                        </Link>
                      </Button>
                    )}
                </div>
              )}

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}