import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAuctions } from "@/api/auction.api";
import AuctionGrid from "@/components/auction/AuctionGrid";
import { usePolling } from "@/hooks/usePolling";
import { POLLING_INTERVAL_LIST } from "@/utils/constants";
import { extractAuctionsData } from "@/api/apiHelpers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import PriceDisplay from "@/components/shared/PriceDisplay";
import AuctionStatusBadge from "@/components/auction/AuctionStatusBadge";
import EmptyState from "@/components/shared/EmptyState";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import toast from "react-hot-toast";

export default function AdminDashboardPage() {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resolveDialog, setResolveDialog] = useState({ open: false, auctionId: null });
  const [isResolving, setIsResolving] = useState(false);

  // Set page title
  useEffect(() => {
    document.title = "Admin Dashboard - BidZen";
  }, []);

  useEffect(() => {
    const fetchSystemData = async () => {
      try {
        setLoading(true);
        const response = await getAuctions();
        // Extract auctions from nested response structure
        setAuctions(extractAuctionsData(response));
      } catch (error) {
        console.error("Failed to fetch system data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSystemData();
  }, []);

  const stats = {
    totalAuctions: auctions.length,
    activeAuctions: auctions.filter(a => a.status === 'active').length,
    closedAuctions: auctions.filter(a => a.status === 'closed').length,
    flaggedAuctions: auctions.filter(a => a.status === 'flagged').length,
    totalValue: auctions.reduce((sum, a) => sum + (a.currentHighestBid || a.startingPrice), 0),
  };

  const flaggedAuctions = auctions.filter(a => a.status === 'flagged');
  const recentAuctions = auctions
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const handleResolveFlag = async (auctionId) => {
    try {
      setIsResolving(true);

      // This would normally call an API to resolve the flag
      // For now, we'll simulate success
      await new Promise(resolve => setTimeout(resolve, 1000));

      setAuctions(auctions.map(a =>
        a._id === auctionId ? { ...a, status: 'active' } : a
      ));
      setResolveDialog({ open: false, auctionId: null });
      toast.success("Flag resolved successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to resolve flag");
    } finally {
      setIsResolving(false);
    }
  };

  const openResolveDialog = (auctionId) => {
    setResolveDialog({ open: true, auctionId });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading system data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">System overview and management</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Auctions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalAuctions}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.activeAuctions}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Closed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.closedAuctions}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Flagged</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.flaggedAuctions}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Value</CardTitle>
            </CardHeader>
            <CardContent>
              <PriceDisplay amount={stats.totalValue} className="text-2xl font-bold" />
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Flagged Auctions */}
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-4">Flagged Auctions</h2>
            {flaggedAuctions.length === 0 ? (
              <EmptyState
                title="No flagged auctions"
                description="All auctions are currently in compliance"
              />
            ) : (
              <div className="space-y-4">
                {flaggedAuctions.map((auction) => (
                  <Card key={auction._id} className="border-red-200 dark:border-red-800">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg mb-2">
                            <Link
                              to={`/auctions/${auction._id}`}
                              className="hover:text-primary transition-colors"
                            >
                              {auction.title}
                            </Link>
                          </CardTitle>
                          <div className="flex items-center gap-2">
                            <AuctionStatusBadge
                              status={auction.status}
                              endTime={auction.endTime}
                            />
                            <span className="text-sm text-muted-foreground">
                              by {auction.seller?.name}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-muted-foreground mb-1">Current Bid</div>
                          <PriceDisplay
                            amount={auction.currentHighestBid || auction.startingPrice}
                            className="text-lg font-bold text-primary"
                          />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="text-sm text-muted-foreground">
                            Created: {new Date(auction.createdAt).toLocaleDateString()}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Flagged reason: {auction.flaggedReason || "Manual review"}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button asChild variant="outline" size="sm">
                            <Link to={`/auctions/${auction._id}`}>Review</Link>
                          </Button>
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => openResolveDialog(auction._id)}
                          >
                            Resolve
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Recent Activity */}
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-4">Recent Activity</h2>
            {recentAuctions.length === 0 ? (
              <EmptyState
                title="No recent activity"
                description="No auctions have been created recently"
              />
            ) : (
              <div className="space-y-4">
                {recentAuctions.map((auction) => (
                  <Card key={auction._id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg mb-2">
                            <Link
                              to={`/auctions/${auction._id}`}
                              className="hover:text-primary transition-colors"
                            >
                              {auction.title}
                            </Link>
                          </CardTitle>
                          <div className="flex items-center gap-2">
                            <AuctionStatusBadge
                              status={auction.status}
                              endTime={auction.endTime}
                            />
                            <span className="text-sm text-muted-foreground">
                              by {auction.seller?.name}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-muted-foreground mb-1">Current Bid</div>
                          <PriceDisplay
                            amount={auction.currentHighestBid || auction.startingPrice}
                            className="text-lg font-bold text-primary"
                          />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="text-sm text-muted-foreground">
                            Created: {new Date(auction.createdAt).toLocaleDateString()}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Bids: {auction.bidCount || 0}
                          </div>
                        </div>
                        <Button asChild variant="outline" size="sm">
                          <Link to={`/auctions/${auction._id}`}>View</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-foreground mb-4">Quick Actions</h2>
          <div className="flex gap-4">
            <Button asChild>
              <Link to="/admin/users">Manage Users</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/auctions">View All Auctions</Link>
            </Button>
          </div>
        </div>

        {/* Resolve Flag Confirmation Dialog */}
        <ConfirmDialog
          open={resolveDialog.open}
          onOpenChange={(open) => setResolveDialog({ ...resolveDialog, open })}
          title="Resolve Flag"
          description="Are you sure you want to resolve this flag? This will remove the flag and restore the auction to active status."
          confirmText="Resolve"
          onConfirm={() => handleResolveFlag(resolveDialog.auctionId)}
          loading={isResolving}
        />
      </div>
    </div>
  );
}
