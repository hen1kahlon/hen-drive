import { useEffect, useRef, type RefObject } from "react";

export function useScrollReveal<T extends HTMLElement = HTMLElement>(
  delay: 0 | 100 | 200 | 300 = 0,
): RefObject<T | null> {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    // Skip hide-then-reveal for elements already visible in the viewport
    // to avoid the flash: visible → invisible → fade-in.
    const rect = el.getBoundingClientRect();
    const alreadyVisible = rect.top < window.innerHeight && rect.bottom > 0;
    if (alreadyVisible) return;

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
      { threshold: 0.05 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return ref;
}
