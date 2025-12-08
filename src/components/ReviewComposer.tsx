import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star, X } from "lucide-react";

export interface ReviewData {
  id?: string;
  name: string;
  rating: number;
  comment: string;
  userId?: string;
}

interface ReviewComposerProps {
  onSubmit: (review: ReviewData) => void;
  onCancel: () => void;
  initialReview?: ReviewData;
  isLoading?: boolean;
}

const ReviewComposer = ({
  onSubmit,
  onCancel,
  initialReview,
  isLoading = false,
}: ReviewComposerProps) => {
  const [rating, setRating] = useState(initialReview?.rating || 5);
  const [comment, setComment] = useState(initialReview?.comment || "");
  const [hoverRating, setHoverRating] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!comment.trim()) {
      alert("Please enter a review comment");
      return;
    }

    if (rating < 1 || rating > 5) {
      alert("Please select a rating between 1 and 5");
      return;
    }

    onSubmit({
      id: initialReview?.id,
      name: initialReview?.name || "You",
      rating,
      comment: comment.trim(),
      userId: initialReview?.userId,
    });
  };

  return (
    <div className="bg-card rounded-xl p-6 shadow-soft border border-border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground">
          {initialReview ? "Edit Your Review" : "Share Your Review"}
        </h3>
        <button
          onClick={onCancel}
          className="text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Close composer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Star Rating */}
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            Rating
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="transition-all hover:scale-110"
                aria-label={`Rate ${star} stars`}
              >
                <Star
                  className={`w-6 h-6 ${
                    star <= (hoverRating || rating)
                      ? "text-secondary fill-secondary"
                      : "text-muted-foreground"
                  } transition-colors`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Comment Textarea */}
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            Your Comment
          </label>
          <Textarea
            placeholder="Share your experience with this course..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="min-h-24 resize-none"
            maxLength={500}
          />
          <p className="text-xs text-muted-foreground mt-1">
            {comment.length}/500 characters
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-2 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isLoading || !comment.trim()}
            className="min-w-24"
          >
            {isLoading ? "Saving..." : initialReview ? "Update Review" : "Post Review"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ReviewComposer;
