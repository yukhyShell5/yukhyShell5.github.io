"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Github } from "lucide-react";
import { useI18n, type Lang } from "@/components/i18n";

function LangToggle() {
  const { lang, setLang } = useI18n();
  const toggle = (l: Lang) => setLang(l);

  return (
    <div className="flex items-center border border-border font-mono text-[10px] uppercase tracking-[0.16em]">
      <button
        onClick={() => toggle("fr")}
        className={`cursor-pointer px-2.5 py-[7px] transition-colors ${
          lang === "fr"
            ? "bg-foreground text-background"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        fr
      </button>
      <button
        onClick={() => toggle("en")}
        className={`cursor-pointer px-2.5 py-[7px] transition-colors ${
          lang === "en"
            ? "bg-foreground text-background"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        en
      </button>
    </div>
  );
}

export function Nav() {
  const { t } = useI18n();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/#about", label: t("nav.about") },
    { href: "/#playground", label: t("nav.playground") },
    { href: "/#projects", label: t("nav.projects") },
    { href: "/wiki", label: t("nav.wiki") },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 border-b border-input transition-all duration-300 ${
        isScrolled ? "bg-background/90 backdrop-blur-lg" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-[60px] w-full max-w-[1600px] items-center gap-4 md:gap-8 px-4 md:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 text-foreground transition-colors hover:text-primary min-w-0 shrink-0"
        >
          <span className="font-mono text-xl leading-none text-primary">❯</span>
          <span className="font-mono text-xl font-bold tracking-tighter truncate">
            yukhyShell5
          </span>
        </Link>

        <div className="flex-1" />

        {/* Desktop nav */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-mono text-[11.5px] uppercase tracking-[0.07em] text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}

          <a
            href="https://github.com/yukhyShell5"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="inline-flex h-[30px] w-[30px] items-center justify-center border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
          >
            <Github className="h-3.5 w-3.5" />
          </a>

          <LangToggle />

          <Link
            href="/#contact"
            className="border border-border px-[15px] py-[7px] font-mono text-[11.5px] uppercase tracking-[0.07em] text-foreground transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground"
          >
            {t("nav.contact")}
          </Link>
        </div>

        {/* Mobile toggle */}
        <div className="flex items-center gap-3 md:hidden">
          <LangToggle />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label="Menu"
            className="flex h-[30px] w-[30px] flex-col items-center justify-center gap-1 border border-border text-muted-foreground"
          >
            <span
              className={`block h-px w-3.5 bg-current transition-transform ${
                mobileMenuOpen ? "translate-y-[3px] rotate-45" : ""
              }`}
            />
            <span
              className={`block h-px w-3.5 bg-current transition-opacity ${
                mobileMenuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block h-px w-3.5 bg-current transition-transform ${
                mobileMenuOpen ? "-translate-y-[3px] -rotate-45" : ""
              }`}
            />
          </button>
        </div>
      </nav>

      {/* Mobile sheet */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-b border-border bg-background/95 backdrop-blur-lg md:hidden"
          >
            <div className="flex flex-col px-6 font-mono">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="border-b border-border py-4 text-xs uppercase tracking-[0.07em] text-foreground"
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex items-center justify-between py-4">
                <a
                  href="https://github.com/yukhyShell5"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-[30px] w-[30px] items-center justify-center border border-border text-muted-foreground"
                >
                  <Github className="h-3.5 w-3.5" />
                </a>
                <Link
                  href="/#contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="border border-border px-[15px] py-[7px] text-xs uppercase tracking-[0.07em] text-foreground"
                >
                  {t("nav.contact")}
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
