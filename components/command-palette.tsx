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
  Twitter,
  ExternalLink,
  Shield,
  Gamepad2,
  Lock,
  BookOpen,
} from "lucide-react";

const commands = [
  {
    group: "Navigation",
    items: [
      { icon: User, label: "About", action: "scroll", target: "#about" },
      { icon: Bug, label: "Playground", action: "scroll", target: "#playground" },
      { icon: Mail, label: "Contact", action: "scroll", target: "#contact" },
    ],
  },
  {
    group: "Projects",
    items: [
      { icon: Shield, label: "Logs Anonymizer", action: "navigate", target: "/logs-anonymizer" },
      { icon: Gamepad2, label: "Chess Learn", action: "navigate", target: "/chess-learn" },
      { icon: Lock, label: "Crackstation", action: "navigate", target: "/crackstation", disabled: true },
      { icon: BookOpen, label: "Wiki", action: "navigate", target: "/wiki", disabled: true },
    ],
  },
  {
    group: "Links",
    items: [
      { icon: Github, label: "GitHub", action: "link", target: "https://github.com/yukhyShell5" },
      { icon: Twitter, label: "Twitter", action: "link", target: "https://twitter.com/" },
    ],
  },
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

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
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        {commands.map((group, idx) => (
          <div key={group.group}>
            <CommandGroup heading={group.group}>
              {group.items.map((item) => (
                <CommandItem
                  key={item.label}
                  onSelect={() => handleSelect(item.action, item.target, (item as any).disabled)}
                  className={`flex items-center gap-3 cursor-pointer ${
                    (item as any).disabled ? "opacity-50" : ""
                  }`}
                  disabled={(item as any).disabled}
                >
                  <item.icon className="w-4 h-4 text-muted-foreground" />
                  <span>{item.label}</span>
                  {(item as any).disabled && (
                    <span className="text-xs px-1.5 py-0.5 rounded bg-primary/10 text-primary ml-auto">
                      Soon
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
