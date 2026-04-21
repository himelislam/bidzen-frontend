import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getUserAuctions, deleteAuction, getSellerStats } from "@/api/user.api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  const [sellerStats, setSellerStats] = useState({
    totalAuctions: 0,
    activeAuctions: 0,
    totalRevenue: 0,
    averageSalePrice: 0,
    successRate: 0,
  });

  useEffect(() => {
    document.title = "Seller Dashboard - BidZen";
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [auctionRes, statsRes] = await Promise.all([
          getUserAuctions(),
          getSellerStats(),
        ]);

        setAuctions(auctionRes || []);
        setSellerStats(statsRes || sellerStats);
      } catch (error) {
        toast.error("Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const stats = {
    total: auctions.length,
    active: auctions.filter((a) => a.status === "active").length,
    scheduled: auctions.filter((a) => a.status === "scheduled").length,
    closed: auctions.filter((a) => a.status === "closed").length,
  };

  const handleDeleteAuction = async (auctionId) => {
    try {
      setIsDeleting(true);
      await deleteAuction(auctionId);

      setAuctions((prev) => prev.filter((a) => a._id !== auctionId));
      toast.success("Auction deleted successfully");
      setDeleteDialog({ open: false, auctionId: null });
    } catch (error) {
      toast.error("Delete failed");
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <div className="animate-spin h-10 w-10 border-2 border-purple-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-slate-950 text-white">

      {/* Glow Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-purple-600/20 blur-[140px] rounded-full pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-4xl font-bold">Seller Dashboard</h1>
            <p className="text-slate-400 mt-1">
              Manage auctions & track performance
            </p>
          </div>

          <Button asChild className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:scale-105 transition">
            <Link to="/seller/create">+ Create Auction</Link>
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-10">

          {[
            { label: "Total", value: stats.total, color: "text-white" },
            { label: "Active", value: stats.active, color: "text-green-400" },
            { label: "Scheduled", value: stats.scheduled, color: "text-yellow-400" },
            { label: "Closed", value: stats.closed, color: "text-red-400" },
            {
              label: "Revenue",
              value: <PriceDisplay amount={sellerStats.totalRevenue || 0} />,
              color: "text-purple-300",
            },
          ].map((item) => (
            <div
              key={item.label}
              className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md hover:scale-[1.02] transition"
            >
              <p className="text-sm text-slate-400">{item.label}</p>
              <div className={`text-2xl font-bold ${item.color}`}>
                {item.value}
              </div>
            </div>
          ))}
        </div>

        {/* Auctions */}
        <div className="space-y-4">

          <h2 className="text-xl font-semibold mb-4">Your Auctions</h2>

          {auctions.length === 0 ? (
            <EmptyState
              title="No auctions yet"
              description="Start selling by creating your first auction"
            />
          ) : (
            auctions.map((auction) => (
              <Card
                key={auction._id}
                className="bg-white/5 border border-white/10 backdrop-blur-xl hover:border-purple-500/50 transition hover:scale-[1.01]"
              >
                <CardHeader>
                  <div className="flex justify-between">
                    <div>
                      <CardTitle className="text-white text-lg">
                        {auction.title}
                      </CardTitle>

                      <AuctionStatusBadge
                        status={auction.status}
                        endTime={auction.endTime}
                      />
                    </div>

                    <PriceDisplay
                      amount={auction.currentHighestBid || auction.startingPrice}
                      className="text-purple-300 text-lg font-bold"
                    />
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="flex justify-between items-center">

                    <div className="text-sm text-slate-400 space-y-1">
                      <p>Starting: <PriceDisplay amount={auction.startingPrice} /></p>
                      <p>Bids: {auction.bidCount || 0}</p>
                    </div>

                    <div className="flex gap-2">

                      <Button
                        asChild
                        size="sm"
                        className="bg-white/10 hover:bg-white/20 border border-white/10"
                      >
                        <Link to={`/auctions/${auction._id}`}>View</Link>
                      </Button>

                      {auction.status === "scheduled" && (
                        <>
                          <Button
                            asChild
                            size="sm"
                            className="bg-purple-600 hover:bg-purple-700"
                          >
                            <Link to={`/seller/listings/${auction._id}/edit`}>
                              Edit
                            </Link>
                          </Button>

                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() =>
                              setDeleteDialog({
                                open: true,
                                auctionId: auction._id,
                              })
                            }
                          >
                            Delete
                          </Button>
                        </>
                      )}
                    </div>

                  </div>
                </CardContent>
              </Card>
            ))
          )}

        </div>
      </div>

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open) =>
          setDeleteDialog({ ...deleteDialog, open })
        }
        title="Delete Auction?"
        description="This action cannot be undone."
        confirmText="Delete"
        onConfirm={() => handleDeleteAuction(deleteDialog.auctionId)}
        isDestructive
        loading={isDeleting}
      />
    </div>
  );
}