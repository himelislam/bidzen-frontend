import { useState } from "react";
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

const categories = [
  'electronics', 'fashion', 'luxury', 'gaming', 'professional', 'collectibles', 'automotive', 'home', 'other'
];

const auctionSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100, "Title must be less than 100 characters"),
  description: z.string().min(10, "Description must be at least 10 characters").max(1000, "Description must be less than 1000 characters"),
  startingPrice: z.number().min(1, "Starting price must be at least 1"),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  category: z.string().min(1, "Category is required"),
}).refine((data) => {
  if (data.startTime && data.endTime) {
    const start = new Date(data.startTime);
    const end = new Date(data.endTime);
    return end > start;
  }
  return true;
}, {
  message: "End time must be after start time",
  path: ["endTime"]
});

export default function CreateAuctionV2() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm({
    resolver: zodResolver(auctionSchema),
    defaultValues: {
      title: "",
      description: "",
      startingPrice: 0,
      startTime: "",
      endTime: "",
      category: ""
    },
  });

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);

      console.log('Creating auction with data:', data);
      const response = await createAuction(data);

      console.log('Create auction response:', response);

      // Handle both real API and mock response structures
      if (response.data?.success || response.success) {
        const auction = response.data?.data?.auction || response.data?.auction;
        toast.success("Auction created successfully!");
        console.log('Created auction:', auction);
        navigate("/seller/dashboard");
      } else {
        const message = response.data?.message || response.message || "Failed to create auction";
        toast.error(message);
      }
    } catch (error) {
      console.error("Auction creation error:", error);
      const message = error.response?.data?.error?.message || error.response?.data?.message || "Failed to create auction";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Create New Auction</h1>
          <p className="text-muted-foreground">Simple auction creation form</p>
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

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="startTime">Auction Start Time *</Label>
                  <DateTimePicker
                    value={watch("startTime")}
                    onChange={(value) => setValue("startTime", value)}
                    min={new Date()}
                    max={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)}
                    label="Auction Start Time"
                    required={true}
                    error={errors.startTime?.message}
                  />
                  {errors.startTime && (
                    <p className="text-sm text-destructive">{errors.startTime.message}</p>
                  )}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="endTime">Auction End Time *</Label>
                  <DateTimePicker
                    value={watch("endTime")}
                    onChange={(value) => setValue("endTime", value)}
                    min={new Date(Date.now() + 60 * 60 * 1000)}
                    max={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)}
                    label="Auction End Time"
                    required={true}
                    error={errors.endTime?.message}
                  />
                  {errors.endTime && (
                    <p className="text-sm text-destructive">{errors.endTime.message}</p>
                  )}
                </div>
              </div>

              <div className="flex gap-4 pt-4">
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