"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Github, ArrowUpRight, KeyRound, Copy, Check, Download } from "lucide-react";
import { useI18n } from "@/components/i18n";

export function Contact() {
  const { t } = useI18n();
  const [copied, setCopied] = useState<"github" | "pgp" | null>(null);

  const github = {
    url: "https://github.com/yukhyShell5",
    handle: "@yukhyShell5",
  };

  const pgp = {
    keyId: "B2F6030784F7ABEB",
    fingerprint: "2540E85B130F0F1591B8837CB2F6030784F7ABEB",
    email: "zoulou.azerty33@gmail.com",
    file: "/pgp.asc",
  };

  const formattedFingerprint = pgp.fingerprint.match(/.{1,4}/g)?.join(" ") ?? pgp.fingerprint;

  const copy = async (value: string, which: "github" | "pgp") => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(which);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      // Clipboard unavailable (e.g. non-secure context), ignore.
    }
  };

  return (
    <section id="contact" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 font-mono"
        >
          <div className="flex items-center gap-3 mb-2">
            <span className="text-primary text-sm">04</span>
            <span className="text-2xl font-bold">
              <span className="text-primary">#</span> {t("section.contact")}
            </span>
          </div>
          <p className="text-muted-foreground text-sm">
            <span className="text-term-muted">$</span> echo &quot;{t("contact.subtitle")}&quot;
          </p>
        </motion.div>

        <div className="flex flex-col md:flex-row justify-center gap-6">
          {/* GitHub */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex-1 max-w-xl rounded border border-border bg-card p-6 font-mono"
          >
            <div className="flex items-center gap-2 mb-3">
              <Github className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">GitHub</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary ml-auto">
                {t("contact.github.desc")}
              </span>
            </div>

            <div className="flex items-center gap-2 mb-1 text-xs text-term-dim">
              <span>{github.handle}</span>
              <span className="text-term-muted">·</span>
              <span className="truncate">github.com/yukhyShell5</span>
            </div>

            <div className="flex items-center gap-2 mb-4">
              <code className="text-xs text-term-muted break-all leading-relaxed">{github.url}</code>
              <button
                type="button"
                onClick={() => copy(github.url, "github")}
                aria-label={t("contact.copy")}
                className="shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded border border-border text-xs text-term-muted hover:border-primary/50 hover:text-primary transition-colors"
              >
                {copied === "github" ? (
                  <>
                    <Check className="w-3.5 h-3.5" /> {t("contact.copied")}
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" /> {t("contact.copy")}
                  </>
                )}
              </button>
            </div>

            <a
              href={github.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded border border-border text-sm text-term-muted hover:border-primary/50 hover:text-primary transition-colors"
            >
              <ArrowUpRight className="w-3.5 h-3.5" />
              {t("contact.github.visit")}
            </a>
          </motion.div>

          {/* PGP */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="flex-1 max-w-xl rounded border border-border bg-card p-6 font-mono"
          >
            <div className="flex items-center gap-2 mb-3">
              <KeyRound className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">{t("contact.pgp")}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary ml-auto">
                {t("contact.pgp.desc")}
              </span>
            </div>

            <div className="flex items-center gap-2 mb-1 text-xs text-term-dim">
              <span>{pgp.keyId}</span>
              <span className="text-term-muted">·</span>
              <span className="truncate">{pgp.email}</span>
            </div>

            <div className="flex items-center gap-2 mb-4">
              <code className="text-xs text-term-muted break-all leading-relaxed">
                {formattedFingerprint}
              </code>
              <button
                type="button"
                onClick={() => copy(pgp.fingerprint, "pgp")}
                aria-label={t("contact.copy")}
                className="shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded border border-border text-xs text-term-muted hover:border-primary/50 hover:text-primary transition-colors"
              >
                {copied === "pgp" ? (
                  <>
                    <Check className="w-3.5 h-3.5" /> {t("contact.copied")}
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" /> {t("contact.copy")}
                  </>
                )}
              </button>
            </div>

            <a
              href={pgp.file}
              download
              className="inline-flex items-center gap-2 px-4 py-2 rounded border border-border text-sm text-term-muted hover:border-primary/50 hover:text-primary transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              {t("contact.pgp.download")}
            </a>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-24 pt-8 border-t border-border text-center text-sm text-muted-foreground font-mono"
        >
          <p>
            <span className="text-term-muted">#</span> © {new Date().getFullYear()} yukhyShell5.{" "}
            {t("contact.footer")}{" "}
            <a
              href="https://nextjs.org"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors text-primary"
            >
              Next.js
            </a>{" "}
            +{" "}
            <a
              href="https://ui.shadcn.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors text-primary"
            >
              shadcn/ui
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
