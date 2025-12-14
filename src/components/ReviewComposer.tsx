import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star, X } from "lucide-react";
import { cn } from "@/lib/utils";

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
    
    if (!comment.trim()) { alert("Please enter a review comment"); return; }
    if (rating < 1 || rating > 5) { alert("Please select a rating between 1 and 5"); return; }

    onSubmit({
      id: initialReview?.id,
      name: initialReview?.name || "You",
      rating,
      comment: comment.trim(),
      userId: initialReview?.userId,
    });
  };

  return (
    <div className="bg-zinc-900/60 backdrop-blur-xl border border-[#F4B942]/30 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
      {/* Decorative gradient blob */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#F4B942]/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2" />

      <div className="flex items-center justify-between mb-6 relative z-10">
        <h3 className="font-display font-bold text-white text-lg">
          {initialReview ? "Edit Your Review" : "Share Your Experience"}
        </h3>
        <button
          onClick={onCancel}
          className="p-1 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-all"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
        {/* Star Rating */}
        <div>
          <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2 block">
            How would you rate this course?
          </label>
          <div className="flex gap-1.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="transition-transform hover:scale-110 focus:outline-none"
              >
                <Star
                  className={cn(
                    "w-8 h-8 transition-colors duration-200",
                    star <= (hoverRating || rating)
                      ? "text-[#F4B942] fill-[#F4B942]"
                      : "text-zinc-700 fill-zinc-800/30"
                  )}
                />
              </button>
            ))}
          </div>
          <p className="text-xs text-[#F4B942] mt-2 font-medium h-4">
             {(hoverRating || rating) === 5 ? "Excellent!" : 
              (hoverRating || rating) === 4 ? "Very Good" :
              (hoverRating || rating) === 3 ? "Good" :
              (hoverRating || rating) === 2 ? "Fair" : "Poor"}
          </p>
        </div>

        {/* Comment Textarea */}
        <div>
          <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2 block">
            Your Review
          </label>
          <Textarea
            placeholder="What did you learn? How was the instructor?"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="min-h-[120px] resize-none bg-black/20 border-white/10 text-white placeholder:text-zinc-600 focus:border-[#F4B942]/50 focus:ring-0 rounded-xl"
            maxLength={500}
          />
          <div className="flex justify-end mt-1">
             <p className="text-[10px] text-zinc-500">
               {comment.length}/500
             </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 justify-end pt-2">
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            disabled={isLoading}
            className="text-zinc-400 hover:text-white hover:bg-white/5"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isLoading || !comment.trim()}
            className="bg-[#F4B942] text-zinc-950 hover:bg-[#F4B942]/90 font-bold px-6 shadow-lg shadow-orange-500/10"
          >
            {isLoading ? "Saving..." : initialReview ? "Update Review" : "Post Review"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ReviewComposer;