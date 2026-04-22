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
import { formatCurrency } from "@/utils/formatCurrency";
import toast from "react-hot-toast";

const bidSchema = z.object({
  amount: z
    .number()
    .min(1, "Bid amount must be at least 1")
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
    <Card className="bg-slate-800 border border-white/10">
      <CardHeader>
        <CardTitle className="text-white">Place Your Bid</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-slate-300">Bid Amount</Label>
            <Input
              id="amount"
              type="number"
              min={minBid}
              step="1"
              placeholder={`Minimum bid: ${formatCurrency(minBid)}`}
              {...register("amount", { valueAsNumber: true })}
              className="text-lg bg-slate-700 border-white/10 text-white placeholder:text-slate-400"
            />
            {errors.amount && (
              <p className="text-sm text-red-400">{errors.amount.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm text-slate-400">
              <span>Starting Price:</span>
              <PriceDisplay amount={auction.startingPrice} />
            </div>
            <div className="flex justify-between text-sm text-slate-400">
              <span>Current Highest:</span>
              <PriceDisplay amount={auction.currentHighestBid || auction.startingPrice} />
            </div>
            <div className="flex justify-between text-sm font-medium text-white">
              <span>Minimum Bid:</span>
              <PriceDisplay amount={minBid} />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-slate-700 hover:bg-slate-600 text-white border-white/10"
            disabled={isSubmitting || !watchedAmount || watchedAmount < minBid}
          >
            {isSubmitting ? "Placing Bid..." : "Place Bid"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
