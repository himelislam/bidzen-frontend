import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PriceDisplay from "@/components/shared/PriceDisplay";
import AuctionStatusBadge from "@/components/auction/AuctionStatusBadge";
import EmptyState from "@/components/shared/EmptyState";
import { getUserAuctions } from "@/api/user.api";
import toast from "react-hot-toast";

export default function SellerListingsPage() {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "My Listings - BidZen";
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await getUserAuctions();
        setAuctions(res || []);
      } catch (err) {
        toast.error("Failed to load listings");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <div className="animate-spin h-10 w-10 border-2 border-purple-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h- pt-20 bg-slate-950 text-white">

      {/* Glow background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-purple-600/20 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold">My Listings</h1>
          <p className="text-slate-400 mt-2">
            Manage and track your auctions in real time
          </p>
        </div>

        {/* Empty */}
        {auctions.length === 0 ? (
          <EmptyState
            title="No listings yet"
            description="Create your first auction and start selling instantly"
            action={
              <Button asChild className="bg-gradient-to-r from-purple-500 to-indigo-500">
                <Link to="/seller/create">Create Auction</Link>
              </Button>
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {auctions.map((auction) => (
              <Card
                key={auction._id}
                className="bg-white/5 border border-white/10 backdrop-blur-xl text-white hover:scale-[1.02] hover:border-purple-500/50 transition-all duration-300"
              >
                <CardContent className="p-5 flex flex-col h-full">

                  {/* Top */}
                  <div className="flex justify-between items-start mb-3">
                    <AuctionStatusBadge
                      status={auction.status}
                      endTime={auction.endTime}
                    />

                    <span className="text-xs text-slate-400">
                      {new Date(auction.endTime).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-semibold mb-2 line-clamp-2">
                    {auction.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-slate-400 line-clamp-2 mb-4">
                    {auction.description}
                  </p>

                  {/* Price Box */}
                  <div className="flex items-center justify-between bg-white/5 p-3 rounded-xl border border-white/10 mb-5">
                    <span className="text-sm text-slate-400">Current Bid</span>
                    <div className="text-purple-300 font-bold">
                      <PriceDisplay
                        amount={auction.currentBid || auction.startingPrice}
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-auto flex gap-2">

                    <Button
                      asChild
                      size="sm"
                      className="flex-1 bg-white/10 border border-white/10 hover:bg-white/20 hover:border-purple-500/50 transition"
                    >
                      <Link to={`/seller/listings/${auction._id}/edit`}>
                        Edit
                      </Link>
                    </Button>

                    <Button
                      asChild
                      size="sm"
                      className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-500 hover:scale-105 transition"
                    >
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