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
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="h-10 w-10 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const statCards = [
    { label: "Total Bids", value: stats.totalBids },
    { label: "Active Auctions", value: stats.activeAuctions },
    { label: "Won Auctions", value: stats.wonAuctions },
  ];

  return (
    <div className="min-h-screen pt-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 py-10">

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-foreground">
            Buyer Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            Welcome back, <span className="text-primary">{user?.name}</span>
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">

          {statCards.map((item, i) => (
            <Card
              key={i}
              className="border border-white/10 bg-background/60 backdrop-blur-xl hover:shadow-lg transition"
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">
                  {item.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">
                  {item.value}
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Spent */}
          <Card className="border border-cyan-500/20 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 backdrop-blur-xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">
                Total Spent
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-cyan-400">
                <PriceDisplay amount={stats.totalSpent} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Bids */}
          <div className="lg:col-span-2">
            <Card className="border border-white/10 bg-background/60 backdrop-blur-xl">
              <CardHeader>
                <CardTitle>Recent Bids</CardTitle>
              </CardHeader>

              <CardContent className="space-y-3">

                {userBids.length === 0 ? (
                  <EmptyState
                    title="No bids yet"
                    description="Start bidding on auctions"
                    action={
                      <Button asChild>
                        <Link to="/auctions">Browse Auctions</Link>
                      </Button>
                    }
                  />
                ) : (
                  userBids.slice(0, 6).map((bid) => (
                    <div
                      key={bid._id}
                      className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-background/40 hover:border-cyan-500/30 transition"
                    >
                      <div>
                        <Link
                          to={`/auctions/${bid.auction._id}`}
                          className="font-medium hover:text-primary transition"
                        >
                          {bid.auction.title}
                        </Link>

                        <div className="text-xs mt-1">
                          <AuctionStatusBadge status={bid.auction.status} />
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-bold text-primary">
                          <PriceDisplay amount={bid.amount} />
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(bid.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))
                )}

              </CardContent>
            </Card>
          </div>

          {/* Actions */}
          <div>
            <Card className="border border-white/10 bg-background/60 backdrop-blur-xl">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>

              <CardContent className="space-y-3">
                <Button
                  asChild
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-90"
                >
                  <Link to="/auctions">Browse Auctions</Link>
                </Button>

                <Button
                  variant="outline"
                  asChild
                  className="w-full border-white/10 hover:bg-white/5"
                >
                  <Link to="/my-bids">My Bids</Link>
                </Button>
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
}