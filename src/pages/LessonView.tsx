import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

// UI Components
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import LiquidEther from "@/components/ui/liquidether";

// Icons (Extended imports for user avatars)
import {
  Menu,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Sparkles,
  Lock,
  Play,
  FileText,
  ArrowLeft,
  Send,
  Clock,
  User as UserIcon, // Added UserIcon for fallback
  Smile, 
  Heart, 
  Star, 
  Zap,  
  Leaf, 
  Coffee, 
  Music, 
  Palette, 
  BookOpen, 
  Globe, 
  Sun, 
} from "lucide-react";

import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/* TYPES & CONFIG                               */
/* -------------------------------------------------------------------------- */

const API_URL = "http://localhost/mooc_api/get_courses.php";
const UPDATE_PROGRESS_API = "http://localhost/mooc_api/update_course_progress.php";

// NEW: Avatar Map definition (Matches the keys and icons from AvatarSelector.tsx)
// NOTE: The 'bgClass' values (e.g., bg-secondary) must be correctly defined in your CSS/Tailwind config to render colors.
const AVATAR_MAP: { [key: string]: { icon: React.ElementType, bgClass: string } } = {
  smile: { icon: Smile, bgClass: "bg-secondary" }, // Assume bg-secondary is defined
  heart: { icon: Heart, bgClass: "bg-coral" },     // Assume bg-coral is defined
  star: { icon: Star, bgClass: "bg-gold" },       // Assume bg-gold is defined
  zap: { icon: Zap, bgClass: "bg-accent" },       // Assume bg-accent is defined
  leaf: { icon: Leaf, bgClass: "bg-primary" },    // Assume bg-primary is defined
  coffee: { icon: Coffee, bgClass: "bg-coral-light" },
  music: { icon: Music, bgClass: "bg-teal" },
  palette: { icon: Palette, bgClass: "bg-blue" },
  bookopen: { icon: BookOpen, bgClass: "bg-purple" },
  globe: { icon: Globe, bgClass: "bg-indigo" },
  sun: { icon: Sun, bgClass: "bg-yellow" },
  // Default fallback is handled by logic later
};


type LessonFromApi = {
  lesson_id: number;
  content_id: number;
  lesson_title: string;
  lesson_duration: string | null;
  lesson_type: "video" | "reading" | "quiz" | null;
  lesson_directory_url?: string | null;
};

type CourseContentFromApi = {
  content_id: number;
  course_conn_id: number;
  course_id: number;
  course_content_title: string;
  course_content_lessons: number;
  course_content_length: string | null;
  lessons?: LessonFromApi[];
};

type CourseFromApi = {
  course_id: number;
  course_title: string;
  course_contents?: CourseContentFromApi[];
};

type Lesson = {
  title: string;
  duration: string;
  type: "video" | "reading" | "quiz";
  videoUrl?: string | null;
};

type Module = {
  title: string;
  duration: string;
  lessons: Lesson[];
};

type CourseData = {
  title: string;
  modules: Module[];
};

/* -------------------------------------------------------------------------- */
/* COMPONENT                                 */
/* -------------------------------------------------------------------------- */

export default function LessonView() {
  const navigate = useNavigate();
  const { id, lessonSlug } = useParams<{ id: string; lessonSlug: string }>();

  // ------------------------------------------
  // 1. User Logic & Avatar Retrieval
  // ------------------------------------------
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  const [userAvatarId, setUserAvatarId] = useState<string | null>(null); // NEW STATE for avatar ID

  useEffect(() => {
    // 1. Get ID
    let userId = 23; // Fallback default
    try {
      const userRaw = localStorage.getItem("silaylearn_user");
      if (userRaw) {
        const parsed = JSON.parse(userRaw);
        if (parsed.dbId) userId = Number(parsed.dbId);
        
        // Retrieve Avatar URL first
        if (parsed.profile_picture) setUserAvatar(parsed.profile_picture);
        else if (parsed.avatar) setUserAvatar(parsed.avatar); // Fallback for 'avatar' field if it's a URL
        
        // Retrieve Avatar ID if it exists
        if (parsed.avatarId) {
            setUserAvatarId(parsed.avatarId);
        }

      } else {
        // Fallback to old structure
        const oldUserRaw = localStorage.getItem("user");
        if (oldUserRaw) {
          const parsed = JSON.parse(oldUserRaw);
          if (parsed.id) userId = Number(parsed.id);
          if (parsed.profile_picture) setUserAvatar(parsed.profile_picture);
          if (parsed.avatar_id) setUserAvatarId(parsed.avatar_id);
        }
      }
      const simpleId = localStorage.getItem("user_id");
      if (simpleId && !userRaw && !localStorage.getItem("user")) userId = Number(simpleId);
    } catch (e) {
      console.error("Error parsing user data:", e);
    }
    setCurrentUserId(userId);
  }, []);

  // ------------------------------------------
  // 2. State
  // ------------------------------------------
  const [courseData, setCourseData] = useState<CourseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarTab, setSidebarTab] = useState<"content" | "chat">("content");
  
  const [moduleIndex, setModuleIndex] = useState(0);
  const [lessonIndex, setLessonIndex] = useState(0);
  const [completed, setCompleted] = useState<Set<string>>(new Set());

  // Chat State
  const [chatMessages, setChatMessages] = useState<{ sender: string; text: string }[]>([]);
  const [chatInput, setChatInput] = useState("");
  const isSendingRef = useRef(false);
  const [isTyping, setIsTyping] = useState(false);
  const chatInputRef = useRef<HTMLInputElement | null>(null);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  // ------------------------------------------
  // 3. Effects
  // ------------------------------------------

  // Restore completed lessons
  useEffect(() => {
    if (!id || !currentUserId) return;
    const storageKey = `completed_${currentUserId}_${id}`;
    const stored = localStorage.getItem(storageKey);
    if (!stored) return;
    try {
      const arr = JSON.parse(stored) as string[];
      setCompleted(new Set(arr));
    } catch (e) {
      console.error("Failed to parse saved completed lessons", e);
    }
  }, [id, currentUserId]);

  // Parse URL slug
  useEffect(() => {
    const slug = lessonSlug ?? "0-0";
    const [mStr, lStr] = slug.split("-");
    setModuleIndex(Number(mStr) || 0);
    setLessonIndex(Number(lStr) || 0);
  }, [lessonSlug]);

  // Scroll chat to bottom
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages, isTyping, sidebarTab]);

  // Fetch Course
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await axios.get<CourseFromApi[]>(API_URL);
        const all = res.data;
        const numericId = id ?? "1";
        const db = all.find((c) => String(c.course_id) === numericId);

        if (!db) {
          setError("Course not found");
          return;
        }

        const mapped: CourseData = {
          title: db.course_title,
          modules: (db.course_contents ?? []).map((content) => ({
            title: content.course_content_title,
            duration: content.course_content_length ?? "",
            lessons: (content.lessons ?? []).map((lesson) => ({
              title: lesson.lesson_title,
              duration: lesson.lesson_duration ?? "",
              type: (lesson.lesson_type ?? "video") as Lesson["type"],
              videoUrl: lesson.lesson_directory_url ?? null,
            })),
          })),
        };

        setCourseData(mapped);
      } catch (err) {
        console.error(err);
        setError("Failed to load course");
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  // Keyboard Nav
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return; 
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "m" || e.key === "M") setSidebarOpen((s) => !s);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [moduleIndex, lessonIndex, courseData]);

  // ------------------------------------------
  // 4. Logic
  // ------------------------------------------

  const totalLessons = courseData
    ? courseData.modules.reduce((a, m) => a + m.lessons.length, 0)
    : 0;
  const completedCount = completed.size;
  const progress = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  const currentModule = courseData?.modules[moduleIndex];
  const currentLesson = currentModule?.lessons[lessonIndex];

  const updateCourseProgress = async (newProgress: number, lessonsFinished: number) => {
    if (!currentUserId || !id) return;
    try {
      const formData = new FormData();
      formData.append("user_id", String(currentUserId));
      formData.append("course_id", String(id));
      formData.append("progress", String(newProgress));
      formData.append("lessons_finished", String(lessonsFinished));
      formData.append("total_lessons", String(totalLessons));
      await axios.post(UPDATE_PROGRESS_API, formData);
    } catch (err) {
      console.error("Failed to update course progress", err);
    }
  };

  const toggleComplete = () => {
    const key = `${moduleIndex}-${lessonIndex}`;
    setCompleted((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);

      const newFinished = next.size;
      const newProg = totalLessons > 0 ? Math.round((newFinished / totalLessons) * 100) : 0;
      
      updateCourseProgress(newProg, newFinished);
      if (id && currentUserId) {
        localStorage.setItem(`completed_${currentUserId}_${id}`, JSON.stringify(Array.from(next)));
      }
      return next;
    });
  };

  const autoMarkLessonVisited = (mIdx: number, lIdx: number) => {
    const key = `${mIdx}-${lIdx}`;
    setCompleted((prev) => {
      if (prev.has(key)) return prev;
      const next = new Set(prev);
      next.add(key);
      const newFinished = next.size;
      const newProg = totalLessons > 0 ? Math.round((newFinished / totalLessons) * 100) : 0;
      updateCourseProgress(newProg, newFinished);
      if (id && currentUserId) {
        localStorage.setItem(`completed_${currentUserId}_${id}`, JSON.stringify(Array.from(next)));
      }
      return next;
    });
  };

  const next = () => {
    if (!courseData) return;
    const mod = courseData.modules;
    if (lessonIndex < mod[moduleIndex].lessons.length - 1) {
      setLessonIndex((li) => li + 1);
    } else if (moduleIndex < mod.length - 1) {
      setModuleIndex((mi) => mi + 1);
      setLessonIndex(0);
    }
  };

  const prev = () => {
    if (!courseData) return;
    if (lessonIndex > 0) {
      setLessonIndex((li) => li - 1);
    } else if (moduleIndex > 0) {
      setModuleIndex((mi) => mi - 1);
      setLessonIndex(courseData.modules[moduleIndex - 1].lessons.length - 1);
    }
  };

  const sendChat = async () => {
    if (!chatInput.trim() || isSendingRef.current || !currentUserId) return;
    isSendingRef.current = true;
    
    const userMessage = chatInput.trim();
    setChatMessages((prev) => [...prev, { sender: "user", text: userMessage }]);
    setChatInput("");
    setIsTyping(true);

    try {
      const res = await axios.post("http://127.0.0.1:5000/chat", {
        user_id: currentUserId,
        message: userMessage,
        lesson_title: currentLesson?.title ?? "",
        language: "en",
      });
      const reply = res.data.reply || "No response";
      setChatMessages((prev) => [...prev, { sender: "assistant", text: reply }]);
    } catch (err) {
      setChatMessages((prev) => [...prev, { sender: "assistant", text: "Error connecting to Roxy AI." }]);
    } finally {
      setIsTyping(false);
      isSendingRef.current = false;
    }
  };

  // ------------------------------------------
  // 5. Render
  // ------------------------------------------

  if (loading || !courseData || !currentModule || !currentLesson) {
    return (
      <div className="w-full h-screen bg-zinc-950 flex flex-col items-center justify-center">
         <div className="w-16 h-16 rounded-full border-2 border-white/10 border-t-[#F4B942] animate-spin mb-6" />
         <span className="font-display tracking-widest text-sm uppercase text-[#F4B942]">Loading SilayLearn...</span>
      </div>
    );
  }

  const isCompleted = completed.has(`${moduleIndex}-${lessonIndex}`);

  return (
    <div className="relative h-screen w-full bg-zinc-950 text-white overflow-hidden font-sans selection:bg-[#F4B942]/30 selection:text-[#F4B942]">
      
      {/* 🔮 Background Layer (Matching About.tsx) */}
      <div className="absolute inset-0 z-0">
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
        {/* Dark overlay for UI readability */}
        <div className="absolute inset-0 bg-zinc-950/70 pointer-events-none" />
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:24px_24px]" />
      </div>

      {/* 🧭 Top Navigation Bar (Floating Glass) */}
      <header className="relative z-30 h-16 px-4 lg:px-6 flex items-center justify-between border-b border-white/5 bg-zinc-950/30 backdrop-blur-xl">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => navigate(`/courses/${id}`)}
            className="group flex items-center gap-3 text-white/70 hover:text-white transition-all"
          >
            <div className="p-2 rounded-full border border-white/10 bg-white/5 group-hover:border-[#F4B942] group-hover:bg-[#F4B942]/10 transition-colors">
               <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            </div>
            <div className="hidden sm:block">
              <span className="block text-[10px] font-bold tracking-widest text-[#F4B942] uppercase opacity-70 group-hover:opacity-100">Return</span>
              <span className="font-display text-sm tracking-wide">{courseData.title}</span>
            </div>
          </button>
        </div>

        {/* Center: Progress */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 hidden lg:flex items-center gap-3">
          <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">Progress</span>
          <div className="w-48 h-1.5 bg-white/10 rounded-full overflow-hidden border border-white/5 shadow-inner">
              <motion.div 
                className="h-full bg-gradient-to-r from-emerald-600 via-emerald-400 to-[#F4B942]" 
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
          </div>
          <span className="text-xs font-mono text-white/60">{progress}%</span>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
           <button 
             onClick={() => setSidebarOpen(!sidebarOpen)}
             className="lg:hidden p-2 text-white/70 hover:text-[#F4B942]"
           >
             <Menu className="w-5 h-5" />
           </button>
           <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
              <Clock className="w-3 h-3 text-[#F4B942]" />
              <span className="text-xs text-white/80">{currentLesson.duration}</span>
           </div>
        </div>
      </header>

      {/* 📦 Main Workspace */}
      <div className="relative z-20 flex h-[calc(100vh-64px)]">
        
        {/* ◀️ Left Sidebar (Glass Panel) */}
        <AnimatePresence initial={false}>
          {sidebarOpen && (
            <motion.aside
              initial={{ width: 0, opacity: 0, x: -20 }}
              animate={{ width: 360, opacity: 1, x: 0 }}
              exit={{ width: 0, opacity: 0, x: -20 }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="absolute lg:relative z-40 h-full flex-shrink-0 border-r border-white/5 bg-zinc-950/80 backdrop-blur-2xl flex flex-col shadow-[10px_0_30px_rgba(0,0,0,0.5)]"
            >
              {/* Sidebar Tabs */}
              <div className="p-4 flex gap-2 border-b border-white/5">
                <button
                  onClick={() => setSidebarTab("content")}
                  className={cn(
                    "flex-1 py-2.5 text-xs font-bold uppercase tracking-widest rounded-xl transition-all relative overflow-hidden",
                    sidebarTab === "content" 
                      ? "text-white bg-white/5 border border-white/10 shadow-lg" 
                      : "text-zinc-500 hover:text-zinc-300 hover:bg-white/5"
                  )}
                >
                  {sidebarTab === "content" && <div className="absolute inset-0 bg-gradient-to-tr from-[#F4B942]/10 to-transparent opacity-50" />}
                  Lessons
                </button>
                <button
                  onClick={() => setSidebarTab("chat")}
                  className={cn(
                    "flex-1 py-2.5 text-xs font-bold uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 relative overflow-hidden",
                    sidebarTab === "chat" 
                      ? "text-white bg-white/5 border border-white/10 shadow-lg" 
                      : "text-zinc-500 hover:text-zinc-300 hover:bg-white/5"
                  )}
                >
                  {sidebarTab === "chat" && <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 to-transparent opacity-50" />}
                  <Sparkles className={cn("w-3 h-3", sidebarTab === "chat" ? "text-emerald-400" : "")} />
                  AI Coach
                </button>
              </div>

              {/* Sidebar Content */}
              <div className="flex-1 overflow-y-auto custom-scrollbar relative">
                
                {/* 📂 Tab: CONTENT */}
                {sidebarTab === "content" && (
                  <div className="p-4 space-y-4">
                    <Accordion type="single" collapsible defaultValue={`item-${moduleIndex}`} className="space-y-4">
                      {courseData.modules.map((m, i) => (
                        <AccordionItem 
                          key={i} 
                          value={`item-${i}`} 
                          className="border-none"
                        >
                          <AccordionTrigger className="group flex items-center justify-between p-0 hover:no-underline mb-3">
                            <div className="text-left pl-1">
                               <div className="text-xs font-bold text-[#F4B942] uppercase tracking-wider mb-1 opacity-80">Module {i + 1}</div>
                               <div className="font-display text-sm text-white group-hover:text-[#F4B942] transition-colors">{m.title}</div>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="pt-0 pb-2">
                             <div className="space-y-1">
                                {m.lessons.map((l, li) => {
                                   const isActive = moduleIndex === i && lessonIndex === li;
                                   const isDone = completed.has(`${i}-${li}`);
                                   
                                   return (
                                     <button
                                       key={li}
                                       onClick={() => {
                                          setModuleIndex(i);
                                          setLessonIndex(li);
                                          autoMarkLessonVisited(i, li);
                                          if (window.innerWidth < 1024) setSidebarOpen(false);
                                       }}
                                       className={cn(
                                          "w-full text-left flex items-center gap-3 p-3 rounded-xl text-xs transition-all duration-300 relative overflow-hidden border",
                                          isActive 
                                            ? "bg-white/10 border-[#F4B942]/30 shadow-[0_0_15px_rgba(244,185,66,0.1)]"
                                            : "border-transparent hover:bg-white/5 hover:border-white/5"
                                       )}
                                     >
                                        {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#F4B942]" />}
                                        
                                        <div className={cn(
                                            "w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 border transition-colors",
                                            isActive 
                                              ? "border-[#F4B942] bg-[#F4B942]/20 text-[#F4B942]" 
                                              : isDone 
                                                ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-500" 
                                                : "border-white/10 text-zinc-500"
                                        )}>
                                           {isDone ? <CheckCircle className="w-3 h-3" /> : (l.type === "video" ? <Play className="w-2.5 h-2.5 ml-0.5" /> : <FileText className="w-2.5 h-2.5" />)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                           <div className={cn("font-medium truncate", isActive ? "text-white" : "text-zinc-400 group-hover:text-zinc-200")}>{l.title}</div>
                                           <div className="text-[10px] text-zinc-600">{l.duration}</div>
                                        </div>
                                     </button>
                                   )
                                })}
                             </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                )}

                {/* 🤖 Tab: CHAT */}
                {sidebarTab === "chat" && (
                  <div className="h-full flex flex-col p-4">
                     <div ref={chatContainerRef} className="flex-1 space-y-4 overflow-y-auto mb-4 pr-1 scroll-smooth">
                        {/* Intro */}
                        <div className="flex flex-col items-center justify-center py-8 text-center space-y-3 opacity-60">
                           {/* AI Coach Avatar (Intro) - FIX APPLIED */}
                           <div className="w-12 h-12 rounded-full border border-white/20 shadow-lg relative overflow-hidden">
                              <img 
                                 src="/ai_coach_avatar.jpg" 
                                 alt="AI Coach Roxy" 
                                 className="absolute inset-0 w-full h-full object-cover" 
                              />
                           </div>
                           <p className="text-xs text-zinc-400 max-w-[200px]">
                             I'm Roxy, your heritage guide. Ask me about the culture behind this lesson.
                           </p>
                        </div>

                        {chatMessages.map((msg, i) => {
                           // NEW: Determine user's current avatar/icon
                           const CurrentUserIcon = userAvatarId && AVATAR_MAP[userAvatarId] ? AVATAR_MAP[userAvatarId].icon : UserIcon;
                           // Fallback to the main accent color if the specific bgClass for the avatar ID is missing
                           const CurrentUserBg = userAvatarId && AVATAR_MAP[userAvatarId] ? AVATAR_MAP[userAvatarId].bgClass : "bg-[#F4B942]";
                           
                           return (
                             <motion.div 
                               initial={{ opacity: 0, y: 10 }}
                               animate={{ opacity: 1, y: 0 }}
                               key={i} 
                               className={cn("flex gap-3", msg.sender === "user" ? "flex-row-reverse" : "")}
                             >
                                {msg.sender === "assistant" ? (
                                   // AI Coach Avatar (Message) - FIX APPLIED
                                   <div className="w-8 h-8 rounded-full border border-white/20 shadow-lg flex-shrink-0 mt-1 relative overflow-hidden">
                                      <img 
                                         src="/ai_coach_avatar.jpg" 
                                         alt="AI Coach Roxy" 
                                         className="absolute inset-0 w-full h-full object-cover" 
                                      />
                                   </div>
                                ) : (
                                   // User Avatar Logic (Fixed with robust cropping structure)
                                   <div className={cn(
                                      "w-8 h-8 rounded-full border border-white/20 shadow-lg flex-shrink-0 mt-1 overflow-hidden",
                                      // If userAvatar (URL) exists, use relative/absolute for cropping, otherwise use flex for icon centering
                                      userAvatar ? "relative" : "flex items-center justify-center",
                                      CurrentUserBg
                                   )}>
                                      {userAvatar ? (
                                          // PRIORITY 1: If a direct image URL is available, use it
                                          <img src={userAvatar} alt="User" className="absolute inset-0 w-full h-full object-cover" />
                                      ) : (
                                          // PRIORITY 2: Otherwise, use the mapped icon or the default UserIcon
                                          <CurrentUserIcon className="w-4 h-4 text-black" />
                                      )}
                                   </div>
                                )}
                                
                                <div className={cn(
                                   "p-3.5 rounded-2xl text-xs leading-relaxed shadow-lg max-w-[85%]",
                                   msg.sender === "user" 
                                      ? "bg-[#F4B942] text-zinc-900 font-medium rounded-tr-sm"
                                      : "bg-white/10 backdrop-blur-xl border border-white/10 text-zinc-100 rounded-tl-sm"
                                )}>
                                   {msg.text}
                                </div>
                             </motion.div>
                           )
                        })}
                        
                        {isTyping && (
                           <div className="flex gap-3">
                              {/* AI Coach Typing Indicator Avatar - FIX APPLIED */}
                              <div className="w-8 h-8 rounded-full border border-white/20 shadow-lg flex-shrink-0 relative overflow-hidden">
                                 <img 
                                    src="/ai_coach_avatar.jpg" 
                                    alt="AI Coach Roxy" 
                                    className="absolute inset-0 w-full h-full object-cover" 
                                 />
                              </div>
                              <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-white/5 backdrop-blur-md border border-white/5 flex items-center gap-1">
                                 <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" />
                                 <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce delay-75" />
                                 <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce delay-150" />
                              </div>
                           </div>
                        )}
                     </div>

                     {/* Input Area */}
                     <div className="relative pt-2 border-t border-white/5">
                        <input
                           ref={chatInputRef}
                           type="text"
                           value={chatInput}
                           onChange={(e) => setChatInput(e.target.value)}
                           onKeyDown={(e) => e.key === "Enter" && sendChat()}
                           disabled={isSendingRef.current || !currentUserId}
                           placeholder="Ask a question..."
                           className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-4 pr-12 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#F4B942]/50 focus:bg-white/10 transition-all shadow-inner"
                        />
                        <button 
                           onClick={sendChat}
                           disabled={!chatInput.trim()}
                           className="absolute right-2 top-1/2 -translate-y-1/2 mt-1 p-1.5 bg-[#F4B942] rounded-lg text-black hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 transition-all shadow-lg shadow-orange-500/20"
                        >
                           <Send className="w-4 h-4" />
                        </button>
                     </div>
                  </div>
                )}
              </div>
            </motion.aside>
          )}
        </AnimatePresence>


        {/* 🎬 Main Content */}
        <main className="flex-1 flex flex-col min-w-0 overflow-y-auto scroll-smooth">
           
           {/* Sidebar Toggle (Floating) */}
           <AnimatePresence>
             {!sidebarOpen && (
               <motion.button
                 initial={{ opacity: 0, x: -20 }}
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ opacity: 0, x: -20 }}
                 onClick={() => setSidebarOpen(true)}
                 className="fixed bottom-6 left-6 z-50 p-3.5 bg-zinc-950/90 backdrop-blur-xl border border-white/10 text-white rounded-full hover:border-[#F4B942] hover:text-[#F4B942] transition-colors shadow-[0_10px_30px_rgba(0,0,0,0.5)] group"
               >
                 <Menu className="w-5 h-5 group-hover:scale-110 transition-transform" />
               </motion.button>
             )}
           </AnimatePresence>

           <div className="w-full max-w-6xl mx-auto p-4 lg:p-8 flex flex-col gap-8">
              
              {/* Premium Video Player Container */}
              <div className="relative group rounded-3xl overflow-hidden bg-black shadow-[0_30px_80px_rgba(0,0,0,0.6)] border border-white/10 ring-1 ring-white/5 transition-transform duration-500">
                 
                 {/* Video Area */}
                 <div className="aspect-video bg-zinc-900 relative flex items-center justify-center overflow-hidden">
                    {/* Background glow behind video */}
                    <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/20 to-transparent pointer-events-none" />
                    
                    {currentLesson.type === "video" && currentLesson.videoUrl ? (
                      <video
                        key={currentLesson.videoUrl}
                        className="w-full h-full object-contain relative z-10"
                        controls
                        controlsList="nodownload"
                        poster="/placeholder-poster.jpg"
                      >
                        <source src={currentLesson.videoUrl} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    ) : (
                      <div className="flex flex-col items-center gap-4 text-zinc-500 z-10">
                         <div className="w-20 h-20 rounded-full bg-white/5 border border-white/5 flex items-center justify-center shadow-2xl">
                            <Lock className="w-8 h-8 text-zinc-600" />
                         </div>
                         <p className="font-display tracking-wide">Content Locked</p>
                      </div>
                    )}
                 </div>

                 {/* Controls Bar (Glass Overlay) */}
                 <div className="relative bg-zinc-950/90 border-t border-white/10 p-5 lg:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 backdrop-blur-md">
                    <div>
                       <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-bold text-[#F4B942] uppercase tracking-wider px-2 py-0.5 rounded bg-[#F4B942]/10 border border-[#F4B942]/20">
                            Lesson {lessonIndex + 1}
                          </span>
                       </div>
                       <h2 className="text-xl sm:text-2xl font-display font-bold text-white tracking-wide">{currentLesson.title}</h2>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                       <button onClick={prev} className="p-3 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/20 transition-all active:scale-95">
                          <ChevronLeft className="w-5 h-5" />
                       </button>

                       <button 
                          onClick={toggleComplete}
                          className={cn(
                             "flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold uppercase text-xs tracking-wider transition-all shadow-lg active:scale-95",
                             isCompleted
                               ? "bg-emerald-500 text-emerald-950 shadow-emerald-500/20 hover:bg-emerald-400 border border-emerald-400"
                               : "bg-white text-zinc-900 hover:bg-zinc-200 border border-white"
                          )}
                       >
                          {isCompleted ? <CheckCircle className="w-4 h-4" /> : <div className="w-4 h-4 rounded-full border-2 border-zinc-900/30" />}
                          <span>{isCompleted ? "Completed" : "Mark Done"}</span>
                       </button>

                       <button onClick={next} className="p-3 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/20 transition-all active:scale-95">
                          <ChevronRight className="w-5 h-5" />
                       </button>
                    </div>
                 </div>
              </div>

              {/* Bottom Info Grid */}
              <div className="grid lg:grid-cols-3 gap-6">
                 {/* Notes Card */}
                 <div className="lg:col-span-2 relative p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl overflow-hidden group">
                    {/* Decorative shimmer */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                    
                    <h3 className="text-lg font-display font-semibold text-white mb-4 flex items-center gap-2">
                       <div className="p-1.5 rounded-lg bg-[#F4B942]/10 border border-[#F4B942]/20">
                          <FileText className="w-4 h-4 text-[#F4B942]" />
                       </div>
                       Lesson Notes
                    </h3>
                    <p className="text-zinc-400 leading-relaxed font-light">
                       In this lesson, we explore the cultural significance of <span className="text-white font-medium">{currentLesson.title}</span>. 
                       Understanding the roots of this topic is essential for mastering the broader module of <span className="text-emerald-400">{currentModule.title}</span>. 
                       Take your time to absorb the visual details presented in the video.
                    </p>

                    <div className="mt-6 pt-6 border-t border-white/5 flex gap-8">
                       <div>
                          <span className="block text-[10px] uppercase tracking-wider text-zinc-500 mb-1">Duration</span>
                          <span className="text-sm font-medium text-white flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-zinc-500" />
                            {currentLesson.duration}
                          </span>
                       </div>
                       <div>
                          <span className="block text-[10px] uppercase tracking-wider text-zinc-500 mb-1">Format</span>
                          <span className="text-sm font-medium text-white capitalize flex items-center gap-1.5">
                            <Play className="w-3.5 h-3.5 text-zinc-500" />
                            {currentLesson.type}
                          </span>
                       </div>
                    </div>
                 </div>

                 {/* Up Next Card */}
                 <div 
                    onClick={next}
                    className="relative p-8 rounded-3xl bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-xl border border-white/10 shadow-xl flex flex-col cursor-pointer group hover:border-[#F4B942]/30 transition-all duration-300 hover:-translate-y-1"
                 >
                    <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowLeft className="w-5 h-5 text-[#F4B942] rotate-180" />
                    </div>

                    <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-4">Up Next</h3>
                    
                    {courseData.modules[moduleIndex].lessons[lessonIndex + 1] ? (
                       <div className="mt-auto">
                          <div className="text-xl font-display font-bold text-white group-hover:text-[#F4B942] transition-colors leading-tight mb-2">
                             {courseData.modules[moduleIndex].lessons[lessonIndex + 1].title}
                          </div>
                          <div className="text-sm text-zinc-400 flex items-center gap-2">
                             <span>Start next lesson</span>
                          </div>
                       </div>
                    ) : (
                       <div className="mt-auto text-zinc-500 text-sm italic flex flex-col gap-2">
                          <CheckCircle className="w-8 h-8 text-emerald-500 mb-2" />
                          <span>You have reached the end of this module.</span>
                       </div>
                    )}
                 </div>
              </div>

           </div>
        </main>
      </div>
    </div>
  );
}