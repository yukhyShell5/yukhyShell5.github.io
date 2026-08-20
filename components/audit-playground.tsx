"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, EyeOff, ChevronRight, AlertTriangle, CheckCircle } from "lucide-react";
import { useI18n, type TranslationKey } from "@/components/i18n";

interface Vulnerability {
  id: string;
  titleKey: TranslationKey;
  severity: "critical" | "high" | "medium" | "low";
  categoryKey: TranslationKey;
  code: string[];
  vulnerableLine: number;
  hintKey: TranslationKey;
  explanationKey: TranslationKey;
  pocKey?: TranslationKey;
}

const vulnerabilities: Vulnerability[] = [
  {
    id: "reentrancy-1",
    titleKey: "playground.v1.title",
    severity: "critical",
    categoryKey: "playground.v1.category",
    code: [
      "contract Vulnerable {",
      "    mapping(address => uint) public balances;",
      "",
      "    function withdraw() public {",
      "        uint amount = balances[msg.sender];",
      "        (bool success,) = msg.sender.call{value: amount}(\"\");",
      "        require(success);",
      "        balances[msg.sender] = 0;",
      "    }",
      "}",
    ],
    vulnerableLine: 5,
    hintKey: "playground.v1.hint",
    explanationKey: "playground.v1.explanation",
    pocKey: "playground.v1.poc",
  },
  {
    id: "access-control-1",
    titleKey: "playground.v2.title",
    severity: "high",
    categoryKey: "playground.v2.category",
    code: [
      "contract Vault {",
      "    address public owner;",
      "    ",
      "    function setOwner(address _owner) public {",
      "        owner = _owner;",
      "    }",
      "",
      "    function withdraw() public {",
      "        require(msg.sender == owner);",
      "        // ... withdraw logic",
      "    }",
      "}",
    ],
    vulnerableLine: 3,
    hintKey: "playground.v2.hint",
    explanationKey: "playground.v2.explanation",
  },
  {
    id: "oracle-1",
    titleKey: "playground.v3.title",
    severity: "critical",
    categoryKey: "playground.v3.category",
    code: [
      "contract Lending {",
      "    IUniswapV2Pair public pair;",
      "",
      "    function getPrice() public view returns (uint) {",
      "        (uint r0, uint r1,) = pair.getReserves();",
      "        return r0 * 1e18 / r1;",
      "    }",
      "",
      "    function liquidate(address user) public {",
      "        uint price = getPrice();",
      "        // ... use price for liquidation",
      "    }",
      "}",
    ],
    vulnerableLine: 4,
    hintKey: "playground.v3.hint",
    explanationKey: "playground.v3.explanation",
    pocKey: "playground.v3.poc",
  },
];

const severityStyles = {
  critical: { dot: "bg-[#f38ba8]", cls: "text-[#f38ba8] border-[#f38ba8]/30 bg-[#f38ba8]/10" },
  high: { dot: "bg-[#f9e2af]", cls: "text-[#f9e2af] border-[#f9e2af]/30 bg-[#f9e2af]/10" },
  medium: { dot: "bg-[#cba6f7]", cls: "text-[#cba6f7] border-[#cba6f7]/30 bg-[#cba6f7]/10" },
  low: { dot: "bg-[#a6e3a1]", cls: "text-[#a6e3a1] border-[#a6e3a1]/30 bg-[#a6e3a1]/10" },
};

export function AuditPlayground() {
  const { t } = useI18n();
  const [selectedVuln, setSelectedVuln] = useState<Vulnerability>(vulnerabilities[0]);
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [foundLine, setFoundLine] = useState<number | null>(null);
  const [correct, setCorrect] = useState(false);

  const handleLineClick = (lineIdx: number) => {
    setFoundLine(lineIdx);
    setCorrect(lineIdx === selectedVuln.vulnerableLine);
  };

  const handleNextChallenge = () => {
    const currentIdx = vulnerabilities.findIndex((v) => v.id === selectedVuln.id);
    const nextIdx = (currentIdx + 1) % vulnerabilities.length;
    setSelectedVuln(vulnerabilities[nextIdx]);
    resetState();
  };

  const resetState = () => {
    setShowHint(false);
    setShowSolution(false);
    setFoundLine(null);
    setCorrect(false);
  };

  return (
    <section id="playground" className="py-24 px-6 bg-[#1e1e22] border-y border-border">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 font-mono"
        >
          <div className="flex items-center gap-3 mb-2">
            <span className="text-primary text-sm">02</span>
            <span className="text-2xl font-bold">
              <span className="text-primary">#</span> {t("section.playground")}
            </span>
          </div>
          <p className="text-muted-foreground text-sm">
            <span className="text-term-muted">$</span> {t("playground.subtitle")}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Vulnerability List */}
          <div className="space-y-3">
            {vulnerabilities.map((vuln) => {
              const sev = severityStyles[vuln.severity];
              return (
                <button
                  key={vuln.id}
                  onClick={() => {
                    setSelectedVuln(vuln);
                    resetState();
                  }}
                  className={`w-full text-left p-4 rounded border transition-colors font-mono cursor-pointer ${
                    selectedVuln.id === vuln.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50 bg-card"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`w-2 h-2 rounded-full ${sev.dot}`} />
                    <span className="text-xs text-muted-foreground">{t(vuln.categoryKey)}</span>
                    <span className={`ml-auto text-[10px] uppercase px-1.5 py-0.5 rounded border ${sev.cls}`}>
                      {t(`playground.severity.${vuln.severity}` as never)}
                    </span>
                  </div>
                  <span className="text-sm">{t(vuln.titleKey)}</span>
                </button>
              );
            })}
          </div>

          {/* Code Panel */}
          <div className="lg:col-span-2">
            <motion.div
              key={selectedVuln.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="border border-border rounded bg-card overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-[#1e1e22]">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-[#f38ba8]/80" />
                    <div className="w-3 h-3 rounded-full bg-[#f9e2af]/80" />
                    <div className="w-3 h-3 rounded-full bg-[#a6e3a1]/80" />
                  </div>
                  <AlertTriangle className="w-4 h-4 text-[#f9e2af] ml-2" />
                  <span className="font-mono text-sm">{t(selectedVuln.titleKey)}</span>
                </div>
                <Badge
                  variant="outline"
                  className={`font-mono ${severityStyles[selectedVuln.severity].cls}`}
                >
                  {t(`playground.severity.${selectedVuln.severity}` as never)}
                </Badge>
              </div>

              {/* Code */}
              <div className="p-4 font-mono text-sm overflow-x-auto">
                {selectedVuln.code.map((line, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleLineClick(idx)}
                    className={`code-line vulnerable px-2 py-1 rounded flex items-center gap-4 ${
                      foundLine === idx
                        ? correct
                          ? "bg-[#a6e3a1]/15"
                          : "bg-[#f38ba8]/15"
                        : ""
                    }`}
                  >
                    <span className="text-term-muted w-6 text-right select-none">
                      {idx + 1}
                    </span>
                    <span className="whitespace-pre">{line || " "}</span>
                    {foundLine === idx && (
                      <span className="ml-auto">
                        {correct ? (
                          <CheckCircle className="w-4 h-4 text-[#a6e3a1]" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-[#f38ba8]" />
                        )}
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {/* Controls */}
              <div className="border-t border-border p-4 space-y-4">
                {/* Result */}
                {foundLine !== null && (
                  <div
                    className={`p-3 rounded text-sm font-mono ${
                      correct
                        ? "bg-[#a6e3a1]/10 text-[#a6e3a1] border border-[#a6e3a1]/20"
                        : "bg-[#f38ba8]/10 text-[#f38ba8] border border-[#f38ba8]/20"
                    }`}
                  >
                    {correct ? t("playground.correct") : t("playground.wrong")}
                  </div>
                )}

                {/* Hint */}
                {showHint && (
                  <div className="p-3 rounded bg-primary/10 text-sm border border-primary/20 font-mono">
                    <span className="font-semibold text-primary">{t("playground.hint")}</span>{" "}
                    {t(selectedVuln.hintKey)}
                  </div>
                )}

                {/* Solution */}
                {showSolution && (
                  <div className="p-3 rounded bg-card border border-border text-sm space-y-2 font-mono">
                    <p>
                      <span className="font-semibold text-primary">{t("playground.explanation")}</span>{" "}
                      {t(selectedVuln.explanationKey)}
                    </p>
                    {selectedVuln.pocKey && (
                      <p className="text-muted-foreground">
                        <span className="font-semibold text-term-cmd">{t("playground.poc")}</span>{" "}
                        {t(selectedVuln.pocKey)}
                      </p>
                    )}
                  </div>
                )}

                {/* Buttons */}
                <div className="flex flex-wrap gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowHint(!showHint)}
                    className="font-mono"
                  >
                    {showHint ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                    {showHint ? t("playground.hideHint") : t("playground.showHint")}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowSolution(!showSolution)}
                    className="font-mono"
                  >
                    {showSolution ? t("playground.hideSolution") : t("playground.showSolution")}
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={handleNextChallenge}
                    className="ml-auto font-mono"
                  >
                    {t("playground.next")}
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
