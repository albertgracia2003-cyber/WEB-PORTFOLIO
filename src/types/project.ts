import type { MediaId } from "@/content/media";

/** Whether the project may appear on the public site. Drafts are filtered out everywhere. */
export type PublicationStatus = "published" | "draft";

/** Honest maturity of the work — always shown next to the project. */
export type Maturity =
  | "functional-prototype"
  | "working-system"
  | "built-object"
  | "concept"
  | "planned";

export type ProjectCategory = "flagship" | "computational" | "physical" | "supporting";

export type Authorship =
  | { kind: "personal"; note?: string }
  | {
      kind: "collaborative";
      /** e.g. "University team project — UPC". */
      context: string;
      /** Albert's individual contribution. Leave undefined until confirmed. */
      contribution?: string;
    };

export interface Project {
  slug: string;
  /** Route of the full case study. Supporting projects may have none. */
  href?: string;
  title: string;
  subtitle: string;
  /** Optional one-line version of the subtitle for compact lists (About capability map). */
  short?: string;
  summary: string;
  category: ProjectCategory;
  /** Only set when verified. */
  year?: string;
  authorship: Authorship;
  maturity: Maturity;
  disciplines: readonly string[];
  /** Tools actually used. */
  tools: readonly string[];
  cover: MediaId;
  /** Optional longer account for supporting projects: a short paragraph, a few concrete points, and where the team's work begins. */
  detail?: { intro: string; points: readonly string[]; teamNote: string };
  related?: readonly string[];
  publication: PublicationStatus;
  /** Internal note on confidentiality; never rendered. */
  confidentiality?: string;
  /** Sort order within its category. */
  order: number;
}
