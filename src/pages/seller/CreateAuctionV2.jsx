import { useState } from "react";
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

const categories = [
  "electronics",
  "fashion",
  "luxury",
  "gaming",
  "professional",
  "collectibles",
  "automotive",
  "home",
  "other",
];

const auctionSchema = z
  .object({
    title: z.string().min(3).max(100),
    description: z.string().min(10).max(1000),
    startingPrice: z.number().min(1),
    startTime: z.string().min(1),
    endTime: z.string().min(1),
    category: z.string().min(1),
  })
  .refine(
    (data) => new Date(data.endTime) > new Date(data.startTime),
    {
      message: "End time must be after start time",
      path: ["endTime"],
    }
  );

export default function CreateAuctionV2() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(auctionSchema),
    defaultValues: {
      title: "",
      description: "",
      startingPrice: 0,
      startTime: "",
      endTime: "",
      category: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      const response = await createAuction(data);

      if (response.data?.success || response.success) {
        toast.success("Auction created successfully!");
        navigate("/seller/dashboard");
      } else {
        toast.error(response.message || "Failed to create auction");
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 bg-slate-950 text-white">

      {/* HEADER */}
      <div className="text-center py-12">
        <h1 className="text-4xl font-bold mb-2">
          Create New Auction
        </h1>
        <p className="text-slate-400">
          Turn your product into a live bidding experience
        </p>
      </div>

      {/* FORM WRAPPER */}
      <div className="max-w-3xl mx-auto px-6 pb-16">

        <Card className="
          bg-slate-900/40 backdrop-blur-xl
          border border-white/10
          shadow-2xl
        ">

          <CardHeader>
            <CardTitle className="text-white text-xl">
              Auction Details
            </CardTitle>
          </CardHeader>

          <CardContent>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

              {/* TITLE */}
              <div className="space-y-2">
                <Label className="text-slate-300">Title</Label>
                <Input
                  placeholder="Enter auction title"
                  {...register("title")}
                  className="bg-slate-950 border-white/10 text-white"
                />
                {errors.title && (
                  <p className="text-red-400 text-sm">
                    {errors.title.message}
                  </p>
                )}
              </div>

              {/* DESCRIPTION */}
              <div className="space-y-2">
                <Label className="text-slate-300">Description</Label>
                <Textarea
                  rows={4}
                  placeholder="Describe your item..."
                  {...register("description")}
                  className="bg-slate-950 border-white/10 text-white"
                />
                {errors.description && (
                  <p className="text-red-400 text-sm">
                    {errors.description.message}
                  </p>
                )}
              </div>

              {/* PRICE + CATEGORY */}
              <div className="grid md:grid-cols-2 gap-4">

                <div className="space-y-2">
                  <Label className="text-slate-300">
                    Starting Price
                  </Label>
                  <Input
                    type="number"
                    placeholder="৳ 100"
                    {...register("startingPrice", { valueAsNumber: true })}
                    className="bg-slate-950 border-white/10 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">Category</Label>

                  <Select onValueChange={(v) => setValue("category", v)}>
                    <SelectTrigger className="bg-slate-950 border-white/10 text-white">
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

              </div>

              {/* TIME SECTION */}
              <div className="space-y-4">

                <div>
                  <Label className="text-slate-300">
                    Start Time
                  </Label>
                  <DateTimePicker
                    value={watch("startTime")}
                    onChange={(v) => setValue("startTime", v)}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label className="text-slate-300">
                    End Time
                  </Label>
                  <DateTimePicker
                    value={watch("endTime")}
                    onChange={(v) => setValue("endTime", v)}
                    className="mt-2"
                  />
                </div>

              </div>

              {/* BUTTONS */}
              <div className="flex gap-3 pt-4">

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="
                    flex-1 bg-gradient-to-r from-purple-600 to-indigo-600
                    hover:from-purple-500 hover:to-indigo-500
                    shadow-lg
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
                    hover:bg-white/5
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