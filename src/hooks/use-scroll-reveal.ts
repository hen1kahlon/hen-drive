import { useEffect, useRef } from "react";

export function useScrollReveal(delay: 0 | 100 | 200 | 300 = 0) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("sr-reveal", "sr-visible");
      return;
    }

    el.classList.add("sr-reveal");

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            if (delay > 0) {
              setTimeout(() => el.classList.add("sr-visible"), delay);
            } else {
              el.classList.add("sr-visible");
            }
            observer.disconnect();
          }
        }
      },
      { threshold: 0.05 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return ref;
}
