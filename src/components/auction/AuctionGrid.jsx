import AuctionCard from "./AuctionCard";

export default function AuctionGrid({ auctions, loading }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-muted rounded-lg h-64"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!auctions || auctions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No auctions found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {auctions.map((auction) => (
        <AuctionCard key={auction._id} auction={auction} />
      ))}
    </div>
  );
}
