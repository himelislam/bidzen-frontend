import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getUserBids } from "@/api/user.api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import PriceDisplay from "@/components/shared/PriceDisplay";
import AuctionStatusBadge from "@/components/auction/AuctionStatusBadge";
import EmptyState from "@/components/shared/EmptyState";
import { useAuth } from "@/hooks/useAuth";
import toast from "react-hot-toast";

export default function BuyerDashboardPage() {
  const { user } = useAuth();
  const [auctions, setAuctions] = useState([]);
  const [userBids, setUserBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalBids: 0,
    activeAuctions: 0,
    wonAuctions: 0,
    totalSpent: 0
  });

  // Fetch user's bids and calculate stats
  const fetchUserData = async () => {
    try {
      setLoading(true);

      // Use dedicated user API instead of fetching all auctions
      const response = await getUserBids();
      const userBids = response.data || [];
      setUserBids(userBids);

      // Calculate stats from user's bids
      const totalBids = userBids.length;
      const activeAuctions = userBids.filter(bid =>
        bid.auction?.status === 'active'
      ).length;
      const wonAuctions = userBids.filter(bid =>
        bid.auction?.status === 'closed' && bid.auction?.winner === user?._id
      ).length;
      const totalSpent = userBids.reduce((sum, bid) => sum + bid.amount, 0);

      setStats({
        totalBids,
        activeAuctions,
        wonAuctions,
        totalSpent
      });
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchUserData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Buyer Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user?.name}! Here's your bidding activity.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bids</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalBids}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Auctions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeAuctions}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Won Auctions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.wonAuctions}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                <PriceDisplay amount={stats.totalSpent} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Bids */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Bids</CardTitle>
              </CardHeader>
              <CardContent>
                {userBids.length === 0 ? (
                  <EmptyState
                    title="No bids yet"
                    description="Start bidding on auctions to see your activity here"
                    action={
                      <Button asChild>
                        <Link to="/auctions">Browse Auctions</Link>
                      </Button>
                    }
                  />
                ) : (
                  <div className="space-y-4">
                    {userBids.slice(0, 5).map((bid) => (
                      <div key={bid._id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <div className="font-medium">{bid.auction.title}</div>
                          <div className="text-sm text-muted-foreground">
                            <AuctionStatusBadge status={bid.auction.status} />
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">
                            <PriceDisplay amount={bid.amount} />
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(bid.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    ))}
                    {userBids.length > 5 && (
                      <div className="text-center pt-4">
                        <Button variant="outline" asChild>
                          <Link to="/my-bids">View All Bids</Link>
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button asChild className="w-full">
                  <Link to="/auctions">Browse Auctions</Link>
                </Button>
                <Button variant="outline" asChild className="w-full">
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
