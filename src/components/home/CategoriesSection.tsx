import { Link } from "react-router-dom";
import { MapPin, Utensils, Leaf, Palette, ArrowRight } from "lucide-react";
import tourismImage from "@/assets/course-tourism.jpg";
import cookingImage from "@/assets/course-cooking.jpg";
import agricultureImage from "@/assets/course-agriculture.jpg";
import craftsImage from "@/assets/course-crafts.jpg";

const categories = [
  {
    name: "Tourism",
    description: "Explore Iloilo's heritage sites, festivals, and hidden gems",
    icon: MapPin,
    image: tourismImage,
    courses: 12,
    color: "bg-teal",
  },
  {
    name: "Filipino Cooking",
    description: "Master authentic Filipino recipes and cooking techniques",
    icon: Utensils,
    image: cookingImage,
    courses: 15,
    color: "bg-coral",
  },
  {
    name: "Agriculture",
    description: "Learn sustainable farming and traditional agricultural methods",
    icon: Leaf,
    image: agricultureImage,
    courses: 8,
    color: "bg-primary",
  },
  {
    name: "Craftsmanship",
    description: "Discover traditional weaving, pottery, and Filipino arts",
    icon: Palette,
    image: craftsImage,
    courses: 10,
    color: "bg-secondary",
  },
];

const CategoriesSection = () => {
  return (
    <section className="py-20 lg:py-28 bg-muted pattern-weave">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 lg:mb-16">
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Explore{" "}
            <span className="text-gradient">Categories</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Discover a wide range of courses celebrating Philippine culture and local expertise
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <Link
              key={category.name}
              to="/courses"
              className="group relative overflow-hidden rounded-2xl bg-card shadow-soft hover:shadow-medium transition-all duration-500 animate-fade-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Image */}
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/40 to-transparent" />
              </div>

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <div className={`w-10 h-10 rounded-xl ${category.color} flex items-center justify-center mb-3 shadow-soft`}>
                  <category.icon className="w-5 h-5 text-primary-foreground" />
                </div>
                <h3 className="font-display text-xl font-bold text-primary-foreground mb-1">
                  {category.name}
                </h3>
                <p className="text-primary-foreground/70 text-sm mb-3 line-clamp-2">
                  {category.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-secondary text-sm font-medium">
                    {category.courses} Courses
                  </span>
                  <span className="flex items-center gap-1 text-primary-foreground/70 text-sm group-hover:text-secondary transition-colors">
                    Explore
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
