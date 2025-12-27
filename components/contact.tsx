"use client";

import { motion } from "framer-motion";
import { Github, Twitter, Mail, ArrowUpRight } from "lucide-react";

const socials = [
  {
    name: "GitHub",
    icon: Github,
    url: "https://github.com/yukhyShell5",
    handle: "@yukhyShell5",
  },
  {
    name: "Twitter",
    icon: Twitter,
    url: "https://twitter.com/",
    handle: "@handle",
  },
  {
    name: "Email",
    icon: Mail,
    url: "mailto:contact@example.com",
    handle: "contact@example.com",
  },
];

export function Contact() {
  return (
    <section id="contact" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl font-bold mb-2">Get in Touch</h2>
          <p className="text-muted-foreground">
            Interested in collaboration or have a security concern? Reach out.
          </p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-6">
          {socials.map((social, idx) => (
            <motion.a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group flex items-center gap-4 px-6 py-4 rounded-lg border border-border bg-card hover:border-primary/50 transition-colors"
            >
              <social.icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              <div className="text-left">
                <div className="font-medium">{social.name}</div>
                <div className="text-sm text-muted-foreground">{social.handle}</div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors ml-2" />
            </motion.a>
          ))}
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-24 pt-8 border-t border-border text-center text-sm text-muted-foreground"
        >
          <p>
            © {new Date().getFullYear()} yukhyShell5. Built with{" "}
            <a
              href="https://nextjs.org"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              Next.js
            </a>{" "}
            and{" "}
            <a
              href="https://ui.shadcn.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              shadcn/ui
            </a>
            .
          </p>
        </motion.div>
      </div>
    </section>
  );
}
