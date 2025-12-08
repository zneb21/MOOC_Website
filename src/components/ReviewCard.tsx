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
    <div className="bg-card rounded-xl p-5 shadow-soft relative group">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3 flex-1">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
            <span className="text-primary-foreground font-semibold">
              {name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 justify-between">
              <p className="font-semibold text-foreground">{name}</p>
              {isOwnReview && (
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                  Your Review
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < rating
                      ? "text-secondary fill-secondary"
                      : "text-muted-foreground"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons - Show on hover or always for own reviews */}
        {isOwnReview && (onEdit || onDelete) && (
          <div className="flex gap-2 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
            {onEdit && (
              <Button
                size="sm"
                variant="ghost"
                onClick={onEdit}
                className="h-8 w-8 p-0"
                title="Edit review"
              >
                <Edit2 className="w-4 h-4" />
              </Button>
            )}
            {onDelete && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                    title="Delete review"
                    disabled={isDeleting}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-destructive" />
                      Delete Review
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete your review? This action
                      cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <div className="flex gap-2 justify-end">
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={onDelete}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
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
      <p className="text-muted-foreground">{comment}</p>
    </div>
  );
};

export default ReviewCard;
