import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import AuctionStatusBadge from "./AuctionStatusBadge";
import CountdownTimer from "./CountdownTimer";
import PriceDisplay from "@/components/shared/PriceDisplay";
import { useAuth } from "@/hooks/useAuth";

export default function AuctionCard({ auction }) {
  const { user } = useAuth();
  const isBuyer = user?.role === "buyer";
  const isActive = auction.status === "active";

  return (
    <Card
      className="
        group relative overflow-hidden flex flex-col h-full
        bg-gradient-to-b from-slate-900 via-slate-950 to-black
        border border-white/10
        hover:border-transparent
        transition-all duration-300
        hover:-translate-y-1 hover:shadow-2xl p-0
      "
    >


      <CardContent className="relative flex-1 p-5">
        {/* Top */}
        <div className="flex justify-between items-center mb-3">
          <AuctionStatusBadge
            status={auction.status}
            endTime={auction.endTime}
          />

          <span className="text-xs text-slate-400 flex items-center gap-1">
            {isActive && (
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            )}
            {auction.seller?.name}
          </span>
        </div>

        {/* Title */}
        <h3
          className="
          text-lg font-semibold text-white mb-2 line-clamp-2
          group-hover:text-cyan-300 transition
        "
        >
          {auction.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-slate-400 line-clamp-2 mb-5">
          {auction.description}
        </p>

        {/* 💎 PRICE HERO BOX (IMPORTANT FIX) */}
        <div
          className="
          relative rounded-xl p-4 mb-4
          bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950
          border border-white/10
          overflow-hidden
        "
        >
          {/* shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-30 animate-pulse" />

          <div className="relative flex justify-between text-sm mb-2">
            <span className="text-slate-400">Starting</span>
            <PriceDisplay
              amount={auction.startingPrice}
              className="text-slate-300"
            />
          </div>

          <div className="relative flex justify-between items-end">
            <span className="text-white font-medium">Current Bid</span>

            <PriceDisplay
              amount={auction.currentHighestBid || auction.startingPrice}
              className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-400"
            />
          </div>
        </div>

        {/* Countdown */}
        {isActive && (
          <div className="pt-3 border-t border-white/10 flex justify-between items-center">
            <span className="text-xs text-slate-400">Time Left</span>
            <CountdownTimer endTime={auction.endTime} />
          </div>
        )}
      </CardContent>

      {/* Footer */}
      <div className="p-5 pt-0 flex gap-2 border-t border-white/10">
        <Button
          asChild
          size="sm"
          className="
            flex-1 relative overflow-hidden
            bg-slate-800 text-white
            border border-white/20
            hover:bg-slate-700 hover:border-white/30
            transition-all duration-300
            hover:-translate-y-[2px]
          "
        >
          <Link to={`/auctions/${auction._id}`}>
            View Details
          </Link>
        </Button>

        {isBuyer && isActive && (
          <Button
            asChild
            size="sm"
            className="
              flex-1 bg-gradient-to-r from-cyan-500 via-purple-600 to-indigo-600
              hover:from-cyan-400 hover:via-purple-500 hover:to-indigo-500
              shadow-lg hover:shadow-cyan-500/30
              text-white border-0
            "
          >
            <Link to={`/auctions/${auction._id}`}>Place Bid</Link>
          </Button>
        )}
      </div>
    </Card>
  );
}
