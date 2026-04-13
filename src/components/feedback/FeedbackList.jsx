import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star } from "lucide-react";
import EmptyState from "@/components/shared/EmptyState";

// Mock feedback data for demo
const mockFeedback = [
  {
    _id: "1",
    reviewer: { name: "John Doe", email: "john@example.com" },
    rating: 5,
    reviewText: "Excellent auction! The seller was very responsive and the item was exactly as described. Would definitely buy from them again!",
    createdAt: "2024-04-10T14:30:00Z",
  },
  {
    _id: "2",
    reviewer: { name: "Jane Smith", email: "jane@example.com" },
    rating: 4,
    reviewText: "Good experience overall. The auction process was smooth and the item quality was great. Shipping could have been faster though.",
    createdAt: "2024-04-08T09:15:00Z",
  },
  {
    _id: "3",
    reviewer: { name: "Bob Wilson", email: "bob@example.com" },
    rating: 5,
    reviewText: "Perfect transaction! Seller was professional and the item exceeded my expectations. Highly recommended!",
    createdAt: "2024-04-05T16:45:00Z",
  },
];

export default function FeedbackList({ auctionId }) {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        setLoading(true);
        // This would normally call an API to fetch feedback
        // For now, we'll use mock data
        setTimeout(() => {
          setFeedback(mockFeedback);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Failed to fetch feedback:", error);
        setLoading(false);
      }
    };

    fetchFeedback();
  }, [auctionId]);

  const StarRating = ({ rating }) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-4 h-4 ${
            star <= rating
              ? "fill-yellow-400 text-yellow-400"
              : "text-gray-300"
          }`}
        />
      ))}
    </div>
  );

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading reviews...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (feedback.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <EmptyState 
            title="No reviews yet" 
            description="Be the first to leave a review for this auction"
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reviews ({feedback.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {feedback.map((review) => (
            <div key={review._id} className="border-b border-border last:border-b-0 pb-6 last:pb-0">
              <div className="flex items-start gap-4">
                <Avatar>
                  <AvatarFallback>
                    {review.reviewer.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-medium text-foreground">
                        {review.reviewer.name}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <StarRating rating={review.rating} />
                  </div>
                  <p className="text-foreground leading-relaxed">
                    {review.reviewText}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
