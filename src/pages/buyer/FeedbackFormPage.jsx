import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, useParams } from "react-router-dom";
import { getAuctionById } from "@/api/auction.api";
import { submitFeedback } from "@/api/feedback.api";
import { useAuth } from "@/hooks/useAuth";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import toast from "react-hot-toast";
import { extractAuctionData } from "@/api/apiHelpers";

const feedbackSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().min(10).max(500),
  wouldRecommend: z.string().min(1),
});

export default function FeedbackFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [auction, setAuction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    document.title = "Leave Feedback - BidZen";
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
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
        const res = await getAuctionById(id);
        const data = extractAuctionData(res);

        if (!data || data.status !== "closed") {
          toast.error("Feedback only for completed auctions");
          navigate(`/auctions/${id}`);
          return;
        }

        if (data.winner !== user?._id) {
          toast.error("Only winner can leave feedback");
          navigate(`/auctions/${id}`);
          return;
        }

        setAuction(data);
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to load auction");
        navigate(`/auctions/${id}`);
      } finally {
        setLoading(false);
      }
    };

    fetchAuction();
  }, [id, navigate, user]);

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);

      await submitFeedback(id, {
        rating: data.rating,
        reviewText: data.comment,
      });

      toast.success("Feedback submitted successfully!");
      navigate("/buyer/bids");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit feedback");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-gradient-to-br from-background via-muted/30 to-background">
        <div className="text-center">
          <div className="animate-spin h-10 w-10 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading auction...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="max-w-3xl mx-auto px-4 py-10">

        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-foreground">
            Leave Feedback
          </h1>
          <p className="text-muted-foreground mt-2">
            Share your experience and help others
          </p>
        </div>

        {/* Auction Card */}
        <Card className="mb-6 border border-white/10 bg-background/60 backdrop-blur-xl shadow-xl">
          <CardHeader>
            <CardTitle className="text-lg">Auction Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p><span className="text-foreground font-medium">Item:</span> {auction.title}</p>
            <p><span className="text-foreground font-medium">Seller:</span> {auction.seller?.name}</p>
            <p><span className="text-foreground font-medium">Final Price:</span> ৳{auction.currentHighestBid}</p>
          </CardContent>
        </Card>

        {/* Form */}
        <Card className="border border-white/10 bg-background/60 backdrop-blur-xl shadow-2xl">
          <CardHeader>
            <CardTitle>Your Feedback</CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

              {/* Rating */}
              <div>
                <Label>Rating *</Label>
                <Select onValueChange={(v) => setValue("rating", Number(v))}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Choose rating" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5].map((r) => (
                      <SelectItem key={r} value={String(r)}>
                        {"⭐".repeat(r)} ({r})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.rating && (
                  <p className="text-xs text-red-500 mt-1">{errors.rating.message}</p>
                )}
              </div>

              {/* Recommend */}
              <div>
                <Label>Would you recommend?</Label>
                <Select onValueChange={(v) => setValue("wouldRecommend", v)}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes 👍</SelectItem>
                    <SelectItem value="no">No 👎</SelectItem>
                    <SelectItem value="maybe">Maybe 🤔</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Comment */}
              <div>
                <Label>Feedback *</Label>
                <Textarea
                  {...register("comment")}
                  className="mt-2"
                  placeholder="Write your experience..."
                  rows={5}
                />
                {errors.comment && (
                  <p className="text-xs text-red-500 mt-1">{errors.comment.message}</p>
                )}
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-90 transition"
                >
                  {isSubmitting ? "Submitting..." : "Submit Feedback"}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/buyer/bids")}
                  className="flex-1 border-white/10 hover:bg-white/5"
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