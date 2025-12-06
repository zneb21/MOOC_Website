import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Star, Clock, Users, PlayCircle, CheckCircle, Award, BookOpen, FileText, HelpCircle } from "lucide-react";
import tourismImage from "@/assets/course-tourism.jpg";
import cookingImage from "@/assets/course-cooking.jpg";
import agricultureImage from "@/assets/course-agriculture.jpg";
import craftsImage from "@/assets/course-crafts.jpg";

type Lesson = {
  title: string;
  duration: string;
  type: 'video' | 'reading' | 'quiz';
};

type Module = {
  title: string;
  lessons: Lesson[];
  duration: string;
};

// ✅ data coming from PHP/MySQL
const API_URL = "http://localhost/mooc_api/get_courses.php";

// ✅ shape of rows from your API
interface CourseFromApi {
  course_id: number;
  course_title: string;
  course_description: string | null;
  course_sub_description: string | null;
  course_price: number;
  course_category: string | null;
  course_thumbnail_url?: string | null;
  instructor_name?: string | null;
  instructor_bio?: string | null; 
  instructor_image_url?: string | null;
  instructor_title?: string | null;   // ✅ new
}


// ✅ original static data (keeps objectives, modules, reviews, etc.)
const coursesData: Record<
  string,
  {
    id: number;
    title: string;
    instructor: string;
    instructorBio: string;
    image: string;
    instructorImage?: string;
    instructorTitle?: string;
    rating: number;
    students: number;
    duration: string;
    category: string;
    price: string;
    description: string;
    longDescription: string;
    objectives: string[];
    modules: Module[];
    reviews: { name: string; rating: number; comment: string }[];
  }
> = {
  "1": {
    id: 1,
    title: "Discover Iloilo: A Complete Tourism Guide",
    instructor: "Maria Santos",
    instructorBio:
      "Maria is a certified tour guide with 15 years of experience showcasing Iloilo's heritage to visitors worldwide.",
    image: tourismImage,
    rating: 4.9,
    students: 1250,
    duration: "8 hours",
    category: "Tourism",
    price: "₱1,499",
    description: "Explore the rich heritage and hidden gems of Iloilo City.",
    longDescription:
      "Embark on a comprehensive journey through Iloilo's rich cultural tapestry. This course covers everything from historic churches to vibrant festivals, local cuisine hotspots, and off-the-beaten-path destinations that make Iloilo truly special.",
    objectives: [
      "Understand Iloilo's historical significance in Philippine history",
      "Navigate popular tourist destinations with confidence",
      "Discover hidden gems known only to locals",
      "Learn about Ilonggo customs and traditions",
      "Plan complete itineraries for different travel styles",
    ],
    modules: [
      { title: "Introduction to Iloilo", duration: "1h 30m", lessons: [
        { title: "Welcome to Iloilo", duration: "5:00", type: "video" },
        { title: "History Overview", duration: "12:30", type: "video" },
        { title: "Geography & Climate", duration: "8:45", type: "reading" },
        { title: "Cultural Identity of Ilonggos", duration: "15:00", type: "video" },
        { title: "Module Quiz", duration: "10:00", type: "quiz" },
      ]},
      { title: "Historic Churches & Heritage Sites", duration: "2h 15m", lessons: [
        { title: "Jaro Cathedral", duration: "18:00", type: "video" },
        { title: "Molo Church", duration: "15:30", type: "video" },
        { title: "San Jose Church", duration: "12:00", type: "video" },
        { title: "Heritage Walking Tour Guide", duration: "20:00", type: "reading" },
        { title: "Lopez Heritage House", duration: "14:00", type: "video" },
        { title: "Iloilo Museum of Contemporary Art", duration: "16:00", type: "video" },
        { title: "Preservation Efforts", duration: "10:00", type: "reading" },
        { title: "Heritage Sites Quiz", duration: "15:00", type: "quiz" },
      ]},
      { title: "Festivals & Cultural Events", duration: "1h", lessons: [
        { title: "Dinagyang Festival", duration: "20:00", type: "video" },
        { title: "Paraw Regatta", duration: "15:00", type: "video" },
        { title: "Local Fiestas Calendar", duration: "10:00", type: "reading" },
        { title: "Festival Photography Tips", duration: "15:00", type: "video" },
      ]},
      { title: "Local Cuisine & Food Tourism", duration: "1h 45m", lessons: [
        { title: "La Paz Batchoy Origins", duration: "18:00", type: "video" },
        { title: "Pancit Molo History", duration: "15:00", type: "video" },
        { title: "Best Food Spots Guide", duration: "12:00", type: "reading" },
        { title: "Seafood Markets Tour", duration: "20:00", type: "video" },
        { title: "Street Food Adventure", duration: "18:00", type: "video" },
        { title: "Cuisine Quiz", duration: "12:00", type: "quiz" },
      ]},
      { title: "Hidden Gems & Day Trips", duration: "1h 30m", lessons: [
        { title: "Islas de Gigantes", duration: "22:00", type: "video" },
        { title: "Guimaras Island", duration: "18:00", type: "video" },
        { title: "Planning Your Day Trip", duration: "15:00", type: "reading" },
        { title: "Off-the-beaten Path", duration: "20:00", type: "video" },
        { title: "Final Assessment", duration: "15:00", type: "quiz" },
      ]},
    ],
    reviews: [
      {
        name: "Jose M.",
        rating: 5,
        comment: "Amazing course! I learned so much about my own city.",
      },
      {
        name: "Anna L.",
        rating: 5,
        comment: "Maria is an excellent instructor. Very informative!",
      },
      {
        name: "Mark T.",
        rating: 4,
        comment: "Great content, helped me plan my Iloilo trip perfectly.",
      },
    ],
  },
  "2": {
    id: 2,
    title: "Traditional Filipino Cuisine Masterclass",
    instructor: "Chef Ramon Cruz",
    instructorBio:
      "Chef Ramon has 20 years of culinary experience and has trained in Manila, Iloilo, and Paris.",
    image: cookingImage,
    rating: 4.8,
    students: 980,
    duration: "12 hours",
    category: "Cooking",
    price: "₱1,999",
    description:
      "Master authentic Filipino recipes passed down through generations.",
    longDescription:
      "Learn to cook authentic Filipino dishes from a master chef. This comprehensive course covers traditional recipes, cooking techniques, and the cultural significance behind each dish. From adobo to kare-kare, become a Filipino cuisine expert.",
    objectives: [
      "Master essential Filipino cooking techniques",
      "Prepare classic dishes like Adobo, Sinigang, and Kare-Kare",
      "Understand the history behind Filipino cuisine",
      "Source and prepare traditional ingredients",
      "Create your own variations while respecting tradition",
    ],
    modules: [
      { title: "Filipino Cooking Fundamentals", duration: "2h", lessons: [
        { title: "Essential Kitchen Tools", duration: "12:00", type: "video" },
        { title: "Basic Cutting Techniques", duration: "18:00", type: "video" },
        { title: "Understanding Filipino Flavors", duration: "15:00", type: "video" },
        { title: "Ingredient Sourcing Guide", duration: "20:00", type: "reading" },
        { title: "Stock & Broth Basics", duration: "22:00", type: "video" },
        { title: "Fundamentals Quiz", duration: "15:00", type: "quiz" },
      ]},
      { title: "Classic Meat Dishes", duration: "3h", lessons: [
        { title: "Chicken Adobo", duration: "25:00", type: "video" },
        { title: "Pork Adobo Variations", duration: "22:00", type: "video" },
        { title: "Beef Caldereta", duration: "28:00", type: "video" },
        { title: "Kare-Kare", duration: "30:00", type: "video" },
        { title: "Lechon Kawali", duration: "20:00", type: "video" },
        { title: "Bistek Tagalog", duration: "18:00", type: "video" },
        { title: "Meat Selection Tips", duration: "12:00", type: "reading" },
        { title: "Meat Dishes Quiz", duration: "15:00", type: "quiz" },
      ]},
      { title: "Seafood Specialties", duration: "2h 30m", lessons: [
        { title: "Sinigang na Hipon", duration: "22:00", type: "video" },
        { title: "Grilled Bangus", duration: "20:00", type: "video" },
        { title: "Paksiw na Isda", duration: "18:00", type: "video" },
        { title: "Fresh Seafood Guide", duration: "15:00", type: "reading" },
        { title: "Kinilaw", duration: "20:00", type: "video" },
        { title: "Seafood Quiz", duration: "15:00", type: "quiz" },
      ]},
      { title: "Vegetable & Side Dishes", duration: "2h", lessons: [
        { title: "Pinakbet", duration: "20:00", type: "video" },
        { title: "Ginataang Kalabasa", duration: "18:00", type: "video" },
        { title: "Ensaladang Talong", duration: "12:00", type: "video" },
        { title: "Seasonal Vegetables", duration: "15:00", type: "reading" },
        { title: "Vegetable Quiz", duration: "15:00", type: "quiz" },
      ]},
      { title: "Regional Specialties", duration: "2h 30m", lessons: [
        { title: "Bicol Express", duration: "22:00", type: "video" },
        { title: "Laing", duration: "18:00", type: "video" },
        { title: "Ilocos Bagnet", duration: "25:00", type: "video" },
        { title: "Visayan Dishes", duration: "20:00", type: "video" },
        { title: "Regional Ingredients", duration: "15:00", type: "reading" },
        { title: "Mindanao Specialties", duration: "18:00", type: "video" },
        { title: "Final Cooking Assessment", duration: "20:00", type: "quiz" },
      ]},
    ],
    reviews: [
      {
        name: "Lisa P.",
        rating: 5,
        comment: "My adobo has never tasted better! Thank you Chef!",
      },
      {
        name: "Miguel R.",
        rating: 5,
        comment: "Comprehensive and easy to follow. Highly recommended!",
      },
      {
        name: "Sarah K.",
        rating: 4,
        comment: "Great course for anyone wanting to learn Filipino cooking.",
      },
    ],
  },
  "3": {
    id: 3,
    title: "Sustainable Rice Farming Techniques",
    instructor: "Juan dela Cruz",
    instructorBio:
      "Juan is a 3rd generation rice farmer who has modernized his family's sustainable farming practices.",
    image: agricultureImage,
    rating: 4.7,
    students: 540,
    duration: "6 hours",
    category: "Agriculture",
    price: "₱999",
    description: "Learn traditional and modern sustainable farming methods.",
    longDescription:
      "Discover the art and science of rice farming in the Philippines. This course combines traditional knowledge with modern sustainable practices, perfect for aspiring farmers or anyone interested in agricultural heritage.",
    objectives: [
      "Understand rice cultivation cycles",
      "Implement sustainable farming practices",
      "Manage pests naturally without harmful chemicals",
      "Optimize water usage and irrigation",
      "Prepare for harvest and post-harvest handling",
    ],
    modules: [
      { title: "Introduction to Rice Farming", duration: "1h", lessons: [
        { title: "Rice Farming in the Philippines", duration: "15:00", type: "video" },
        { title: "Types of Rice Varieties", duration: "18:00", type: "video" },
        { title: "Understanding Seasons", duration: "12:00", type: "reading" },
        { title: "Introduction Quiz", duration: "15:00", type: "quiz" },
      ]},
      { title: "Land Preparation & Planting", duration: "1h 30m", lessons: [
        { title: "Soil Analysis", duration: "15:00", type: "video" },
        { title: "Land Preparation Techniques", duration: "22:00", type: "video" },
        { title: "Seedbed Preparation", duration: "18:00", type: "video" },
        { title: "Transplanting Methods", duration: "20:00", type: "video" },
        { title: "Planting Quiz", duration: "15:00", type: "quiz" },
      ]},
      { title: "Sustainable Pest Management", duration: "1h 15m", lessons: [
        { title: "Common Rice Pests", duration: "18:00", type: "video" },
        { title: "Natural Pest Control", duration: "20:00", type: "video" },
        { title: "Organic Solutions Guide", duration: "15:00", type: "reading" },
        { title: "Pest Management Quiz", duration: "12:00", type: "quiz" },
      ]},
      { title: "Water & Nutrient Management", duration: "1h 15m", lessons: [
        { title: "Irrigation Systems", duration: "20:00", type: "video" },
        { title: "Water Conservation", duration: "18:00", type: "video" },
        { title: "Organic Fertilizers", duration: "15:00", type: "reading" },
        { title: "Nutrient Quiz", duration: "12:00", type: "quiz" },
      ]},
      { title: "Harvesting & Processing", duration: "1h", lessons: [
        { title: "Harvest Timing", duration: "18:00", type: "video" },
        { title: "Post-Harvest Handling", duration: "22:00", type: "video" },
        { title: "Final Assessment", duration: "20:00", type: "quiz" },
      ]},
    ],
    reviews: [
      {
        name: "Pedro G.",
        rating: 5,
        comment: "Very practical knowledge. Applied it to our farm immediately.",
      },
      {
        name: "Maria C.",
        rating: 4,
        comment: "Great overview of sustainable farming methods.",
      },
      {
        name: "Carlos A.",
        rating: 5,
        comment: "Juan's expertise really shows. Excellent course!",
      },
    ],
  },
  "4": {
    id: 4,
    title: "Hablon Weaving: Traditional Textile Art",
    instructor: "Lola Perla",
    instructorBio:
      "Lola Perla has been weaving hablon for over 50 years, preserving this Ilonggo art form.",
    image: craftsImage,
    rating: 4.9,
    students: 320,
    duration: "10 hours",
    category: "Craftsmanship",
    price: "₱1,799",
    description: "Master the ancient art of Ilonggo hablon weaving.",
    longDescription:
      "Learn the traditional art of hablon weaving from a master artisan. This course covers everything from setting up a loom to creating intricate patterns that have been passed down through generations of Ilonggo weavers.",
    objectives: [
      "Set up and operate a traditional weaving loom",
      "Create basic to intermediate hablon patterns",
      "Understand the cultural significance of patterns",
      "Source and prepare natural fibers",
      "Complete a finished hablon textile product",
    ],
    modules: [
      { title: "History of Hablon Weaving", duration: "45m", lessons: [
        { title: "Origins of Hablon", duration: "15:00", type: "video" },
        { title: "Ilonggo Weaving Traditions", duration: "18:00", type: "video" },
        { title: "Cultural Significance Quiz", duration: "12:00", type: "quiz" },
      ]},
      { title: "Loom Setup & Basics", duration: "2h 30m", lessons: [
        { title: "Parts of the Loom", duration: "20:00", type: "video" },
        { title: "Setting Up Your Loom", duration: "28:00", type: "video" },
        { title: "Warp Preparation", duration: "25:00", type: "video" },
        { title: "Threading Guide", duration: "20:00", type: "reading" },
        { title: "Basic Weaving Motion", duration: "22:00", type: "video" },
        { title: "Loom Basics Quiz", duration: "15:00", type: "quiz" },
      ]},
      { title: "Traditional Patterns", duration: "3h", lessons: [
        { title: "Basic Stripes", duration: "25:00", type: "video" },
        { title: "Check Patterns", duration: "22:00", type: "video" },
        { title: "Geometric Designs", duration: "28:00", type: "video" },
        { title: "Pattern Reading Guide", duration: "18:00", type: "reading" },
        { title: "Color Theory for Weaving", duration: "20:00", type: "video" },
        { title: "Creating Your Own Pattern", duration: "25:00", type: "video" },
        { title: "Traditional Motifs", duration: "22:00", type: "video" },
        { title: "Patterns Quiz", duration: "15:00", type: "quiz" },
      ]},
      { title: "Advanced Techniques", duration: "2h 15m", lessons: [
        { title: "Complex Pattern Weaving", duration: "30:00", type: "video" },
        { title: "Multi-color Threading", duration: "25:00", type: "video" },
        { title: "Tension Control", duration: "20:00", type: "video" },
        { title: "Troubleshooting Guide", duration: "15:00", type: "reading" },
        { title: "Advanced Quiz", duration: "15:00", type: "quiz" },
      ]},
      { title: "Finishing & Care", duration: "1h 30m", lessons: [
        { title: "Removing from Loom", duration: "18:00", type: "video" },
        { title: "Finishing Edges", duration: "22:00", type: "video" },
        { title: "Care Instructions", duration: "15:00", type: "reading" },
        { title: "Final Project Assessment", duration: "20:00", type: "quiz" },
      ]},
    ],
    reviews: [
      {
        name: "Elena R.",
        rating: 5,
        comment: "Lola Perla is a treasure! So grateful for this course.",
      },
      {
        name: "James L.",
        rating: 5,
        comment: "Finally learning this beautiful art. Thank you!",
      },
      {
        name: "Rosa M.",
        rating: 5,
        comment: "Preserving our heritage one weave at a time.",
      },
    ],
  },
};

const CoursePreview = () => {
  const { id } = useParams();

  const [dbCourses, setDbCourses] = useState<CourseFromApi[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 🔹 Fetch all courses from API, like your DB-only version
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error(`Failed to fetch course (${res.status})`);

        const data: CourseFromApi[] = await res.json();
        setDbCourses(data);
      } catch (err: any) {
        setError(err.message || "Failed to load course");
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-16 lg:pt-20">
          <p className="container mx-auto px-4 py-12 text-muted-foreground">
            Loading course...
          </p>
        </main>
        <Footer />
      </div>
    );
  }

  const numericId = id ?? "1";

  // base static course (keeps objectives/modules/reviews/etc.)
  const staticCourse = coursesData[numericId] || coursesData["1"];

  // if DB data exists, overlay the DB values on the static course
  let course = staticCourse;

  if (dbCourses) {
    const db = dbCourses.find((c) => String(c.course_id) === numericId);
    if (db) {
      course = {
        ...staticCourse,
        title: db.course_title,
        description:
          db.course_sub_description ??
          db.course_description ??
          staticCourse.description,
        longDescription:
          db.course_description ?? staticCourse.longDescription,
        category: db.course_category ?? staticCourse.category,
        instructor: db.instructor_name ?? staticCourse.instructor,
        instructorBio: db.instructor_bio ?? staticCourse.instructorBio,
        price: `₱${db.course_price.toLocaleString()}`,
        image: db.course_thumbnail_url ?? staticCourse.image,
        instructorImage:
          db.instructor_image_url ?? staticCourse.instructorImage,
        instructorTitle:
          db.instructor_title ?? staticCourse.instructorTitle, // ✅ overlay title
      };
    }
  }




  if (error && !course) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-16 lg:pt-20">
          <p className="container mx-auto px-4 py-12 text-red-500">
            {error ?? "Course not found"}
          </p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-16 lg:pt-20">
        {/* Hero Section */}
        <section className="py-12 lg:py-16 bg-primary relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {error && (
              <p className="mb-4 text-sm text-red-200">
                Warning: {error} – showing fallback content.
              </p>
            )}

            <div className="grid lg:grid-cols-2 gap-8 items-center">
              {/* Course Info */}
              <div className="animate-fade-up">
                <span className="inline-block bg-secondary text-secondary-foreground text-sm font-medium px-4 py-1 rounded-full mb-4">
                  {course.category}
                </span>
                <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-primary-foreground mb-4">
                  {course.title}
                </h1>
                <p className="text-primary-foreground/80 text-lg mb-6">
                  {course.longDescription}
                </p>

                {/* Stats */}
                <div className="flex flex-wrap items-center gap-6 mb-6">
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-secondary fill-secondary" />
                    <span className="text-primary-foreground font-semibold">
                      {course.rating}
                    </span>
                    <span className="text-primary-foreground/70">
                      ({course.reviews.length} reviews)
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-primary-foreground/80">
                    <Users className="w-5 h-5" />
                    <span>{course.students.toLocaleString()} students</span>
                  </div>
                  <div className="flex items-center gap-2 text-primary-foreground/80">
                    <Clock className="w-5 h-5" />
                    <span>{course.duration}</span>
                  </div>
                </div>

                <p className="text-primary-foreground/80">
                  Instructor:{" "}
                  <span className="text-primary-foreground font-medium">
                    {course.instructor}
                  </span>
                </p>
              </div>

              {/* Course Card */}
              <div className="bg-card rounded-2xl shadow-medium overflow-hidden animate-fade-up delay-100">
                <div className="relative aspect-video">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-foreground/20">
                    <div className="w-16 h-16 rounded-full bg-primary-foreground flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
                      <PlayCircle className="w-8 h-8 text-primary" />
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-baseline justify-between mb-4">
                    <span className="font-display text-3xl font-bold text-foreground">
                      {course.price}
                    </span>
                  </div>
                  <Button variant="hero" size="xl" className="w-full mb-3" asChild>
                    <Link to="/register">Enroll Now</Link>
                  </Button>
                  <p className="text-center text-muted-foreground text-sm">
                    30-day money-back guarantee
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Course Content */}
        <section className="py-12 lg:py-16 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-12">
                {/* Learning Objectives */}
                <div className="animate-fade-up">
                  <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                    <BookOpen className="w-6 h-6 text-primary" />
                    What You'll Learn
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {course.objectives.map((objective, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{objective}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Course Modules */}
                <div className="animate-fade-up delay-100">
                  
                  {/* I use accordion for drop-down menus chuchu */}
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="course-content" className="border-none">
                      <AccordionTrigger className="hover:no-underline p-0">
                        <h2 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
                          <PlayCircle className="w-6 h-6 text-primary" />
                          Course Content
                        </h2>
                      </AccordionTrigger>
                      <AccordionContent className="pt-4">
                        <p className="text-muted-foreground mb-4">
                          {course.modules.length} modules • {course.modules.reduce((acc, mod) => acc + mod.lessons.length, 0)} lessons • {course.duration} total
                        </p>

                        {/* Drop-down menus for content/lessons chuchu */}
                        <Accordion type="single" collapsible className="w-full space-y-3">
                          {course.modules.map((module, index) => (
                            <AccordionItem 
                             key={index} 
                             value={`module-${index + 1}`} 
                             className="bg-card rounded-xl shadow-soft hover:shadow-medium transition-shadow overflow-hidden border-b-0"
                           >
                              <AccordionTrigger className="px-4 py-4 hover:no-underline flex justify-between w-full">
                                <div className="flex items-center gap-3">
                                  <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm flex-shrink-0">
                                    {index + 1}
                                  </span>
                                  <div className='text-left'>
                                   <h3 className="font-semibold text-foreground">
                                     {module.title}
                                   </h3>
                                   <p className="text-muted-foreground text-sm">
                                     {module.lessons.length} lessons • {module.duration}
                                   </p>
                                 </div>
                               </div>
                              </AccordionTrigger>
                            <AccordionContent className="px-4 pb-4">
                                <div className="space-y-2 pt-2 border-t border-border">
                                  {module.lessons.map((lesson, lessonIndex) => (
                                    <div
                                      key={lessonIndex}
                                      className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-muted/50 transition-colors"
                                    >
                                      <div className="flex items-center gap-3">
                                        {lesson.type === 'video' && (
                                          <PlayCircle className="w-4 h-4 text-primary" />
                                        )}
                                        {lesson.type === 'reading' && (
                                          <FileText className="w-4 h-4 text-secondary" />
                                        )}
                                        {lesson.type === 'quiz' && (
                                          <HelpCircle className="w-4 h-4 text-accent-foreground" />
                                        )}
                                        <span className="text-foreground text-sm">{lesson.title}</span>
                                      </div>
                                      <span className="text-muted-foreground text-sm">{lesson.duration}</span>
                                    </div>
                                  ))}
                                </div>
                              </AccordionContent>
                           </AccordionItem>
                          ))}
                        </Accordion>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>

                {/* Reviews */}
                <div className="animate-fade-up delay-200">
                  <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                    <Star className="w-6 h-6 text-primary" />
                    Student Reviews
                  </h2>
                  <div className="space-y-4">
                    {course.reviews.map((review, index) => (
                      <div
                        key={index}
                        className="bg-card rounded-xl p-5 shadow-soft"
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                            <span className="text-primary-foreground font-semibold">
                              {review.name.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <p className="font-semibold text-foreground">
                              {review.name}
                            </p>
                            <div className="flex items-center gap-1">
                              {[...Array(review.rating)].map((_, i) => (
                                <Star
                                  key={i}
                                  className="w-4 h-4 text-secondary fill-secondary"
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        <p className="text-muted-foreground">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Instructor Card */}
                <div className="bg-card rounded-2xl p-6 shadow-soft animate-fade-up">
                  <h3 className="font-display text-lg font-semibold text-foreground mb-4">
                    Your Instructor
                  </h3>
                  <div className="flex items-center gap-4 mb-4">
                    {course.instructorImage ? (
                      // ✅ Show instructor photo from API if available
                      <img
                        src={course.instructorImage}
                        alt={course.instructor}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    ) : (
                      // ✅ Fallback to gradient circle + initial
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-teal-light flex items-center justify-center">
                        <span className="font-display text-xl font-bold text-primary-foreground">
                          {course.instructor.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-foreground">
                        {course.instructor}
                      </p>
                      <p className="text-muted-foreground text-sm">
                        {course.instructorTitle ?? `${course.category} Expert`}
                      </p>
                    </div>

                  </div>
                  <p className="text-muted-foreground text-sm">
                    {course.instructorBio}
                  </p>
                </div>

                {/* Course Includes */}
                <div className="bg-card rounded-2xl p-6 shadow-soft animate-fade-up delay-100">
                  <h3 className="font-display text-lg font-semibold text-foreground mb-4">
                    This Course Includes
                  </h3>
                  <ul className="space-y-3">
                    {[
                      {
                        icon: PlayCircle,
                        text: `${course.duration} of video content`,
                      },
                      { icon: BookOpen, text: "Downloadable resources" },
                      { icon: Award, text: "Certificate of completion" },
                      { icon: Users, text: "Community access" },
                    ].map((item, index) => (
                      <li
                        key={index}
                        className="flex items-center gap-3 text-muted-foreground"
                      >
                        <item.icon className="w-5 h-5 text-primary" />
                        <span>{item.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default CoursePreview;
