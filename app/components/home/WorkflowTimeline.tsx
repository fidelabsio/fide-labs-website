"use client";

import { useEffect, useRef, useState } from "react";

type Step = { n: string; t: string; d: string; meta: string; points: string[] };

const STEPS: Step[] = [
  {
    n: "01",
    t: "Customer requests quote",
    d: "A shopper taps “Request a quote” instead of Buy, right on the product page. No account, no signup, no back-and-forth email just to get a price.",
    meta: "On your storefront",
    points: ["Works on any product or variant", "Captures cart, quantity & contact in one step"],
  },
  {
    n: "02",
    t: "Merchant reviews request",
    d: "The request lands in your dashboard the moment it’s sent, with the full cart, quantities, and customer details already attached and organized for you.",
    meta: "FIDE dashboard",
    points: ["Real-time desktop & email alerts", "Full customer and cart context"],
  },
  {
    n: "03",
    t: "Merchant sends quote",
    d: "Set custom pricing, volume discounts, and terms, then send a branded offer back in a single click — or save it as a template to reuse next time.",
    meta: "Custom pricing",
    points: ["Per-line or order-wide discounts", "Reusable quote templates"],
  },
  {
    n: "04",
    t: "Customer reviews quote",
    d: "They get a branded email with your price, terms, and a secure link to accept. No login, no portal to hunt through — just one clear call to action.",
    meta: "Branded email",
    points: ["Mobile-friendly branded email", "Secure, expiring accept link"],
  },
  {
    n: "05",
    t: "Customer approves",
    d: "One click accepts the quote and drops the agreed pricing straight into a ready-to-pay Shopify checkout, with the negotiated discount already applied.",
    meta: "Secure checkout",
    points: ["Agreed price locked in", "Pay by card or on net terms"],
  },
  {
    n: "06",
    t: "Order confirmed",
    d: "The paid order flows straight into Shopify with the quoted pricing intact — no manual entry, no re-keying, no reconciliation to clean up later.",
    meta: "Synced to Shopify",
    points: ["Native Shopify order", "Full quote-to-order audit trail"],
  },
];

export default function WorkflowTimeline() {
  const listRef = useRef<HTMLOListElement>(null);
  const [fill, setFill] = useState(0); // 0..1 — how full the spine is
  const [active, setActive] = useState(0); // how many nodes are completed

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;

    let raf = 0;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      raf = requestAnimationFrame(() => {
        setFill(1);
        setActive(STEPS.length);
      });
      return () => cancelAnimationFrame(raf);
    }

    const update = () => {
      raf = 0;
      const nodes = Array.from(list.querySelectorAll<HTMLElement>("[data-node]"));
      if (!nodes.length) return;
      const trigger = window.innerHeight * 0.62;
      const first = nodes[0].getBoundingClientRect();
      const last = nodes[nodes.length - 1].getBoundingClientRect();
      const span = last.top - first.top || 1;
      setFill(Math.min(1, Math.max(0, (trigger - first.top) / span)));
      let count = 0;
      for (const n of nodes) if (n.getBoundingClientRect().top + n.offsetHeight / 2 <= trigger) count++;
      setActive(count);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    raf = requestAnimationFrame(update);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const done = active >= STEPS.length;

  return (
    <div className="workflow reveal">
      <div className="mx-auto grid max-w-[1180px] grid-cols-1 gap-10 min-[900px]:grid-cols-[minmax(260px,0.8fr)_minmax(0,1.2fr)] min-[900px]:gap-14 xl:gap-20">

        {/* sticky heading */}
        <div className="text-center min-[900px]:sticky min-[900px]:top-28 min-[900px]:self-start min-[900px]:text-left">
          <p className="font-[family-name:var(--font-mono)] text-[14px] font-medium tracking-[0.08em] text-brand-teal">{"// How It Works"}</p>
          <h2 className="mt-4 font-[family-name:var(--font-display)] text-[clamp(32px,3.6vw,48px)] font-bold leading-[1.18] tracking-tight text-gray-900">
            From Quote Request to{" "}
            <span className="mt-2 inline-block rounded-[10px] bg-gradient-to-r from-brand-blue to-brand-teal px-3 pb-1.5 pt-1 leading-none text-white">Revenue</span>
          </h2>
          <p className="mx-auto mt-6 max-w-[400px] font-[family-name:var(--font-sans)] text-[16px] leading-relaxed text-gray-500 min-[900px]:mx-0">
            A seamless workflow that turns quote requests into confirmed, paid orders — automatically, in six steps.
          </p>
        </div>

        {/* timeline */}
        <div className="relative">
          <ol ref={listRef} className="relative flex flex-col gap-12 min-[900px]:gap-16">
            {/* spine track + animated fill — a desktop-only delight; on phones
                the cramped node gutter is dropped for full-width cards */}
            <span aria-hidden="true" className="pointer-events-none absolute left-[21px] top-9 bottom-9 hidden w-1 rounded bg-brand-blue/15 min-[900px]:block">
              <span
                className="absolute left-0 top-0 w-full rounded bg-gradient-to-b from-brand-blue to-brand-teal"
                style={{ height: `${fill * 100}%` }}
              />
            </span>

            {STEPS.map((s, i) => {
              const on = i < active;
              return (
                <li key={s.n} className="relative grid grid-cols-1 items-start gap-5 min-[900px]:grid-cols-[44px_1fr] min-[900px]:gap-9">
                  {/* check node — desktop timeline only */}
                  <span
                    data-node
                    aria-hidden="true"
                    className={`z-10 mt-9 hidden h-10 w-10 place-items-center rounded-full ring-4 transition-colors duration-300 ease-out min-[900px]:grid ${
                      on
                        ? "bg-gradient-to-br from-brand-blue to-brand-teal text-white shadow-[0_4px_12px_rgba(47,84,235,0.28)] ring-[#e9f1fd]"
                        : "bg-white text-slate-300 ring-[#dbe7f5]"
                    }`}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                  </span>

                  {/* gradient-border white card */}
                  <div className="min-w-0 rounded-[21px] bg-gradient-to-br from-brand-blue to-brand-teal p-px shadow-[0_18px_45px_rgba(47,84,235,0.12)] transition-transform duration-300 hover:-translate-y-1">
                    <div className="rounded-[20px] bg-white p-6 sm:p-9">
                      <div className="flex items-center gap-3">
                        {/* Compact numbered chip anchors each step in the mobile stack */}
                        <span className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-[11px] bg-gradient-to-br from-brand-blue to-brand-teal font-[family-name:var(--font-mono)] text-[15px] font-bold leading-none text-white shadow-[0_4px_12px_rgba(47,84,235,0.28)] min-[900px]:hidden">{s.n}</span>
                        <span className="hidden bg-gradient-to-br from-brand-blue to-brand-teal bg-clip-text font-[family-name:var(--font-mono)] text-[46px] font-semibold leading-none text-transparent min-[900px]:inline">{s.n}</span>
                        <span className="ml-auto font-[family-name:var(--font-mono)] text-[10.5px] font-medium uppercase tracking-[0.1em] text-gray-400 sm:text-[11px]">{s.meta}</span>
                      </div>
                      <h3 className="mt-5 font-[family-name:var(--font-display)] text-[19px] font-bold leading-snug tracking-tight text-gray-900 sm:text-[22px] min-[900px]:mt-7">{s.t}</h3>
                      <p className="mt-2.5 font-[family-name:var(--font-sans)] text-[14.5px] leading-relaxed text-gray-500 sm:text-[15px]">{s.d}</p>
                      <ul className="mt-5 flex flex-col gap-2.5 border-t border-gray-100 pt-5">
                        {s.points.map((p) => (
                          <li key={p} className="flex items-start gap-2.5 font-[family-name:var(--font-sans)] text-[13.5px] leading-snug text-gray-600">
                            <span aria-hidden="true" className="mt-0.5 grid h-[18px] w-[18px] flex-shrink-0 place-items-center rounded-md bg-[#e0faf8] text-[#0d9488]">
                              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                            </span>
                            {p}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>

          {/* celebration */}
          <div className="mt-10 flex items-center gap-4 min-[900px]:mt-12 min-[900px]:grid min-[900px]:grid-cols-[44px_1fr] min-[900px]:gap-9">
            <span
              className={`grid h-10 w-10 place-items-center text-[26px] transition-all duration-500 ${done ? "scale-100 opacity-100" : "scale-50 opacity-0"}`}
              aria-hidden="true"
            >
              🎉
            </span>
            <span className={`font-[family-name:var(--font-sans)] text-[15px] font-semibold text-gray-600 transition-opacity duration-500 ${done ? "opacity-100" : "opacity-0"}`}>
              Revenue in the bank — no manual entry, no chasing.
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
