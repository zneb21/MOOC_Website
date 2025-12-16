import { Link } from "react-router-dom";
import { MapPin, Utensils, Leaf, Palette, ArrowRight } from "lucide-react";
import Reveal from "@/components/home/Reveal";
import TiltCard from "@/components/home/TiltCard";
import SectionSeparator from "@/components/home/SectionSeparator";

import { useEffect, useMemo, useState } from "react";

type CourseFromApi = {
  course_id: number;
  course_category: string | null;
  course_thumbnail_url?: string | null; // ✅ from get_courses.php (like CoursePreview)
};

const API_URL = "http://localhost/mooc_api/get_courses.php";

const CategoriesSection = () => {
  const [dbCourses, setDbCourses] = useState<CourseFromApi[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(API_URL);
        const data: CourseFromApi[] = await res.json();
        setDbCourses(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("Failed to load categories:", e);
        setDbCourses([]);
      }
    })();
  }, []);

  // ✅ unique categories only (first occurrence kept, duplicates skipped)
  // ✅ thumbnail image pulled from DB (first course found for that category)
  const categories = useMemo(() => {
    const seen = new Set<string>();
    const iconCycle = [MapPin, Utensils, Leaf, Palette]; // ✅ no mapping, just "at least one icon"

    const uniqueCats = dbCourses
      .map((c) => (c.course_category ?? "").trim())
      .filter(Boolean)
      .filter((cat) => {
        const key = cat.toLowerCase();
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });

    return uniqueCats.map((cat, idx) => {
      const key = cat.toLowerCase();

      const coursesInCat = dbCourses.filter(
        (c) => (c.course_category ?? "").trim().toLowerCase() === key
      );

      // ✅ "first one you can find in the DB" for the image (same idea as CoursePreview)
      const firstWithThumb = coursesInCat.find((c) => !!c.course_thumbnail_url);
      const imageFromDb = firstWithThumb?.course_thumbnail_url ?? null;

      const Icon = iconCycle[idx % iconCycle.length];

      // keep your existing class names; rotate a few so cards still look varied
      const colorCycle = ["bg-teal", "bg-coral", "bg-primary", "bg-secondary"];
      const color = colorCycle[idx % colorCycle.length];

      return {
        name: cat,
        description: "Explore courses in this category",
        icon: Icon,
        image: imageFromDb, // ✅ from DB
        courses: coursesInCat.length,
        color,
      };
    });
  }, [dbCourses]);

  return (
    <section className="relative py-20 lg:py-28 bg-muted overflow-hidden">
      {/* ambient blobs */}
      <div className="absolute -top-24 right-10 w-72 h-72 bg-[#F4B942]/10 rounded-full blur-3xl" />
      <div className="absolute bottom-12 left-10 w-64 h-64 bg-teal-400/10 rounded-full blur-3xl" />

      {/* subtle texture */}
      <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(circle_at_1px_1px,black_1px,transparent_0)] [background-size:26px_26px]" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <Reveal>
          <div className="text-center max-w-2xl mx-auto mb-12 lg:mb-16">
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Explore <span className="text-gradient">Categories</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              Discover a wide range of courses celebrating Philippine culture and local expertise
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, i) => (
            <Reveal key={category.name} delayMs={i * 90}>
              <TiltCard className="group">
                <Link
                  to="/courses"
                  className="block relative rounded-3xl overflow-hidden transition-all duration-500
                             bg-white/55 dark:bg-white/6 backdrop-blur-xl
                             border border-black/10 dark:border-white/10
                             shadow-[0_16px_50px_rgba(0,0,0,0.10)] dark:shadow-[0_18px_60px_rgba(0,0,0,0.35)]
                             hover:shadow-[0_28px_90px_rgba(0,0,0,0.18)] dark:hover:shadow-[0_30px_100px_rgba(0,0,0,0.55)]
                             hover:ring-1 hover:ring-[#F4B942]/30"
                >
                  {/* ✅ glass highlight sweep */}
                  <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute -inset-x-24 -inset-y-24 rotate-12 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                  </div>

                  {/* image (from DB) */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    {category.image ? (
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full bg-black/10 dark:bg-white/5" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/25 to-transparent" />
                  </div>

                  {/* content overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <div
                      className={`w-11 h-11 rounded-2xl ${category.color} flex items-center justify-center mb-3
                                  shadow-[0_14px_35px_rgba(0,0,0,0.28)] border border-white/15`}
                    >
                      <category.icon className="w-5 h-5 text-primary-foreground" />
                    </div>

                    <h3 className="font-display text-xl font-bold text-white mb-1">
                      {category.name}
                    </h3>

                    <p className="text-white/70 text-sm mb-3 line-clamp-2">
                      {category.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <span className="text-[#F4B942] text-sm font-semibold">
                        {category.courses} Courses
                      </span>

                      <span className="flex items-center gap-1 text-white/70 text-sm group-hover:text-[#F4B942] transition-colors">
                        Explore
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                  </div>
                </Link>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>

      {/* wave end */}
      <div className="absolute bottom-0 left-0 right-0">
        <SectionSeparator />
      </div>
    </section>
  );
};

export default CategoriesSection;
