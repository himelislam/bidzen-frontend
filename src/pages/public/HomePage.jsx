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
    .filter((a) => a.status === "active")
    .slice(0, 6);

  const closingSoonAuctions = auctions
    .filter((a) => a.status === "active" && isClosingSoon(a.endTime))
    .sort((a, b) => new Date(a.endTime) - new Date(b.endTime));

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden">

      {/* HERO */}
      <section className="relative bg-gradient-to-br from-indigo-700 via-purple-700 to-slate-900 py-28 overflow-hidden">
        <div className="absolute inset-0 bg-black/30"></div>

        <div className="relative max-w-7xl mx-auto px-6 text-center">

          <span className="inline-flex mb-6 px-5 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm">
            ⚡ Live Auctions Running Now
          </span>

          <h1 className="text-5xl md:text-7xl font-extrabold mb-6">
            Bid Smarter.
            <span className="block text-yellow-300">Win Bigger.</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-200 max-w-2xl mx-auto mb-10">
            Discover exclusive auctions, compete in real-time bidding, and unlock premium deals.
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

      {/* 🆕 LIVE HIGHLIGHT BANNER */}
      <section className="py-12 bg-gradient-to-r from-purple-900 to-indigo-900 text-center border-y border-white/10">
        <h2 className="text-2xl md:text-3xl font-bold">
          🔴 Live Bidding is happening right now — don’t miss out!
        </h2>
        <p className="text-slate-300 mt-2">
          Thousands of users are actively bidding in real time.
        </p>
      </section>

      {/* TRUST / STATS */}
      <section className="py-16 bg-slate-950">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">

          {[
            { label: "Active Auctions", value: "1.2K+" },
            { label: "Users", value: "50K+" },
            { label: "Successful Bids", value: "120K+" },
            { label: "Trust Score", value: "4.9/5" },
          ].map((item) => (
            <div key={item.label} className="p-6 rounded-2xl bg-slate-900 border border-white/10">
              <h3 className="text-3xl font-bold text-purple-300">{item.value}</h3>
              <p className="text-slate-400 text-sm mt-2">{item.label}</p>
            </div>
          ))}

        </div>
      </section>

      {/* FEATURED */}
      <section className="">
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
        <section className=" bg-slate-900">
          <div className="max-w-7xl mx-auto px-6">

            <div className="text-center mb-14">
              <h2 className="text-4xl font-bold text-red-400 mb-3">
                Closing Soon
              </h2>
              <p className="text-slate-400">Don’t miss these ending auctions</p>
            </div>

            <div className="rounded-3xl bg-slate-950/60 backdrop-blur-xl p-6 border border-white/10">
              <AuctionGrid auctions={closingSoonAuctions} loading={false} />
            </div>

          </div>
        </section>
      )}

      {/* 🆕 HOW IT WORKS (IMPROVED) */}
      <section className="py-24 bg-slate-950">
        <div className="max-w-7xl mx-auto px-6 text-center">

          <h2 className="text-4xl font-bold mb-14">How BidZen Works</h2>

          <div className="grid md:grid-cols-3 gap-8">

            {[
              { step: "1", title: "Create Listing", desc: "Sellers list items in seconds." },
              { step: "2", title: "Place Bids", desc: "Buyers compete in real-time auctions." },
              { step: "3", title: "Win & Deliver", desc: "Highest bidder wins instantly." },
            ].map((item) => (
              <div key={item.step} className="p-8 rounded-2xl bg-slate-900 border border-slate-800">
                <div className="w-14 h-14 mx-auto mb-5 rounded-full bg-purple-600 flex items-center justify-center font-bold">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-slate-400">{item.desc}</p>
              </div>
            ))}

          </div>
        </div>
      </section>

      {/* 🆕 TESTIMONIALS */}
      <section className="py-24 bg-slate-900">
        <div className="max-w-7xl mx-auto px-6 text-center">

          <h2 className="text-4xl font-bold mb-14">What Users Say</h2>

          <div className="grid md:grid-cols-3 gap-8">

            {[
              {
                name: "Rahim",
                text: "I sold my old laptop in 2 hours. Amazing platform!",
              },
              {
                name: "Sadia",
                text: "Best bidding experience ever. Very smooth UI!",
              },
              {
                name: "Karim",
                text: "I got deals cheaper than marketplace prices.",
              },
            ].map((t) => (
              <div key={t.name} className="p-6 rounded-2xl bg-slate-950 border border-white/10">
                <p className="text-slate-300 mb-4">"{t.text}"</p>
                <h4 className="text-purple-300 font-semibold">- {t.name}</h4>
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