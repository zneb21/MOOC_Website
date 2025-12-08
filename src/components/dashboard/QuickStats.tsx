import { BookOpen, Clock, CheckCircle } from "lucide-react";
import { Enrollment } from "@/data/mockData";

interface QuickStatsProps {
  enrollments: Enrollment[];
}

const QuickStats = ({ enrollments }: QuickStatsProps) => {
  const totalCourses = enrollments.length;
  const inProgress = enrollments.filter((e) => e.progress > 0 && e.progress < 100).length;
  const completed = enrollments.filter((e) => e.progress === 100).length;

  const stats = [
    {
      icon: BookOpen,
      label: "Enrolled",
      value: totalCourses,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      icon: Clock,
      label: "In Progress",
      value: inProgress,
      color: "text-secondary",
      bgColor: "bg-secondary/10",
    },
    {
      icon: CheckCircle,
      label: "Completed",
      value: completed,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-4">
      {stats.map((stat, index) => (
        <div
          key={stat.label}
          className="bg-card rounded-xl p-4 shadow-soft animate-fade-up"
          style={{ animationDelay: `${(index + 1) * 100}ms` }}
        >
          <div className={`w-10 h-10 rounded-lg ${stat.bgColor} flex items-center justify-center mb-3`}>
            <stat.icon className={`w-5 h-5 ${stat.color}`} />
          </div>
          <p className="text-2xl font-bold text-foreground">{stat.value}</p>
          <p className="text-sm text-muted-foreground">{stat.label}</p>
        </div>
      ))}
    </div>
  );
};

export default QuickStats;
