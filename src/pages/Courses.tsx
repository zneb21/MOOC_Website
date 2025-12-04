import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Star, Clock, Users, Filter, X } from "lucide-react";
import tourismImage from "@/assets/course-tourism.jpg";
import cookingImage from "@/assets/course-cooking.jpg";
import agricultureImage from "@/assets/course-agriculture.jpg";
import craftsImage from "@/assets/course-crafts.jpg";

const allCourses = [
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
    description: "Explore the rich heritage and hidden gems of Iloilo City.",
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
    description: "Master authentic Filipino recipes passed down through generations.",
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
    description: "Learn traditional and modern sustainable farming methods.",
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
    description: "Master the ancient art of Ilonggo hablon weaving.",
  },
  {
    id: 5,
    title: "Ilonggo Language & Culture",
    instructor: "Prof. Ana Reyes",
    image: tourismImage,
    rating: 4.6,
    students: 890,
    duration: "15 hours",
    category: "Tourism",
    price: "₱1,299",
    description: "Learn the beautiful Hiligaynon language and local customs.",
  },
  {
    id: 6,
    title: "Filipino Desserts & Kakanin",
    instructor: "Nanay Rosa",
    image: cookingImage,
    rating: 4.8,
    students: 720,
    duration: "8 hours",
    category: "Cooking",
    price: "₱1,499",
    description: "Create traditional Filipino sweets and rice cakes.",
  },
  {
    id: 7,
    title: "Organic Vegetable Gardening",
    instructor: "Mang Pedro",
    image: agricultureImage,
    rating: 4.5,
    students: 430,
    duration: "5 hours",
    category: "Agriculture",
    price: "₱799",
    description: "Start your own organic vegetable garden at home.",
  },
  {
    id: 8,
    title: "Pottery & Clay Art Basics",
    instructor: "Artisan Miguel",
    image: craftsImage,
    rating: 4.7,
    students: 280,
    duration: "7 hours",
    category: "Craftsmanship",
    price: "₱1,599",
    description: "Discover the art of traditional Filipino pottery.",
  },
];

const categories = ["All", "Tourism", "Cooking", "Agriculture", "Craftsmanship"];

const Courses = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showFilters, setShowFilters] = useState(false);

  const filteredCourses = allCourses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-16 lg:pt-20">
        {/* Header */}
        <section className="py-12 lg:py-16 bg-muted">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 animate-fade-up">
                Explore <span className="text-gradient">Courses</span>
              </h1>
              <p className="text-muted-foreground text-lg animate-fade-up delay-100">
                Discover courses celebrating Philippine culture, local skills, and Ilonggo heritage
              </p>
            </div>
          </div>
        </section>

        {/* Search & Filters */}
        <section className="py-6 bg-background border-b border-border sticky top-16 lg:top-20 z-30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search courses or instructors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                  </button>
                )}
              </div>

              {/* Mobile Filter Toggle */}
              <Button
                variant="outline"
                className="sm:hidden"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>

              {/* Desktop Category Filters */}
              <div className="hidden sm:flex items-center gap-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "teal" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>

            {/* Mobile Category Filters */}
            {showFilters && (
              <div className="flex flex-wrap gap-2 mt-4 sm:hidden animate-fade-in">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "teal" : "outline"}
                    size="sm"
                    onClick={() => {
                      setSelectedCategory(category);
                      setShowFilters(false);
                    }}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Courses Grid */}
        <section className="py-12 lg:py-16 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {/* Results Count */}
            <p className="text-muted-foreground mb-6">
              Showing {filteredCourses.length} course{filteredCourses.length !== 1 ? "s" : ""}
              {selectedCategory !== "All" && ` in ${selectedCategory}`}
            </p>

            {filteredCourses.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredCourses.map((course, index) => (
                  <Link
                    key={course.id}
                    to={`/courses/${course.id}`}
                    className="group bg-card rounded-2xl overflow-hidden shadow-soft hover:shadow-medium transition-all duration-500 animate-fade-up"
                    style={{ animationDelay: `${index * 50}ms` }}
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
                      <p className="text-muted-foreground text-sm mb-1">
                        by {course.instructor}
                      </p>
                      <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                        {course.description}
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
                        <span className="text-sm text-accent font-medium">
                          View →
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-muted-foreground text-lg mb-4">
                  No courses found matching your criteria.
                </p>
                <Button variant="outline" onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All");
                }}>
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Courses;
