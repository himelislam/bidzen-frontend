import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getUserBids } from "@/api/user.api";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PriceDisplay from "@/components/shared/PriceDisplay";
import AuctionStatusBadge from "@/components/auction/AuctionStatusBadge";
import EmptyState from "@/components/shared/EmptyState";
import toast from "react-hot-toast";

export default function MyBidsPage() {
  const [userBids, setUserBids] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "My Bids - BidZen";
  }, []);

  useEffect(() => {
    const fetchBids = async () => {
      try {
        setLoading(true);
        const res = await getUserBids();
        const bids = res.data || [];

        setUserBids(
          bids.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          )
        );
      } catch (err) {
        toast.error("Failed to load bids");
      } finally {
        setLoading(false);
      }
    };

    fetchBids();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <div className="animate-spin h-10 w-10 border-2 border-purple-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-slate-950 text-white">

      {/* Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-purple-600/20 blur-[140px] rounded-full pointer-events-none"></div>

      <div className="relative max-w-6xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold">My Bids</h1>
          <p className="text-slate-400 mt-2">
            Track all your bidding activity in real-time
          </p>
        </div>

        {/* Empty */}
        {userBids.length === 0 ? (
          <EmptyState
            title="No bids yet"
            description="Start bidding on auctions to see activity here"
          />
        ) : (
          <div className="space-y-5">

            {userBids.map((bid) => (
              <Card
                key={`${bid.auction._id}-${bid._id}`}
                className="bg-white/5 border border-white/10 backdrop-blur-xl text-white hover:border-purple-500/40 transition hover:scale-[1.01]"
              >
                <CardHeader className="pb-3">

                  <div className="flex justify-between items-start">

                    {/* Left */}
                    <div>
                      <Link
                        to={`/auctions/${bid.auction._id}`}
                        className="text-lg font-semibold hover:text-purple-300 transition"
                      >
                        {bid.auction.title}
                      </Link>

                      <div className="flex items-center gap-3 mt-2">
                        <AuctionStatusBadge
                          status={bid.auction.status}
                          endTime={bid.auction.endTime}
                        />

                        <span className="text-xs text-slate-400">
                          {new Date(bid.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* Right (Your Bid) */}
                    <div className="text-right">
                      <p className="text-xs text-slate-400">Your Bid</p>
                      <div className="text-xl font-bold text-purple-300">
                        <PriceDisplay amount={bid.amount} />
                      </div>
                    </div>

                  </div>

                </CardHeader>

                <CardContent>

                  <div className="flex justify-between items-center">

                    {/* Price Info */}
                    <div className="text-sm text-slate-400 space-y-1">
                      <p>
                        Starting:{" "}
                        <PriceDisplay amount={bid.auction.startingPrice} />
                      </p>

                      <p>
                        Highest:{" "}
                        <PriceDisplay
                          amount={
                            bid.auction.currentHighestBid ||
                            bid.auction.startingPrice
                          }
                        />
                      </p>
                    </div>

                    {/* Action */}
                    <Button
                      asChild
                      size="sm"
                      className="bg-white/10 border border-white/10 hover:bg-white/20 hover:border-purple-500/50 transition"
                    >
                      <Link to={`/auctions/${bid.auction._id}`}>
                        View Auction
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