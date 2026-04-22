import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAuctions } from "@/api/auction.api";
import { extractAuctionsData } from "@/api/apiHelpers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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

  useEffect(() => {
    document.title = "Admin Dashboard - BidZen";
  }, []);

  useEffect(() => {
    const fetchSystemData = async () => {
      try {
        setLoading(true);
        const response = await getAuctions();
        setAuctions(extractAuctionsData(response));
      } catch (error) {
        toast.error("Failed to load system data");
      } finally {
        setLoading(false);
      }
    };

    fetchSystemData();
  }, []);

  const stats = {
    total: auctions.length,
    active: auctions.filter(a => a.status === "active").length,
    closed: auctions.filter(a => a.status === "closed").length,
    flagged: auctions.filter(a => a.status === "flagged").length,
    totalValue: auctions.reduce((sum, a) => sum + (a.currentHighestBid || a.startingPrice), 0),
  };

  const flaggedAuctions = auctions.filter(a => a.status === "flagged");
  const recentAuctions = [...auctions]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const handleResolveFlag = async (auctionId) => {
    try {
      setIsResolving(true);
      await new Promise(res => setTimeout(res, 1000));

      setAuctions(prev =>
        prev.map(a =>
          a._id === auctionId ? { ...a, status: "active" } : a
        )
      );

      toast.success("Flag resolved");
      setResolveDialog({ open: false, auctionId: null });
    } catch {
      toast.error("Failed to resolve");
    } finally {
      setIsResolving(false);
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

      {/* Glow BG */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-purple-600/20 blur-[140px] rounded-full"></div>

      <div className="relative max-w-7xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold">Admin Dashboard</h1>
          <p className="text-slate-400 mt-1">System overview & control</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-10">

          {[
            { label: "Total", value: stats.total, color: "text-white" },
            { label: "Active", value: stats.active, color: "text-green-400" },
            { label: "Closed", value: stats.closed, color: "text-blue-400" },
            { label: "Flagged", value: stats.flagged, color: "text-red-400" },
            {
              label: "Value",
              value: <PriceDisplay amount={stats.totalValue} />,
              color: "text-purple-300",
            },
          ].map((item) => (
            <div
              key={item.label}
              className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md hover:scale-[1.03] transition"
            >
              <p className="text-sm text-slate-400">{item.label}</p>
              <div className={`text-2xl font-bold ${item.color}`}>
                {item.value}
              </div>
            </div>
          ))}

        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Flagged */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Flagged Auctions</h2>

            {flaggedAuctions.length === 0 ? (
              <EmptyState title="No flagged auctions" />
            ) : (
              flaggedAuctions.map((auction) => (
                <Card
                  key={auction._id}
                  className="bg-white/5 border border-white/10 backdrop-blur-xl hover:border-red-500/50 transition"
                >
                  <CardHeader>
                    <div className="flex justify-between">
                      <div>
                        <CardTitle className="text-white">
                          {auction.title}
                        </CardTitle>

                        <AuctionStatusBadge status={auction.status} />
                      </div>

                      <PriceDisplay
                        amount={auction.currentHighestBid || auction.startingPrice}
                        className="text-red-300 font-bold"
                      />
                    </div>
                  </CardHeader>

                  <CardContent className="flex justify-between items-center">
                    <div className="text-sm text-slate-400">
                      Reason: {auction.flaggedReason || "Manual review"}
                    </div>

                    <Button
                      size="sm"
                      className="bg-red-600 hover:bg-red-700"
                      onClick={() =>
                        setResolveDialog({ open: true, auctionId: auction._id })
                      }
                    >
                      Resolve
                    </Button>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Recent */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Recent Auctions</h2>

            {recentAuctions.map((auction) => (
              <Card
                key={auction._id}
                className="bg-white/5 border border-white/10 backdrop-blur-xl hover:border-purple-500/50 transition"
              >
                <CardHeader>
                  <div className="flex justify-between">
                    <div>
                      <CardTitle className="text-white">
                        {auction.title}
                      </CardTitle>

                      <AuctionStatusBadge status={auction.status} />
                    </div>

                    <PriceDisplay
                      amount={auction.currentHighestBid || auction.startingPrice}
                      className="text-purple-300 font-bold"
                    />
                  </div>
                </CardHeader>

                <CardContent className="flex justify-between items-center">
                  <span className="text-sm text-slate-400">
                    {new Date(auction.createdAt).toLocaleDateString()}
                  </span>

                  <Button
                    asChild
                    size="sm"
                    className="bg-white/10 hover:bg-white/20"
                  >
                    <Link to={`/auctions/${auction._id}`}>View</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

        </div>

        {/* Actions */}
        <div className="mt-10 flex gap-4">
          <Button className="bg-gradient-to-r from-purple-500 to-indigo-500">
            <Link to="/admin/users">Manage Users</Link>
          </Button>

          <Button
            variant="outline"
            className="border-white/10 hover:bg-white/10"
          >
            <Link to="/auctions">All Auctions</Link>
          </Button>
        </div>

      </div>

      {/* Dialog */}
      <ConfirmDialog
        open={resolveDialog.open}
        onOpenChange={(open) =>
          setResolveDialog({ ...resolveDialog, open })
        }
        title="Resolve Flag?"
        description="This will restore auction"
        confirmText="Resolve"
        onConfirm={() => handleResolveFlag(resolveDialog.auctionId)}
        loading={isResolving}
      />
    </div>
  );
}