/**
 * ╔══════════════════════════════════════════════════════╗
 * ║         SICORA AGENCY — Link In Bio Config           ║
 * ║   Modifier ce fichier pour adapter à chaque modèle   ║
 * ╚══════════════════════════════════════════════════════╝
 */

const config = {
  // ── Identité ──────────────────────────────────────────
  name: "Gleyssy",
  username: "@gleyssy",
  bio: "Accès privé. Contenu exclusif. Réservé aux fans sélectionnés 💎",
  profileImage: "profile.jpg",
  backgroundImage: "bg.jpg",

  // ── Liens ─────────────────────────────────────────────
  links: {
    mym: "https://mym.fans/app/t/hh4f2klw51Vno35",
    instagram: "https://www.instagram.com/gleys.syy/",
    tiktok: "https://www.tiktok.com/@gley.syy",
    vip: "#"   // remplacer par le lien VIP réel
  },

  // ── VIP Access (zone cachée) ───────────────────────────
  vip: {
    triggerHoldMs: 1800,        // durée appui long pour révéler (ms)
    buttonLabel: "Accès VIP ✦",
    hint: "Maintenir pour déverrouiller"
  },

  // ── Agence ────────────────────────────────────────────
  agency: {
    name: "SICORA AGENCY",
    contact: "pepignhio37@outlook.com"
  },

  // ── Tracking ──────────────────────────────────────────
  tracking: {
    metaPixelId: "XXXXXXXXXXXXXXXXXX",   // remplacer par vrai ID Meta Pixel
    gaId: "G-XXXXXXXXXX"                  // remplacer par vrai ID Google Analytics
  },

  // ── Funnel Webhook ────────────────────────────────────
  funnel: {
    enabled: true,
    webhookUrl: "https://hooks.zapier.com/hooks/catch/XXXXX/XXXXX/"  // remplacer
  }
};

// Export pour usage dans script.js
if (typeof module !== "undefined") module.exports = config;
