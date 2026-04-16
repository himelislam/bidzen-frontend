import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useParams, useNavigate } from "react-router-dom";
import { getAuctionById } from "@/api/auction.api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import toast from "react-hot-toast";

const auctionSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100, "Title must be less than 100 characters"),
  description: z.string().min(10, "Description must be at least 10 characters").max(1000, "Description must be less than 1000 characters"),
  startingPrice: z.number().min(1, "Starting price must be at least ৳1"),
  endTime: z.string().min(1, "End time is required"),
  category: z.string().min(1, "Category is required"),
});

const categories = [
  "Electronics",
  "Fashion",
  "Home & Garden",
  "Sports & Outdoors",
  "Books & Media",
  "Toys & Games",
  "Business & Industrial",
  "Health & Beauty",
  "Other"
];

export default function EditListingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [auction, setAuction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Set page title
  useEffect(() => {
    document.title = "Edit Auction - BidZen";
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(auctionSchema),
  });

  useEffect(() => {
    const fetchAuction = async () => {
      try {
        setLoading(true);
        const response = await getAuctionById(id);
        const auctionData = response.data;

        if (auctionData.status !== 'active') {
          toast.error("Only active auctions can be edited");
          navigate("/seller/dashboard");
          return;
        }

        setAuction(auctionData);

        // Pre-fill form with auction data
        setValue("title", auctionData.title);
        setValue("description", auctionData.description);
        setValue("startingPrice", auctionData.startingPrice);
        setValue("category", auctionData.category || "");

        // Format endTime for datetime-local input
        const endTime = new Date(auctionData.endTime);
        setValue("endTime", endTime.toISOString().slice(0, 16));
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to fetch auction");
        navigate("/seller/dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchAuction();
  }, [id, navigate, setValue]);

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      // Convert endTime to proper format and update auction
      const auctionData = {
        ...data,
        endTime: new Date(data.endTime).toISOString(),
      };

      // This would normally call an API to update auction
      // For now, we'll simulate success
      toast.success("Auction updated successfully!");
      navigate("/seller/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update auction");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getMinDateTime = () => {
    const now = new Date();
    now.setHours(now.getHours() + 1); // Minimum 1 hour from now
    return now.toISOString().slice(0, 16);
  };

  const getMaxDateTime = () => {
    const now = new Date();
    now.setDate(now.getDate() + 30); // Maximum 30 days from now
    return now.toISOString().slice(0, 16);
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
          <h1 className="text-3xl font-bold text-foreground mb-2">Edit Auction</h1>
          <p className="text-muted-foreground">Update your auction listing details</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Edit Auction Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    placeholder="Enter auction title"
                    {...register("title")}
                  />
                  {errors.title && (
                    <p className="text-sm text-destructive">{errors.title.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select onValueChange={(value) => setValue("category", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.category && (
                    <p className="text-sm text-destructive">{errors.category.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your item in detail"
                  rows={4}
                  {...register("description")}
                />
                {errors.description && (
                  <p className="text-sm text-destructive">{errors.description.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="startingPrice">Starting Price (৳) *</Label>
                  <Input
                    id="startingPrice"
                    type="number"
                    min="1"
                    placeholder="Enter starting price"
                    {...register("startingPrice", { valueAsNumber: true })}
                  />
                  {errors.startingPrice && (
                    <p className="text-sm text-destructive">{errors.startingPrice.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endTime">Auction End Time *</Label>
                  <Input
                    id="endTime"
                    type="datetime-local"
                    min={getMinDateTime()}
                    max={getMaxDateTime()}
                    {...register("endTime")}
                  />
                  {errors.endTime && (
                    <p className="text-sm text-destructive">{errors.endTime.message}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Auction must end between 1 hour and 30 days from now
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  {isSubmitting ? "Updating..." : "Update Auction"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/seller/dashboard")}
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
