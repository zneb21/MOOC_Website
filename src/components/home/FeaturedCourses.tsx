import { Link } from "react-router-dom";
import { Star, Clock, Users, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Reveal from "@/components/home/Reveal";
import TiltCard from "@/components/home/TiltCard";
import SectionSeparator from "@/components/home/SectionSeparator";

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
    <section className="relative py-20 lg:py-28 overflow-hidden bg-slate-50 dark:bg-emerald-950/90">
      {/* ✨ About-page style ambience */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-slate-100 to-white dark:from-black/50 dark:via-emerald-950/70 dark:to-black/55" />
      <div className="absolute -top-24 left-10 w-80 h-80 bg-[#F4B942]/20 dark:bg-[#F4B942]/12 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-8 w-72 h-72 bg-teal-400/20 dark:bg-teal-400/12 rounded-full blur-3xl" />
      <div className="absolute top-1/3 left-1/2 w-72 h-72 bg-emerald-400/15 dark:bg-emerald-400/8 rounded-full blur-3xl -translate-x-1/2" />

      {/* subtle dot texture (like About vibe) */}
      <div className="absolute inset-0 opacity-[0.1] dark:opacity-[0.07] bg-[radial-gradient(circle_at_1px_1px,black_1px,transparent_0)] dark:bg-[radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:24px_24px]" />

      {/* soft vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-100/50 via-transparent to-transparent dark:from-black/45 dark:via-transparent dark:to-black/30 pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <Reveal>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-12 lg:mb-16">
            <div>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4">
                Featured <span className="text-gradient">Courses</span>
              </h2>
              <p className="text-slate-700/80 dark:text-white/70 text-lg max-w-xl">
                Handpicked courses by our expert instructors to help you master local skills
              </p>
            </div>

            <Button
              variant="outline"
              asChild
              className="hidden sm:flex bg-black/5 hover:bg-black/10 border-black/10 text-slate-800 dark:bg-white/5 dark:hover:bg-white/10 dark:border-white/15 dark:text-white"
            >
              <Link to="/courses" className="flex items-center gap-2">
                View All Courses <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredCourses.map((course, i) => (
            <Reveal key={course.id} delayMs={i * 90}>
              <TiltCard className="group">
                <Link
                  to={`/courses/${course.id}`}
                  className="
                    relative block rounded-3xl overflow-hidden bg-white/60 dark:bg-black/20
                    backdrop-blur-2xl border border-white/20 dark:border-white/10
                    shadow-xl dark:shadow-[0_22px_70px_rgba(0,0,0,0.45)]
                    transition-all duration-500
                    hover:-translate-y-1 hover:shadow-2xl dark:hover:shadow-[0_34px_110px_rgba(0,0,0,0.65)]
                    hover:ring-1 hover:ring-emerald-500/30 dark:hover:ring-emerald-300/30
                  "
                >
                  {/* subtle glass sweep */}
                  <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute -inset-x-24 -inset-y-24 rotate-12 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                  </div>

                  {/* image */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    /> 
                    <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent" />

                    {/* category pill */}
                    <div className="absolute top-3 left-3">
                      <span className="bg-black/40 text-white text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-md border border-white/15">
                        {course.category}
                      </span>
                    </div>
                  </div>

                  {/* content */}
                  <div className="p-5 relative"> 
                    <h3 className="font-display text-lg font-semibold text-slate-900 dark:text-white mb-2 line-clamp-2 group-hover:text-emerald-600 dark:group-hover:text-[#F4B942] transition-colors">
                      {course.title}
                    </h3>

                    <p className="text-slate-700/80 dark:text-white/65 text-sm mb-3">
                      by <span className="text-slate-800 dark:text-white/80">{course.instructor}</span>
                    </p>

                    <div className="flex items-center gap-4 text-sm text-slate-700/80 dark:text-white/65 mb-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-[#F4B942] fill-[#F4B942]" />
                        <span className="font-medium text-slate-800 dark:text-white">{course.rating}</span>
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

                    <div className="flex items-center justify-between pt-4 border-t border-black/10 dark:border-white/10">
                      <span className="font-display text-xl font-bold text-emerald-600 dark:text-emerald-300">
                        {course.price}
                      </span>

                      <span className="text-sm font-semibold text-emerald-600/90 dark:text-[#F4B942]/90 group-hover:text-emerald-600 dark:group-hover:text-[#F4B942] transition-colors">
                        View Course →
                      </span>
                    </div>
                  </div>
                </Link>
              </TiltCard>
            </Reveal>
          ))}
        </div>

        {/* mobile button */}
        <div className="mt-8 text-center sm:hidden">
          <Button
            variant="outline"
            asChild
            className="w-full bg-black/5 hover:bg-black/10 border-black/10 text-slate-800 dark:bg-white/5 dark:hover:bg-white/10 dark:border-white/15 dark:text-white"
          >
            <Link to="/courses" className="flex items-center justify-center gap-2">
              View All Courses <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>

      {/* wave end (keeps your current component) */}
      <div className="absolute bottom-0 left-0 right-0">
        <SectionSeparator />
      </div>
    </section>
  );
};

export default FeaturedCourses;
