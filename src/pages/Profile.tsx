import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProfileForm from "@/components/profile/ProfileForm";
import SecuritySettings from "@/components/profile/SecuritySettings";
import { Settings } from "lucide-react";

const Profile = () => {
  return (
    <div className="min-h-screen bg-muted">
      <Navbar />
      
      <main className="pt-20 lg:pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3 animate-fade-up">
              <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
                <Settings className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-display text-2xl font-bold text-foreground">
                  Account Settings
                </h1>
                <p className="text-muted-foreground">
                  Manage your profile and preferences
                </p>
              </div>
            </div>

            <ProfileForm />
            <SecuritySettings />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Profile;
