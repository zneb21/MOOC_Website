type Props = {
  flip?: boolean;
  className?: string;
  tone?: "light" | "dark";
};

const SectionSeparator = ({ flip = false, className = "", tone = "dark" }: Props) => {
  const fill = tone === "dark" ? "fill-emerald-950/45 dark:fill-emerald-950/65" : "fill-black/5 dark:fill-white/5";

  return (
    <div className={`relative w-full ${className}`} aria-hidden="true">
      {/* fade overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/25 dark:via-black/20 dark:to-black/35 pointer-events-none" />

      <svg
        className={`relative block w-full h-16 sm:h-20 ${flip ? "rotate-180" : ""}`}
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
      >
        <path
          d="M0,64 C240,110 480,110 720,64 C960,18 1200,18 1440,64 L1440,120 L0,120 Z"
          className={fill}
        />
      </svg>
    </div>
  );
};

export default SectionSeparator;
