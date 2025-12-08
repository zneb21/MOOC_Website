import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Menu, X, PlayCircle, ChevronLeft, ChevronRight, CheckCircle, MessageSquare, Home } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import axios from "axios";   // for python flask backend communication

// Compact mock course data (kept short so UI doesn't need scrolling on desktop)
const courseData = {
  title: "Discover Iloilo: A Complete Tourism Guide",
  modules: [
    { title: "Introduction to Iloilo", duration: "1h 30m", lessons: [{ title: "Welcome to Iloilo", duration: "5:00", type: "video", videoUrl: "https://www.youtube.com/embed/jfKfPfyJRdk" }, { title: "History Overview", duration: "12:30", type: "video", videoUrl: "https://www.youtube.com/embed/jfKfPfyJRdk" }] },
    { title: "Historic Churches & Heritage", duration: "2h 15m", lessons: [{ title: "Jaro Cathedral", duration: "18:00", type: "video", videoUrl: "https://www.youtube.com/embed/jfKfPfyJRdk" }, { title: "Molo Church", duration: "15:30", type: "video" }] },
    { title: "Festivals & Events", duration: "1h", lessons: [{ title: "Dinagyang Festival", duration: "20:00", type: "video" }, { title: "Paraw Regatta", duration: "15:00", type: "video" }] },
  ],
};

export default function UdemyLayout() {
  const NAV_HEIGHT = 64;
  const [sidebarOpen, setSidebarOpen] = useState(true); // A: always-visible on desktop
  const [sidebarTab, setSidebarTab] = useState("content");
  const [activeModule, setActiveModule] = useState<number | null>(null);
  const [moduleView, setModuleView] = useState<number | null>(null); // when viewing module details inside sidebar

  // Lesson state
  const [moduleIndex, setModuleIndex] = useState(0);
  const [lessonIndex, setLessonIndex] = useState(0);
  const [completed, setCompleted] = useState<Set<string>>(new Set());

  const totalLessons = courseData.modules.reduce((a, m) => a + m.lessons.length, 0);
  const completedCount = completed.size;
  const progress = Math.round((completedCount / totalLessons) * 100);

  const currentModule = courseData.modules[moduleIndex];
  const currentLesson = currentModule.lessons[lessonIndex];

  // no vertical/horizontal scroll on desktop: we set fixed, responsive heights and use modal/detail panels to avoid overflow
  // keyboard shortcuts: left/right to navigate, m to toggle sidebar
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "m" || e.key === "M") setSidebarOpen(s => !s);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [moduleIndex, lessonIndex]);

  const next = () => {
    const mod = courseData.modules;
    if (lessonIndex < mod[moduleIndex].lessons.length - 1) {
      setLessonIndex(li => li + 1);
    } else if (moduleIndex < mod.length - 1) {
      setModuleIndex(mi => mi + 1);
      setLessonIndex(0);
    }
  };

  const prev = () => {
    if (lessonIndex > 0) setLessonIndex(li => li - 1);
    else if (moduleIndex > 0) {
      setModuleIndex(mi => mi - 1);
      setLessonIndex(courseData.modules[moduleIndex - 1].lessons.length - 1);
    }
  };

  const toggleComplete = () => {
    const key = `${moduleIndex}-${lessonIndex}`;
    setCompleted(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  // For accessibility focus
  const chatInputRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    if (sidebarTab === "chat") chatInputRef.current?.focus();
  }, [sidebarTab]);

  // --------------------------
  // ✅ ADDED AI CHAT STATES
  // --------------------------
  const [chatMessages, setChatMessages] = useState<{ sender: string; text: string }[]>([]);
  const [chatInput, setChatInput] = useState("");
  const isSendingRef = useRef(false);

  // --------------------------
  // ✅ ADDED sendChat() FUNCTION
  // --------------------------
  const sendChat = async () => {
    if (!chatInput.trim() || isSendingRef.current) return;
    isSendingRef.current = true;

    const userMessage = chatInput.trim();
    setChatMessages(prev => [...prev, { sender: "user", text: userMessage }]);
    setChatInput("");

    try {
      const res = await axios.post("http://127.0.0.1:5000/chat", {
        user_id: 1,
        message: userMessage,
        lesson_title: currentLesson.title,
        language: "en",
      });

      const reply = res.data.reply || "No response";
      setChatMessages(prev => [...prev, { sender: "assistant", text: reply }]);

    } catch (err) {
      setChatMessages(prev => [
        ...prev,
        { sender: "assistant", text: "Error: unable to reach AI server." }
      ]);
    }

    isSendingRef.current = false;
  };

  // Responsive: on very small screens, sidebar becomes overlay and can scroll internally. Desktop: fixed, no scroll.

  return (
    <div className="w-full h-screen bg-background text-slate-900 flex flex-col overflow-hidden">
      
      {/* Top Navigation - Sticky */}
      <nav className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 flex-shrink-0 z-50">
        <div className="flex items-center gap-4">
          <button
            onClick={() => window.location.href = '/courses/:id'}
            className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-slate-100 transition-colors"
            aria-label="Back to course preview"
          >
            <ChevronLeft className="w-5 h-5 text-slate-700" />
            <span className="text-sm font-medium text-slate-700">Back to Course</span>
          </button>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:block text-sm font-semibold text-slate-800">{courseData.title}</div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-600">{progress}%</span>
            <div className="w-32 h-2 bg-slate-100 rounded overflow-hidden">
              <div className="h-full bg-primary transition-all" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area Below Nav */}
      <div className="flex-1 flex overflow-hidden">
        
      {/* Sidebar */}
      <aside
        className={`bg-white border-r border-slate-200 z-40 transition-all duration-300 flex-shrink-0 font-sans
        ${sidebarOpen ? "w-72" : "w-0"} 
        ${sidebarOpen ? "block" : "hidden"} 
        lg:${sidebarOpen ? "block w-72" : "hidden"}`}
        style={{ minWidth: sidebarOpen ? 288 : 0 }}
      >

        <div className="h-full flex flex-col" style={{ height: '100vh' }}>
          
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
            <button onClick={() => { setSidebarTab('content'); setModuleView(null); }} className={`flex-1 py-2 rounded-md text-sm font-medium ${sidebarTab === 'content' ? 'bg-primary text-white' : 'text-slate-700 bg-background'}`}>
              Content
            </button>
            <button onClick={() => setSidebarTab('chat')} className={`flex-1 py-2 rounded-md text-sm font-medium ${sidebarTab === 'chat' ? 'bg-primary text-white' : 'text-slate-700 bg-background'}`}>
              AI Chat
            </button>
          </div>

          {/* content area */}
          <div className="p-3 flex-1 flex flex-col gap-3" style={{ minHeight: 0 }}>
            
            {/* progress */}
            <div className="px-2">
              <div className="text-xs text-slate-500">Progress</div>
              <div className="w-full h-2 rounded bg-slate-100 mt-1 overflow-hidden">
                <div className="h-full bg-primary transition-all" style={{ width: `${progress}%` }} />
              </div>
              <div className="text-xs text-slate-600 mt-1">{completedCount}/{totalLessons} lessons</div>
            </div>

            {/* condensed modules list */}
            {sidebarTab === 'content' && (
              <div className="flex-1 flex flex-col gap-2" style={{ minHeight: 0 }}>
                <div className="text-sm font-semibold text-slate-700 px-1">Modules</div>
                
                <Accordion type="single" collapsible className="w-full space-y-2">
                  {courseData.modules.map((m, i) => (
                    <AccordionItem 
                      key={i} 
                      value={`sidebar-module-${i}`}
                      className="bg-background rounded-md border border-slate-200 hover:shadow-md transition-shadow duration-200 overflow-hidden"
                    >
                      <AccordionTrigger className="px-3 py-2 hover:no-underline flex justify-between text-left font-sans">
                        <div className="flex flex-col truncate">
                          <span className="text-sm text-slate-800 truncate">{m.title}</span>
                          <span className="text-xs text-slate-500">{m.lessons.length} lessons • {m.duration}</span>
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
                              className={`flex items-center justify-between py-1.5 px-2 rounded text-left transition-colors
                                ${moduleIndex === i && lessonIndex === li
                                  ? "bg-primary text-white"
                                  : "bg-transparent text-slate-700 hover:bg-slate-100"}`}
                            >
                              <span className={`text-xs truncate 
                                ${moduleIndex === i && lessonIndex === li ? "text-white font-medium" : "text-slate-700"}`}>
                                {lesson.title}
                              </span>

                              <span className={`text-[10px] 
                                ${moduleIndex === i && lessonIndex === li ? "text-white" : "text-slate-400"}`}>
                                {lesson.duration}
                              </span>
                            </button>

                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>

                {/* small footer */}
                <div className="mt-auto px-1 py-2">
                  <button onClick={() => { setModuleIndex(0); setLessonIndex(0); }} className="w-full py-2 rounded-md bg-primary text-white text-sm">Start Course</button>
                </div>
              </div>
            )}

            {/* Chat tab compact UI  */}
            {sidebarTab === 'chat' && (
              <div className="flex-1 flex flex-col gap-2" style={{ minHeight: 0 }}>
                <div className="text-sm font-semibold text-slate-700">Assistant</div>

                <div className="flex-1 rounded-md bg-background pb-3 flex flex-col justify-end" style={{ minHeight: 0 }}>

                  {/* ------------------------------ */}
                  {/* ✅ CHAT MESSAGES ADDED HERE     */}
                  {/* ------------------------------ */}
                  <div className="flex-1 overflow-y-auto mb-2 pr-1">
                    {chatMessages.map((msg, idx) => (
                      <div
                        key={idx}
                        className={`text-xs mb-1 p-2 rounded-md max-w-[85%] ${
                          msg.sender === "user"
                            ? "bg-primary text-white ml-auto"
                            : "bg-slate-200 text-slate-800"
                        }`}
                      >
                        {msg.text}
                      </div>
                    ))}
                  </div>

                  <div className="text-xs text-slate-600 mb-2">Type a question about the lesson.</div>
                  <div className="flex gap-2">

                    {/* UPDATED INPUT */}
                    <input
                      ref={chatInputRef}
                      type="text"
                      placeholder="Ask the assistant..."
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") sendChat(); }}
                      className="flex-1 rounded-md border border-slate-200 py-1.5 text-sm mb-3"
                    />

                    {/* UPDATED BUTTON */}
                    <Button size="sm" onClick={sendChat}>
                      Send
                    </Button>

                  </div>
                </div>

                <div className="text-xs text-slate-400">
                  Tip: press <kbd className="px-1 rounded bg-slate-100">m</kbd> to toggle sidebar, 
                  <kbd className="px-1 rounded bg-slate-100">←</kbd>/<kbd className="px-1 rounded bg-slate-100">→</kbd> to navigate.
                </div>
              </div>
            )}

          </div>
        </div>
      </aside>

      {/* Main area */}
      <main className="flex-1 flex flex-col min-h-0">

        <div className="flex-1 flex" style={{ minHeight: 0 }}>

          {/* Player */}
          <section className="flex-1 flex flex-col bg-slate-800">
            <div className="flex-1 flex items-center justify-center">
              {currentLesson.type === 'video' ? (
                <iframe className="w-full max-w-4xl h-full max-h-[60vh]" src={currentLesson.videoUrl} title={currentLesson.title} frameBorder={0} allowFullScreen />
              ) : (
                <div className="w-full max-w-4xl h-full max-h-[60vh] flex items-center justify-center text-white/80">No video</div>
              )}
            </div>

            <div className="h-20 bg-white border-t border-slate-200 flex items-center px-4 justify-between">
              <div className="flex items-center gap-4">
                <div className="text-sm font-semibold">{currentLesson.title}</div>
                <div className="text-xs text-slate-500">Module {moduleIndex + 1} • {currentModule.title}</div>
              </div>

              <div className="flex items-center gap-2">
                <button onClick={prev} className="px-3 py-2 rounded-md border border-slate-200 bg-white hover:bg-background"><ChevronLeft /></button>
                <button onClick={next} className="px-3 py-2 rounded-md bg-primary text-white hover:bg-violet-700"><ChevronRight /></button>
                <button onClick={toggleComplete} className={`px-3 py-2 rounded-md flex items-center gap-2 border ${completed.has(`${moduleIndex}-${lessonIndex}`) ? 'border-green-500 bg-green-50 text-green-700' : 'border-slate-200 bg-white text-slate-700'}`}>
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm">{completed.has(`${moduleIndex}-${lessonIndex}`) ? 'Completed' : 'Mark'}</span>
                </button>
              </div>
            </div>
          </section>

          {/* Right lesson overview */}
          <aside className="w-80 bg-white border-l border-slate-200 flex flex-col" style={{ minWidth: 320 }}>
            <div className="p-4 border-b">
              <div className="text-sm font-semibold">Lesson Overview</div>
              <div className="text-xs text-slate-500 mt-1">{currentLesson.duration}</div>
            </div>
            <div className="p-3 flex-1 flex flex-col" style={{ minHeight: 0 }}>
              <div className="text-sm font-medium">What you'll learn</div>
              <ul className="mt-2 text-sm text-slate-600 space-y-2">
                <li>Key context and background</li>
                <li>PSi jake occena kag carlos</li>
                <li>nga mga mamaw sa prog :o </li>
              </ul>

              <div className="mt-auto">
                <div className="text-xs text-slate-500 mb-2">Jump to lesson</div>
                <div className="grid grid-cols-1 gap-2">
                  {courseData.modules.flatMap((m, mi) => m.lessons.map((l, li) => ({ mi, li, title: l.title }))).slice(0, 6).map((item, idx) => (
                    <button key={idx} onClick={() => { setModuleIndex(item.mi); setLessonIndex(item.li); }} className={`flex items-center justify-between py-1.5 px-2 rounded text-left transition-colors
                                  ${moduleIndex === item.mi && lessonIndex === item.li
                                    ? "bg-primary text-white"
                                    : "bg-transparent text-slate-700 hover:bg-slate-100"}`}>
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
