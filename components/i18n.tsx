"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

export type Lang = "fr" | "en";

const translations = {
  fr: {
    // Nav
    "nav.about": "À propos",
    "nav.playground": "Playground",
    "nav.projects": "Projets",
    "nav.contact": "Contact",
    "nav.wiki": "Wiki",
    "nav.project.logs": "Logs Anonymizer",
    "nav.project.chess": "Chess Learn",
    "nav.project.crackstation": "Crackstation",
    "nav.project.wiki": "Wiki",
    "nav.desc.logs": "Anonymise les données sensibles dans les logs",
    "nav.desc.chess": "Plateforme interactive d'étude des échecs",
    "nav.desc.crackstation": "Boîte à outils de sécurité des mots de passe",
    "nav.desc.wiki": "Articles et notes de recherche",
    "nav.soon": "Bientôt",

    // Hero
    "hero.status": "Chercheur en sécurité Web3",
    "hero.role": "smart contract auditor",
    "hero.subtitle":
      "Chercheur en sécurité blockchain spécialisé dans l'audit de smart contracts EVM, la sécurité DeFi et la recherche de vulnérabilités.",
    "hero.badge.audits": "Audits de smart contracts",
    "hero.badge.evm": "EVM / Solidity",
    "hero.badge.research": "Recherche de vulnérabilités",
    "hero.discover": "Découvrir",
    "hero.cmd.whoami": "whoami",
    "hero.cmd.cat": "cat ~/profil.md",
    "hero.cmd.profil": "auditeur de smart contracts · sécurité Web3 · EVM internals",
    "hero.cmd.ls": "ls ~/stack",
    "hero.cmd.stack": "solidity  yul  foundry  vyper  hardhat",
    "hero.cmd.stats": "./stats",
    "hero.stat.audits": "audits",
    "hero.stat.cves": "cves",
    "hero.stat.bounties": "bug bounties",
    "hero.stat.years": "ans d'exp.",
    "hero.terminal.title": "yukhyShell5 — ~/portfolio",

    // Section headers
    "section.about": "À propos",
    "section.playground": "Playground",
    "section.projects": "Projets",
    "section.contact": "Contact",

    // EvmDebugger
    "about.subtitle": "Compétences et expérience au format EVM debugger",
    "about.stack": "Stack",
    "about.memory": "Memory",
    "about.storage": "Storage",
    "about.calldata": "Calldata",
    "about.level.advanced": "Avancé",
    "about.level.intermediate": "Intermédiaire",
    "about.exp": "Expérience",
    "about.audits": "Audits",
    "about.cves": "CVEs",
    "about.bounties": "Bug Bounties",
    "about.calldata.text":
      "chercheur@web3sec | github.com/yukhyShell5 | spécialiste EVM",

    // AuditPlayground
    "playground.subtitle":
      "Trouvez la vulnérabilité dans le code. Cliquez sur la ligne vulnérable.",
    "playground.severity.critical": "critique",
    "playground.severity.high": "élevée",
    "playground.severity.medium": "moyenne",
    "playground.severity.low": "basse",
    "playground.correct": "Correct ! Vous avez trouvé la ligne vulnérable.",
    "playground.wrong": "Pas tout à fait. Essayez une autre ligne ou utilisez un indice.",
    "playground.hint": "Indice :",
    "playground.explanation": "Explication :",
    "playground.poc": "PoC :",
    "playground.showHint": "Afficher l'indice",
    "playground.hideHint": "Masquer l'indice",
    "playground.showSolution": "Afficher la solution",
    "playground.hideSolution": "Masquer la solution",
    "playground.next": "Défi suivant",
    "playground.code.title": "audit.sol",
    "playground.v1.title": "Attaque par réentrance",
    "playground.v1.category": "Réentrance",
    "playground.v1.hint": "Vérifiez l'ordre des opérations. Que se passe-t-il avant que le solde ne soit remis à 0 ?",
    "playground.v1.explanation": "L'appel externe est effectué avant la mise à jour du solde à 0. Un attaquant peut appeler withdraw() de manière récursive avant la mise à jour du solde, vidant ainsi le contrat.",
    "playground.v1.poc": "Le contrat attaquant appelle withdraw -> reçoit de l'ETH -> le fallback rappelle withdraw -> on répète jusqu'à épuisement",
    "playground.v2.title": "Contrôle d'accès manquant",
    "playground.v2.category": "Contrôle d'accès",
    "playground.v2.hint": "Qui peut appeler la fonction setOwner ?",
    "playground.v2.explanation": "La fonction setOwner n'a aucun modificateur de contrôle d'accès. N'importe qui peut l'appeler et devenir le propriétaire, puis retirer tous les fonds.",
    "playground.v3.title": "Manipulation d'oracle",
    "playground.v3.category": "Oracle",
    "playground.v3.hint": "Comment le prix est-il calculé ? Peut-il être manipulé en une seule transaction ?",
    "playground.v3.explanation": "Utiliser les réserves spot d'un DEX comme oracle est vulnérable aux attaques par flash loan. Un attaquant peut manipuler le prix en échangeant de grandes quantités, liquider des positions, puis échanger en retour.",
    "playground.v3.poc": "Flash loan -> swap massif -> prix manipulé -> liquidations -> swap retour -> remboursement du prêt",

    // Projects
    "projects.subtitle": "Outils open source et expérimentations",
    "projects.desc.logs":
      "Outil d'anonymisation des données sensibles dans les fichiers de logs. Patterns personnalisés et détection par regex.",
    "projects.desc.chess":
      "Plateforme interactive d'apprentissage des échecs avec outils d'étude et visualisation des variantes.",
    "projects.desc.crackstation":
      "Boîte à outils avancée d'analyse et de test de sécurité des mots de passe. Bientôt disponible.",
    "projects.status.active": "Actif",
    "projects.status.soon": "Bientôt",
    "projects.status.archived": "Archivé",
    "projects.all": "Voir tous les projets sur GitHub",

    // Contact
    "contact.subtitle":
      "Intéressé par une collaboration ou une question de sécurité ? Contactez-moi.",
    "contact.pgp": "Clé PGP",
    "contact.pgp.desc": "messages chiffrés",
    "contact.github.desc": "code source",
    "contact.github.visit": "Voir le profil",
    "contact.copy": "Copier",
    "contact.copied": "Copié !",
    "contact.pgp.download": "Télécharger la clé (.asc)",
    "contact.footer": "Construit avec",

    // Command palette
    "cmd.placeholder": "Tapez une commande ou recherchez...",
    "cmd.empty": "Aucun résultat.",
    "cmd.navigation": "Navigation",
    "cmd.projects": "Projets",
    "cmd.links": "Liens",
    "cmd.soon": "Bientôt",
  },
  en: {
    // Nav
    "nav.about": "About",
    "nav.playground": "Playground",
    "nav.projects": "Projects",
    "nav.contact": "Contact",
    "nav.wiki": "Wiki",
    "nav.project.logs": "Logs Anonymizer",
    "nav.project.chess": "Chess Learn",
    "nav.project.crackstation": "Crackstation",
    "nav.project.wiki": "Wiki",
    "nav.desc.logs": "Anonymize sensitive data in logs",
    "nav.desc.chess": "Interactive chess study platform",
    "nav.desc.crackstation": "Password security toolkit",
    "nav.desc.wiki": "Articles & research notes",
    "nav.soon": "Soon",

    // Hero
    "hero.status": "Web3 Security Researcher",
    "hero.role": "smart contract auditor",
    "hero.subtitle":
      "Blockchain security researcher specializing in EVM smart contract auditing, DeFi security, and vulnerability research.",
    "hero.badge.audits": "Smart Contract Audits",
    "hero.badge.evm": "EVM / Solidity",
    "hero.badge.research": "Vulnerability Research",
    "hero.discover": "Discover",
    "hero.cmd.whoami": "whoami",
    "hero.cmd.cat": "cat ~/profile.md",
    "hero.cmd.profil": "smart contract auditor · web3 security · EVM internals",
    "hero.cmd.ls": "ls ~/stack",
    "hero.cmd.stack": "solidity  yul  foundry  vyper  hardhat",
    "hero.cmd.stats": "./stats",
    "hero.stat.audits": "audits",
    "hero.stat.cves": "cves",
    "hero.stat.bounties": "bug bounties",
    "hero.stat.years": "years exp.",
    "hero.terminal.title": "yukhyShell5 — ~/portfolio",

    // Section headers
    "section.about": "About",
    "section.playground": "Playground",
    "section.projects": "Projects",
    "section.contact": "Contact",

    // EvmDebugger
    "about.subtitle": "Skills & experience in EVM debugger format",
    "about.stack": "Stack",
    "about.memory": "Memory",
    "about.storage": "Storage",
    "about.calldata": "Calldata",
    "about.level.advanced": "Advanced",
    "about.level.intermediate": "Intermediate",
    "about.exp": "Experience",
    "about.audits": "Audits",
    "about.cves": "CVEs",
    "about.bounties": "Bug Bounties",
    "about.calldata.text":
      "researcher@web3sec | github.com/yukhyShell5 | EVM specialist",

    // AuditPlayground
    "playground.subtitle":
      "Find the vulnerability in the code. Click on the vulnerable line.",
    "playground.severity.critical": "critical",
    "playground.severity.high": "high",
    "playground.severity.medium": "medium",
    "playground.severity.low": "low",
    "playground.correct": "Correct! You found the vulnerable line.",
    "playground.wrong": "Not quite. Try another line or use a hint.",
    "playground.hint": "Hint:",
    "playground.explanation": "Explanation:",
    "playground.poc": "PoC:",
    "playground.showHint": "Show Hint",
    "playground.hideHint": "Hide Hint",
    "playground.showSolution": "Show Solution",
    "playground.hideSolution": "Hide Solution",
    "playground.next": "Next Challenge",
    "playground.code.title": "audit.sol",
    "playground.v1.title": "Reentrancy Attack",
    "playground.v1.category": "Reentrancy",
    "playground.v1.hint": "Check the order of operations. What happens before the balance is set to 0?",
    "playground.v1.explanation": "The external call is made before updating the balance to 0. An attacker can recursively call withdraw() before the balance is updated, draining the contract.",
    "playground.v1.poc": "Attacker contract calls withdraw -> receives ETH -> fallback calls withdraw again -> repeat until drained",
    "playground.v2.title": "Missing Access Control",
    "playground.v2.category": "Access Control",
    "playground.v2.hint": "Who can call the setOwner function?",
    "playground.v2.explanation": "The setOwner function has no access control modifier. Anyone can call it and become the owner, then withdraw all funds.",
    "playground.v3.title": "Oracle Manipulation",
    "playground.v3.category": "Oracle",
    "playground.v3.hint": "How is the price calculated? Can it be manipulated in a single transaction?",
    "playground.v3.explanation": "Using spot reserves from a DEX as an oracle is vulnerable to flash loan attacks. An attacker can manipulate the price by swapping large amounts, liquidate positions, then swap back.",
    "playground.v3.poc": "Flash loan -> massive swap -> price manipulated -> liquidations -> swap back -> repay loan",

    // Projects
    "projects.subtitle": "Open source tools and experiments",
    "projects.desc.logs":
      "Tool for anonymizing sensitive data in log files. Supports custom patterns and regex-based detection.",
    "projects.desc.chess":
      "Interactive chess learning platform with study tools and variant visualization.",
    "projects.desc.crackstation":
      "Advanced password analysis and security testing toolkit. Coming soon.",
    "projects.status.active": "Active",
    "projects.status.soon": "Coming Soon",
    "projects.status.archived": "Archived",
    "projects.all": "View all projects on GitHub",

    // Contact
    "contact.subtitle":
      "Interested in collaboration or have a security concern? Reach out.",
    "contact.pgp": "PGP Key",
    "contact.pgp.desc": "encrypted messages",
    "contact.github.desc": "source code",
    "contact.github.visit": "View profile",
    "contact.copy": "Copy",
    "contact.copied": "Copied!",
    "contact.pgp.download": "Download key (.asc)",
    "contact.footer": "Built with",

    // Command palette
    "cmd.placeholder": "Type a command or search...",
    "cmd.empty": "No results found.",
    "cmd.navigation": "Navigation",
    "cmd.projects": "Projects",
    "cmd.links": "Links",
    "cmd.soon": "Soon",
  },
} as const;

type TranslationKey = keyof (typeof translations)["fr"];

export type { TranslationKey };

interface I18nContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: TranslationKey) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function LanguageProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [lang, setLang] = useState<Lang>("fr");

  // Hydration-safe init: read persisted/navigator language after mount to
  // avoid SSR/client mismatch (server always renders "fr").
  useEffect(() => {
    const saved = localStorage.getItem("lang");
    if (saved === "fr" || saved === "en") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLang(saved);
    } else {
      const nav = navigator.language?.toLowerCase() ?? "";
      setLang(nav.startsWith("fr") ? "fr" : "en");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("lang", lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const t = useCallback(
    (key: TranslationKey) => translations[lang][key] ?? key,
    [lang]
  );

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within LanguageProvider");
  return ctx;
}
