import { ReactNode, useRef } from "react";
import { cn } from "@/lib/utils";

type Props = {
  children: ReactNode;
  className?: string;
  maxRotate?: number; // degrees
  maxTranslate?: number; // px
};

const TiltCard = ({ children, className, maxRotate = 3, maxTranslate = 4 }: Props) => {
  const ref = useRef<HTMLDivElement | null>(null);

  const onMove = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el) return;

    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;  // 0..1
    const py = (e.clientY - r.top) / r.height;  // 0..1

    const rotY = (px - 0.5) * (maxRotate * 2);
    const rotX = -(py - 0.5) * (maxRotate * 2);

    const tx = (px - 0.5) * (maxTranslate * 2);
    const ty = (py - 0.5) * (maxTranslate * 2);

    el.style.setProperty("--rx", `${rotX.toFixed(2)}deg`);
    el.style.setProperty("--ry", `${rotY.toFixed(2)}deg`);
    el.style.setProperty("--tx", `${tx.toFixed(2)}px`);
    el.style.setProperty("--ty", `${ty.toFixed(2)}px`);
    el.style.setProperty("--gx", `${(px * 100).toFixed(1)}%`);
    el.style.setProperty("--gy", `${(py * 100).toFixed(1)}%`);
  };

  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--rx", `0deg`);
    el.style.setProperty("--ry", `0deg`);
    el.style.setProperty("--tx", `0px`);
    el.style.setProperty("--ty", `0px`);
  };

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={cn(
        "relative rounded-3xl",
        "transition-transform duration-200 will-change-transform",
        "[transform:translate3d(var(--tx,0px),var(--ty,0px),0)_rotateX(var(--rx,0deg))_rotateY(var(--ry,0deg))]",
        className
      )}
      style={{ transformStyle: "preserve-3d" }}
    >
      {/* cursor glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background:
            "radial-gradient(160px circle at var(--gx,50%) var(--gy,50%), rgba(244,185,66,0.18), transparent 55%)",
        }}
      />
      {children}
    </div>
  );
};

export default TiltCard;
