export interface Chapter {
  /** filename without extension, e.g. "01-bash-en-profondeur" */
  slug: string;
  /** relative path inside cours/, e.g. "cours/linux/01-shell-et-ligne-de-commande/01-bash-en-profondeur.md" */
  file: string;
  /** title from frontmatter (or first H1 fallback) */
  title: string;
  /** "NN" prefix when the filename is numbered */
  numero?: string;
  statut?: string;
  difficulte?: string;
  date?: string;
}

export interface Course {
  /** folder name, e.g. "01-shell-et-ligne-de-commande" */
  slug: string;
  numero?: string;
  title: string;
  description?: string;
  statut?: string;
  difficulte?: string;
  date?: string;
  chapters: Chapter[];
}

export interface Discipline {
  /** folder name, e.g. "linux" */
  slug: string;
  title: string;
  description?: string;
  /** content of the <domaine>.md sommaire (without frontmatter) */
  sommaireContent?: string;
  courses: Course[];
}

export interface WikiData {
  disciplines: Discipline[];
  /** absolute path to the cours/ directory, or null when the vault is absent */
  sourceDir: string | null;
}
