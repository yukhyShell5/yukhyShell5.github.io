import { Hero } from "@/components/hero";
import { EvmDebugger } from "@/components/evm-debugger";
import { AuditPlayground } from "@/components/audit-playground";
import { Projects } from "@/components/projects";
import { Contact } from "@/components/contact";

export default function Home() {
  return (
    <main className="relative">
      <Hero />
      <EvmDebugger />
      <AuditPlayground />
      <Projects />
      <Contact />
    </main>
  );
}
