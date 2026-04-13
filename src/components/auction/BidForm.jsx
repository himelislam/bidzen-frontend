import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { placeBid } from "@/api/bid.api";
import PriceDisplay from "@/components/shared/PriceDisplay";
import toast from "react-hot-toast";

const bidSchema = z.object({
  amount: z
    .number()
    .min(1, "Bid amount must be at least ৳1")
    .refine(
      (val) => val % 1 === 0,
      "Bid amount must be a whole number"
    ),
});

export default function BidForm({ auction, onBidSuccess }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const minBid = (auction.currentHighestBid || auction.startingPrice) + 1;
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(bidSchema),
    defaultValues: {
      amount: minBid,
    },
  });

  const watchedAmount = watch("amount");

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      await placeBid(auction._id, data.amount);
      toast.success("Bid placed successfully!");
      onBidSuccess?.();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to place bid");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Place Your Bid</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Bid Amount</Label>
            <Input
              id="amount"
              type="number"
              min={minBid}
              step="1"
              placeholder={`Minimum bid: ৳${minBid}`}
              {...register("amount", { valueAsNumber: true })}
              className="text-lg"
            />
            {errors.amount && (
              <p className="text-sm text-destructive">{errors.amount.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Starting Price:</span>
              <PriceDisplay amount={auction.startingPrice} />
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Current Highest:</span>
              <PriceDisplay amount={auction.currentHighestBid || auction.startingPrice} />
            </div>
            <div className="flex justify-between text-sm font-medium">
              <span>Minimum Bid:</span>
              <PriceDisplay amount={minBid} />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting || !watchedAmount || watchedAmount < minBid}
          >
            {isSubmitting ? "Placing Bid..." : "Place Bid"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
