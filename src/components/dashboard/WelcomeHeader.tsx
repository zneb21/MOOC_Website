import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookOpen, Compass } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const WelcomeHeader = () => {
  const { user } = useAuth();

  return (
    <div className="bg-card rounded-2xl p-6 md:p-8 shadow-soft animate-fade-up">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-2">
            Welcome back, {user?.fullName?.split(" ")[0] || "Learner"}! 👋
          </h1>
          <p className="text-muted-foreground">
            Continue your learning journey in Philippine culture and heritage.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button variant="teal" asChild>
            <Link to="/courses">
              <Compass className="w-4 h-4 mr-2" />
              Browse Courses
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeHeader;
