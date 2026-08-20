"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { ChevronDown, Shield, Code, Search } from "lucide-react";
import { useI18n } from "@/components/i18n";

// Typed terminal session: commands are typed char by char, outputs appear instantly
interface TermLine {
  kind: "cmd" | "out" | "out-muted" | "out-green" | "out-blue" | "out-yellow";
  text: string;
}

function TerminalSession() {
  const { t } = useI18n();

  const commands = useMemo(
    () => [
      { cmd: t("hero.cmd.whoami"), output: [{ kind: "out" as const, text: "yukhyShell5" }] },
      {
        cmd: t("hero.cmd.cat"),
        output: [{ kind: "out-green" as const, text: t("hero.cmd.profil") }],
      },
      {
        cmd: t("hero.cmd.ls"),
        output: [{ kind: "out-blue" as const, text: t("hero.cmd.stack") }],
      },
      {
        cmd: t("hero.cmd.stats"),
        output: [
          { kind: "out-muted" as const, text: "  audits: 20+    cves: 5+    bounties: 10+    exp: 3+ yrs" },
        ],
      },
    ],
    [t]
  );

  // Build a flat timeline: each command gets a typing phase then its output(s)
  type TimelineItem =
    | { type: "cmd"; cmd: string }
    | { type: "out"; line: TermLine };
  const timeline: TimelineItem[] = useMemo(
    () =>
      commands.flatMap<TimelineItem>((c) => [
        { type: "cmd", cmd: c.cmd },
        ...c.output.map<TimelineItem>((line) => ({ type: "out", line })),
      ]),
    [commands]
  );

  const [timelineIdx, setTimelineIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);

  useEffect(() => {
    if (timelineIdx >= timeline.length) return;
    const item = timeline[timelineIdx];

    if (item.type === "cmd") {
      if (charIdx < item.cmd.length) {
        const timeout = setTimeout(() => setCharIdx((c) => c + 1), 28);
        return () => clearTimeout(timeout);
      }
      const timeout = setTimeout(() => {
        setTimelineIdx((i) => i + 1);
        setCharIdx(0);
      }, 220);
      return () => clearTimeout(timeout);
    }

    // output: show instantly, move on
    const timeout = setTimeout(() => {
      setTimelineIdx((i) => i + 1);
      setCharIdx(0);
    }, 160);
    return () => clearTimeout(timeout);
  }, [timelineIdx, charIdx, timeline]);

  return (
    <div className="border border-border rounded bg-card overflow-hidden shadow-[0_0_60px_rgba(203,166,247,0.06)] text-left">
      {/* Terminal header */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border bg-[#1e1e22]">
        <div className="w-3 h-3 rounded-full bg-[#f38ba8]/80" />
        <div className="w-3 h-3 rounded-full bg-[#f9e2af]/80" />
        <div className="w-3 h-3 rounded-full bg-[#a6e3a1]/80" />
        <span className="ml-2 text-xs text-term-muted font-mono">
          {t("hero.terminal.title")}
        </span>
        <span className="ml-auto text-[10px] text-term-muted font-mono">bash</span>
      </div>

      {/* Terminal body */}
      <div className="p-4 sm:p-5 font-mono text-[13px] leading-6 min-h-[280px]">
        {/* Commands already completed */}
        {timeline.slice(0, timelineIdx).map((item, i) => {
          if (item.type === "out") {
            const cls =
              item.line.kind === "out-green"
                ? "text-term-cmd"
                : item.line.kind === "out-blue"
                  ? "text-term-prompt"
                  : item.line.kind === "out-muted"
                    ? "text-term-dim"
                    : "text-foreground";
            return (
              <div key={i} className={cls}>
                {item.line.text}
              </div>
            );
          }
          return (
            <div key={i} className="text-foreground">
              <span className="text-term-prompt">❯ </span>
              {item.cmd}
            </div>
          );
        })}

        {/* Current command being typed */}
        {timeline[timelineIdx]?.type === "cmd" && (
          <div className="text-foreground">
            <span className="text-term-prompt">❯ </span>
            {timeline[timelineIdx].cmd.slice(0, charIdx)}
            <span className="term-cursor" />
          </div>
        )}

        {/* Final idle prompt */}
        {timelineIdx >= timeline.length && (
          <div className="text-foreground">
            <span className="text-term-prompt">❯ </span>
            <span className="term-cursor" />
          </div>
        )}
      </div>
    </div>
  );
}

function StatusBar() {
  const { t } = useI18n();
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex items-center gap-3 font-mono text-sm mb-8"
    >
      <span className="relative flex h-2.5 w-2.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-60" />
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-success" />
      </span>
      <span className="text-foreground">yukhyShell5</span>
      <span className="text-term-dim">working ·</span>
      <span className="text-term-cmd">{t("hero.role")}</span>
      <span className="hidden sm:inline text-term-muted">
        · {t("hero.status")}
      </span>
    </motion.div>
  );
}

function StatsRow() {
  const { t } = useI18n();
  const stats = [
    { value: "20+", label: t("hero.stat.audits") },
    { value: "5+", label: t("hero.stat.cves") },
    { value: "10+", label: t("hero.stat.bounties") },
    { value: "3+", label: t("hero.stat.years") },
  ];
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 font-mono text-sm"
    >
      {stats.map((s) => (
        <div key={s.label} className="flex items-baseline gap-2">
          <span className="text-lg font-semibold text-foreground">{s.value}</span>
          <span className="text-term-muted text-xs">{s.label}</span>
        </div>
      ))}
    </motion.div>
  );
}

function BadgeRow() {
  const { t } = useI18n();
  const badges = [
    { icon: Shield, label: t("hero.badge.audits") },
    { icon: Code, label: t("hero.badge.evm") },
    { icon: Search, label: t("hero.badge.research") },
  ];
  return (
    <div className="flex flex-wrap justify-center gap-3">
      {badges.map((b, i) => (
        <motion.div
          key={b.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 + i * 0.1 }}
          className="flex items-center gap-2 px-3 py-1.5 rounded border border-border bg-card/60 font-mono text-xs text-muted-foreground"
        >
          <b.icon className="w-3.5 h-3.5 text-primary" />
          {b.label}
        </motion.div>
      ))}
    </div>
  );
}

export function Hero() {
  const { t } = useI18n();

  return (
    <section className="min-h-screen flex flex-col items-center justify-center relative px-6 pt-24 pb-16 overflow-hidden">
      {/* Background grid + vignette */}
      <div className="absolute inset-0 bg-grid" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(23,23,26,0.7)_100%)]" />

      <div className="w-full max-w-3xl z-10">
        <StatusBar />

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-4xl sm:text-6xl font-bold mb-4 font-mono tracking-tight"
        >
          <span className="text-primary">~/</span>
          yukhyShell5
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-base sm:text-lg text-muted-foreground mb-10 max-w-2xl leading-relaxed font-mono"
        >
          {t("hero.subtitle")}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mb-10"
        >
          <TerminalSession />
        </motion.div>

        <StatsRow />

        <div className="mt-10 mb-16">
          <BadgeRow />
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.5 }}
          className="flex justify-center"
        >
          <a
            href="#about"
            className="group inline-flex flex-col items-center gap-2 text-muted-foreground hover:text-foreground transition-colors font-mono"
          >
            <span className="text-xs">{t("hero.discover")}</span>
            <motion.div
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <ChevronDown className="w-4 h-4" />
            </motion.div>
          </a>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  );
}
