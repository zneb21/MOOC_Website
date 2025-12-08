import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WelcomeHeader from "@/components/dashboard/WelcomeHeader";
import QuickStats from "@/components/dashboard/QuickStats";
import EnrolledCourses from "@/components/dashboard/EnrolledCourses";
import { mockEnrollments } from "@/data/mockData";

const Dashboard = () => {
  // TODO: Replace with Supabase query to fetch user's enrollments
  const enrollments = mockEnrollments;

  return (
    <div className="min-h-screen bg-muted">
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
