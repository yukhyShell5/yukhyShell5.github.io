"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  User,
  Bug,
  Mail,
  Github,
  ExternalLink,
  Shield,
  Gamepad2,
  Lock,
  BookOpen,
  KeyRound,
} from "lucide-react";
import { useI18n } from "@/components/i18n";

interface PaletteItem {
  icon: React.ElementType;
  label: string;
  action: "scroll" | "navigate" | "link";
  target: string;
  disabled?: boolean;
}

interface PaletteGroup {
  group: string;
  items: PaletteItem[];
}

export function CommandPalette() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const commands: PaletteGroup[] = [
    {
      group: t("cmd.navigation"),
      items: [
        { icon: User, label: t("nav.about"), action: "scroll", target: "#about" },
        { icon: Bug, label: t("nav.playground"), action: "scroll", target: "#playground" },
        { icon: Mail, label: t("nav.contact"), action: "scroll", target: "#contact" },
      ],
    },
    {
      group: t("cmd.projects"),
      items: [
        { icon: Shield, label: t("nav.project.logs"), action: "navigate", target: "/logs-anonymizer" },
        { icon: Gamepad2, label: t("nav.project.chess"), action: "navigate", target: "/chess-learn" },
        { icon: Lock, label: t("nav.project.crackstation"), action: "navigate", target: "/crackstation", disabled: true },
        { icon: BookOpen, label: t("nav.project.wiki"), action: "navigate", target: "/wiki" },
      ],
    },
    {
      group: t("cmd.links"),
      items: [
        { icon: Github, label: "GitHub", action: "link", target: "https://github.com/yukhyShell5" },
        { icon: KeyRound, label: t("contact.pgp"), action: "link", target: "/pgp.asc" },
      ],
    },
  ];

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleSelect = (action: string, target: string, disabled?: boolean) => {
    if (disabled) return;
    setOpen(false);
    if (action === "scroll") {
      const element = document.querySelector(target);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else if (action === "link") {
      window.open(target, "_blank");
    } else if (action === "navigate") {
      router.push(target);
    }
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder={t("cmd.placeholder")} />
      <CommandList>
        <CommandEmpty>{t("cmd.empty")}</CommandEmpty>
        {commands.map((group, idx) => (
          <div key={group.group}>
            <CommandGroup heading={group.group}>
              {group.items.map((item) => (
                <CommandItem
                  key={item.label}
                  onSelect={() => handleSelect(item.action, item.target, item.disabled)}
                  className={`flex items-center gap-3 cursor-pointer font-mono ${
                    item.disabled ? "opacity-50" : ""
                  }`}
                  disabled={item.disabled}
                >
                  <item.icon className="w-4 h-4 text-muted-foreground" />
                  <span>{item.label}</span>
                  {item.disabled && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary ml-auto">
                      {t("cmd.soon")}
                    </span>
                  )}
                  {item.action === "link" && (
                    <ExternalLink className="w-3 h-3 ml-auto text-muted-foreground" />
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
            {idx < commands.length - 1 && <CommandSeparator />}
          </div>
        ))}
      </CommandList>
    </CommandDialog>
  );
}
