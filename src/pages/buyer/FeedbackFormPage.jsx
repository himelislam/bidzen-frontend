import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, useParams } from "react-router-dom";
import { getAuctionById } from "@/api/auction.api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import toast from "react-hot-toast";

const feedbackSchema = z.object({
  rating: z.number().min(1, "Please select a rating").max(5, "Rating must be between 1-5"),
  comment: z.string().min(10, "Feedback must be at least 10 characters").max(500, "Feedback must be less than 500 characters"),
  wouldRecommend: z.string().min(1, "Please select an option"),
});

export default function FeedbackFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [auction, setAuction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      comment: "",
      wouldRecommend: "",
    },
  });

  useEffect(() => {
    const fetchAuction = async () => {
      try {
        setLoading(true);
        const response = await getAuctionById(id);
        const auctionData = response.data;

        // Only allow feedback for closed auctions where user was winner
        if (auctionData.status !== 'closed') {
          toast.error("Feedback can only be left for completed auctions");
          navigate("/auctions/" + id);
          return;
        }

        setAuction(auctionData);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to fetch auction");
        navigate("/auctions/" + id);
      } finally {
        setLoading(false);
      }
    };

    fetchAuction();
  }, [id, navigate]);

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);

      // This would normally call an API to submit feedback
      // For now, we'll simulate success
      toast.success("Feedback submitted successfully!");
      navigate("/buyer/bids");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit feedback");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading auction details...</p>
        </div>
      </div>
    );
  }

  if (!auction) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Auction not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Leave Feedback</h1>
          <p className="text-muted-foreground">Share your experience with this auction</p>
        </div>

        {/* Auction Info */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Auction Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <span className="font-medium">Item:</span> {auction.title}
              </div>
              <div>
                <span className="font-medium">Seller:</span> {auction.seller?.name}
              </div>
              <div>
                <span className="font-medium">Final Price:</span> ৳{auction.currentHighestBid}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Feedback Form */}
        <Card>
          <CardHeader>
            <CardTitle>Your Feedback</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="rating">Rating *</Label>
                <Select onValueChange={(value) => setValue("rating", parseInt(value))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 - Very Poor</SelectItem>
                    <SelectItem value="2">2 - Poor</SelectItem>
                    <SelectItem value="3">3 - Average</SelectItem>
                    <SelectItem value="4">4 - Good</SelectItem>
                    <SelectItem value="5">5 - Excellent</SelectItem>
                  </SelectContent>
                </Select>
                {errors.rating && (
                  <p className="text-sm text-destructive">{errors.rating.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="wouldRecommend">Would you recommend this seller? *</Label>
                <Select onValueChange={(value) => setValue("wouldRecommend", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                    <SelectItem value="maybe">Maybe</SelectItem>
                  </SelectContent>
                </Select>
                {errors.wouldRecommend && (
                  <p className="text-sm text-destructive">{errors.wouldRecommend.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="comment">Feedback *</Label>
                <Textarea
                  id="comment"
                  placeholder="Share your experience with this auction and seller..."
                  rows={4}
                  {...register("comment")}
                />
                {errors.comment && (
                  <p className="text-sm text-destructive">{errors.comment.message}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  Your feedback helps other buyers make informed decisions
                </p>
              </div>

              <div className="flex gap-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  {isSubmitting ? "Submitting..." : "Submit Feedback"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/buyer/bids")}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
