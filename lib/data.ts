import type {
  InfoRow,
  NavLink,
  Profile,
  Project,
  Quest,
  SkillCategory,
} from "./types";

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://mika-ramanantsoa.vercel.app";

export const profile: Profile = {
  name: "Mika Ramanantsoa",
  role: "Développeur Full-Stack & Mobile",
  tagline:
    "Je conçois et développe des produits web, mobile et data de bout en bout — du prototype au déploiement.",
  location: "Paris, France",
  email: "ramanantsoa.mika@gmail.com",
  availability: "Disponible dès septembre 2026",
  school: "IIM Digital School — A5 Lead Développeur Full-Stack",
  apprenticeship: "Alternant développeur à la Ville de Paris",
  github: "https://github.com/MakiRoyal",
  linkedin: "https://www.linkedin.com/in/mika-ramanantsoa-3b703b202/",
};

/** Lignes tapées par le boot terminal au chargement */
export const bootLines: string[] = [
  "> initialisation du portfolio…",
  "> chargement de la stack : react · spring · fastapi",
  "> import des projets… 3 trouvés",
  "> calibrage du curseur magnétique… ok",
  "> bienvenue.",
];

export const navLinks: NavLink[] = [
  { label: "Accueil", href: "#top" },
  { label: "À propos", href: "#a-propos" },
  { label: "Projets", href: "#projets" },
  { label: "Stack", href: "#stack" },
  { label: "Contact", href: "#contact" },
];

export const heroMeta: string[] = [
  "paris, france",
  "dispo septembre 2026",
  "alternant @ ville de paris",
];

export const aboutParagraphs: string[] = [
  "Étudiant en dernière année de Lead Développeur Full-Stack à l’IIM Digital School, je travaille en alternance à la Ville de Paris, où je développe des applications web et mobiles de bout en bout.",
  "J’aime construire des produits complets : une API propre, une app mobile soignée, une base de données bien pensée — et l’infra pour faire tourner le tout. Je cherche un poste de développeur full-stack, mobile ou data à partir de septembre 2026.",
];

export const identityCard: InfoRow[] = [
  { label: "Localisation", value: "Paris, France" },
  { label: "École", value: "IIM — A5 Lead Dev Full-Stack" },
  { label: "Alternance", value: "Ville de Paris" },
  { label: "Disponibilité", value: "Septembre 2026" },
];

export const projects: Project[] = [
  {
    slug: "watchwith",
    title: "WatchWith",
    tagline: "Trouver quoi regarder, ensemble.",
    description:
      "Application mobile pour choisir un film ou une série à plusieurs : chacun swipe de son côté, l’app détecte les matchs en temps réel et propose la sélection commune. Auth, profils et synchronisation temps réel via Supabase, catalogue alimenté par l’API TMDB.",
    stack: ["React Native", "Expo", "Supabase", "TMDB API", "TypeScript"],
    year: "2025 — 2026",
    role: "Conception & développement complet",
    // TODO : remplacer par le lien du repo exact
    links: { github: profile.github },
    accent: "amber",
  },
  {
    slug: "vibeplaylist",
    title: "VibePlaylist",
    tagline: "Décris une vibe, obtiens la playlist.",
    description:
      "Générateur de playlists piloté par IA : l’utilisateur décrit une ambiance en langage naturel, Gemini la traduit en critères musicaux et l’app compose une playlist exportée directement sur son compte Spotify.",
    stack: ["Expo", "React Native", "Gemini API", "Spotify API"],
    year: "2025",
    role: "Conception & développement complet",
    links: { github: "https://github.com/MakiRoyal/VibePlaylist" },
    accent: "teal",
  },
  {
    slug: "moneybuddy",
    title: "MoneyBuddy",
    tagline: "Le budget, enfin lisible.",
    description:
      "Plateforme de gestion de budget : application mobile React Native pour le suivi quotidien, dashboard web Next.js pour l’analyse, et API Spring Boot pour la logique métier et la persistance.",
    stack: ["Spring Boot", "Java", "React Native", "Next.js", "PostgreSQL"],
    year: "2024 — 2025",
    role: "Full-stack — mobile, web & API",
    links: { github: profile.github },
    accent: "amber",
  },
];

export const skillCategories: SkillCategory[] = [
  {
    title: "Frontend",
    code: "FRT",
    skills: [
      { name: "React", rank: "S" },
      { name: "Next.js", rank: "A" },
      { name: "TypeScript", rank: "A" },
    ],
  },
  {
    title: "Mobile",
    code: "MOB",
    skills: [
      { name: "React Native", rank: "A" },
      { name: "Expo", rank: "A" },
    ],
  },
  {
    title: "Backend",
    code: "BCK",
    skills: [
      { name: "Python · FastAPI", rank: "B" },
      { name: "Java · Spring Boot", rank: "B" },
    ],
  },
  {
    title: "Data & Infra",
    code: "OPS",
    skills: [
      { name: "PostgreSQL", rank: "A" },
      { name: "Supabase", rank: "A" },
    ],
  },
];

export const quests: Quest[] = [
  { label: "CDI full-stack / mobile / data", status: "dispo 09.2026" },
];
