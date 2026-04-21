import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { createAuction } from "@/api/auction.api";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DateTimePicker } from "@/components/ui/datepicker";
import toast from "react-hot-toast";

const auctionSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().min(10).max(1000),
  startingPrice: z.number().min(1),
  endTime: z.string().min(1),
  category: z.string().min(1),
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
  "Other",
];

export default function CreateListingPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

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

      const payload = {
        ...data,
        startTime: new Date().toISOString(),
        endTime: new Date(data.endTime).toISOString(),
      };

      const res = await createAuction(payload);

      if (res.success) {
        toast.success("Auction created successfully 🚀");
        navigate("/seller/dashboard");
      } else {
        toast.error(res.message || "Failed to create auction");
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 bg-slate-950 text-white relative overflow-hidden">

      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-purple-600/20 blur-[140px] rounded-full"></div>

      <div className="max-w-3xl mx-auto px-6 py-14 relative">

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold">
            Create New <span className="text-purple-400">Auction</span>
          </h1>
          <p className="text-slate-400 mt-2">
            List your product and start real-time bidding
          </p>
        </div>

        {/* Card */}
        <Card className="bg-slate-900/60 border border-white/10 backdrop-blur-xl shadow-2xl rounded-2xl">

          <CardHeader>
            <CardTitle className="text-white text-xl">
              Auction Details
            </CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

              {/* Title */}
              <div>
                <Label className="text-slate-300">Title</Label>
                <Input
                  {...register("title")}
                  placeholder="e.g. iPhone 15 Pro Max"
                  className="bg-slate-800 border-white/10 text-white mt-2 focus:border-purple-500"
                />
                {errors.title && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.title.message}
                  </p>
                )}
              </div>

              {/* Category */}
              <div>
                <Label className="text-slate-300">Category</Label>
                <Select onValueChange={(v) => setValue("category", v)}>
                  <SelectTrigger className="bg-slate-800 border-white/10 text-white mt-2">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.category.message}
                  </p>
                )}
              </div>

              {/* Description */}
              <div>
                <Label className="text-slate-300">Description</Label>
                <Textarea
                  {...register("description")}
                  placeholder="Describe your item..."
                  className="bg-slate-800 border-white/10 text-white mt-2"
                />
              </div>

              {/* Price + Date */}
              <div className="grid md:grid-cols-2 gap-4">

                <div>
                  <Label className="text-slate-300">Starting Price (৳)</Label>
                  <Input
                    type="number"
                    {...register("startingPrice", { valueAsNumber: true })}
                    className="bg-slate-800 border-white/10 text-white mt-2"
                  />
                </div>

                <div>
                  <Label className="text-slate-300">End Time</Label>
                  <DateTimePicker
                    value={watch("endTime")}
                    onChange={(v) => setValue("endTime", v)}
                    min={new Date(Date.now() + 60 * 60 * 1000)}
                    max={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)}
                  />
                </div>

              </div>

              {/* Buttons */}
              <div className="flex gap-4 pt-4">

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="
                    flex-1 bg-gradient-to-r from-purple-600 to-indigo-600
                    hover:from-purple-500 hover:to-indigo-500
                    shadow-lg hover:shadow-purple-500/30 transition
                  "
                >
                  {isSubmitting ? "Creating..." : "Create Auction"}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/seller/dashboard")}
                  className="
                    flex-1 border-white/10 text-white
                    hover:bg-white/5 hover:border-purple-500/50
                  "
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