import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft, Search } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-16 lg:pt-20 min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12">
        {/* About-page ambience */}
        <div className="absolute inset-0 -z-10 bg-emerald-950/90" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-black/55 via-emerald-950/70 to-black/55" />
        <div className="absolute -top-28 left-12 -z-10 w-80 h-80 bg-[#F4B942]/12 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 -z-10 w-72 h-72 bg-teal-400/12 rounded-full blur-3xl" />
        <div className="absolute inset-0 -z-10 opacity-[0.07] bg-[radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:24px_24px]" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/45 via-transparent to-black/30 pointer-events-none" />

        <div className="w-full max-w-2xl">
          <div className="relative rounded-3xl bg-black/20 backdrop-blur-2xl border border-white/10 shadow-[0_28px_90px_rgba(0,0,0,0.55)] p-7 sm:p-10 overflow-hidden text-center">
            <div className="pointer-events-none absolute -inset-x-24 -inset-y-24 rotate-12 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-30" />

            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 border border-white/10 shadow-[0_16px_40px_rgba(0,0,0,0.35)] mb-4">
              <Search className="w-7 h-7 text-[#F4B942]" />
            </div>

            <h1 className="text-5xl sm:text-6xl font-bold font-display text-white">
              404
            </h1>
            <p className="mt-3 text-white/70 text-lg">
              Oops — that page doesn’t exist.
            </p>
            <p className="mt-2 text-white/50 text-sm">
              You tried to access:{" "}
              <span className="text-white/70">{location.pathname}</span>
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                className="
                  h-12 px-6
                  bg-[#F4B942] text-black
                  hover:bg-[#e6a92f] active:bg-[#d99f2c]
                  shadow-[0_16px_40px_rgba(0,0,0,0.25)]
                "
                asChild
              >
                <Link to="/">
                  <Home className="w-5 h-5 mr-2" />
                  Return Home
                </Link>
              </Button>

              <Button
                variant="outline"
                className="
                  h-12 px-6
                  bg-white/5 hover:bg-white/10
                  border-white/15 text-white
                "
                onClick={() => window.history.back()}
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Go Back
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NotFound;
