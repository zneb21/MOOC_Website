import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useReveal } from "@/components/home/useReveal";

type Props = {
  children: ReactNode;
  className?: string;
  delayMs?: number;
};

const Reveal = ({ children, className, delayMs = 0 }: Props) => {
  const { ref, shown } = useReveal<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all duration-700 will-change-transform",
        shown ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-6 scale-[0.985]",
        className
      )}
      style={{ transitionDelay: `${delayMs}ms` }}
    >
      {children}
    </div>
  );
};

export default Reveal;
