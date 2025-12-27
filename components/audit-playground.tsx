"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, EyeOff, ChevronRight, AlertTriangle, CheckCircle } from "lucide-react";

interface Vulnerability {
  id: string;
  title: string;
  severity: "critical" | "high" | "medium" | "low";
  category: string;
  code: string[];
  vulnerableLine: number;
  hint: string;
  explanation: string;
  poc?: string;
}

const vulnerabilities: Vulnerability[] = [
  {
    id: "reentrancy-1",
    title: "Reentrancy Attack",
    severity: "critical",
    category: "Reentrancy",
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
    hint: "Check the order of operations. What happens before the balance is set to 0?",
    explanation: "The external call is made before updating the balance to 0. An attacker can recursively call withdraw() before the balance is updated, draining the contract.",
    poc: "Attacker contract calls withdraw -> receives ETH -> fallback calls withdraw again -> repeat until drained",
  },
  {
    id: "access-control-1",
    title: "Missing Access Control",
    severity: "high",
    category: "Access Control",
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
    hint: "Who can call the setOwner function?",
    explanation: "The setOwner function has no access control modifier. Anyone can call it and become the owner, then withdraw all funds.",
  },
  {
    id: "oracle-1",
    title: "Oracle Manipulation",
    severity: "critical",
    category: "Oracle",
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
    hint: "How is the price calculated? Can it be manipulated in a single transaction?",
    explanation: "Using spot reserves from a DEX as an oracle is vulnerable to flash loan attacks. An attacker can manipulate the price by swapping large amounts, liquidate positions, then swap back.",
  },
];

const severityColors = {
  critical: "bg-critical/10 text-critical border-critical/20",
  high: "bg-warning/10 text-warning border-warning/20",
  medium: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  low: "bg-success/10 text-success border-success/20",
};

export function AuditPlayground() {
  const [selectedVuln, setSelectedVuln] = useState<Vulnerability>(vulnerabilities[0]);
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [foundLine, setFoundLine] = useState<number | null>(null);
  const [correct, setCorrect] = useState(false);

  const handleLineClick = (lineIdx: number) => {
    setFoundLine(lineIdx);
    if (lineIdx === selectedVuln.vulnerableLine) {
      setCorrect(true);
    } else {
      setCorrect(false);
    }
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
    <section id="playground" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold mb-2">Vulnerability Playground</h2>
          <p className="text-muted-foreground">
            Find the vulnerability in the code. Click on the vulnerable line.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Vulnerability List */}
          <div className="space-y-3">
            {vulnerabilities.map((vuln) => (
              <button
                key={vuln.id}
                onClick={() => {
                  setSelectedVuln(vuln);
                  resetState();
                }}
                className={`w-full text-left p-4 rounded-lg border transition-colors ${
                  selectedVuln.id === vuln.id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className={severityColors[vuln.severity]}>
                    {vuln.severity}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{vuln.category}</span>
                </div>
                <span className="font-medium">{vuln.title}</span>
              </button>
            ))}
          </div>

          {/* Code Panel */}
          <div className="lg:col-span-2">
            <motion.div
              key={selectedVuln.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="border border-border rounded-lg bg-card overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card/50">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-warning" />
                  <span className="font-mono text-sm">{selectedVuln.title}</span>
                </div>
                <Badge variant="outline" className={severityColors[selectedVuln.severity]}>
                  {selectedVuln.severity}
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
                          ? "bg-success/20"
                          : "bg-critical/20"
                        : ""
                    }`}
                  >
                    <span className="text-muted-foreground w-6 text-right select-none">
                      {idx + 1}
                    </span>
                    <span className="whitespace-pre">{line || " "}</span>
                    {foundLine === idx && (
                      <span className="ml-auto">
                        {correct ? (
                          <CheckCircle className="w-4 h-4 text-success" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-critical" />
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
                    className={`p-3 rounded-lg text-sm ${
                      correct
                        ? "bg-success/10 text-success border border-success/20"
                        : "bg-critical/10 text-critical border border-critical/20"
                    }`}
                  >
                    {correct
                      ? "Correct! You found the vulnerable line."
                      : "Not quite. Try another line or use a hint."}
                  </div>
                )}

                {/* Hint */}
                {showHint && (
                  <div className="p-3 rounded-lg bg-primary/10 text-sm border border-primary/20">
                    <span className="font-semibold">Hint:</span> {selectedVuln.hint}
                  </div>
                )}

                {/* Solution */}
                {showSolution && (
                  <div className="p-3 rounded-lg bg-card border border-border text-sm space-y-2">
                    <p>
                      <span className="font-semibold">Explanation:</span>{" "}
                      {selectedVuln.explanation}
                    </p>
                    {selectedVuln.poc && (
                      <p className="text-muted-foreground">
                        <span className="font-semibold">PoC:</span> {selectedVuln.poc}
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
                  >
                    {showHint ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                    {showHint ? "Hide Hint" : "Show Hint"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowSolution(!showSolution)}
                  >
                    {showSolution ? "Hide Solution" : "Show Solution"}
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={handleNextChallenge}
                    className="ml-auto"
                  >
                    Next Challenge
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
