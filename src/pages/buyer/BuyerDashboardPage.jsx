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

export default function BuyerDashboardPage() {
  const { user } = useAuth();
  const [userBids, setUserBids] = useState([]);
  const [loading, setLoading] = useState(true);

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

            <h2 className="text-xl font-semibold mb-4">Recent Bids</h2>

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
                    <CardContent className="flex justify-between items-center p-5">

                      <div>
                        <Link
                          to={`/auctions/${bid.auction._id}`}
                          className="font-medium hover:text-cyan-400 transition"
                        >
                          {bid.auction.title}
                        </Link>

                        <div className="text-xs mt-1">
                          <AuctionStatusBadge status={bid.auction.status} />
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-bold text-cyan-400">
                          <PriceDisplay amount={bid.amount} />
                        </div>
                        <div className="text-xs text-slate-400">
                          {new Date(bid.createdAt).toLocaleDateString()}
                        </div>
                      </div>

                    </CardContent>
                  </Card>
                ))}

              </div>
            )}

          </div>

          {/* Actions */}
          <div>

            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>

            <div className="space-y-3">

              <Button
                asChild
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-90"
              >
                <Link to="/auctions">Browse Auctions</Link>
              </Button>

              <Button
                variant="outline"
                asChild
                className="w-full border-white/10 hover:bg-white/5 text-black"
              >
                <Link to="/my-bids" className="text-black">My Bids</Link>
              </Button>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
}