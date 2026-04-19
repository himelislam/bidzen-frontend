import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { createAuction } from "@/api/auction.api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DateTimePicker } from "@/components/ui/datepicker";
import toast from "react-hot-toast";

const auctionSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100, "Title must be less than 100 characters"),
  description: z.string().min(10, "Description must be at least 10 characters").max(1000, "Description must be less than 1000 characters"),
  startingPrice: z.number().min(1, "Starting price must be at least ৳1"),
  startTime: z.string().refine((date) => {
    const selectedDate = new Date(date);
    const now = new Date();
    const minDate = new Date(now.getTime() + 60 * 60 * 1000); // 1 hour from now

    if (selectedDate < minDate) {
      return "Auction must start at least 1 hour from now";
    }
    return true;
  }, {
    message: "Start time is required",
  }),
  endTime: z.string().refine((date) => {
    const selectedDate = new Date(date);
    const now = new Date();
    const minDate = new Date(now.getTime() + 60 * 60 * 1000); // 1 hour from now
    const maxDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days from now

    if (selectedDate < minDate) {
      return "Auction must start at least 1 hour from now";
    }
    if (selectedDate > maxDate) {
      return "Auction must end within 30 days from now";
    }
    return true;
  }, {
    message: "End time is required",
  }),
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

export default function CreateListingPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Set page title
  useEffect(() => {
    document.title = "Create Auction - BidZen";
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(auctionSchema),
    defaultValues: {
      title: "",
      description: "",
      startingPrice: 0,
      endTime: "",
      category: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);

      // Debug: Log form data before submission
      console.log("🔍 Form Data Being Submitted:", data);
      console.log("🔍 Form Validation:", {
        title: data.title,
        description: data.description,
        startingPrice: data.startingPrice,
        startTime: data.startTime,
        endTime: data.endTime,
        category: data.category
      });

      // Prepare auction data according to backend API specification
      const auctionData = {
        title: data.title,
        description: data.description,
        startingPrice: data.startingPrice,
        startTime: new Date(data.startTime).toISOString(),
        endTime: new Date(data.endTime).toISOString(),
        category: data.category
      };

      // Call API to create auction
      console.log("🚀 Calling API to create auction...");
      const response = await createAuction(auctionData);
      console.log("📥 API Response:", response);

      if (response.success) {
        console.log("✅ Auction created successfully!");
        toast.success("Auction created successfully!");
        navigate("/seller/dashboard");
      } else {
        console.log("❌ API Error:", response);
        toast.error(response.message || "Failed to create auction");
      }
    } catch (error) {
      console.log("🚨 Network/Validation Error:", error);
      toast.error(error.response?.data?.message || "Failed to create auction");
    } finally {
      console.log("🔄 Submission complete, setting isSubmitting to false");
      setIsSubmitting(false);
    }
  };


  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Create New Auction</h1>
          <p className="text-muted-foreground">List your item for auction and start receiving bids</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Auction Details</CardTitle>
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

                <DateTimePicker
                  value={watch("endTime")}
                  onChange={(value) => setValue("endTime", value)}
                  min={new Date(Date.now() + 60 * 60 * 1000)} // 1 hour from now
                  max={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)} // 30 days from now
                  label="Auction End Time"
                  required={true}
                  error={errors.endTime?.message}
                />
              </div>

              <div className="flex gap-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  {isSubmitting ? "Creating..." : "Create Auction"}
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
