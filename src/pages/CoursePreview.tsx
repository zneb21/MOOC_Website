import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

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
import LiquidEther from "@/components/ui/liquidether";

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

// ✅ enroll endpoint
const ENROLL_COURSE_URL = "http://localhost/mooc_api/enroll_course.php";


// ✅ comments API endpoints
const CREATE_COMMENT_URL = "http://localhost/mooc_api/create_comment.php";
const GET_COMMENTS_URL   = "http://localhost/mooc_api/get_comments.php";
const DELETE_COMMENT_URL = "http://localhost/mooc_api/delete_comment.php"; // 🆕
const UPDATE_COMMENT_URL  = "http://localhost/mooc_api/update_comment.php"; // 🆕

// ✅ shape of rows from tra_comment
type ReviewFromApi = {
  comment_id: number;
  content_id: number;
  user_id: number | null;
  user_name: string | null;
  rating: number;
  comment_text: string;
  created_at: string;
};



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



const CoursePreview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
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

// Load reviews from DB (tra_comment) – no more placeholder/seed reviews
useEffect(() => {
  if (!dbCourses || !id) return;

  const numericId = String(id);

  const fetchReviews = async () => {
    try {
      const res = await fetch(`${GET_COMMENTS_URL}?content_id=${numericId}`);
      let dbReviews: ReviewFromApi[] = [];

      if (res.ok) {
        dbReviews = await res.json();
      }

      const mappedDbReviews = dbReviews.map((r) => ({
        id: String(r.comment_id),
        name: r.user_name || "Anonymous",
        rating: r.rating,
        comment: r.comment_text,
        userId: r.user_id !== null ? String(r.user_id) : undefined,
      }));

      setAllReviews(mappedDbReviews);
    } catch (err) {
      console.error("Failed to load reviews:", err);
      setAllReviews([]); // fallback: no reviews
    }
  };

  fetchReviews();
}, [dbCourses, id]);


const handleSaveReview = async (reviewData: ReviewData) => {
  if (!user) {
    alert("Please log in to post a review");
    return;
  }

  // 🔹 use URL /courses/:id as the content_id key
  const contentIdNum = id ? parseInt(id, 10) : 0;
  if (!contentIdNum || Number.isNaN(contentIdNum)) {
    alert("Invalid course id for this review.");
    return;
  }

  setIsLoadingReview(true);

  try {
    if (editingReviewId) {
      // ✏️ EDIT MODE: update DB (if DB-backed) or local (if seed- review)
      const existing = allReviews.find((r) => r.id === editingReviewId);
      if (!existing) {
        console.error("Editing review not found:", editingReviewId);
        setIsLoadingReview(false);
        return;
      }

      // Seed/static reviews don't exist in DB → local update only
      if (editingReviewId.startsWith("seed-")) {
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
      } else {
        // ✅ Real DB-backed comment: call update_comment.php
        if (!user.dbId || user.dbId <= 0) {
          console.error("User has no valid dbId:", user);
          alert("Your account is not linked to the database yet. Please re-login.");
          setIsLoadingReview(false);
          return;
        }

        const commentIdNum = parseInt(editingReviewId, 10);
        if (!commentIdNum || Number.isNaN(commentIdNum)) {
          console.error("Invalid comment id for edit:", editingReviewId);
          setIsLoadingReview(false);
          return;
        }

        const payload = {
          comment_id: commentIdNum,
          user_id: user.dbId,                 // ✅ DB users.id
          rating: reviewData.rating,
          comment_text: reviewData.comment,
        };

        const res = await fetch(UPDATE_COMMENT_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const raw = await res.text();
        let json: any = {};
        try {
          json = raw ? JSON.parse(raw) : {};
        } catch {
          // ignore parse error
        }

        if (!res.ok || !json.success) {
          console.error("update_comment.php error:", res.status, raw);
          alert(json.message || "Failed to update review. Please try again.");
          setIsLoadingReview(false);
          return;
        }

        // ✅ update local state
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
      }

      setEditingReviewId(null);
    } else {
      // 🆕 CREATE MODE: send to PHP

      // ✅ Safety check: make sure this user is linked to a DB row
      if (!user.dbId || user.dbId <= 0) {
        console.error("User has no valid dbId:", user);
        alert("Your account is not linked to the database yet. Please re-register or contact support.");
        setIsLoadingReview(false);
        return;
      }

      const payload = {
        content_id: contentIdNum,
        user_id: user.dbId,                          // ✅ real DB users.id
        user_name: user.fullName || "Anonymous",
        rating: reviewData.rating,
        comment_text: reviewData.comment,
      };

      console.log("Sending review payload:", payload);

      const res = await fetch(CREATE_COMMENT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const raw = await res.text(); // read once

      if (!res.ok) {
        console.error("create_comment.php error:", res.status, raw);
        alert(`Failed to save review.\nStatus: ${res.status}\nResponse: ${raw}`);
        throw new Error(`HTTP ${res.status}: ${raw}`);
      }

      // if OK, parse JSON
      let json: any = {};
      try {
        json = raw ? JSON.parse(raw) : {};
      } catch (e) {
        console.warn("Non-JSON success response:", raw);
      }

      const newId =
        json.comment_id !== undefined
          ? String(json.comment_id)
          : `review-${Date.now()}`;

      const newReview = {
        id: newId,
        name: payload.user_name,
        rating: payload.rating,
        comment: payload.comment_text,
        userId: String(payload.user_id || ""),
      };

      // ✅ update UI immediately
      setAllReviews((prevReviews) => [newReview, ...prevReviews]);
      setUserReviewIds((prev) => new Set([...prev, newId]));
    }

    setShowReviewComposer(false);
  } catch (err) {
    console.error("Error saving review:", err);
  } finally {
    setIsLoadingReview(false);
  }
};

  // Handle deleting a review
// Handle deleting a review (real DB delete)
const handleDeleteReview = async (reviewId: string | undefined) => {
  if (!reviewId) return;

  if (!user || !user.dbId) {
    alert("Please log in again to delete your review.");
    return;
  }

  // Seeded/static reviews (like seed-0) don't exist in DB – just remove locally
  if (reviewId.startsWith("seed-")) {
    setAllReviews((prevReviews) =>
      prevReviews.filter((review) => review.id !== reviewId)
    );
    return;
  }

  const commentIdNum = parseInt(reviewId, 10);
  if (!commentIdNum || Number.isNaN(commentIdNum)) {
    console.error("Invalid review id for deletion:", reviewId);
    return;
  }

  setDeletingReviewId(reviewId);

  try {
    const res = await fetch(DELETE_COMMENT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        comment_id: commentIdNum,  // 🆕 tra_comment.comment_id
        user_id: user.dbId,       // 🆕 DB users.id
      }),
    });

    const raw = await res.text();
    let json: any = {};
    try {
      json = raw ? JSON.parse(raw) : {};
    } catch {
      // ignore parse error
    }

    if (!res.ok || !json.success) {
      console.error("Delete review failed:", res.status, raw);
      alert(json.message || "Failed to delete review. Please try again.");
      return;
    }

    // ✅ update local state on success
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

const handleEnrollClick = async () => {
  if (!user) {
    // Not logged in → send to register
    navigate("/register");
    return;
  }

  if (!user.dbId || user.dbId <= 0) {
    alert("Your account is not linked to the database yet. Please re-login.");
    return;
  }

  // course.id is from the `course` object we built
  const courseId = course.id;

  try {
    const res = await fetch(ENROLL_COURSE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: user.dbId,
        course_id: courseId,
      }),
    });

    const raw = await res.text();
    let json: any = {};
    try {
      json = raw ? JSON.parse(raw) : {};
    } catch {
      console.warn("Non-JSON response from enroll_course:", raw);
    }

    if (!res.ok || !json.success) {
      console.error("Enroll failed:", res.status, raw);
      alert(json.message || "Failed to enroll in this course. Please try again.");
      return;
    }

    // ✅ Enrollment successful → go to dashboard
    navigate("/dashboard");
  } catch (err) {
    console.error("Error calling enroll_course.php:", err);
    alert("Something went wrong while enrolling. Please try again.");
  }
};



  // Get current user's reviews (multiple)
// Get current user's reviews (multiple) by DB id
const currentUserReviews =
  user?.dbId
    ? allReviews.filter((review) => review.userId === String(user.dbId))
    : [];

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

// Optional: compute average rating from real reviews
const averageRating =
  allReviews.length > 0
    ? allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length
    : 0;

// ✅ final course object used by JSX below (no placeholder meta)
const course = {
  id: db.course_id,
  title: db.course_title,
  instructor: db.instructor_name ?? "Unknown Instructor",
  instructorBio: db.instructor_bio ?? "",
  image: db.course_thumbnail_url ?? tourismImage, // fallback image
  instructorImage: db.instructor_image_url ?? undefined,
  instructorTitle: db.instructor_title ?? undefined,
  rating: Number(averageRating.toFixed(1)),
  students: 0,                    // replace later if you add real DB field
  duration: "Self-paced",         // replace later if you add real DB field
  category: db.course_category ?? "General",
  price: `₱${db.course_price.toLocaleString()}`,
  description:
    db.course_sub_description ?? db.course_description ?? "",
  longDescription: db.course_description ?? "",
  objectives: [],                 // no more placeholder objectives
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
          mouseForce={25}
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
                    <Button
                      variant="hero"
                      size="xl"
                      className="w-full mb-3"
                      onClick={handleEnrollClick}
                    >
                      Enroll Now
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
