import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getUserBids } from "@/api/user.api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PriceDisplay from "@/components/shared/PriceDisplay";
import AuctionStatusBadge from "@/components/auction/AuctionStatusBadge";
import EmptyState from "@/components/shared/EmptyState";
import { useAuth } from "@/hooks/useAuth";
import toast from "react-hot-toast";
import { Search, Gavel, TrendingUp, Clock } from "lucide-react";
import BidForm from "@/components/auction/BidForm";

export default function BuyerDashboardPage() {
  const { user } = useAuth();
  const [userBids, setUserBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAuction, setSelectedAuction] = useState(null);

  const [stats, setStats] = useState({
    totalBids: 0,
    activeAuctions: 0,
    wonAuctions: 0,
    totalSpent: 0,
  });

  const fetchUserData = async () => {
    try {
      setLoading(true);

      const response = await getUserBids();
      const bids = response.data || [];
      setUserBids(bids);

      const totalBids = bids.length;
      const activeAuctions = bids.filter(
        (b) => b.auction?.status === "active"
      ).length;

      const wonAuctions = bids.filter(
        (b) =>
          b.auction?.status === "closed" &&
          b.auction?.winner === user?._id
      ).length;

      const totalSpent = bids.reduce((sum, b) => sum + b.amount, 0);

      setStats({ totalBids, activeAuctions, wonAuctions, totalSpent });
    } catch (err) {
      toast.error("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen pt-20 bg-slate-950 flex items-center justify-center text-white">
        <div className="animate-spin h-10 w-10 border-2 border-cyan-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const statCards = [
    { label: "Total Bids", value: stats.totalBids, color: "text-white" },
    { label: "Active Auctions", value: stats.activeAuctions, color: "text-green-400" },
    { label: "Won Auctions", value: stats.wonAuctions, color: "text-emerald-400" },
  ];

  return (
    <div className="min-h-screen pt-20 bg-slate-950 text-white">

      {/* Glow Background (same seller style) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-cyan-500/20 blur-[140px] rounded-full pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold">Buyer Dashboard</h1>
          <p className="text-slate-400 mt-1">
            Welcome back{" "}
            <span className="text-cyan-400 font-medium">{user?.name}</span>
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">

          {statCards.map((item, i) => (
            <div
              key={i}
              className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md hover:scale-[1.02] transition"
            >
              <p className="text-sm text-slate-400">{item.label}</p>
              <div className={`text-2xl font-bold ${item.color}`}>
                {item.value}
              </div>
            </div>
          ))}

          {/* Total Spent */}
          <div className="p-5 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 backdrop-blur-md">
            <p className="text-sm text-slate-400">Total Spent</p>
            <div className="text-2xl font-bold text-cyan-400">
              <PriceDisplay amount={stats.totalSpent} />
            </div>
          </div>

        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Bids */}
          <div className="lg:col-span-2">

            <h2 className="text-xl font-semibold mb-4 text-white">Recent Bids</h2>

            {userBids.length === 0 ? (
              <EmptyState
                title="No bids yet"
                description="Start bidding on auctions"
              />
            ) : (
              <div className="space-y-3">

                {userBids.slice(0, 6).map((bid) => (
                  <Card
                    key={bid._id}
                    className="bg-white/5 border border-white/10 backdrop-blur-xl hover:border-cyan-500/40 transition"
                  >
                    <CardContent className="p-5">

                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <Link
                            to={`/auctions/${bid.auction._id}`}
                            className="font-medium text-white hover:text-cyan-400 transition"
                          >
                            {bid.auction.title}
                          </Link>

                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-xs px-2 py-1 bg-slate-700 rounded text-slate-300">
                              {bid.auction.category || 'other'}
                            </span>
                            <AuctionStatusBadge status={bid.auction.status} />
                            {bid.auction.status === 'active' && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setSelectedAuction(bid.auction)}
                                className="border-cyan-500/30 hover:bg-cyan-500/10 text-cyan-400 text-xs px-2 py-1 h-6"
                              >
                                Bid Now
                              </Button>
                            )}
                          </div>
                        </div>

                        <div className="text-right ml-4">
                          <div className="font-bold text-cyan-400">
                            <PriceDisplay amount={bid.amount} />
                          </div>
                          <div className="text-xs text-slate-400">
                            Your bid
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 text-xs text-slate-400 border-t border-slate-700 pt-3">
                        <div>
                          <div className="text-slate-500">Current Bid</div>
                          <div className="text-white font-medium">
                            <PriceDisplay amount={bid.auction.currentHighestBid || 0} />
                          </div>
                        </div>
                        <div>
                          <div className="text-slate-500">Ends In</div>
                          <div className="text-white font-medium">
                            {bid.auction.endTime ? (
                              new Date(bid.auction.endTime) > new Date() ? (
                                Math.ceil((new Date(bid.auction.endTime) - new Date()) / (1000 * 60 * 60 * 24)) > 0 ?
                                  `${Math.ceil((new Date(bid.auction.endTime) - new Date()) / (1000 * 60 * 60 * 24))}d` :
                                  `${Math.ceil((new Date(bid.auction.endTime) - new Date()) / (1000 * 60 * 60))}h`
                              ) : 'Ended'
                            ) : 'N/A'}
                          </div>
                        </div>
                        <div>
                          <div className="text-slate-500">Total Bids</div>
                          <div className="text-white font-medium">
                            {bid.auction.bidCount || 0}
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center mt-3 text-xs text-slate-400">
                        <div>
                          Bid on {new Date(bid.createdAt).toLocaleDateString()}
                        </div>
                        {bid.auction.winner === user?._id && bid.auction.status === 'closed' && (
                          <div className="text-green-400 font-medium">
                            You Won!
                          </div>
                        )}
                      </div>

                    </CardContent>
                  </Card>
                ))}

              </div>
            )}

          </div>

          {/* Right Sidebar */}
          <div className="space-y-8">
            {/* Quick Actions */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white">Quick Actions</h2>

              <div className="space-y-3">
                <Button
                  asChild
                  className="w-full bg-slate-800 hover:bg-slate-700 text-white border border-white/10"
                >
                  <Link to="/auctions" className="flex items-center justify-center gap-2">
                    <Search className="h-4 w-4" />
                    Browse Auctions
                  </Link>
                </Button>

                <Button
                  variant="secondary"
                  asChild
                  className="w-full border-white/20 bg-slate-300 hover:bg-white/10 text-white"
                >
                  <Link to="/my-bids" className="flex items-center justify-center gap-2">
                    <Gavel className="h-4 w-4" />
                    My Bids
                  </Link>
                </Button>
              </div>

            </div>

            {/* Bid Form */}
            <div>
              {selectedAuction ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-white">Place Bid</h2>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setSelectedAuction(null)}
                      className="text-slate-400 hover:text-white"
                    >
                      ×
                    </Button>
                  </div>
                  <div className="text-sm text-slate-400 mb-2">
                    Bidding on: <span className="text-white font-medium">{selectedAuction.title}</span>
                  </div>
                  <BidForm
                    auction={selectedAuction}
                    onBidSuccess={() => {
                      setSelectedAuction(null);
                      fetchUserData();
                    }}
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-white">Quick Bid</h2>
                  <div className="bg-slate-800 border border-white/10 rounded-lg p-6 text-center">
                    <Gavel className="h-8 w-8 text-slate-400 mx-auto mb-3" />
                    <p className="text-slate-400 text-sm">
                      Select an active auction from your bids to place a new bid
                    </p>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}