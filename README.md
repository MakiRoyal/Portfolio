# Portfolio — Mika Ramanantsoa

Portfolio personnel : Next.js 15 (App Router) · TypeScript strict · Tailwind CSS v4 · Framer Motion.

## Démarrer

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # build de production (prêt pour Vercel)
```

## Interactions signature

- **Boot terminal** au chargement (passable au clic/Échap, joué une fois par session, sauté si `prefers-reduced-motion`)
- **Menu index** plein écran (burger en haut à droite, focus trap, Échap)
- **Drag-to-explore** horizontal des projets avec inertie — molette et ← → au clavier ; scroll natif sur tactile
- **Curseur magnétique** avec label contextuel (`data-hover` / `data-label` / `data-magnetic`) — désactivé sur tactile
- **Konami code** ↑ ↑ ↓ ↓ ← → ← → B A : thème rétro Game Boy
- **Barres de compétences RPG** animées à l’entrée dans le viewport
- Grain SVG en overlay, barre de progression de scroll

## Où modifier le contenu

Tout le contenu (projets, stack, textes, liens) vit dans [`lib/data.ts`](lib/data.ts).

## TODO avant mise en ligne

- [ ] Remplacer les liens `links.github` des projets par les URLs exactes des repos
- [ ] Vérifier l’URL LinkedIn dans `lib/data.ts`
- [ ] Définir `NEXT_PUBLIC_SITE_URL` sur Vercel (utilisé pour les métadonnées, sitemap, robots)
