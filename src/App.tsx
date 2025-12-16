import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import About from "./pages/About";
import Courses from "./pages/Courses";
import CoursePreview from "./pages/CoursePreview";
import Presentations from "./pages/Presentations";
import PresentationView from "./pages/PresentationView";
import DinosaurGame from "./pages/DinosaurGame";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import LessonView from "./pages/LessonView";
import ResetPasswordPage from './pages/ResetPasswordPage';
import ForgotPassword from './pages/ForgotPassword';
import ScrollToTop from "@/components/home/ScrollToTop";

// 1. IMPORT ClickSpark component
import ClickSpark from '@/components/ClickSpark';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      {/* 2. WRAP the entire application (BrowserRouter) with ClickSpark */}
      <ClickSpark
          sparkColor='#F5C542' // Warm Gold/Amber color to match the site's accent
          sparkSize={40}       // Slightly larger for a noticeable effect
          sparkRadius={120}    // Wide radius for a soft, spreading glow
          sparkCount={7}       // 7 sparks for an intentional, sophisticated feel
          duration={900}       // Longer duration (ms) for a slower fade out
      >
        <BrowserRouter>
         <ScrollToTop /> {/* ✅ add this */}
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/:id" element={<CoursePreview />} />
            <Route path="/presentations" element={<Presentations />} />
            <Route path="/presentations/:id" element={<PresentationView />} />
            <Route path="/dinosaur-game" element={<DinosaurGame />} />

            {/* Lesson viewer route */}
            <Route path="/course/:id/lesson/:lessonSlug" element={<LessonView />} />

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Password Reset Routes - Public access */}
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} /> 

            {/* For User Dashboard chuchu */}
            <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />

            {/* MUST stay last */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
        </BrowserRouter>
      </ClickSpark>
    </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;