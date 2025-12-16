import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  Eye, 
  Calendar,
  User,
  FileText,
  Download,
  ExternalLink,
  Edit,
  Trash2
} from "lucide-react";
import LiquidEther from "@/components/ui/liquidether";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Presentation {
  id: number;
  title: string;
  description: string | null;
  content: string | null;
  thumbnail: string | null;
  thumbnail_url: string | null;
  file_url: string | null;
  file_url_full: string | null;
  author_id: number | null;
  author_name: string | null;
  category: string | null;
  is_public: number;
  views: number;
  created_at: string;
  updated_at: string;
}

const GET_API_URL = "http://localhost/mooc_api/get_presentation.php";
const VIEWS_API_URL = "http://localhost/mooc_api/increment_presentation_views.php";
const DELETE_API_URL = "http://localhost/mooc_api/delete_presentation.php";

const PresentationView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [presentation, setPresentation] = useState<Presentation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    if (id) {
      fetchPresentation();
      incrementViews();
    }
  }, [id]);

  const fetchPresentation = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${GET_API_URL}?id=${id}`);
      if (!res.ok) {
        throw new Error(`Failed to fetch presentation (${res.status})`);
      }
      const data: Presentation = await res.json();
      setPresentation(data);
      setLoading(false);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to load presentation");
      setLoading(false);
    }
  };

  const incrementViews = async () => {
    try {
      await fetch(VIEWS_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: parseInt(id || "0") }),
      });
      // Refresh presentation to get updated view count
      setTimeout(() => {
        fetchPresentation();
      }, 500);
    } catch (err) {
      console.error("Failed to increment views:", err);
    }
  };

  const handleDelete = async () => {
    if (!presentation) return;

    try {
      const response = await fetch(`${DELETE_API_URL}?id=${presentation.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete presentation");
      }

      toast({
        title: "Success",
        description: "Presentation deleted successfully",
      });
      navigate("/presentations");
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to delete presentation",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="relative min-h-screen bg-slate-50 dark:bg-zinc-950">
        <Navbar />
        <main className="pt-16 lg:pt-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <p className="text-slate-600 dark:text-white/70">Loading presentation...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !presentation) {
    return (
      <div className="relative min-h-screen bg-slate-50 dark:bg-zinc-950">
        <Navbar />
        <main className="pt-16 lg:pt-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <p className="text-red-300 mb-4">Error: {error || "Presentation not found"}</p>
            <Button onClick={() => navigate("/presentations")} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Presentations
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const canEdit = user && (user.dbId === presentation.author_id || user.role === 'instructor');

  return (
    <div className="relative min-h-screen bg-slate-50 dark:bg-zinc-950">
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
          mouseForce={30}
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

      <main className="pt-16 lg:pt-20 relative z-10">
        {/* Header */}
        <section className="relative overflow-hidden py-8 lg:py-12 bg-slate-100 dark:bg-emerald-950/90 border-b border-black/10 dark:border-white/10">
          <div className="absolute inset-0 bg-gradient-to-br from-white via-slate-50 to-white dark:from-black/55 dark:via-emerald-950/70 dark:to-black/55" />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <Button
              variant="ghost"
              onClick={() => navigate("/presentations")}
              className="mb-6"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Presentations
            </Button>

            <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
              <div className="flex-1">
                {presentation.category && (
                  <span className="inline-block bg-emerald-600/20 dark:bg-emerald-400/20 text-emerald-700 dark:text-emerald-300 text-sm font-semibold px-3 py-1 rounded-full mb-4">
                    {presentation.category}
                  </span>
                )}
                <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4">
                  {presentation.title}
                </h1>
                {presentation.description && (
                  <p className="text-slate-700/80 dark:text-white/70 text-lg mb-6">
                    {presentation.description}
                  </p>
                )}

                {/* Meta Info */}
                <div className="flex flex-wrap items-center gap-6 text-sm text-slate-700/80 dark:text-white/65">
                  {presentation.author_name && (
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span className="text-slate-800 dark:text-white font-medium">
                        {presentation.author_name}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    <span className="text-slate-800 dark:text-white font-medium">
                      {presentation.views} {presentation.views === 1 ? 'view' : 'views'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span className="text-slate-800 dark:text-white">
                      {new Date(presentation.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              {canEdit && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => navigate("/presentations")}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit (Go to List)
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => setShowDeleteDialog(true)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="relative py-12 lg:py-16 bg-slate-100 dark:bg-emerald-950/90">
          <div className="absolute inset-0 bg-gradient-to-br from-white via-slate-50 to-white dark:from-black/40 dark:via-emerald-950/70 dark:to-black/45" />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-4xl mx-auto">
              {/* Thumbnail */}
              {presentation.thumbnail_url && (
                <div className="mb-8 rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src={presentation.thumbnail_url}
                    alt={presentation.title}
                    className="w-full h-auto object-cover"
                  />
                </div>
              )}

              {/* Content */}
              {presentation.content && (
                <div className="prose prose-lg dark:prose-invert max-w-none mb-8 bg-white/60 dark:bg-black/20 backdrop-blur-2xl border border-white/20 dark:border-white/10 rounded-3xl p-8 shadow-xl">
                  <div
                    dangerouslySetInnerHTML={{ __html: presentation.content }}
                    className="text-slate-800 dark:text-white"
                  />
                </div>
              )}

              {/* File Download */}
              {presentation.file_url_full && (
                <div className="bg-white/60 dark:bg-black/20 backdrop-blur-2xl border border-white/20 dark:border-white/10 rounded-3xl p-6 shadow-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-emerald-600/20 dark:bg-emerald-400/20 flex items-center justify-center">
                        <FileText className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                          Presentation File
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-white/70">
                          Download or view the presentation file
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        asChild
                        className="bg-black/5 hover:bg-black/10 border-black/15 text-slate-800 dark:bg-white/5 dark:hover:bg-white/10 dark:border-white/15 dark:text-white"
                      >
                        <a
                          href={presentation.file_url_full}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          View
                        </a>
                      </Button>
                      <Button variant="teal" asChild>
                        <a
                          href={presentation.file_url_full}
                          download
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {!presentation.content && !presentation.file_url_full && (
                <div className="text-center py-12 bg-white/60 dark:bg-black/20 backdrop-blur-2xl border border-white/20 dark:border-white/10 rounded-3xl">
                  <FileText className="w-16 h-16 text-slate-400 dark:text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-600 dark:text-white/70">
                    No content available for this presentation.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Presentation</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{presentation.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PresentationView;

