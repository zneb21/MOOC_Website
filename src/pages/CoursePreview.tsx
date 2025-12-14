import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Star, Clock, Users, PlayCircle, CheckCircle, Award, BookOpen, FileText, HelpCircle, Play } from "lucide-react";
import ReviewComposer, { ReviewData } from "@/components/ReviewComposer";
import ReviewCard from "@/components/ReviewCard";
import { useAuth } from "@/contexts/AuthContext";
import tourismImage from "@/assets/course-tourism.jpg";
import LiquidEther from "@/components/ui/liquidether";

// Types (Preserved)
type Lesson = {
  title: string;
  duration: string;
  type: 'video' | 'reading' | 'quiz';
};

// const API_URL = "http://localhost/mooc_api/get_courses.php"; //
const API_URL = "http://localhost/mooc_api/get_courses.php";
const ENROLL_COURSE_URL = "http://localhost/mooc_api/enroll_course.php"; //
const CREATE_COMMENT_URL = "http://localhost/mooc_api/create_comment.php"; //
const GET_COMMENTS_URL   = "http://localhost/mooc_api/get_comments.php"; //
const DELETE_COMMENT_URL = "http://localhost/mooc_api/delete_comment.php"; //
const UPDATE_COMMENT_URL  = "http://localhost/mooc_api/update_comment.php"; //

type ReviewFromApi = {
  comment_id: number;
  content_id: number;
  user_id: number | null;
  user_name: string | null;
  rating: number;
  comment_text: string;
  created_at: string;
};

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
  course_id: number;
  course_content_title: string;
  course_content_lessons: number;
  course_content_length: string | null;
  created_at: string;
  updated_at: string;
  lessons?: LessonFromApi[];
};

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
  
  const [allReviews, setAllReviews] = useState<Array<{ id?: string; name: string; rating: number; comment: string; userId?: string }>>([]);
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [showReviewComposer, setShowReviewComposer] = useState(false);
  const [deletingReviewId, setDeletingReviewId] = useState<string | null>(null);
  const [isLoadingReview, setIsLoadingReview] = useState(false);
  const [userReviewIds, setUserReviewIds] = useState<Set<string>>(new Set());

  // Fetch Logic (Preserved)
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
        setAllReviews([]);
      }
    };
    fetchReviews();
  }, [dbCourses, id]);

  const handleSaveReview = async (reviewData: ReviewData) => {
    if (!user) { alert("Please log in to post a review"); return; }
    const contentIdNum = id ? parseInt(id, 10) : 0;
    if (!contentIdNum || Number.isNaN(contentIdNum)) { alert("Invalid course id for this review."); return; }
    setIsLoadingReview(true);
    try {
      if (editingReviewId) {
        const existing = allReviews.find((r) => r.id === editingReviewId);
        if (!existing) { setIsLoadingReview(false); return; }

        if (editingReviewId.startsWith("seed-")) {
          setAllReviews((prevReviews) => prevReviews.map((review) => review.id === editingReviewId ? { ...review, rating: reviewData.rating, comment: reviewData.comment } : review));
        } else {
            if (!user.dbId || user.dbId <= 0) { alert("Your account is not linked to the database yet. Please re-login."); setIsLoadingReview(false); return; }
            const commentIdNum = parseInt(editingReviewId, 10);
            const payload = { comment_id: commentIdNum, user_id: user.dbId, rating: reviewData.rating, comment_text: reviewData.comment };
            const res = await fetch(UPDATE_COMMENT_URL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
            const raw = await res.text();
            let json: any = {};
            try { json = raw ? JSON.parse(raw) : {}; } catch {}

            if (!res.ok || !json.success) { alert(json.message || "Failed to update review."); setIsLoadingReview(false); return; }
            setAllReviews((prevReviews) => prevReviews.map((review) => review.id === editingReviewId ? { ...review, rating: reviewData.rating, comment: reviewData.comment } : review));
        }
        setEditingReviewId(null);
      } else {
        if (!user.dbId || user.dbId <= 0) { alert("Account not linked."); setIsLoadingReview(false); return; }
        const payload = { content_id: contentIdNum, user_id: user.dbId, user_name: user.fullName || "Anonymous", rating: reviewData.rating, comment_text: reviewData.comment };
        const res = await fetch(CREATE_COMMENT_URL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
        const raw = await res.text();
        if (!res.ok) { alert(`Failed to save review.`); throw new Error(`HTTP ${res.status}`); }
        let json: any = {};
        try { json = raw ? JSON.parse(raw) : {}; } catch {}
        const newId = json.comment_id !== undefined ? String(json.comment_id) : `review-${Date.now()}`;
        const newReview = { id: newId, name: payload.user_name, rating: payload.rating, comment: payload.comment_text, userId: String(payload.user_id || "") };
        setAllReviews((prevReviews) => [newReview, ...prevReviews]);
        setUserReviewIds((prev) => new Set([...prev, newId]));
      }
      setShowReviewComposer(false);
    } catch (err) { console.error("Error saving review:", err); } finally { setIsLoadingReview(false); }
  };

  const handleDeleteReview = async (reviewId: string | undefined) => {
    if (!reviewId) return;
    if (!user || !user.dbId) { alert("Please log in again."); return; }
    if (reviewId.startsWith("seed-")) { setAllReviews((prev) => prev.filter((r) => r.id !== reviewId)); return; }
    const commentIdNum = parseInt(reviewId, 10);
    setDeletingReviewId(reviewId);
    try {
      const res = await fetch(DELETE_COMMENT_URL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ comment_id: commentIdNum, user_id: user.dbId }) });
      const raw = await res.text();
      let json: any = {};
      try { json = raw ? JSON.parse(raw) : {}; } catch {}
      if (!res.ok || !json.success) { alert(json.message || "Failed to delete review."); return; }
      setAllReviews((prev) => prev.filter((r) => r.id !== reviewId));
      setUserReviewIds((prev) => { const updated = new Set(prev); updated.delete(reviewId); return updated; });
    } catch (err) { alert("Failed to delete review."); } finally { setDeletingReviewId(null); }
  };

  const handleEnrollClick = async () => {
    if (!user) { navigate("/register"); return; }
    if (!user.dbId || user.dbId <= 0) { alert("Account not linked."); return; }
    const courseId = course.id;
    try {
      const res = await fetch(ENROLL_COURSE_URL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ user_id: user.dbId, course_id: courseId }) });
      const raw = await res.text();
      let json: any = {};
      try { json = raw ? JSON.parse(raw) : {}; } catch {}
      if (!res.ok || !json.success) { alert(json.message || "Failed to enroll."); return; }
      navigate("/dashboard");
    } catch (err) { alert("Enrollment error."); }
  };

  const currentUserReviews = user?.dbId ? allReviews.filter((review) => review.userId === String(user.dbId)) : [];
  const isEditingMode = editingReviewId !== null;

  // Render Logic
  if (loading) return <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-[#F4B942]">Loading...</div>;

  const numericId = id ?? "1";
  const db = dbCourses?.find((c) => String(c.course_id) === numericId);

  if (!db) return <div className="min-h-screen bg-zinc-950 text-white p-10">{error ?? "Course not found"}</div>;

  const averageRating = allReviews.length > 0 ? allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length : 0;

  const course = {
    id: db.course_id,
    title: db.course_title,
    instructor: db.instructor_name ?? "Unknown Instructor",
    instructorBio: db.instructor_bio ?? "Passionate educator dedicated to Filipino heritage.",
    image: db.course_thumbnail_url ?? tourismImage,
    instructorImage: db.instructor_image_url ?? undefined,
    instructorTitle: db.instructor_title ?? undefined,
    rating: Number(averageRating.toFixed(1)),
    students: 1250, // Placeholder or DB field
    duration: "Self-paced",
    category: db.course_category ?? "General",
    price: `₱${db.course_price.toLocaleString()}`,
    description: db.course_sub_description ?? db.course_description ?? "",
    longDescription: db.course_description ?? "",
    objectives: ["Master local techniques", "Understand cultural history", "Apply skills practically", "Join a community of learners"], // Fallback if DB empty
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

  return (
    <div className="relative min-h-screen bg-zinc-950 text-white font-sans overflow-x-hidden selection:bg-[#F4B942]/30 selection:text-[#F4B942]">
      {/* 🔮 Background Layer */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <LiquidEther
           colors={["#064e3b", "#022c22", "#0f766e"]} 
           mouseForce={20}
           cursorSize={100}
           isViscous={false}
           viscous={30}
           iterationsViscous={32}
           iterationsPoisson={32}
           resolution={0.25}
           isBounce={false}
           autoDemo={true}
           autoSpeed={0.4}
           autoIntensity={1.8}
        />
        <div className="absolute inset-0 bg-zinc-950/75" />
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:24px_24px]" />
      </div>

      <Navbar />

      <main className="relative z-10 pt-24 lg:pt-32 pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* HERO SECTION */}
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start mb-20">
              
              {/* Left: Text Info */}
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F4B942]/10 border border-[#F4B942]/20 backdrop-blur-md">
                   <span className="w-1.5 h-1.5 rounded-full bg-[#F4B942]" />
                   <span className="text-xs font-bold text-[#F4B942] tracking-wider uppercase">{course.category}</span>
                </div>

                <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
                  {course.title}
                </h1>

                <p className="text-lg text-zinc-300 leading-relaxed max-w-xl">
                  {course.longDescription}
                </p>

                <div className="flex flex-wrap items-center gap-6 text-sm">
                   <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
                      <Star className="w-4 h-4 text-[#F4B942] fill-[#F4B942]" />
                      <span className="font-bold text-white">{course.rating}</span>
                      <span className="text-zinc-400">({course.reviews.length} reviews)</span>
                   </div>
                   <div className="flex items-center gap-2 text-zinc-400">
                      <Users className="w-4 h-4" />
                      <span>{course.students.toLocaleString()} students</span>
                   </div>
                   <div className="flex items-center gap-2 text-zinc-400">
                      <Clock className="w-4 h-4" />
                      <span>{course.duration}</span>
                   </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                   {course.instructorImage ? (
                      <img src={course.instructorImage} alt={course.instructor} className="w-12 h-12 rounded-full object-cover border-2 border-white/10" />
                   ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-display font-bold text-lg border-2 border-white/10">
                         {course.instructor.charAt(0)}
                      </div>
                   )}
                   <div>
                      <p className="text-sm text-zinc-400">Instructor</p>
                      <p className="font-semibold text-white">{course.instructor}</p>
                   </div>
                </div>
              </div>

              {/* Right: Floating Card */}
              <div className="relative group lg:sticky lg:top-32">
                 <div className="absolute -inset-1 bg-gradient-to-br from-[#F4B942]/20 to-emerald-500/20 rounded-[2rem] blur-xl opacity-75 group-hover:opacity-100 transition-opacity duration-500" />
                 <div className="relative bg-zinc-900/80 backdrop-blur-xl border border-white/10 rounded-[1.8rem] overflow-hidden shadow-2xl">
                    <div className="relative aspect-video overflow-hidden">
                       <img src={course.image} alt={course.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                       <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/30 transition-colors">
                          <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-xl cursor-pointer">
                             <Play className="w-6 h-6 text-white ml-1" />
                          </div>
                       </div>
                    </div>
                    
                    <div className="p-8">
                       <div className="flex items-end justify-between mb-6">
                          <div>
                             <p className="text-zinc-400 text-sm mb-1">Total Price</p>
                             <h3 className="font-display text-4xl font-bold text-white tracking-tight">{course.price}</h3>
                          </div>
                          <div className="text-right">
                             <div className="text-[#F4B942] text-xs font-bold uppercase tracking-wider mb-1">One-time payment</div>
                             <div className="text-zinc-500 text-xs">Lifetime access</div>
                          </div>
                       </div>
                       
                       <Button 
                          onClick={handleEnrollClick}
                          size="xl" 
                          className="w-full bg-[#F4B942] text-zinc-950 hover:bg-[#F4B942]/90 font-bold text-lg h-14 rounded-xl shadow-[0_4px_20px_rgba(244,185,66,0.25)] transition-all hover:translate-y-[-2px]"
                       >
                          Enroll Now
                       </Button>
                       
                       <p className="text-center text-zinc-500 text-xs mt-4 flex items-center justify-center gap-1">
                          <Award className="w-3 h-3" /> 30-day money-back guarantee
                       </p>
                    </div>
                 </div>
              </div>
            </div>

            {/* CONTENT GRID */}
            <div className="grid lg:grid-cols-3 gap-12">
               
               {/* MAIN COLUMN */}
               <div className="lg:col-span-2 space-y-12">
                  
                  {/* Learning Objectives */}
                  <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8">
                     <h3 className="font-display text-2xl font-bold text-white mb-6 flex items-center gap-3">
                        <BookOpen className="w-6 h-6 text-[#F4B942]" />
                        What You'll Learn
                     </h3>
                     <div className="grid sm:grid-cols-2 gap-4">
                        {course.objectives.map((obj, i) => (
                           <div key={i} className="flex items-start gap-3 text-zinc-300">
                              <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                              <span className="text-sm leading-relaxed">{obj}</span>
                           </div>
                        ))}
                     </div>
                  </div>

                  {/* Syllabus / Modules */}
                  <div className="space-y-6">
                     <h3 className="font-display text-2xl font-bold text-white flex items-center gap-3">
                        <PlayCircle className="w-6 h-6 text-[#F4B942]" />
                        Course Syllabus
                     </h3>
                     
                     <div className="space-y-4">
                        <Accordion type="single" collapsible className="w-full space-y-4">
                           {course.modules.map((mod, i) => (
                              <AccordionItem key={i} value={`mod-${i}`} className="border-none bg-white/5 border border-white/5 rounded-2xl overflow-hidden">
                                 <AccordionTrigger className="px-6 py-4 hover:bg-white/5 hover:no-underline transition-colors group">
                                    <div className="flex items-center gap-4 text-left">
                                       <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-[#F4B942] font-bold group-hover:bg-[#F4B942] group-hover:text-black transition-colors">
                                          {i + 1}
                                       </div>
                                       <div>
                                          <h4 className="font-semibold text-white group-hover:text-[#F4B942] transition-colors">{mod.title}</h4>
                                          <p className="text-xs text-zinc-500 mt-0.5">{mod.lessons.length} lessons • {mod.duration}</p>
                                       </div>
                                    </div>
                                 </AccordionTrigger>
                                 <AccordionContent className="px-6 pb-6 pt-2">
                                    <div className="space-y-2 relative pl-5 ml-5 border-l border-white/10">
                                       {mod.lessons.map((lesson, li) => (
                                          <Link key={li} to={`/course/${id}/lesson/${i}-${li}`} className="flex items-center justify-between py-2 pl-4 pr-3 rounded-lg hover:bg-white/5 transition-all group/lesson">
                                             <div className="flex items-center gap-3">
                                                {lesson.type === 'video' ? <PlayCircle className="w-4 h-4 text-zinc-500 group-hover/lesson:text-[#F4B942]" /> : 
                                                 lesson.type === 'reading' ? <FileText className="w-4 h-4 text-zinc-500 group-hover/lesson:text-blue-400" /> :
                                                 <HelpCircle className="w-4 h-4 text-zinc-500 group-hover/lesson:text-purple-400" />
                                                }
                                                <span className="text-sm text-zinc-300 group-hover/lesson:text-white transition-colors">{lesson.title}</span>
                                             </div>
                                             <span className="text-xs text-zinc-600 font-mono">{lesson.duration}</span>
                                          </Link>
                                       ))}
                                    </div>
                                 </AccordionContent>
                              </AccordionItem>
                           ))}
                        </Accordion>
                     </div>
                  </div>

                  {/* Reviews Section */}
                  <div className="pt-8 border-t border-white/10">
                     <div className="flex items-center justify-between mb-8">
                        <h3 className="font-display text-2xl font-bold text-white flex items-center gap-3">
                           <Star className="w-6 h-6 text-[#F4B942]" />
                           Student Reviews
                        </h3>
                        {user && !isEditingMode && !showReviewComposer && (
                           <Button onClick={() => setShowReviewComposer(true)} variant="outline" className="border-white/10 bg-white/5 text-white hover:bg-white/10 hover:border-white/20 hover:text-[#F4B942]">
                              Write a Review
                           </Button>
                        )}
                     </div>

                     <div className="space-y-6">
                        {showReviewComposer && (
                           <ReviewComposer onSubmit={handleSaveReview} onCancel={() => setShowReviewComposer(false)} isLoading={isLoadingReview} />
                        )}

                        {isEditingMode && allReviews.find(r => r.id === editingReviewId) && (
                           <ReviewComposer 
                              onSubmit={handleSaveReview} 
                              onCancel={() => setEditingReviewId(null)} 
                              initialReview={allReviews.find(r => r.id === editingReviewId)} 
                              isLoading={isLoadingReview} 
                           />
                        )}

                        {currentUserReviews.length > 0 && !isEditingMode && (
                           <div className="space-y-4 mb-8">
                              <h4 className="text-sm font-bold text-[#F4B942] uppercase tracking-wider mb-2">Your Review</h4>
                              {currentUserReviews.map(r => (
                                 <ReviewCard 
                                    key={r.id} {...r} 
                                    isOwnReview 
                                    onEdit={() => setEditingReviewId(r.id || null)} 
                                    onDelete={() => handleDeleteReview(r.id)} 
                                    isDeleting={deletingReviewId === r.id} 
                                 />
                              ))}
                           </div>
                        )}

                        <div className="space-y-4">
                           {course.reviews.filter(r => !currentUserReviews.find(ur => ur.id === r.id)).map(r => (
                              <ReviewCard key={r.id} {...r} />
                           ))}
                           {course.reviews.length === 0 && (
                              <div className="p-8 rounded-2xl bg-white/5 border border-dashed border-white/10 text-center">
                                 <p className="text-zinc-500">No reviews yet. Be the first to share your thoughts!</p>
                              </div>
                           )}
                        </div>
                     </div>
                  </div>
               </div>

               {/* SIDEBAR */}
               <div className="space-y-6">
                  {/* Instructor Bio */}
                  <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6">
                     <h4 className="font-display text-lg font-bold text-white mb-4">Instructor</h4>
                     <div className="flex items-center gap-4 mb-4">
                        {course.instructorImage ? (
                           <img src={course.instructorImage} className="w-14 h-14 rounded-full object-cover border border-white/10" alt="" />
                        ) : (
                           <div className="w-14 h-14 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold border border-emerald-500/30">
                              {course.instructor.charAt(0)}
                           </div>
                        )}
                        <div>
                           <div className="font-semibold text-white">{course.instructor}</div>
                           <div className="text-xs text-zinc-400">{course.instructorTitle ?? "Heritage Expert"}</div>
                        </div>
                     </div>
                     <p className="text-sm text-zinc-400 leading-relaxed">{course.instructorBio}</p>
                  </div>

                  {/* Includes */}
                  <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6">
                     <h4 className="font-display text-lg font-bold text-white mb-4">This Course Includes</h4>
                     <ul className="space-y-3">
                        {[
                           { icon: PlayCircle, text: `${course.duration} on-demand video` },
                           { icon: BookOpen, text: "Downloadable resources" },
                           { icon: Award, text: "Certificate of completion" },
                           { icon: Users, text: "Community access" },
                        ].map((item, i) => (
                           <li key={i} className="flex items-center gap-3 text-sm text-zinc-400">
                              <item.icon className="w-4 h-4 text-[#F4B942]" />
                              <span>{item.text}</span>
                           </li>
                        ))}
                     </ul>
                  </div>
               </div>
            </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CoursePreview;