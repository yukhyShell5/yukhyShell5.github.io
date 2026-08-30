"use client";

import { motion } from "framer-motion";
import { useI18n, type TranslationKey } from "@/components/i18n";

interface Skill {
  name: string;
  levelKey?: TranslationKey;
}

export function EvmDebugger() {
  const { t } = useI18n();

  const stackData: Skill[] = [
    { name: "Solidity", levelKey: "about.level.advanced" },
    { name: "Vyper", levelKey: "about.level.intermediate" },
    { name: "Yul / Assembly", levelKey: "about.level.advanced" },
    { name: "Foundry", levelKey: "about.level.advanced" },
    { name: "Hardhat", levelKey: "about.level.advanced" },
  ];

  const memoryData: Skill[] = [
    { name: "Smart Contract Audits" },
    { name: "DeFi Protocol Security" },
    { name: "MEV / Flashloan Attacks" },
    { name: "Oracle Manipulation" },
    { name: "Access Control Analysis" },
  ];

  const storageData = [
    { slot: "0", key: t("about.exp"), value: "3+ years" },
    { slot: "1", key: t("about.audits"), value: "20+" },
    { slot: "2", key: t("about.cves"), value: "5+" },
    { slot: "3", key: t("about.bounties"), value: "10+" },
  ];

  return (
    <section id="about" className="py-24 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 font-mono break-words"
        >
          <div className="flex items-center gap-3 mb-2">
            <span className="text-primary text-sm shrink-0">01</span>
            <span className="text-xl sm:text-2xl font-bold">
              <span className="text-primary">#</span> {t("section.about")}
            </span>
          </div>
          <p className="text-muted-foreground text-sm">
            <span className="text-term-muted">$</span> {t("about.subtitle")}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="border border-border rounded bg-card overflow-hidden font-mono text-sm"
        >
          {/* Header */}
          <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border bg-[#1e1e22]">
            <div className="w-3 h-3 rounded-full bg-[#f38ba8]/80 shrink-0" />
            <div className="w-3 h-3 rounded-full bg-[#f9e2af]/80 shrink-0" />
            <div className="w-3 h-3 rounded-full bg-[#a6e3a1]/80 shrink-0" />
            <span className="ml-2 text-xs text-term-muted truncate">evm-debugger.sol</span>
            <span className="ml-auto text-[10px] text-term-muted shrink-0">0x01</span>
          </div>

          {/* Content Grid */}
          <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border">
            {/* Stack */}
            <div className="p-4">
              <div className="text-xs text-term-muted uppercase tracking-wider mb-4">
                <span className="text-term-prompt">stack</span>
              </div>
              <div className="space-y-2">
                {stackData.map((item, idx) => (
                  <div key={item.name} className="flex items-center justify-between gap-2">
                    <span className="text-term-dim">[{idx}]</span>
                    <span className="text-foreground flex-1 ml-1">{item.name}</span>
                    <span className="text-xs text-term-cmd">{item.levelKey ? t(item.levelKey) : ""}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Memory */}
            <div className="p-4">
              <div className="text-xs text-term-muted uppercase tracking-wider mb-4">
                <span className="text-term-prompt">memory</span>
              </div>
              <div className="space-y-2">
                {memoryData.map((item, idx) => (
                  <div key={item.name} className="flex items-start gap-2">
                    <span className="text-term-muted text-xs">
                      0x{(idx * 32).toString(16).padStart(2, "0")}:
                    </span>
                    <span className="text-foreground text-xs">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Storage */}
            <div className="p-4">
              <div className="text-xs text-term-muted uppercase tracking-wider mb-4">
                <span className="text-term-prompt">storage</span>
              </div>
              <div className="space-y-2">
                {storageData.map((item) => (
                  <div key={item.slot} className="flex items-center justify-between text-xs">
                    <span className="text-term-muted">slot {item.slot}</span>
                    <span className="text-term-dim">{item.key}</span>
                    <span className="text-term-cmd">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Calldata */}
          <div className="border-t border-border p-4">
            <div className="text-xs text-term-muted uppercase tracking-wider mb-2">
              <span className="text-term-prompt">calldata</span>
            </div>
            <div className="text-xs text-term-dim break-all">
              <span className="text-term-cmd">0x:</span> {t("about.calldata.text")}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
