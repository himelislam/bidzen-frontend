import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import toast from "react-hot-toast";

const feedbackSchema = z.object({
  rating: z.number().min(1, "Please select a rating").max(5, "Rating must be between 1-5"),
  reviewText: z.string().min(10, "Review must be at least 10 characters").max(500, "Review must be less than 500 characters"),
});

export default function FeedbackForm({ auctionId, onSubmitted }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoveredStar, setHoveredStar] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      rating: 0,
      reviewText: "",
    },
  });

  const selectedRating = watch("rating");

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      
      // This would normally call an API to submit feedback
      // For now, we'll simulate success
      toast.success("Review submitted successfully!");
      onSubmitted?.();
    } catch (error) {
      if (error.response?.status === 409) {
        toast.error("You have already reviewed this auction");
      } else {
        toast.error(error.response?.data?.message || "Failed to submit review");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const StarRating = () => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className="p-1"
          onClick={() => setValue("rating", star)}
          onMouseEnter={() => setHoveredStar(star)}
          onMouseLeave={() => setHoveredStar(0)}
        >
          <Star
            className={`w-6 h-6 ${
              star <= (hoveredStar || selectedRating)
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
          />
        </button>
      ))}
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Leave a Review</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Rating *
            </label>
            <StarRating />
            <input type="hidden" {...register("rating", { valueAsNumber: true })} />
            {errors.rating && (
              <p className="text-sm text-destructive mt-1">{errors.rating.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="reviewText" className="text-sm font-medium text-foreground mb-2 block">
              Your Review *
            </label>
            <Textarea
              id="reviewText"
              placeholder="Share your experience with this auction..."
              rows={4}
              {...register("reviewText")}
            />
            {errors.reviewText && (
              <p className="text-sm text-destructive mt-1">{errors.reviewText.message}</p>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              10-500 characters
            </p>
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
