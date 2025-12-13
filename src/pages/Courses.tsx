import { useState, useEffect } from "react";
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
import LiquidEther from "@/components/ui/liquidether";

// === Types for data from your PHP/MySQL API ===
interface CourseFromApi {
  course_id: number;
  course_title: string;
  course_description: string | null;
  course_sub_description: string | null;
  course_price: number;
  course_category: string | null;
  instructor_id?: number | null;

  instructor_name?: string | null;
  instructor_title?: string | null;

  // ⭐ from backend
  course_thumbnail?: string | null;
  course_thumbnail_url?: string | null;
}

// === Type used by your UI cards ===
interface CourseCard {
  id: number;
  title: string;
  instructor: string;
  image: string;
  rating: number;
  students: number;
  duration: string;
  category: string;
  price: string;
  description: string;
}

const categories = ["All", "Tourism", "Cooking", "Agriculture", "Craftsmanship"];

// adjust base URL if your folder name / path is different
const API_URL = "http://localhost/mooc_api/get_courses.php";

const Courses = () => {
  const [courses, setCourses] = useState<CourseCard[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch(API_URL);
        if (!res.ok) {
          throw new Error(`Failed to fetch courses (${res.status})`);
        }

        const data: CourseFromApi[] = await res.json();

        const mapped: CourseCard[] = data.map((c) => {
          // fallback image if DB thumbnail is missing
          let fallbackImage = tourismImage;
          if (c.course_category === "Cooking") fallbackImage = cookingImage;
          else if (c.course_category === "Agriculture") fallbackImage = agricultureImage;
          else if (c.course_category === "Craftsmanship") fallbackImage = craftsImage;

          return {
            id: c.course_id,
            title: c.course_title,
            instructor: c.instructor_name ?? "Unknown Instructor",
            // ⭐ primary: DB thumbnail URL; fallback: local placeholder
            image: c.course_thumbnail_url ?? fallbackImage,
            rating: Number(4.8.toFixed(1)),
            students: 0,
            duration: "8 hours",
            category: c.course_category ?? "Uncategorized",
            price: `₱${c.course_price.toLocaleString()}`,
            description:
              c.course_sub_description ??
              c.course_description ??
              "No description available.",
          };
        });

        setCourses(mapped);
        setLoading(false);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Failed to load courses");
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="relative min-h-screen bg-muted">
       {/* Background Layer */}
       <div
         style={{
           position: "fixed",
           top: 0,
           left: 0,
           width: "100%",
           height: "100vh",
           zIndex: 0,
         }}
         className="liquid-ether-container"
       >
         <LiquidEther
           colors={["#4C8C4A", "#98D198", "#70A370"]}
           mouseForce={30}
           cursorSize={100}
           isViscous={false}
           viscous={30}
           iterationsViscous={32}
           iterationsPoisson={32}
           resolution={0.3}
           isBounce={false}
           autoDemo={true}
           autoSpeed={0.5}
           autoIntensity={2.2}
           takeoverDuration={0.25}
           autoResumeDelay={3000}
           autoRampDuration={0.6}
         />
       </div>
      <Navbar />

      <main className="pt-16 lg:pt-20">
        {/* About-style header */}
        <section className="relative overflow-hidden py-14 lg:py-20 bg-emerald-950/90">
          <div className="absolute inset-0 bg-gradient-to-br from-black/55 via-emerald-950/70 to-black/55" />
          <div className="absolute -top-24 left-10 w-80 h-80 bg-[#F4B942]/12 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-8 w-72 h-72 bg-teal-400/12 rounded-full blur-3xl" />
          <div className="absolute inset-0 opacity-[0.07] bg-[radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:24px_24px]" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/30 pointer-events-none" />

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-2xl">
              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 animate-fade-up">
                Explore <span className="text-[#F4B942]">Courses</span>
              </h1>
              <p className="text-white/70 text-lg animate-fade-up delay-100">
                Discover courses celebrating Philippine culture, local skills, and Ilonggo heritage
              </p>
            </div>
          </div>
        </section>

        {/* Search & Filters (glass bar like About) */}
        <section className="py-6 border-b border-white/10 bg-emerald-950/70 sticky top-16 lg:top-20 z-30 backdrop-blur-xl">
          <div className="absolute inset-0 bg-gradient-to-r from-black/25 via-emerald-950/25 to-black/25" />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
                <Input
                  type="text"
                  placeholder="Search courses or instructors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="
                    pl-10 h-12
                    bg-white/5 border-white/15 text-white placeholder:text-white/50
                    focus-visible:ring-emerald-300/40
                  "
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    <X className="w-4 h-4 text-white/60 hover:text-white" />
                  </button>
                )}
              </div>

              {/* Mobile Filter Toggle */}
              <Button
                variant="outline"
                className="sm:hidden bg-white/5 hover:bg-white/10 border-white/15 text-white"
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
                    className={
                      selectedCategory === category
                        ? ""
                        : "bg-white/5 hover:bg-white/10 border-white/15 text-white"
                    }
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
                    className={
                      selectedCategory === category
                        ? ""
                        : "bg-white/5 hover:bg-white/10 border-white/15 text-white"
                    }
                  >
                    {category}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Courses Grid */}
        <section className="relative py-12 lg:py-16 bg-emerald-950/90 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-emerald-950/70 to-black/45" />
          <div className="absolute top-1/3 left-10 w-72 h-72 bg-emerald-400/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-72 h-72 bg-[#F4B942]/10 rounded-full blur-3xl" />
          <div className="absolute inset-0 opacity-[0.06] bg-[radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:26px_26px]" />

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Results / loading / error */}
            {loading ? (
              <p className="text-white/70 mb-6">Loading courses...</p>
            ) : error ? (
              <p className="text-red-300 mb-6">Error: {error}</p>
            ) : (
              <p className="text-white/70 mb-6">
                Showing {filteredCourses.length} course
                {filteredCourses.length !== 1 ? "s" : ""}
                {selectedCategory !== "All" && ` in ${selectedCategory}`}
              </p>
            )}

            {!loading && !error && (
              <>
                {filteredCourses.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredCourses.map((course, index) => (
                      <Link
                        key={course.id}
                        to={`/courses/${course.id}`}
                        className="
                          group relative rounded-3xl overflow-hidden
                          bg-black/20 backdrop-blur-2xl
                          border border-white/10
                          shadow-[0_22px_70px_rgba(0,0,0,0.45)]
                          transition-all duration-500
                          hover:-translate-y-1 hover:shadow-[0_34px_110px_rgba(0,0,0,0.65)]
                          hover:ring-1 hover:ring-emerald-300/30
                          animate-fade-up
                        "
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        {/* shimmer sweep */}
                        <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                          <div className="absolute -inset-x-24 -inset-y-24 rotate-12 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                        </div>

                        {/* Image */}
                        <div className="relative aspect-[4/3] overflow-hidden">
                          <img
                            src={course.image}
                            alt={course.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent" />
                          <div className="absolute top-3 left-3">
                            <span className="bg-black/35 text-white text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-md border border-white/10">
                              {course.category}
                            </span>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-5 relative">
                          <h3 className="font-display text-lg font-semibold text-white mb-2 line-clamp-2 group-hover:text-[#F4B942] transition-colors">
                            {course.title}
                          </h3>
                          <p className="text-white/65 text-sm mb-1">
                            by <span className="text-white/80">{course.instructor}</span>
                          </p>
                          <p className="text-white/60 text-sm mb-3 line-clamp-2">
                            {course.description}
                          </p>

                          {/* Stats */}
                          <div className="flex items-center gap-4 text-sm text-white/65 mb-4">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-[#F4B942] fill-[#F4B942]" />
                              <span className="font-medium text-white">
                                {course.rating.toFixed(1)}
                              </span>
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
                          <div className="flex items-center justify-between pt-4 border-t border-white/10">
                            <span className="font-display text-xl font-bold text-emerald-300">
                              {course.price}
                            </span>
                            <span className="text-sm font-semibold text-[#F4B942]/90 group-hover:text-[#F4B942] transition-colors">
                              View →
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <p className="text-white/70 text-lg mb-4">
                      No courses found matching your criteria.
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearchQuery("");
                        setSelectedCategory("All");
                      }}
                      className="bg-white/5 hover:bg-white/10 border-white/15 text-white"
                    >
                      Clear Filters
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Courses;
