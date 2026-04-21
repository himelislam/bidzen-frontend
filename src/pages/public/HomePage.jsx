import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAuctions } from "@/api/auction.api";
import AuctionGrid from "@/components/auction/AuctionGrid";
import { Button } from "@/components/ui/button";
import { isClosingSoon } from "@/utils/timeHelpers";
import { usePolling } from "@/hooks/usePolling";
import { POLLING_INTERVAL_LIST } from "@/utils/constants";
import { extractAuctionsData } from "@/api/apiHelpers";

export default function HomePage() {
  useEffect(() => {
    document.title = "BidZen - Premier Online Auction Platform";
  }, []);

  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAuctions = async () => {
    try {
      setLoading(true);
      const response = await getAuctions();
      const auctionsData = extractAuctionsData(response);
      setAuctions(Array.isArray(auctionsData) ? auctionsData : []);
    } catch (err) {
      console.error("Failed to fetch auctions:", err);
      setAuctions([]);
    } finally {
      setLoading(false);
    }
  };

  usePolling(fetchAuctions, POLLING_INTERVAL_LIST);

  useEffect(() => {
    fetchAuctions();
  }, []);

  const featuredAuctions = auctions
    .filter((auction) => auction.status === "active")
    .slice(0, 6);

  const closingSoonAuctions = auctions
    .filter(
      (auction) =>
        auction.status === "active" && isClosingSoon(auction.endTime)
    )
    .sort((a, b) => new Date(a.endTime) - new Date(b.endTime));

  const steps = [
    {
      step: "1",
      title: "List",
      desc: "Create your auction listing in minutes and reach thousands of buyers.",
    },
    {
      step: "2",
      title: "Bid",
      desc: "Buyers compete with real-time bids for the best price.",
    },
    {
      step: "3",
      title: "Win",
      desc: "Highest bidder wins and sellers get maximum value.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden">

      {/* Glow Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-purple-600/20 blur-[140px] rounded-full pointer-events-none"></div>

      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-700 via-purple-700 to-slate-900 py-28">

        <div className="absolute inset-0 bg-black/30"></div>

        <div className="relative max-w-7xl mx-auto px-6 text-center">

          <span className="inline-flex items-center gap-2 mb-6 px-5 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm">
            ⚡ Live Auctions Running Now
          </span>

          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6">
            Bid Smarter.
            <span className="block text-yellow-300">
              Win Bigger.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-200 max-w-2xl mx-auto mb-10">
            Discover exclusive auctions, compete in real-time bidding, and unlock premium deals with BidZen.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">

            <Button asChild size="lg" className="px-10 text-lg bg-white text-black">
              <Link to="/auctions">Explore Auctions</Link>
            </Button>

            <Button asChild size="lg" variant="secondary" className="px-10 text-lg border border-white/20">
              <Link to="/register">Start Selling</Link>
            </Button>

          </div>

        </div>
      </section>

      {/* FEATURED */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">

          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold mb-3">Featured Auctions</h2>
            <p className="text-slate-400">Handpicked premium listings</p>
          </div>

          <div className="rounded-3xl bg-slate-900/40 backdrop-blur-xl p-6 border border-white/10">
            <AuctionGrid auctions={featuredAuctions} loading={loading} />
          </div>

        </div>
      </section>

      {/* CLOSING SOON */}
      {closingSoonAuctions.length > 0 && (
        <section className="py-24 bg-slate-900">

          <div className="max-w-7xl mx-auto px-6">

            <div className="text-center mb-14">
              <h2 className="text-4xl font-bold text-red-400 mb-3">
                Closing Soon
              </h2>
              <p className="text-slate-400">
                Hurry — these auctions are ending soon
              </p>
            </div>

            <div className="rounded-3xl bg-slate-950/60 backdrop-blur-xl p-6 border border-white/10">
              <AuctionGrid auctions={closingSoonAuctions} loading={false} />
            </div>

          </div>
        </section>
      )}

      {/* HOW IT WORKS */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">

          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-3">How It Works</h2>
            <p className="text-slate-400">Simple 3-step auction process</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">

            {steps.map((item) => (
              <div
                key={item.step}
                className="rounded-2xl bg-slate-900 p-8 text-center border border-slate-800 hover:border-purple-500 transition"
              >

                <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-xl font-bold">
                  {item.step}
                </div>

                <h3 className="text-2xl font-semibold mb-3">
                  {item.title}
                </h3>

                <p className="text-slate-400">
                  {item.desc}
                </p>

              </div>
            ))}

          </div>

        </div>
      </section>

      {/* CTA */}
      <section className="py-28 bg-gradient-to-r from-indigo-700 via-purple-700 to-slate-900 text-center">

        <div className="max-w-4xl mx-auto px-6">

          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Start Selling?
          </h2>

          <p className="text-lg text-slate-200 mb-10">
            Join thousands of sellers earning more with real-time bidding.
          </p>

          <Button asChild size="lg" className="px-12 text-lg bg-white text-black">
            <Link to="/register">Create Account</Link>
          </Button>

        </div>

      </section>

    </div>
  );
}