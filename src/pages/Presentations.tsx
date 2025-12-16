import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Search, 
  Filter, 
  X, 
  Plus, 
  Eye, 
  Calendar,
  User,
  FileText,
  Edit,
  Trash2
} from "lucide-react";
import LiquidEther from "@/components/ui/liquidether";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

// Types
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

const categories = ["All", "Education", "Business", "Technology", "Culture", "Tourism", "Other"];

const API_URL = "http://localhost/mooc_api/get_presentations.php";
const CREATE_API_URL = "http://localhost/mooc_api/create_presentation.php";
const UPDATE_API_URL = "http://localhost/mooc_api/update_presentation.php";
const DELETE_API_URL = "http://localhost/mooc_api/delete_presentation.php";

const Presentations = () => {
  const [presentations, setPresentations] = useState<Presentation[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPresentation, setEditingPresentation] = useState<Presentation | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    thumbnail: "",
    file_url: "",
    category: "",
    is_public: true,
  });

  useEffect(() => {
    fetchPresentations();
  }, []);

  const fetchPresentations = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedCategory !== "All") {
        params.append("category", selectedCategory);
      }
      params.append("is_public", "1");

      const res = await fetch(`${API_URL}?${params.toString()}`);
      if (!res.ok) {
        throw new Error(`Failed to fetch presentations (${res.status})`);
      }

      const data: Presentation[] = await res.json();
      setPresentations(data);
      setLoading(false);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to load presentations");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPresentations();
  }, [selectedCategory]);

  const handleCreatePresentation = async () => {
    try {
      if (!formData.title.trim()) {
        toast({
          title: "Error",
          description: "Title is required",
          variant: "destructive",
        });
        return;
      }

      const response = await fetch(CREATE_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          author_id: user?.dbId || null,
          author_name: user?.fullName || null,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create presentation");
      }

      const result = await response.json();
      toast({
        title: "Success",
        description: "Presentation created successfully",
      });
      setIsDialogOpen(false);
      resetForm();
      fetchPresentations();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to create presentation",
        variant: "destructive",
      });
    }
  };

  const handleUpdatePresentation = async () => {
    if (!editingPresentation) return;

    try {
      const response = await fetch(UPDATE_API_URL, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: editingPresentation.id,
          ...formData,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update presentation");
      }

      toast({
        title: "Success",
        description: "Presentation updated successfully",
      });
      setIsDialogOpen(false);
      setEditingPresentation(null);
      resetForm();
      fetchPresentations();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to update presentation",
        variant: "destructive",
      });
    }
  };

  const handleDeletePresentation = async (id: number) => {
    if (!confirm("Are you sure you want to delete this presentation?")) {
      return;
    }

    try {
      const response = await fetch(`${DELETE_API_URL}?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete presentation");
      }

      toast({
        title: "Success",
        description: "Presentation deleted successfully",
      });
      fetchPresentations();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to delete presentation",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      content: "",
      thumbnail: "",
      file_url: "",
      category: "",
      is_public: true,
    });
    setEditingPresentation(null);
  };

  const openEditDialog = (presentation: Presentation) => {
    setEditingPresentation(presentation);
    setFormData({
      title: presentation.title,
      description: presentation.description || "",
      content: presentation.content || "",
      thumbnail: presentation.thumbnail || "",
      file_url: presentation.file_url || "",
      category: presentation.category || "",
      is_public: presentation.is_public === 1,
    });
    setIsDialogOpen(true);
  };

  const filteredPresentations = presentations.filter((presentation) => {
    const matchesSearch =
      presentation.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (presentation.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
    const matchesCategory =
      selectedCategory === "All" || presentation.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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

      <main className="pt-16 lg:pt-20">
        {/* Header */}
        <section className="relative overflow-hidden py-14 lg:py-20 bg-slate-100 dark:bg-emerald-950/90">
          <div className="absolute inset-0 bg-gradient-to-br from-white via-slate-50 to-white dark:from-black/55 dark:via-emerald-950/70 dark:to-black/55" />
          <div className="absolute -top-24 left-10 w-80 h-80 bg-[#F4B942]/20 dark:bg-[#F4B942]/12 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-8 w-72 h-72 bg-teal-400/20 dark:bg-teal-400/12 rounded-full blur-3xl" />
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-950 via-emerald-900/80 to-background" />
          <div className="absolute inset-0 opacity-[0.06] bg-[radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:22px_22px]" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-100/50 via-transparent to-transparent dark:from-black/45 dark:via-transparent dark:to-black/30 pointer-events-none" />
         
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex justify-between items-center">
              <div className="max-w-2xl">
                <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4 animate-fade-up">
                  Explore <span className="text-gradient">Presentations</span>
                </h1>
                <p className="text-slate-700/80 dark:text-white/70 text-lg animate-fade-up delay-100">
                  Discover and share educational presentations about Philippine culture, heritage, and more
                </p>
              </div>
              {user && (
                <Dialog open={isDialogOpen} onOpenChange={(open) => {
                  setIsDialogOpen(open);
                  if (!open) {
                    resetForm();
                  }
                }}>
                  <DialogTrigger asChild>
                    <Button variant="teal" className="hidden sm:flex">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Presentation
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>
                        {editingPresentation ? "Edit Presentation" : "Create New Presentation"}
                      </DialogTitle>
                      <DialogDescription>
                        {editingPresentation 
                          ? "Update your presentation details below."
                          : "Fill in the details to create a new presentation."}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="title">Title *</Label>
                        <Input
                          id="title"
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          placeholder="Enter presentation title"
                        />
                      </div>
                      <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          placeholder="Enter a brief description"
                          rows={3}
                        />
                      </div>
                      <div>
                        <Label htmlFor="content">Content</Label>
                        <Textarea
                          id="content"
                          value={formData.content}
                          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                          placeholder="Enter presentation content (HTML or markdown supported)"
                          rows={6}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="thumbnail">Thumbnail URL</Label>
                          <Input
                            id="thumbnail"
                            value={formData.thumbnail}
                            onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                            placeholder="e.g., presentations/thumb.jpg"
                          />
                        </div>
                        <div>
                          <Label htmlFor="file_url">File URL</Label>
                          <Input
                            id="file_url"
                            value={formData.file_url}
                            onChange={(e) => setFormData({ ...formData, file_url: e.target.value })}
                            placeholder="e.g., presentations/file.pdf"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="category">Category</Label>
                        <Select
                          value={formData.category}
                          onValueChange={(value) => setFormData({ ...formData, category: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.filter(c => c !== "All").map((cat) => (
                              <SelectItem key={cat} value={cat}>
                                {cat}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="is_public"
                          checked={formData.is_public}
                          onChange={(e) => setFormData({ ...formData, is_public: e.target.checked })}
                          className="w-4 h-4"
                        />
                        <Label htmlFor="is_public">Make this presentation public</Label>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setIsDialogOpen(false);
                            resetForm();
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="teal"
                          onClick={editingPresentation ? handleUpdatePresentation : handleCreatePresentation}
                        >
                          {editingPresentation ? "Update" : "Create"}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>
        </section>

        {/* Search & Filters */}
        <section className="py-6 border-b border-black/10 dark:border-white/10 bg-white/70 dark:bg-emerald-950/70 sticky top-16 lg:top-20 z-30 backdrop-blur-xl">
          <div className="absolute inset-0 bg-gradient-to-r from-white/25 via-slate-50/25 to-white/25 dark:from-black/25 dark:via-emerald-950/25 dark:to-black/25" />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 dark:text-white/60" />
                <Input
                  type="text"
                  placeholder="Search presentations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="
                    pl-10 h-12
                    bg-black/5 dark:bg-white/5 border-black/15 dark:border-white/15 text-slate-900 dark:text-white placeholder:text-slate-500/80 dark:placeholder:text-white/50
                    focus-visible:ring-emerald-500/40 dark:focus-visible:ring-emerald-300/40
                  "
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    <X className="w-4 h-4 text-slate-500/60 hover:text-slate-800 dark:text-white/60 dark:hover:text-white" />
                  </button>
                )}
              </div>

              {/* Mobile Filter Toggle */}
              <Button
                variant="outline"
                className="sm:hidden bg-black/5 hover:bg-black/10 border-black/15 text-slate-800 dark:bg-white/5 dark:hover:bg-white/10 dark:border-white/15 dark:text-white"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>

              {/* Desktop Category Filters */}
              <div className="hidden sm:flex items-center gap-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "teal" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className={
                      selectedCategory === category
                        ? ""
                        : "bg-black/5 hover:bg-black/10 border-black/15 text-slate-800 dark:bg-white/5 dark:hover:bg-white/10 dark:border-white/15 dark:text-white"
                    }
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>

            {/* Mobile Category Filters */}
            {showFilters && (
              <div className="flex flex-wrap gap-2 mt-4 sm:hidden animate-fade-in">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "teal" : "outline"}
                    size="sm"
                    onClick={() => {
                      setSelectedCategory(category);
                      setShowFilters(false);
                    }}
                    className={
                      selectedCategory === category
                        ? ""
                        : "bg-black/5 hover:bg-black/10 border-black/15 text-slate-800 dark:bg-white/5 dark:hover:bg-white/10 dark:border-white/15 dark:text-white"
                    }
                  >
                    {category}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Presentations Grid */}
        <section className="relative py-12 lg:py-16 bg-slate-100 dark:bg-emerald-950/90 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white via-slate-50 to-white dark:from-black/40 dark:via-emerald-950/70 dark:to-black/45" />
          <div className="absolute top-1/3 left-10 w-72 h-72 bg-emerald-400/15 dark:bg-emerald-400/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-72 h-72 bg-[#F4B942]/15 dark:bg-[#F4B942]/10 rounded-full blur-3xl" />
          <div className="absolute inset-0 opacity-[0.1] dark:opacity-[0.06] bg-[radial-gradient(circle_at_1px_1px,black_1px,transparent_0)] dark:bg-[radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:26px_26px]" />

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Results / loading / error */}
            {loading ? (
              <p className="text-slate-600 dark:text-white/70 mb-6">Loading presentations...</p>
            ) : error ? (
              <p className="text-red-300 mb-6">Error: {error}</p>
            ) : (
              <p className="text-slate-600 dark:text-white/70 mb-6">
                Showing {filteredPresentations.length} presentation
                {filteredPresentations.length !== 1 ? "s" : ""}
                {selectedCategory !== "All" && ` in ${selectedCategory}`}
              </p>
            )}

            {!loading && !error && (
              <>
                {filteredPresentations.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredPresentations.map((presentation, index) => (
                      <div
                        key={presentation.id}
                        className="
                          group relative rounded-3xl overflow-hidden bg-white/60 dark:bg-black/20
                          backdrop-blur-2xl border border-white/20 dark:border-white/10
                          shadow-xl dark:shadow-[0_22px_70px_rgba(0,0,0,0.45)]
                          transition-all duration-500
                          hover:-translate-y-1 hover:shadow-2xl dark:hover:shadow-[0_34px_110px_rgba(0,0,0,0.65)]
                          hover:ring-1 hover:ring-emerald-500/30 dark:hover:ring-emerald-300/30
                          animate-fade-up
                        "
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        {/* Clickable overlay for navigation */}
                        <Link
                          to={`/presentations/${presentation.id}`}
                          className="absolute inset-0 z-10"
                          aria-label={`View ${presentation.title}`}
                        />
                        {/* Thumbnail */}
                        <div className="relative aspect-[4/3] overflow-hidden bg-slate-200 dark:bg-slate-800">
                          {presentation.thumbnail_url ? (
                            <img
                              src={presentation.thumbnail_url}
                              alt={presentation.title}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <FileText className="w-16 h-16 text-slate-400 dark:text-slate-600" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent" />
                          {presentation.category && (
                            <div className="absolute top-3 left-3">
                              <span className="bg-black/40 text-white text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-md border border-white/15">
                                {presentation.category}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="p-5 relative">
                          <h3 className="font-display text-lg font-semibold text-slate-900 dark:text-white mb-2 line-clamp-2 group-hover:text-emerald-600 dark:group-hover:text-[#F4B942] transition-colors">
                            {presentation.title}
                          </h3>
                          {presentation.description && (
                            <p className="text-slate-600/90 dark:text-white/60 text-sm mb-3 line-clamp-2">
                              {presentation.description}
                            </p>
                          )}

                          {/* Meta Info */}
                          <div className="flex items-center gap-4 text-sm text-slate-700/80 dark:text-white/65 mb-4">
                            {presentation.author_name && (
                              <div className="flex items-center gap-1">
                                <User className="w-4 h-4" />
                                <span className="text-slate-800 dark:text-white">{presentation.author_name}</span>
                              </div>
                            )}
                            <div className="flex items-center gap-1">
                              <Eye className="w-4 h-4" />
                              <span className="text-slate-800 dark:text-white">{presentation.views}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span className="text-slate-800 dark:text-white">
                                {new Date(presentation.created_at).toLocaleDateString()}
                              </span>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center justify-between pt-4 border-t border-black/10 dark:border-white/10 relative z-20">
                            <Link
                              to={`/presentations/${presentation.id}`}
                              className="text-sm font-semibold text-emerald-600/90 dark:text-[#F4B942]/90 group-hover:text-emerald-600 dark:group-hover:text-[#F4B942] transition-colors"
                              onClick={(e) => e.stopPropagation()}
                            >
                              View Details →
                            </Link>
                            {user && (user.dbId === presentation.author_id || user.role === 'instructor') && (
                              <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    openEditDialog(presentation);
                                  }}
                                  className="h-8 w-8 p-0 relative z-30"
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleDeletePresentation(presentation.id);
                                  }}
                                  className="h-8 w-8 p-0 text-red-500 hover:text-red-600 relative z-30"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <p className="text-slate-600 dark:text-white/70 text-lg mb-4">
                      No presentations found matching your criteria.
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearchQuery("");
                        setSelectedCategory("All");
                      }}
                      className="bg-black/5 hover:bg-black/10 border-black/15 text-slate-800 dark:bg-white/5 dark:hover:bg-white/10 dark:border-white/15 dark:text-white"
                    >
                      Clear Filters
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Presentations;

