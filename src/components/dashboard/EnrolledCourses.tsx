import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BookOpen, ArrowRight } from "lucide-react";
import { Enrollment } from "@/data/mockData";

interface EnrolledCoursesProps {
  enrollments: Enrollment[];
}

const EnrolledCourses = ({ enrollments }: EnrolledCoursesProps) => {
  if (enrollments.length === 0) {
    return (
      <div className="bg-card rounded-2xl p-8 shadow-soft animate-fade-up delay-300">
        <div className="text-center py-8">
          <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="font-display text-xl font-semibold text-foreground mb-2">
            No courses yet!
          </h3>
          <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
            Start your learning journey by exploring our course catalog and discovering Philippine culture and heritage.
          </p>
          <Button variant="teal" asChild>
            <Link to="/courses">Browse Courses</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl p-6 shadow-soft animate-fade-up delay-300">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-xl font-semibold text-foreground">
          My Enrolled Courses
        </h2>
        <Button variant="ghost" size="sm" asChild>
          <Link to="/courses" className="text-primary">
            View All
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {enrollments.map((enrollment, index) => (
          <div
            key={enrollment.id}
            className="group bg-muted/50 rounded-xl overflow-hidden hover:shadow-medium transition-all duration-300"
            style={{ animationDelay: `${(index + 4) * 100}ms` }}
          >
            <div className="aspect-video relative overflow-hidden">
              <img
                src={enrollment.image}
                alt={enrollment.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-2 right-2">
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-background/90 text-foreground">
                  {enrollment.category}
                </span>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-medium text-foreground line-clamp-2 mb-1 group-hover:text-primary transition-colors">
                {enrollment.title}
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                {enrollment.instructor}
              </p>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium text-foreground">{enrollment.progress}%</span>
                </div>
                <Progress value={enrollment.progress} className="h-2" />
              </div>
              <Button
                variant={enrollment.progress === 100 ? "outline" : "teal"}
                size="sm"
                className="w-full mt-4"
                asChild
              >
                <Link to={`/courses/${enrollment.courseId}`}>
                  {enrollment.progress === 100 ? "Review Course" : "Continue Learning"}
                </Link>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EnrolledCourses;
