import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useParams, useNavigate } from "react-router-dom";
import { getAuctionById, updateAuction } from "@/api/auction.api";
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
import toast from "react-hot-toast";

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

export default function EditListingPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    document.title = "Edit Auction - BidZen";
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm();

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getAuctionById(id);
        const a = res.data;

        setValue("title", a.title);
        setValue("description", a.description);
        setValue("startingPrice", a.startingPrice);
        setValue("category", a.category);

        setValue("startTime", a.startTime?.slice(0, 16));
        setValue("endTime", a.endTime?.slice(0, 16));
      } catch {
        toast.error("Failed to load auction");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);

      const payload = {
        ...data,
        startTime: new Date(data.startTime).toISOString(),
        endTime: new Date(data.endTime).toISOString(),
      };

      const res = await updateAuction(id, payload);

      if (res.data?.success) {
        toast.success("Auction updated successfully 🚀");
        navigate("/seller/dashboard");
      } else {
        toast.error("Update failed");
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        Loading auction...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white relative overflow-hidden">

      {/* Glow background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-600/20 blur-[140px] rounded-full"></div>

      <div className="max-w-3xl mx-auto px-6 py-14 relative">

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold">
            Edit <span className="text-indigo-400">Auction</span>
          </h1>
          <p className="text-slate-400 mt-2">
            Update your listing details easily
          </p>
        </div>

        {/* Card */}
        <Card className="bg-slate-900/60 border border-white/10 backdrop-blur-xl rounded-2xl shadow-2xl">

          <CardHeader>
            <CardTitle className="text-white">
              Auction Information
            </CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

              {/* Title */}
              <div>
                <Label className="text-slate-300">Title</Label>
                <Input
                  {...register("title")}
                  className="bg-slate-800 border-white/10 text-white mt-2"
                />
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
              </div>

              {/* Description */}
              <div>
                <Label className="text-slate-300">Description</Label>
                <Textarea
                  {...register("description")}
                  className="bg-slate-800 border-white/10 text-white mt-2"
                />
              </div>

              {/* Price + Dates */}
              <div className="grid md:grid-cols-2 gap-4">

                <div>
                  <Label className="text-slate-300">Starting Price</Label>
                  <Input
                    type="number"
                    {...register("startingPrice")}
                    className="bg-slate-800 border-white/10 text-white mt-2"
                  />
                </div>

                <div>
                  <Label className="text-slate-300">Start Time</Label>
                  <Input
                    type="datetime-local"
                    {...register("startTime")}
                    className="bg-slate-800 border-white/10 text-white mt-2"
                  />
                </div>

                <div className="md:col-span-2">
                  <Label className="text-slate-300">End Time</Label>
                  <Input
                    type="datetime-local"
                    {...register("endTime")}
                    className="bg-slate-800 border-white/10 text-white mt-2"
                  />
                </div>

              </div>

              {/* Buttons */}
              <div className="flex gap-4 pt-4">

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="
                    flex-1 bg-gradient-to-r from-indigo-600 to-purple-600
                    hover:from-indigo-500 hover:to-purple-500
                    shadow-lg hover:shadow-indigo-500/30 transition
                  "
                >
                  {isSubmitting ? "Updating..." : "Update Auction"}
                </Button>

                <Button
                  type="button"
                  onClick={() => navigate("/seller/dashboard")}
                  variant="outline"
                  className="
                    flex-1 border-white/10 text-white
                    hover:bg-white/5 hover:border-indigo-500/50
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