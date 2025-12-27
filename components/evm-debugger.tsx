"use client";

import { motion } from "framer-motion";

interface Skill {
  name: string;
  level?: string;
}

const stackData: Skill[] = [
  { name: "Solidity", level: "Advanced" },
  { name: "Vyper", level: "Intermediate" },
  { name: "Yul / Assembly", level: "Advanced" },
  { name: "Foundry", level: "Advanced" },
  { name: "Hardhat", level: "Advanced" },
];

const memoryData: Skill[] = [
  { name: "Smart Contract Audits" },
  { name: "DeFi Protocol Security" },
  { name: "MEV / Flashloan Attacks" },
  { name: "Oracle Manipulation" },
  { name: "Access Control Analysis" },
];

const storageData = [
  { slot: "0", key: "Experience", value: "3+ years" },
  { slot: "1", key: "Audits", value: "20+" },
  { slot: "2", key: "CVEs", value: "5+" },
  { slot: "3", key: "Bug Bounties", value: "10+" },
];

export function EvmDebugger() {
  return (
    <section id="about" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold mb-2">About</h2>
          <p className="text-muted-foreground">Skills & experience in EVM debugger format</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="border border-border rounded-lg bg-card/50 backdrop-blur-sm overflow-hidden font-mono text-sm"
        >
          {/* Header */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-card/50">
            <div className="w-3 h-3 rounded-full bg-critical/50" />
            <div className="w-3 h-3 rounded-full bg-warning/50" />
            <div className="w-3 h-3 rounded-full bg-success/50" />
            <span className="ml-2 text-muted-foreground">evm-debugger.sol</span>
          </div>

          {/* Content Grid */}
          <div className="grid md:grid-cols-3 divide-x divide-border">
            {/* Stack */}
            <div className="p-4">
              <div className="text-xs text-muted-foreground uppercase tracking-wider mb-4">Stack</div>
              <div className="space-y-2">
                {stackData.map((item, idx) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <span className="text-muted-foreground">[{idx}]</span>
                    <span className="text-foreground">{item.name}</span>
                    <span className="text-xs text-primary">{item.level}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Memory */}
            <div className="p-4">
              <div className="text-xs text-muted-foreground uppercase tracking-wider mb-4">Memory</div>
              <div className="space-y-2">
                {memoryData.map((item, idx) => (
                  <div key={item.name} className="flex items-start gap-2">
                    <span className="text-muted-foreground text-xs">0x{(idx * 32).toString(16).padStart(2, '0')}:</span>
                    <span className="text-foreground text-xs">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Storage */}
            <div className="p-4">
              <div className="text-xs text-muted-foreground uppercase tracking-wider mb-4">Storage</div>
              <div className="space-y-2">
                {storageData.map((item) => (
                  <div key={item.slot} className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">slot {item.slot}</span>
                    <span className="text-muted-foreground">{item.key}</span>
                    <span className="text-success">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Calldata */}
          <div className="border-t border-border p-4">
            <div className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Calldata</div>
            <div className="text-xs text-muted-foreground break-all">
              <span className="text-primary">0x:</span>{" "}
              researcher@web3security | github.com/yukhyShell5 | EVM specialist
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
