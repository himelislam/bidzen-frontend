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
    <Card className="flex flex-col h-full hover:shadow-md transition-shadow duration-200">
      <CardContent className="flex-1 p-5">
        {/* Status badge */}
        <div className="flex items-center justify-between mb-3">
          <AuctionStatusBadge status={auction.status} endTime={auction.endTime} />
          <span className="text-xs text-muted-foreground">{auction.seller?.name}</span>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-foreground text-base leading-snug mb-2 line-clamp-2">
          {auction.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {auction.description}
        </p>

        {/* Pricing */}
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Starting</span>
            <PriceDisplay amount={auction.startingPrice} className="text-muted-foreground" />
          </div>
          <div className="flex justify-between">
            <span className="text-sm font-medium text-foreground">Highest bid</span>
            <PriceDisplay
              amount={auction.currentHighestBid || auction.startingPrice}
              className="text-lg font-bold text-primary"
            />
          </div>
        </div>

        {/* Countdown */}
        {isActive && (
          <div className="mt-3 pt-3 border-t border-border">
            <CountdownTimer endTime={auction.endTime} />
          </div>
        )}
      </CardContent>

      <CardFooter className="p-5 pt-0 gap-2">
        <Button asChild variant="outline" size="sm" className="flex-1">
          <Link to={`/auctions/${auction._id}`}>View Details</Link>
        </Button>
        {isBuyer && isActive && (
          <Button asChild size="sm" className="flex-1">
            <Link to={`/auctions/${auction._id}`}>Place Bid</Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
