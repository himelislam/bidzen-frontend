import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getAuctions } from "@/api/auction.api";
import AuctionGrid from "@/components/auction/AuctionGrid";
import { extractAuctionsData } from "@/api/apiHelpers";
import EmptyState from "@/components/shared/EmptyState";

export default function SellerProfilePage() {
  useEffect(() => {
    document.title = "Seller Profile - BidZen";
  }, []);

  const { id } = useParams();
  const [seller, setSeller] = useState(null);
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSeller = async () => {
      try {
        setLoading(true);

        const response = await getAuctions();
        const allAuctions = extractAuctionsData(response);

        const sellerAuctions = allAuctions.filter(
          (a) => a.seller?._id === id
        );

        setAuctions(sellerAuctions);

        if (sellerAuctions.length > 0) {
          setSeller(sellerAuctions[0].seller);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSeller();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-slate-400">Loading seller profile...</p>
        </div>
      </div>
    );
  }

  if (!seller) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <EmptyState
          title="Seller not found"
          description="This seller profile does not exist or has no listings."
        />
      </div>
    );
  }

  const activeCount = auctions.filter((a) => a.status === "active").length;
  const closedCount = auctions.filter((a) => a.status === "closed").length;

  return (
    <div className="min-h-screen pt-20 bg-slate-950 text-white">

      {/* HERO SELLER HEADER */}
      <section className="relative py-16 bg-gradient-to-r from-indigo-700 via-purple-700 to-slate-900">

        <div className="absolute inset-0 bg-black/30"></div>

        <div className="relative max-w-7xl mx-auto px-6">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

            {/* Seller Info */}
            <div>
              <h1 className="text-4xl font-bold">{seller.name}</h1>
              <p className="text-slate-200 mt-1">
                Trusted Auction Seller
              </p>
            </div>

            {/* Badge */}
            <div className="px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-sm">
              🛍 Verified Seller
            </div>

          </div>

        </div>
      </section>

      {/* STATS SECTION */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-3 gap-6">

          {[
            { label: "Total Auctions", value: auctions.length },
            { label: "Active Listings", value: activeCount },
            { label: "Completed Sales", value: closedCount },
          ].map((item) => (
            <div
              key={item.label}
              className="
                rounded-2xl bg-slate-900/40
                border border-white/10
                backdrop-blur-xl
                p-6 text-center
                hover:border-purple-500/30
                transition
              "
            >
              <div className="text-3xl font-bold text-purple-300">
                {item.value}
              </div>
              <p className="text-slate-400 text-sm mt-2">
                {item.label}
              </p>
            </div>
          ))}

        </div>
      </section>

      {/* AUCTIONS SECTION */}
      <section className="pb-16">
        <div className="max-w-7xl mx-auto px-6">

          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-semibold">
              {seller.name}'s Listings
            </h2>

            <span className="text-slate-400 text-sm">
              {auctions.length} items
            </span>
          </div>

          <div className="rounded-3xl bg-slate-900/40 border border-white/10 backdrop-blur-xl p-6">

            {auctions.length === 0 ? (
              <EmptyState
                title="No Auctions Yet"
                description="This seller has not listed any auctions yet."
              />
            ) : (
              <AuctionGrid auctions={auctions} loading={false} />
            )}

          </div>

        </div>
      </section>

    </div>
  );
}