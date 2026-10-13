export interface ProjectLinks {
  github?: string;
  demo?: string;
}

export interface Project {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  stack: string[];
  year: string;
  role: string;
  links: ProjectLinks;
  accent: "amber" | "teal";
}

export type SkillRank = "S" | "A" | "B" | "C";

export interface Skill {
  name: string;
  /** Rang façon fiche de personnage RPG — S le plus maîtrisé, C des notions */
  rank: SkillRank;
  note?: string;
}

export interface SkillCategory {
  title: string;
  code: string;
  skills: Skill[];
}

export interface NavLink {
  label: string;
  href: string;
}

export interface Quest {
  label: string;
  status: string;
}

export interface InfoRow {
  label: string;
  value: string;
}

export interface Profile {
  name: string;
  role: string;
  tagline: string;
  location: string;
  email: string;
  availability: string;
  school: string;
  apprenticeship: string;
  github: string;
  linkedin: string;
}
