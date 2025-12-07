import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  PlayCircle,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
} from "lucide-react";

// ✅ same API as CoursePreview
const API_URL = "http://localhost/mooc_api/get_courses.php";

type Lesson = {
  title: string;
  duration: string;
  type: "video" | "reading" | "quiz";
  videoUrl?: string | null; // from lesson_directory_url
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

// 🔹 minimal shapes from PHP
type LessonFromApi = {
  lesson_id: number;
  content_id: number;
  lesson_title: string;
  lesson_duration: string | null;
  lesson_type: "video" | "reading" | "quiz" | null;
  lesson_directory?: string | null;
  lesson_directory_url?: string | null;
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

type CourseFromApi = {
  course_id: number;
  course_title: string;
  course_contents?: CourseContentFromApi[];
};

export default function LessonView() {
  const { id, lessonSlug } = useParams<{ id: string; lessonSlug: string }>();
  const navigate = useNavigate();

  const [courseData, setCourseData] = useState<CourseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // parse "/courses/:id/lesson/0-1" => moduleIndex=0, lessonIndex=1
  const [parsedModuleIndex, parsedLessonIndex] = (lessonSlug ?? "0-0")
    .split("-")
    .map((n) => Number(n) || 0);

  // Lesson state
  const [moduleIndex, setModuleIndex] = useState(parsedModuleIndex);
  const [lessonIndex, setLessonIndex] = useState(parsedLessonIndex);
  const [completed, setCompleted] = useState<Set<string>>(new Set());

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarTab, setSidebarTab] = useState<"content" | "chat">("content");

  // For accessibility focus (chat)
  const chatInputRef = useRef<HTMLInputElement | null>(null);

  // 🔹 fetch from PHP backend and map lesson_directory_url -> videoUrl
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error(`Failed to fetch course (${res.status})`);

        const data: CourseFromApi[] = await res.json();
        const db = data.find((c) => String(c.course_id) === String(id));

        if (!db || !db.course_contents) {
          throw new Error("Course not found or has no content");
        }

        const modules: Module[] = db.course_contents.map((content) => ({
          title: content.course_content_title,
          duration: content.course_content_length ?? "",
          lessons: (content.lessons ?? []).map((lesson) => ({
            title: lesson.lesson_title,
            duration: lesson.lesson_duration ?? "",
            type: (lesson.lesson_type ?? "video") as Lesson["type"],
            // ✅ wire directory into player URL
            videoUrl:
              lesson.lesson_directory_url ??
              lesson.lesson_directory ??
              undefined,
          })),
        }));

        setCourseData({
          title: db.course_title,
          modules,
        });
      } catch (err: any) {
        setError(err.message || "Failed to load course");
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id, lessonSlug]);

  // focus chat input when switching to "chat"
  useEffect(() => {
    if (sidebarTab === "chat") chatInputRef.current?.focus();
  }, [sidebarTab]);

  // keyboard shortcuts: left/right to navigate, m to toggle sidebar
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "m" || e.key === "M") setSidebarOpen((s) => !s);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moduleIndex, lessonIndex, courseData]);

  // 🧠 helpers (guard against courseData = null)
  const next = () => {
    if (!courseData) return;
    const mod = courseData.modules;
    if (moduleIndex >= mod.length) return;

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
      const newModuleIndex = moduleIndex - 1;
      const lastLessonIndex =
        courseData.modules[newModuleIndex].lessons.length - 1;
      setModuleIndex(newModuleIndex);
      setLessonIndex(lastLessonIndex);
    }
  };

  const toggleComplete = () => {
    const key = `${moduleIndex}-${lessonIndex}`;
    setCompleted((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  // =============== RENDER GUARDS ===============
  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center text-slate-600">
        Loading lesson...
      </div>
    );
  }

  if (!courseData) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center text-slate-600">
        <p className="mb-4 text-red-500">
          {error ?? "Course data not available"}
        </p>
        <Button onClick={() => navigate(`/courses/${id}`)}>
          Back to Course
        </Button>
      </div>
    );
  }

  // Now we know courseData exists
  const totalLessons = courseData.modules.reduce(
    (a, m) => a + m.lessons.length,
    0
  );
  const completedCount = completed.size;
  const progress =
    totalLessons > 0
      ? Math.round((completedCount / totalLessons) * 100)
      : 0;

  const safeModuleIndex = Math.min(
    moduleIndex,
    Math.max(0, courseData.modules.length - 1)
  );
  const currentModule = courseData.modules[safeModuleIndex];

  const safeLessonIndex = Math.min(
    lessonIndex,
    Math.max(0, currentModule.lessons.length - 1)
  );
  const currentLesson = currentModule.lessons[safeLessonIndex];

  // =============== MAIN UI ===============
  return (
    <div className="w-full h-screen bg-background text-slate-900 flex flex-col overflow-hidden">
      {/* Top Navigation - Sticky */}
      <nav className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 flex-shrink-0 z-50">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(`/courses/${id}`)}
            className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-slate-100 transition-colors"
            aria-label="Back to course preview"
          >
            <ChevronLeft className="w-5 h-5 text-slate-700" />
            <span className="text-sm font-medium text-slate-700">
              Back to Course
            </span>
          </button>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:block text-sm font-semibold text-slate-800">
            {courseData.title}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-600">{progress}%</span>
            <div className="w-32 h-2 bg-slate-100 rounded overflow-hidden">
              <div
                className="h-full bg-primary transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area Below Nav */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - always visible on large screens */}
        <aside
          className={`bg-white border-r border-slate-200 z-40 transition-all duration-300 flex-shrink-0 font-sans
          ${sidebarOpen ? "w-72" : "w-0"}
          ${sidebarOpen ? "block" : "hidden"}
          lg:${sidebarOpen ? "block w-72" : "hidden"}`}
          style={{ minWidth: sidebarOpen ? 288 : 0 }}
        >
          <div className="h-full flex flex-col" style={{ height: "100vh" }}>
            {/* header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="rounded-md bg-primary w-9 h-9 flex items-center justify-center text-white">
                  <PlayCircle className="w-5 h-5" />
                </div>
                <div className="text-sm font-semibold">Course</div>
              </div>
            </div>

            {/* tab buttons */}
            <div className="px-3 py-3 flex gap-2 border-b border-slate-100">
              <button
                onClick={() => {
                  setSidebarTab("content");
                }}
                className={`flex-1 py-2 rounded-md text-sm font-medium ${
                  sidebarTab === "content"
                    ? "bg-primary text-white"
                    : "text-slate-700 bg-background"
                }`}
              >
                Content
              </button>
              <button
                onClick={() => setSidebarTab("chat")}
                className={`flex-1 py-2 rounded-md text-sm font-medium ${
                  sidebarTab === "chat"
                    ? "bg-primary text-white"
                    : "text-slate-700 bg-background"
                }`}
              >
                AI Chat
              </button>
            </div>

            {/* content area */}
            <div
              className="p-3 flex-1 flex flex-col gap-3"
              style={{ minHeight: 0 }}
            >
              {/* progress */}
              <div className="px-2">
                <div className="text-xs text-slate-500">Progress</div>
                <div className="w-full h-2 rounded bg-slate-100 mt-1 overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="text-xs text-slate-600 mt-1">
                  {completedCount}/{totalLessons} lessons
                </div>
              </div>

              {/* Modules list */}
              {sidebarTab === "content" && (
                <div
                  className="flex-1 flex flex-col gap-2"
                  style={{ minHeight: 0 }}
                >
                  <div className="text-sm font-semibold text-slate-700 px-1">
                    Modules
                  </div>
                  <Accordion
                    type="single"
                    collapsible
                    className="w-full space-y-2"
                  >
                    {courseData.modules.map((m, i) => (
                      <AccordionItem
                        key={i}
                        value={`sidebar-module-${i}`}
                        className="bg-background rounded-md border border-slate-200 hover:shadow-md transition-shadow duration-200 overflow-hidden"
                      >
                        <AccordionTrigger className="px-3 py-2 hover:no-underline flex justify-between text-left font-sans">
                          <div className="flex flex-col truncate">
                            <span className="text-sm text-slate-800 truncate">
                              {m.title}
                            </span>
                            <span className="text-xs text-slate-500">
                              {m.lessons.length} lessons • {m.duration}
                            </span>
                          </div>
                        </AccordionTrigger>

                        <AccordionContent className="px-3 pb-3">
                          <div className="flex flex-col gap-1">
                            {m.lessons.map((lesson, li) => (
                              <button
                                key={li}
                                onClick={() => {
                                  setModuleIndex(i);
                                  setLessonIndex(li);

                                  if (window.innerWidth < 1024) {
                                    setSidebarOpen(false);
                                  }
                                }}
                                className={`flex items-center justify-between py-1.5 px-2 rounded text-left transition-colors ${
                                  moduleIndex === i && lessonIndex === li
                                    ? "bg-primary text-white"
                                    : "bg-transparent text-slate-700 hover:bg-slate-100"
                                }`}
                              >
                                <span
                                  className={`text-xs truncate ${
                                    moduleIndex === i && lessonIndex === li
                                      ? "text-white font-medium"
                                      : "text-slate-700"
                                  }`}
                                >
                                  {lesson.title}
                                </span>

                                <span
                                  className={`text-[10px] ${
                                    moduleIndex === i && lessonIndex === li
                                      ? "text-white"
                                      : "text-slate-400"
                                  }`}
                                >
                                  {lesson.duration}
                                </span>
                              </button>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>

                  {/* small footer with actions */}
                  <div className="mt-auto px-1 py-2">
                    <button
                      onClick={() => {
                        setModuleIndex(0);
                        setLessonIndex(0);
                      }}
                      className="w-full py-2 rounded-md bg-primary text-white text-sm"
                    >
                      Start Course
                    </button>
                  </div>
                </div>
              )}

              {/* Chat tab compact UI */}
              {sidebarTab === "chat" && (
                <div
                  className="flex-1 flex flex-col gap-2"
                  style={{ minHeight: 0 }}
                >
                  <div className="text-sm font-semibold text-slate-700">
                    Assistant
                  </div>
                  <div
                    className="flex-1 rounded-md bg-background pb-3 flex flex-col justify-end"
                    style={{ minHeight: 0 }}
                  >
                    <div className="text-xs text-slate-600 mb-2">
                      Type a question about the lesson.
                    </div>
                    <div className="flex gap-2">
                      <input
                        ref={chatInputRef}
                        type="text"
                        placeholder="Ask the assistant..."
                        className="flex-1 rounded-md border border-slate-200 py-1.5 text-sm mb-3 px-2"
                      />
                      <Button size="sm">Send</Button>
                    </div>
                  </div>
                  <div className="text-xs text-slate-400">
                    Tip: press{" "}
                    <kbd className="px-1 rounded bg-slate-100">m</kbd> to
                    toggle sidebar,{" "}
                    <kbd className="px-1 rounded bg-slate-100">←</kbd>/
                    <kbd className="px-1 rounded bg-slate-100">→</kbd> to
                    navigate.
                  </div>
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* Main area */}
        <main className="flex-1 flex flex-col min-h-0">
          {/* Player + info area */}
          <div className="flex-1 flex" style={{ minHeight: 0 }}>
            {/* Left: Player */}
            <section className="flex-1 flex flex-col bg-slate-800">
              <div className="flex-1 flex items-center justify-center">
                {/* video / content */}
                {currentLesson.type === "video" && currentLesson.videoUrl ? (
                  <iframe
                    className="w-full max-w-4xl h-full max-h-[60vh]"
                    src={currentLesson.videoUrl}
                    title={currentLesson.title}
                    frameBorder={0}
                    allowFullScreen
                  />
                ) : (
                  <div className="w-full max-w-4xl h-full max-h-[60vh] flex items-center justify-center text-white/80">
                    No video
                  </div>
                )}
              </div>

              {/* lesson control bar */}
              <div className="h-20 bg-white border-t border-slate-200 flex items-center px-4 justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-sm font-semibold">
                    {currentLesson.title}
                  </div>
                  <div className="text-xs text-slate-500">
                    Module {safeModuleIndex + 1} • {currentModule.title}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={prev}
                    className="px-3 py-2 rounded-md border border-slate-200 bg-white hover:bg-background"
                  >
                    <ChevronLeft />
                  </button>
                  <button
                    onClick={next}
                    className="px-3 py-2 rounded-md bg-primary text-white hover:bg-violet-700"
                  >
                    <ChevronRight />
                  </button>
                  <button
                    onClick={toggleComplete}
                    className={`px-3 py-2 rounded-md flex items-center gap-2 border ${
                      completed.has(`${moduleIndex}-${lessonIndex}`)
                        ? "border-green-500 bg-green-50 text-green-700"
                        : "border-slate-200 bg-white text-slate-700"
                    }`}
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm">
                      {completed.has(`${moduleIndex}-${lessonIndex}`)
                        ? "Completed"
                        : "Mark"}
                    </span>
                  </button>
                </div>
              </div>
            </section>

            {/* Right: Lesson overview */}
            <aside
              className="w-80 bg-white border-l border-slate-200 flex flex-col"
              style={{ minWidth: 320 }}
            >
              <div className="p-4 border-b">
                <div className="text-sm font-semibold">Lesson Overview</div>
                <div className="text-xs text-slate-500 mt-1">
                  {currentLesson.duration}
                </div>
              </div>
              <div
                className="p-3 flex-1 flex flex-col"
                style={{ minHeight: 0 }}
              >
                <div className="text-sm font-medium">What you'll learn</div>
                <ul className="mt-2 text-sm text-slate-600 space-y-2">
                  <li>Key context and background</li>
                  <li>Example bullet 2</li>
                  <li>Example bullet 3</li>
                </ul>

                <div className="mt-auto">
                  <div className="text-xs text-slate-500 mb-2">
                    Jump to lesson
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    {courseData.modules
                      .flatMap((m, mi) =>
                        m.lessons.map((l, li) => ({
                          mi,
                          li,
                          title: l.title,
                        }))
                      )
                      .slice(0, 6)
                      .map((item, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setModuleIndex(item.mi);
                            setLessonIndex(item.li);
                          }}
                          className={`flex items-center justify-between py-1.5 px-2 rounded text-left transition-colors ${
                            moduleIndex === item.mi && lessonIndex === item.li
                              ? "bg-primary text-white"
                              : "bg-transparent text-slate-700 hover:bg-slate-100"
                          }`}
                        >
                          {item.title}
                        </button>
                      ))}
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
}
