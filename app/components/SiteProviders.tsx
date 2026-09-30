"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { usePathname } from "next/navigation";

interface ToastCtx {
  showToast: (msg: string) => void;
}

const ToastContext = createContext<ToastCtx>({ showToast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

/**
 * App-wide client chrome:
 *  - toast notifications (replaces the old per-page toast state)
 *  - reveal-on-scroll entrance animations, re-armed on every route change
 *  - a back-to-top button
 *
 * A backstop timer guarantees `.reveal` content is never left permanently
 * invisible (slow/failed JS, crawlers, landing mid-page).
 */
export default function SiteProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [toast, setToast] = useState({ msg: "", show: false });
  const [backVisible, setBackVisible] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((msg: string) => {
    setToast({ msg, show: true });
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(
      () => setToast((t) => ({ ...t, show: false })),
      3200
    );
  }, []);

  // Back-to-top visibility
  useEffect(() => {
    const onScroll = () => setBackVisible(window.scrollY > 480);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Reveal-on-scroll, re-run whenever the route changes.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });

    const revealAll = () =>
      document
        .querySelectorAll(".reveal")
        .forEach((el) => el.classList.add("visible"));

    const start = setTimeout(() => {
      const els = document.querySelectorAll(".reveal:not(.visible)");
      if (!("IntersectionObserver" in window)) {
        revealAll();
        return;
      }
      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add("visible");
              obs.unobserve(e.target);
            }
          });
        },
        { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
      );
      els.forEach((el) => obs.observe(el));
    }, 80);

    const backstop = setTimeout(revealAll, 2400);
    return () => {
      clearTimeout(start);
      clearTimeout(backstop);
    };
  }, [pathname]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {/* TOAST */}
      <div
        className={`toast${toast.show ? " show" : ""}`}
        role="status"
        aria-live="polite"
      >
        <div className="toast-icon" aria-hidden="true">
          ✓
        </div>
        <span>{toast.msg}</span>
      </div>

      {/* BACK TO TOP */}
      <button
        className={`back-btn${backVisible ? " show" : ""}`}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Back to top"
        title="Back to top"
      >
        ↑
      </button>

      {children}
    </ToastContext.Provider>
  );
}
