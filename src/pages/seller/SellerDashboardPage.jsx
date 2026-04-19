import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getUserAuctions, deleteAuction, getSellerStats } from "@/api/user.api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import PriceDisplay from "@/components/shared/PriceDisplay";
import AuctionStatusBadge from "@/components/auction/AuctionStatusBadge";
import EmptyState from "@/components/shared/EmptyState";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import toast from "react-hot-toast";

export default function SellerDashboardPage() {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, auctionId: null });
  const [isDeleting, setIsDeleting] = useState(false);

  // Set page title
  useEffect(() => {
    document.title = "Seller Dashboard - BidZen";
  }, []);

  useEffect(() => {
    const fetchSellerAuctions = async () => {
      try {
        setLoading(true);
        // Use dedicated user API to get seller's auctions only
        const auctions = await getUserAuctions();
        setAuctions(auctions);
      } catch (error) {
        console.error("Failed to fetch seller auctions:", error);
        toast.error("Failed to load your auctions");
      } finally {
        setLoading(false);
      }
    };

    fetchSellerAuctions();
  }, []);

  useEffect(() => {
    const fetchSellerStatistics = async () => {
      try {
        const stats = await getSellerStats();
        setSellerStats(stats);
      } catch (error) {
        console.error("Failed to fetch seller stats:", error);
      }
    };

    fetchSellerStatistics();
  }, []);

  const [sellerStats, setSellerStats] = useState({
    totalAuctions: 0,
    activeAuctions: 0,
    totalRevenue: 0,
    averageSalePrice: 0,
    successRate: 0
  });

  const stats = {
    total: auctions.length,
    active: auctions.filter(a => a.status === 'active').length,
    scheduled: auctions.filter(a => a.status === 'scheduled').length,
    closed: auctions.filter(a => a.status === 'closed').length,
  };

  const handleDeleteAuction = async (auctionId) => {
    try {
      setIsDeleting(true);

      // Call real API to delete auction
      await deleteAuction(auctionId);

      setAuctions(auctions.filter(a => a._id !== auctionId));
      setDeleteDialog({ open: false, auctionId: null });
      toast.success("Listing deleted successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete listing");
    } finally {
      setIsDeleting(false);
    }
  };

  const openDeleteDialog = (auctionId) => {
    setDeleteDialog({ open: true, auctionId });
  };

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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Seller Dashboard</h1>
            <p className="text-muted-foreground">Manage your auctions and track performance</p>
          </div>
          <Button asChild>
            <Link to="/seller/create">Create New Auction</Link>
          </Button>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Auctions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.active}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                <PriceDisplay amount={sellerStats.totalRevenue || 0} />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Success Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {sellerStats.successRate || 0}%
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Avg Sale Price</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                <PriceDisplay amount={sellerStats.averageSalePrice || 0} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Auctions List */}
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-6">Your Auctions</h2>
          {auctions.length === 0 ? (
            <EmptyState
              title="No auctions yet"
              description="Create your first auction to start selling"
            />
          ) : (
            <div className="space-y-4">
              {auctions.map((auction) => (
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
                            Created on {new Date(auction.createdAt).toLocaleDateString()}
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
                          Starting Price: <PriceDisplay amount={auction.startingPrice} />
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Bids: {auction.bidCount || 0}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {auction.status === 'scheduled' && (
                          <Button asChild variant="outline" size="sm">
                            <Link to={`/seller/listings/${auction._id}/edit`}>Edit</Link>
                          </Button>
                        )}
                        {auction.status === 'scheduled' && (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => openDeleteDialog(auction._id)}
                          >
                            Delete
                          </Button>
                        )}
                        <Button asChild variant="outline" size="sm">
                          <Link to={`/auctions/${auction._id}`}>View</Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}
        title="Delete Listing"
        description="Are you sure you want to delete this auction listing? This action cannot be undone."
        confirmText="Delete"
        onConfirm={() => handleDeleteAuction(deleteDialog.auctionId)}
        isDestructive={true}
        loading={isDeleting}
      />
    </div>
  );
}
