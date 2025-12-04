import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Star, Clock, Users, PlayCircle, CheckCircle, Award, BookOpen } from "lucide-react";
import tourismImage from "@/assets/course-tourism.jpg";
import cookingImage from "@/assets/course-cooking.jpg";
import agricultureImage from "@/assets/course-agriculture.jpg";
import craftsImage from "@/assets/course-crafts.jpg";

const coursesData: Record<string, {
  id: number;
  title: string;
  instructor: string;
  instructorBio: string;
  image: string;
  rating: number;
  students: number;
  duration: string;
  category: string;
  price: string;
  description: string;
  longDescription: string;
  objectives: string[];
  modules: { title: string; lessons: number; duration: string }[];
  reviews: { name: string; rating: number; comment: string }[];
}> = {
  "1": {
    id: 1,
    title: "Discover Iloilo: A Complete Tourism Guide",
    instructor: "Maria Santos",
    instructorBio: "Maria is a certified tour guide with 15 years of experience showcasing Iloilo's heritage to visitors worldwide.",
    image: tourismImage,
    rating: 4.9,
    students: 1250,
    duration: "8 hours",
    category: "Tourism",
    price: "₱1,499",
    description: "Explore the rich heritage and hidden gems of Iloilo City.",
    longDescription: "Embark on a comprehensive journey through Iloilo's rich cultural tapestry. This course covers everything from historic churches to vibrant festivals, local cuisine hotspots, and off-the-beaten-path destinations that make Iloilo truly special.",
    objectives: [
      "Understand Iloilo's historical significance in Philippine history",
      "Navigate popular tourist destinations with confidence",
      "Discover hidden gems known only to locals",
      "Learn about Ilonggo customs and traditions",
      "Plan complete itineraries for different travel styles",
    ],
    modules: [
      { title: "Introduction to Iloilo", lessons: 5, duration: "1h 30m" },
      { title: "Historic Churches & Heritage Sites", lessons: 8, duration: "2h 15m" },
      { title: "Festivals & Cultural Events", lessons: 4, duration: "1h" },
      { title: "Local Cuisine & Food Tourism", lessons: 6, duration: "1h 45m" },
      { title: "Hidden Gems & Day Trips", lessons: 5, duration: "1h 30m" },
    ],
    reviews: [
      { name: "Jose M.", rating: 5, comment: "Amazing course! I learned so much about my own city." },
      { name: "Anna L.", rating: 5, comment: "Maria is an excellent instructor. Very informative!" },
      { name: "Mark T.", rating: 4, comment: "Great content, helped me plan my Iloilo trip perfectly." },
    ],
  },
  "2": {
    id: 2,
    title: "Traditional Filipino Cuisine Masterclass",
    instructor: "Chef Ramon Cruz",
    instructorBio: "Chef Ramon has 20 years of culinary experience and has trained in Manila, Iloilo, and Paris.",
    image: cookingImage,
    rating: 4.8,
    students: 980,
    duration: "12 hours",
    category: "Cooking",
    price: "₱1,999",
    description: "Master authentic Filipino recipes passed down through generations.",
    longDescription: "Learn to cook authentic Filipino dishes from a master chef. This comprehensive course covers traditional recipes, cooking techniques, and the cultural significance behind each dish. From adobo to kare-kare, become a Filipino cuisine expert.",
    objectives: [
      "Master essential Filipino cooking techniques",
      "Prepare classic dishes like Adobo, Sinigang, and Kare-Kare",
      "Understand the history behind Filipino cuisine",
      "Source and prepare traditional ingredients",
      "Create your own variations while respecting tradition",
    ],
    modules: [
      { title: "Filipino Cooking Fundamentals", lessons: 6, duration: "2h" },
      { title: "Classic Meat Dishes", lessons: 8, duration: "3h" },
      { title: "Seafood Specialties", lessons: 6, duration: "2h 30m" },
      { title: "Vegetable & Side Dishes", lessons: 5, duration: "2h" },
      { title: "Regional Specialties", lessons: 7, duration: "2h 30m" },
    ],
    reviews: [
      { name: "Lisa P.", rating: 5, comment: "My adobo has never tasted better! Thank you Chef!" },
      { name: "Miguel R.", rating: 5, comment: "Comprehensive and easy to follow. Highly recommended!" },
      { name: "Sarah K.", rating: 4, comment: "Great course for anyone wanting to learn Filipino cooking." },
    ],
  },
  "3": {
    id: 3,
    title: "Sustainable Rice Farming Techniques",
    instructor: "Juan dela Cruz",
    instructorBio: "Juan is a 3rd generation rice farmer who has modernized his family's sustainable farming practices.",
    image: agricultureImage,
    rating: 4.7,
    students: 540,
    duration: "6 hours",
    category: "Agriculture",
    price: "₱999",
    description: "Learn traditional and modern sustainable farming methods.",
    longDescription: "Discover the art and science of rice farming in the Philippines. This course combines traditional knowledge with modern sustainable practices, perfect for aspiring farmers or anyone interested in agricultural heritage.",
    objectives: [
      "Understand rice cultivation cycles",
      "Implement sustainable farming practices",
      "Manage pests naturally without harmful chemicals",
      "Optimize water usage and irrigation",
      "Prepare for harvest and post-harvest handling",
    ],
    modules: [
      { title: "Introduction to Rice Farming", lessons: 4, duration: "1h" },
      { title: "Land Preparation & Planting", lessons: 5, duration: "1h 30m" },
      { title: "Sustainable Pest Management", lessons: 4, duration: "1h 15m" },
      { title: "Water & Nutrient Management", lessons: 4, duration: "1h 15m" },
      { title: "Harvesting & Processing", lessons: 3, duration: "1h" },
    ],
    reviews: [
      { name: "Pedro G.", rating: 5, comment: "Very practical knowledge. Applied it to our farm immediately." },
      { name: "Maria C.", rating: 4, comment: "Great overview of sustainable farming methods." },
      { name: "Carlos A.", rating: 5, comment: "Juan's expertise really shows. Excellent course!" },
    ],
  },
  "4": {
    id: 4,
    title: "Hablon Weaving: Traditional Textile Art",
    instructor: "Lola Perla",
    instructorBio: "Lola Perla has been weaving hablon for over 50 years, preserving this Ilonggo art form.",
    image: craftsImage,
    rating: 4.9,
    students: 320,
    duration: "10 hours",
    category: "Craftsmanship",
    price: "₱1,799",
    description: "Master the ancient art of Ilonggo hablon weaving.",
    longDescription: "Learn the traditional art of hablon weaving from a master artisan. This course covers everything from setting up a loom to creating intricate patterns that have been passed down through generations of Ilonggo weavers.",
    objectives: [
      "Set up and operate a traditional weaving loom",
      "Create basic to intermediate hablon patterns",
      "Understand the cultural significance of patterns",
      "Source and prepare natural fibers",
      "Complete a finished hablon textile product",
    ],
    modules: [
      { title: "History of Hablon Weaving", lessons: 3, duration: "45m" },
      { title: "Loom Setup & Basics", lessons: 6, duration: "2h 30m" },
      { title: "Traditional Patterns", lessons: 8, duration: "3h" },
      { title: "Advanced Techniques", lessons: 5, duration: "2h 15m" },
      { title: "Finishing & Care", lessons: 4, duration: "1h 30m" },
    ],
    reviews: [
      { name: "Elena R.", rating: 5, comment: "Lola Perla is a treasure! So grateful for this course." },
      { name: "James L.", rating: 5, comment: "Finally learning this beautiful art. Thank you!" },
      { name: "Rosa M.", rating: 5, comment: "Preserving our heritage one weave at a time." },
    ],
  },
};

const CoursePreview = () => {
  const { id } = useParams();
  const course = coursesData[id || "1"] || coursesData["1"];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-16 lg:pt-20">
        {/* Hero Section */}
        <section className="py-12 lg:py-16 bg-primary relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
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
                    <span className="text-primary-foreground font-semibold">{course.rating}</span>
                    <span className="text-primary-foreground/70">({course.reviews.length} reviews)</span>
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
                  Instructor: <span className="text-primary-foreground font-medium">{course.instructor}</span>
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
                  <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                    <PlayCircle className="w-6 h-6 text-primary" />
                    Course Content
                  </h2>
                  <div className="space-y-3">
                    {course.modules.map((module, index) => (
                      <div
                        key={index}
                        className="bg-card rounded-xl p-4 shadow-soft hover:shadow-medium transition-shadow"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-foreground mb-1">
                              {index + 1}. {module.title}
                            </h3>
                            <p className="text-muted-foreground text-sm">
                              {module.lessons} lessons • {module.duration}
                            </p>
                          </div>
                          <PlayCircle className="w-5 h-5 text-muted-foreground" />
                        </div>
                      </div>
                    ))}
                  </div>
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
                            <p className="font-semibold text-foreground">{review.name}</p>
                            <div className="flex items-center gap-1">
                              {[...Array(review.rating)].map((_, i) => (
                                <Star key={i} className="w-4 h-4 text-secondary fill-secondary" />
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
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-teal-light flex items-center justify-center">
                      <span className="font-display text-xl font-bold text-primary-foreground">
                        {course.instructor.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{course.instructor}</p>
                      <p className="text-muted-foreground text-sm">{course.category} Expert</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground text-sm">{course.instructorBio}</p>
                </div>

                {/* Course Includes */}
                <div className="bg-card rounded-2xl p-6 shadow-soft animate-fade-up delay-100">
                  <h3 className="font-display text-lg font-semibold text-foreground mb-4">
                    This Course Includes
                  </h3>
                  <ul className="space-y-3">
                    {[
                      { icon: PlayCircle, text: `${course.duration} of video content` },
                      { icon: BookOpen, text: "Downloadable resources" },
                      { icon: Award, text: "Certificate of completion" },
                      { icon: Users, text: "Community access" },
                    ].map((item, index) => (
                      <li key={index} className="flex items-center gap-3 text-muted-foreground">
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
