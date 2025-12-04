import { Link } from "react-router-dom";
import { Star, Clock, Users, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import tourismImage from "@/assets/course-tourism.jpg";
import cookingImage from "@/assets/course-cooking.jpg";
import agricultureImage from "@/assets/course-agriculture.jpg";
import craftsImage from "@/assets/course-crafts.jpg";

const featuredCourses = [
  {
    id: 1,
    title: "Discover Iloilo: A Complete Tourism Guide",
    instructor: "Maria Santos",
    image: tourismImage,
    rating: 4.9,
    students: 1250,
    duration: "8 hours",
    category: "Tourism",
    price: "₱1,499",
  },
  {
    id: 2,
    title: "Traditional Filipino Cuisine Masterclass",
    instructor: "Chef Ramon Cruz",
    image: cookingImage,
    rating: 4.8,
    students: 980,
    duration: "12 hours",
    category: "Cooking",
    price: "₱1,999",
  },
  {
    id: 3,
    title: "Sustainable Rice Farming Techniques",
    instructor: "Juan dela Cruz",
    image: agricultureImage,
    rating: 4.7,
    students: 540,
    duration: "6 hours",
    category: "Agriculture",
    price: "₱999",
  },
  {
    id: 4,
    title: "Hablon Weaving: Traditional Textile Art",
    instructor: "Lola Perla",
    image: craftsImage,
    rating: 4.9,
    students: 320,
    duration: "10 hours",
    category: "Craftsmanship",
    price: "₱1,799",
  },
];

const FeaturedCourses = () => {
  return (
    <section className="py-20 lg:py-28 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-12">
          <div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Featured <span className="text-gradient">Courses</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl">
              Handpicked courses by our expert instructors to help you master local skills
            </p>
          </div>
          <Button variant="outline" asChild className="hidden sm:flex">
            <Link to="/courses" className="flex items-center gap-2">
              View All Courses
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredCourses.map((course, index) => (
            <Link
              key={course.id}
              to={`/courses/${course.id}`}
              className="group bg-card rounded-2xl overflow-hidden shadow-soft hover:shadow-medium transition-all duration-500 animate-fade-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Image */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-3 left-3">
                  <span className="bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full">
                    {course.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="font-display text-lg font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                  {course.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-3">
                  by {course.instructor}
                </p>

                {/* Stats */}
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-secondary fill-secondary" />
                    <span className="font-medium text-foreground">{course.rating}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{course.students.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{course.duration}</span>
                  </div>
                </div>

                {/* Price */}
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <span className="font-display text-xl font-bold text-primary">
                    {course.price}
                  </span>
                  <span className="text-sm text-accent font-medium group-hover:text-accent/80 transition-colors">
                    View Course →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Mobile View All Button */}
        <div className="mt-8 text-center sm:hidden">
          <Button variant="outline" asChild className="w-full">
            <Link to="/courses" className="flex items-center justify-center gap-2">
              View All Courses
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCourses;
