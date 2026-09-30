"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoMark from "./LogoMark";
import { PRODUCTS } from "../lib/products";

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
      className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

const COMPANY = [
  { label: "About us", desc: "Our mission and the team behind FIDE", href: "/about" },
  { label: "Contact", desc: "Talk to our team", href: "/contact" },
  { label: "Help & Support", desc: "Guides and answers, fast", href: "/support" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menus on route change (state adjusted during render, not in an effect).
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setMenuOpen(false);
    setOpen(null);
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(null);
        setMenuOpen(false);
      }
    };
    const onClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setOpen(null);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);
  const productActive = pathname.startsWith("/products") || pathname === "/product";
  const companyActive = COMPANY.some((c) => isActive(c.href));
  const linkCls = (active: boolean) => `nv-link${active ? " nv-link-active" : ""}`;

  const span0 = menuOpen ? "rotate(45deg) translate(5px,5px)" : "";
  const span2 = menuOpen ? "rotate(-45deg) translate(5px,-5px)" : "";

  return (
    <header ref={navRef} className={`nv-header${scrolled ? " nv-scrolled" : ""}`}>
      <div className="nv-bar">
        {/* Logo */}
        <Link href="/" className="nv-logo" aria-label="FIDE Labs home">
          <LogoMark size={32} />
          <span className="nv-wordmark">FIDE<span>Labs</span></span>
        </Link>

        {/* Centered desktop nav */}
        <nav aria-label="Primary" className="nv-links">
          <div
            className="nv-item"
            onMouseEnter={() => setOpen("Products")}
            onMouseLeave={() => setOpen(null)}
          >
            <button
              type="button"
              aria-expanded={open === "Products"}
              aria-haspopup="true"
              className={`${linkCls(productActive)} nv-trigger`}
              onClick={() => setOpen((o) => (o === "Products" ? null : "Products"))}
            >
              Products <Chevron open={open === "Products"} />
            </button>
            {open === "Products" && (
              <div className="nv-pop nv-pop-wide">
                <div className="nv-pop-inner">
                  {PRODUCTS.map((p) => (
                    <Link key={p.slug} href={`/products/${p.slug}`} className="nv-pop-row" onClick={() => setOpen(null)}>
                      <span className="nv-pop-ic"><LogoMark size={28} /></span>
                      <span className="nv-pop-text">
                        <span className="nv-pop-title">{p.name}</span>
                        <span className="nv-pop-desc">{p.tagline}</span>
                      </span>
                    </Link>
                  ))}
                  <Link href="/products" className="nv-pop-all" onClick={() => setOpen(null)}>
                    View all products →
                  </Link>
                </div>
              </div>
            )}
          </div>

          <Link href="/docs" aria-current={isActive("/docs") ? "page" : undefined} className={linkCls(isActive("/docs"))}>Docs</Link>

          <div
            className="nv-item"
            onMouseEnter={() => setOpen("Company")}
            onMouseLeave={() => setOpen(null)}
          >
            <button
              type="button"
              aria-expanded={open === "Company"}
              aria-haspopup="true"
              className={`${linkCls(companyActive)} nv-trigger`}
              onClick={() => setOpen((o) => (o === "Company" ? null : "Company"))}
            >
              Company <Chevron open={open === "Company"} />
            </button>
            {open === "Company" && (
              <div className="nv-pop">
                <div className="nv-pop-inner">
                  {COMPANY.map((c) => (
                    <Link key={c.href} href={c.href} className="nv-pop-row" onClick={() => setOpen(null)}>
                      <span className="nv-pop-text">
                        <span className="nv-pop-title">{c.label}</span>
                        <span className="nv-pop-desc">{c.desc}</span>
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Right actions */}
        <div className="nv-right">
          <Link href="/products" className="nv-cta">Try Now</Link>
          <button
            type="button"
            className="nv-burger"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <span style={{ transform: span0 }} />
            <span style={{ opacity: menuOpen ? 0 : 1 }} />
            <span style={{ transform: span2 }} />
          </button>
        </div>
      </div>

      {/* Mobile menu — floating pill */}
      {menuOpen && (
        <div className="nv-mobile">
          <div className="nv-mobile-group">
            <div className="nv-mobile-label">Products</div>
            {PRODUCTS.map((p) => (
              <Link key={p.slug} href={`/products/${p.slug}`} className="nv-mobile-link">{p.name}</Link>
            ))}
            <Link href="/products" className="nv-mobile-link">All products</Link>
          </div>
          <div className="nv-mobile-group">
            <Link href="/docs" className="nv-mobile-link nv-mobile-top">Docs</Link>
          </div>
          <div className="nv-mobile-group">
            <div className="nv-mobile-label">Company</div>
            {COMPANY.map((c) => (
              <Link key={c.href} href={c.href} className="nv-mobile-link">{c.label}</Link>
            ))}
          </div>
          <Link href="/contact" className="nv-cta nv-cta-block">Try Now</Link>
        </div>
      )}
    </header>
  );
}
