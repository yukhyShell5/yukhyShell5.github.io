"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, Menu, X, ChevronDown, BookOpen, Shield, Gamepad2, Lock, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProjectLink {
  href: string;
  label: string;
  icon: React.ElementType;
  description: string;
  status?: "coming-soon";
}

const projectLinks: ProjectLink[] = [
  { 
    href: "/logs-anonymizer", 
    label: "Logs Anonymizer", 
    icon: Shield,
    description: "Anonymize sensitive data in logs"
  },
  { 
    href: "/chess-learn", 
    label: "Chess Learn", 
    icon: Gamepad2,
    description: "Interactive chess study platform"
  },
  { 
    href: "/crackstation", 
    label: "Crackstation", 
    icon: Lock,
    description: "Password security toolkit",
    status: "coming-soon"
  },
  { 
    href: "/wiki", 
    label: "Wiki", 
    icon: BookOpen,
    description: "Articles & research notes",
    status: "coming-soon"
  },
];

const navItems = [
  { href: "#about", label: "About" },
  { href: "#playground", label: "Playground" },
  { href: "#contact", label: "Contact" },
];

export function Nav() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [projectsOpen, setProjectsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProjectsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/80 backdrop-blur-lg border-b border-border"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-mono font-semibold">
          <Terminal className="w-5 h-5 text-primary" />
          <span>yukhyShell5</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {item.label}
            </Link>
          ))}
          
          {/* Projects Dropdown */}
          <div ref={dropdownRef} className="relative">
            <button
              onClick={() => setProjectsOpen(!projectsOpen)}
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Projects
              <ChevronDown className={`w-4 h-4 transition-transform ${projectsOpen ? "rotate-180" : ""}`} />
            </button>

            <AnimatePresence>
              {projectsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full right-0 mt-2 w-64 p-2 rounded-lg border border-border bg-card/95 backdrop-blur-lg shadow-lg"
                >
                  {projectLinks.map((project) => (
                    <Link
                      key={project.href}
                      href={project.status === "coming-soon" ? "#" : project.href}
                      onClick={() => setProjectsOpen(false)}
                      className={`flex items-start gap-3 p-3 rounded-md transition-colors ${
                        project.status === "coming-soon" 
                          ? "opacity-50 cursor-default" 
                          : "hover:bg-accent"
                      }`}
                    >
                      <project.icon className="w-5 h-5 text-primary mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{project.label}</span>
                          {project.status === "coming-soon" && (
                            <span className="text-xs px-1.5 py-0.5 rounded bg-primary/10 text-primary">
                              Soon
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground truncate">
                          {project.description}
                        </p>
                      </div>
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="text-xs text-muted-foreground border border-border rounded px-2 py-1">
            <kbd>⌘</kbd> + <kbd>K</kbd>
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background/95 backdrop-blur-lg border-b border-border overflow-hidden"
          >
            <div className="px-6 py-4 flex flex-col gap-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              
              {/* Projects Section Mobile */}
              <div className="border-t border-border pt-4 mt-2">
                <span className="text-xs uppercase tracking-wider text-muted-foreground mb-3 block">
                  Projects
                </span>
                <div className="space-y-3">
                  {projectLinks.map((project) => (
                    <Link
                      key={project.href}
                      href={project.status === "coming-soon" ? "#" : project.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 ${
                        project.status === "coming-soon" 
                          ? "opacity-50 cursor-default" 
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <project.icon className="w-4 h-4 text-primary" />
                      <span>{project.label}</span>
                      {project.status === "coming-soon" && (
                        <span className="text-xs px-1.5 py-0.5 rounded bg-primary/10 text-primary ml-auto">
                          Soon
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
