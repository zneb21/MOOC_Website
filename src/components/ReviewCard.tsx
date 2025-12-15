import { Star, Edit2, Trash2, AlertCircle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

export interface ReviewCardProps {
  id?: string;
  name: string;
  rating: number;
  comment: string;
  isOwnReview?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  isDeleting?: boolean;
}

const ReviewCard = ({
  name,
  rating,
  comment,
  isOwnReview = false,
  onEdit,
  onDelete,
  isDeleting = false,
}: ReviewCardProps) => {
  return (
    <div className="bg-white/60 dark:bg-white/5 backdrop-blur-sm border border-black/5 dark:border-white/5 rounded-2xl p-5 relative group hover:bg-white/100 dark:hover:bg-white/8 hover:border-black/10 dark:hover:border-white/10 transition-all duration-300">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3 flex-1">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#F4B942] to-orange-400 flex items-center justify-center flex-shrink-0 shadow-lg shadow-orange-500/20">
            <span className="text-zinc-950 font-bold text-sm">
              {name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 justify-between">
              <p className="font-semibold text-zinc-900 dark:text-white">{name}</p>
              {isOwnReview && (
                <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded">
                  You
                </span>
              )}
            </div>
            <div className="flex items-center gap-1 mt-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i < rating
                      ? "text-[#F4B942] fill-current"
                      : "text-zinc-300 dark:text-zinc-700 fill-current"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {isOwnReview && (onEdit || onDelete) && (
          <div className="flex gap-2 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
            {onEdit && (
              <Button
                size="sm"
                variant="ghost"
                onClick={onEdit}
                className="h-8 w-8 p-0 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-black/10 dark:hover:bg-white/10"
                title="Edit review"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </Button>
            )}
            {onDelete && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0 text-red-500/70 dark:text-red-400/70 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-500/10"
                    title="Delete review"
                    disabled={isDeleting}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-white dark:bg-zinc-900 border-black/10 dark:border-white/10 text-zinc-900 dark:text-white">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2 text-zinc-900 dark:text-white">
                      <AlertCircle className="w-5 h-5 text-red-500" />
                      Delete Review
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-zinc-600 dark:text-zinc-400">
                      Are you sure you want to delete your review? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <div className="flex gap-2 justify-end">
                    <AlertDialogCancel className="bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10 text-zinc-900 dark:text-white hover:bg-black/10 dark:hover:bg-white/10 hover:text-zinc-900 dark:hover:text-white">Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={onDelete}
                      className="bg-red-500 text-white hover:bg-red-600"
                      disabled={isDeleting}
                    >
                      {isDeleting ? "Deleting..." : "Delete"}
                    </AlertDialogAction>
                  </div>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        )}
      </div>
      <p className="text-zinc-700 dark:text-zinc-300 text-sm leading-relaxed">{comment}</p>
    </div>
  );
};

export default ReviewCard;