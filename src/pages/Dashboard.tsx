import { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WelcomeHeader from "@/components/dashboard/WelcomeHeader";
import QuickStats from "@/components/dashboard/QuickStats";
import EnrolledCourses from "@/components/dashboard/EnrolledCourses";
import { mockEnrollments } from "@/data/mockData";
import { useAuth } from "@/contexts/AuthContext";
import LiquidEther from "@/components/ui/liquidether";



// 🔹 Same shape as whatever your mockEnrollments use
type Enrollment = (typeof mockEnrollments)[number];

const ENROLLMENTS_API = "http://localhost/mooc_api/get_user_enrollments.php";

const Dashboard = () => {
  const { user } = useAuth();

  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    // No DB id → keep mock data (or set to [] if you prefer)
    if (!user?.dbId) {
      setLoading(false);
      return;
    }

    const fetchEnrollments = async () => {
      try {
        const res = await fetch(
          `${ENROLLMENTS_API}?user_id=${user.dbId}`
        );

        if (!res.ok) {
          throw new Error(`Failed to fetch enrollments (${res.status})`);
        }

        const json = await res.json();

        if (!json.success) {
          console.error("API error:", json);
          setLoading(false);
          return;
        }

        const rows = json.data as any[];

      const mapped: Enrollment[] = rows.map((row) => ({
        id: row.course_id,                        // react key / internal id
        courseId: row.course_id,                  // 🔹 used for routing
        title: row.course_title,
        instructor: row.instructor_name ?? "Unknown Instructor",
        category: row.course_category ?? "General",
        image: row.course_thumbnail_url || "",
        status: row.status ?? "enrolled",
        progress: typeof row.progress === "number"
          ? row.progress
          : parseInt(row.progress ?? "0", 10) || 0,   // 🆕 read from DB
      }));





        setEnrollments(mapped);
      } catch (err) {
        console.error("Failed to load enrollments:", err);
        // fallback – keep mock data
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollments();
  }, [user]);

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

      <main className="pt-20 lg:pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto space-y-6">
            <WelcomeHeader />

            <QuickStats enrollments={enrollments} />
            <EnrolledCourses enrollments={enrollments} />


          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
