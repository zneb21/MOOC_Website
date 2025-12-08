import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Star, Clock, Users, PlayCircle, CheckCircle, Award, BookOpen, FileText, HelpCircle } from "lucide-react";
import ReviewComposer, { ReviewData } from "@/components/ReviewComposer";
import ReviewCard from "@/components/ReviewCard";
import { useAuth } from "@/contexts/AuthContext";
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



// ✅ nested lessons from ref_course_lessons
type LessonFromApi = {
  lesson_id: number;
  content_id: number;
  lesson_title: string;
  lesson_duration: string | null;
  lesson_type: 'video' | 'reading' | 'quiz' | null;
  created_at: string;
  updated_at: string;
};

type CourseContentFromApi = {
  content_id: number;
  course_conn_id: number;
  course_id: number;                 // sequence/index
  course_content_title: string;
  course_content_lessons: number;
  course_content_length: string | null;
  created_at: string;
  updated_at: string;
  lessons?: LessonFromApi[];         // ⬅️ comes from PHP "lessons" field
};

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
  instructor_title?: string | null;  
  course_contents?: CourseContentFromApi[];
}

// ⭐ Only keep extra meta not yet in DB (objectives, reviews, rating, students, duration)
type StaticCourseMeta = {
  rating: number;
  students: number;
  duration: string;
  objectives: string[];
  reviews: { id?: string; name: string; rating: number; comment: string; userId?: string }[];
};

const staticMetaById: Record<string, StaticCourseMeta> = {
  "1": {
    rating: 4.9,
    students: 1250,
    duration: "8 hours",
    objectives: [
      "Understand Iloilo's historical significance in Philippine history",
      "Navigate popular tourist destinations with confidence",
      "Discover hidden gems known only to locals",
      "Learn about Ilonggo customs and traditions",
      "Plan complete itineraries for different travel styles",
    ],
    reviews: [
      { name: "Jose M.", rating: 5, comment: "Amazing course! I learned so much about my own city." },
      { name: "Anna L.", rating: 5, comment: "Maria is an excellent instructor. Very informative!" },
      { name: "Mark T.", rating: 4, comment: "Great content, helped me plan my Iloilo trip perfectly." },
    ],
  },
  "2": {
    rating: 4.8,
    students: 980,
    duration: "12 hours",
    objectives: [
      "Master essential Filipino cooking techniques",
      "Prepare classic dishes like Adobo, Sinigang, and Kare-Kare",
      "Understand the history behind Filipino cuisine",
      "Source and prepare traditional ingredients",
      "Create your own variations while respecting tradition",
    ],
    reviews: [
      { name: "Lisa P.", rating: 5, comment: "My adobo has never tasted better! Thank you Chef!" },
      { name: "Miguel R.", rating: 5, comment: "Comprehensive and easy to follow. Highly recommended!" },
      { name: "Sarah K.", rating: 4, comment: "Great course for anyone wanting to learn Filipino cooking." },
    ],
  },
  "3": {
    rating: 4.7,
    students: 540,
    duration: "6 hours",
    objectives: [
      "Understand rice cultivation cycles",
      "Implement sustainable farming practices",
      "Manage pests naturally without harmful chemicals",
      "Optimize water usage and irrigation",
      "Prepare for harvest and post-harvest handling",
    ],
    reviews: [
      { name: "Pedro G.", rating: 5, comment: "Very practical knowledge. Applied it to our farm immediately." },
      { name: "Maria C.", rating: 4, comment: "Great overview of sustainable farming methods." },
      { name: "Carlos A.", rating: 5, comment: "Juan's expertise really shows. Excellent course!" },
    ],
  },
  "4": {
    rating: 4.9,
    students: 320,
    duration: "10 hours",
    objectives: [
      "Set up and operate a traditional weaving loom",
      "Create basic to intermediate hablon patterns",
      "Understand the cultural significance of patterns",
      "Source and prepare natural fibers",
      "Complete a finished hablon textile product",
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
  const { user } = useAuth();

  const [dbCourses, setDbCourses] = useState<CourseFromApi[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Review management state
  const [allReviews, setAllReviews] = useState<Array<{ id?: string; name: string; rating: number; comment: string; userId?: string }>>([]);
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [showReviewComposer, setShowReviewComposer] = useState(false);
  const [deletingReviewId, setDeletingReviewId] = useState<string | null>(null);
  const [isLoadingReview, setIsLoadingReview] = useState(false);
  const [userReviewIds, setUserReviewIds] = useState<Set<string>>(new Set());

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

  // Initialize reviews from static data
  useEffect(() => {
    if (dbCourses && id) {
      const numericId = String(id);
      const staticMeta = staticMetaById[numericId];
      if (staticMeta?.reviews) {
        setAllReviews(staticMeta.reviews.map((review, idx) => ({
          id: `review-${idx}`,
          ...review,
        })));
      }
    }
  }, [dbCourses, id]);

  // Handle adding or updating a review
  const handleSaveReview = async (reviewData: ReviewData) => {
    if (!user) {
      alert("Please log in to post a review");
      return;
    }

    setIsLoadingReview(true);
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (editingReviewId) {
        // Update existing review
        setAllReviews((prevReviews) =>
          prevReviews.map((review) =>
            review.id === editingReviewId
              ? {
                  ...review,
                  rating: reviewData.rating,
                  comment: reviewData.comment,
                }
              : review
          )
        );
        setEditingReviewId(null);
      } else {
        // Add new review
        const newReview = {
          id: `review-${Date.now()}`,
          name: user.fullName || "Anonymous",
          rating: reviewData.rating,
          comment: reviewData.comment,
          userId: user.id,
        };
        setAllReviews((prevReviews) => [newReview, ...prevReviews]);
        setUserReviewIds((prev) => new Set([...prev, newReview.id || ""]));
      }
      setShowReviewComposer(false);
    } catch (err) {
      console.error("Error saving review:", err);
      alert("Failed to save review. Please try again.");
    } finally {
      setIsLoadingReview(false);
    }
  };

  // Handle deleting a review
  const handleDeleteReview = async (reviewId: string | undefined) => {
    if (!reviewId) return;

    setDeletingReviewId(reviewId);
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      setAllReviews((prevReviews) =>
        prevReviews.filter((review) => review.id !== reviewId)
      );
      setUserReviewIds((prev) => {
        const updated = new Set(prev);
        updated.delete(reviewId);
        return updated;
      });
    } catch (err) {
      console.error("Error deleting review:", err);
      alert("Failed to delete review. Please try again.");
    } finally {
      setDeletingReviewId(null);
    }
  };

  // Get current user's reviews (multiple)
  const currentUserReviews = allReviews.filter((review) => review.userId === user?.id);
  const isEditingMode = editingReviewId !== null;

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

const db = dbCourses?.find((c) => String(c.course_id) === numericId);

if (!db) {
  // simple fallback if course not found
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

// ✅ pull static extras (objectives, reviews, rating, students, duration)
const staticMeta =
  staticMetaById[numericId] ??
  {
    rating: 4.5,
    students: 0,
    duration: "Self-paced",
    objectives: [],
    reviews: [],
  };

// ✅ final course object used by JSX below
const course = {
  id: db.course_id,
  title: db.course_title,
  instructor: db.instructor_name ?? "Unknown Instructor",
  instructorBio: db.instructor_bio ?? "",
  image: db.course_thumbnail_url ?? tourismImage, // fallback image
  instructorImage: db.instructor_image_url ?? undefined,
  instructorTitle: db.instructor_title ?? undefined,
  rating: staticMeta.rating,
  students: staticMeta.students,
  duration: staticMeta.duration,
  category: db.course_category ?? "General",
  price: `₱${db.course_price.toLocaleString()}`,
  description:
    db.course_sub_description ?? db.course_description ?? "",
  longDescription: db.course_description ?? "",
  objectives: staticMeta.objectives,
  modules: (db.course_contents ?? []).map((content) => ({
    title: content.course_content_title,
    duration: content.course_content_length ?? "",
    lessons: (content.lessons ?? []).map((lesson) => ({
      title: lesson.lesson_title,
      duration: lesson.lesson_duration ?? "",
      type: (lesson.lesson_type ?? "video") as Lesson["type"],
    })),
  })),
  reviews: allReviews,
};





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
                                  <Link
                                    key={lessonIndex}
                                    to={`/course/${id}/lesson/${index}-${lessonIndex}`}
                                    className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
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
                                      <span className="text-foreground text-sm hover:text-primary transition-colors">
                                        {lesson.title}
                                      </span>
                                    </div>
                                    <span className="text-muted-foreground text-sm">
                                      {lesson.duration}
                                    </span>
                                  </Link>
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

                  {/* Review Composer - Show if user logged in and not editing */}
                  {user && !isEditingMode && !showReviewComposer && (
                    <div className="mb-6">
                      <Button
                        onClick={() => setShowReviewComposer(true)}
                        variant="outline"
                        className="w-full"
                      >
                        Write a Review
                      </Button>
                    </div>
                  )}

                  {/* Review Composer Form */}
                  {showReviewComposer && (
                    <div className="mb-6">
                      <ReviewComposer
                        onSubmit={handleSaveReview}
                        onCancel={() => setShowReviewComposer(false)}
                        isLoading={isLoadingReview}
                      />
                    </div>
                  )}

                  {/* Edit Mode for User's Review */}
                  {isEditingMode && (
                    <div className="mb-6">
                      {allReviews.find((r) => r.id === editingReviewId) && (
                        <ReviewComposer
                          onSubmit={handleSaveReview}
                          onCancel={() => setEditingReviewId(null)}
                          initialReview={allReviews.find((r) => r.id === editingReviewId)}
                          isLoading={isLoadingReview}
                        />
                      )}
                    </div>
                  )}

                  {/* Current User's Reviews - Show all if exists and not editing */}
                  {currentUserReviews.length > 0 && !isEditingMode && (
                    <div className="mb-6 space-y-4 pb-4 border-b border-border">
                      <p className="text-sm font-semibold text-muted-foreground">Your Reviews</p>
                      {currentUserReviews.map((review) => (
                        <ReviewCard
                          key={review.id}
                          id={review.id}
                          name={review.name}
                          rating={review.rating}
                          comment={review.comment}
                          isOwnReview={true}
                          onEdit={() => setEditingReviewId(review.id || null)}
                          onDelete={() => handleDeleteReview(review.id)}
                          isDeleting={deletingReviewId === review.id}
                        />
                      ))}
                    </div>
                  )}

                  {/* Other Reviews */}
                  <div className="space-y-4">
                    {course.reviews
                      .filter((review) => !currentUserReviews.find((ur) => ur.id === review.id))
                      .map((review) => (
                        <ReviewCard
                          key={review.id}
                          id={review.id}
                          name={review.name}
                          rating={review.rating}
                          comment={review.comment}
                          isOwnReview={false}
                        />
                      ))}
                  </div>

                  {/* Empty State */}
                  {course.reviews.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>No reviews yet. Be the first to share your experience!</p>
                    </div>
                  )}
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
