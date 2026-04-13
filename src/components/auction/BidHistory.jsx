import { formatDistanceToNow } from "date-fns";
import PriceDisplay from "@/components/shared/PriceDisplay";
import EmptyState from "@/components/shared/EmptyState";

export default function BidHistory({ bids }) {
  if (!bids || bids.length === 0) {
    return (
      <EmptyState 
        title="No bids yet" 
        description="Be the first to place a bid on this auction!"
      />
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground mb-4">Bid History</h3>
      <div className="space-y-3">
        {bids.map((bid, index) => (
          <div key={bid._id || index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div className="flex items-center space-x-3">
              <span className="font-medium text-foreground">{bid.bidder?.name}</span>
              <span className="text-sm text-muted-foreground">
                bid {index + 1}
              </span>
            </div>
            <div className="text-right">
              <PriceDisplay 
                amount={bid.amount} 
                className="text-lg font-bold text-primary"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
