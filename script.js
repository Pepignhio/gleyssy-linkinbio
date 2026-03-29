/**
 * ╔══════════════════════════════════════════════════════╗
 * ║      SICORA AGENCY — Link In Bio — script.js         ║
 * ║   Tracking · VIP logic · Funnel webhook · Init       ║
 * ╚══════════════════════════════════════════════════════╝
 */

"use strict";

/* ═══════════════════════════════════════════════════════════
   1. INIT — Injection config dans le DOM
   ═══════════════════════════════════════════════════════════ */
document.addEventListener("DOMContentLoaded", () => {
  injectConfig();
  initTracking();
  initButtons();
  initVipZone();
  trackPageView();
});

function injectConfig() {
  if (typeof config === "undefined") {
    console.warn("[SICORA] config.js non chargé.");
    return;
  }

  // Nom & username
  safeText("heroName",     config.name);
  safeText("heroUsername", config.username || `@${config.name.toLowerCase()}`);
  safeText("heroBio",      config.bio);

  // Social proof
  safeText("membersCount", config.membersCount);
  safeText("membersLabel", config.membersLabel);

  // Liens boutons
  safeHref("btn-mym",       config.links.mym);
  safeHref("btn-instagram", config.links.instagram);
  safeHref("btn-tiktok",    config.links.tiktok);
  safeHref("btnVipActual",  config.links.vip);

  // Avatar
  if (config.profileImage) {
    const img         = document.getElementById("avatar");
    const placeholder = document.getElementById("avatarPlaceholder");
    if (img) {
      img.src = config.profileImage;
      img.style.display = "block";
      if (placeholder) placeholder.style.display = "none";
    }
  }

  // Placeholder initial (première lettre du prénom)
  const ph = document.getElementById("avatarPlaceholder");
  if (ph && config.name) ph.textContent = config.name.charAt(0).toUpperCase();

  // Footer
  safeText("footerAgency",  `Managed by ${config.agency.name}`);
  const contactEl = document.getElementById("footerContact");
  if (contactEl) {
    contactEl.textContent = config.agency.contact;
    contactEl.href        = `mailto:${config.agency.contact}`;
  }

  // Hint VIP
  const vipHint = document.getElementById("vipHint");
  if (vipHint && config.vip?.hint) vipHint.textContent = config.vip.hint;

  // Page title
  document.title = `${config.name} • Private Access`;
}

// Helpers sécurisés
function safeText(id, value) {
  const el = document.getElementById(id);
  if (el && value !== undefined) el.textContent = value;
}
function safeHref(id, url) {
  const el = document.getElementById(id);
  if (el && url) el.href = url;
}

/* ═══════════════════════════════════════════════════════════
   2. TRACKING — Meta Pixel + Google Analytics
   ═══════════════════════════════════════════════════════════ */
function initTracking() {
  if (typeof config === "undefined") return;

  // ── Meta Pixel ────────────────────────────────────────────
  if (config.tracking?.metaPixelId && config.tracking.metaPixelId !== "XXXXXXXXXXXXXXXXXX") {
    if (typeof fbq !== "undefined") {
      fbq("init", config.tracking.metaPixelId);
    }
  }

  // ── Google Analytics ──────────────────────────────────────
  if (config.tracking?.gaId && config.tracking.gaId !== "G-XXXXXXXXXX") {
    if (typeof gtag !== "undefined") {
      gtag("config", config.tracking.gaId, { page_path: window.location.pathname });
    }
  }
}

function trackPageView() {
  trackEvent("page_view", { platform: "linkinbio", creator: config?.name || "unknown" });
}

/**
 * trackEvent — Envoie un événement vers Meta Pixel + GA4 + Webhook funnel
 * @param {string} eventName
 * @param {Object} params
 */
function trackEvent(eventName, params = {}) {
  const payload = {
    event:     eventName,
    creator:   config?.name || "unknown",
    timestamp: new Date().toISOString(),
    url:       window.location.href,
    referrer:  document.referrer || "direct",
    ...params
  };

  // Meta Pixel
  try {
    if (typeof fbq !== "undefined") {
      fbq("trackCustom", eventName, payload);
    }
  } catch (e) { /* silent */ }

  // Google Analytics
  try {
    if (typeof gtag !== "undefined") {
      gtag("event", eventName, payload);
    }
  } catch (e) { /* silent */ }

  // Console dev
  if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
    console.log(`[SICORA TRACK] ${eventName}`, payload);
  }

  // Funnel webhook
  sendFunnelEvent(payload);
}

/* ── Événements spécifiques par bouton ───────────────────── */
function trackClickMym()       { trackEvent("click_mym",       { platform: "mym" }); }
function trackClickInstagram() { trackEvent("click_instagram",  { platform: "instagram" }); }
function trackClickTikTok()    { trackEvent("click_tiktok",    { platform: "tiktok" }); }
function trackClickVip()       { trackEvent("click_vip",       { platform: "vip", type: "hidden_button" }); }

/* ═══════════════════════════════════════════════════════════
   3. FUNNEL WEBHOOK (Zapier / Make)
   ═══════════════════════════════════════════════════════════ */
function sendFunnelEvent(payload) {
  if (typeof config === "undefined") return;
  if (!config.funnel?.enabled) return;
  if (!config.funnel?.webhookUrl || config.funnel.webhookUrl.includes("XXXXX")) return;

  fetch(config.funnel.webhookUrl, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify(payload),
    // keepalive pour éviter perte si l'utilisateur navigue immédiatement
    keepalive: true
  }).catch(() => { /* silent fail — ne pas bloquer l'expérience */ });
}

/* ═══════════════════════════════════════════════════════════
   4. BOUTONS — Init click listeners + tracking
   ═══════════════════════════════════════════════════════════ */
function initButtons() {
  const buttons = [
    { id: "btn-mym",       fn: trackClickMym },
    { id: "btn-instagram", fn: trackClickInstagram },
    { id: "btn-tiktok",    fn: trackClickTikTok }
  ];

  buttons.forEach(({ id, fn }) => {
    const el = document.getElementById(id);
    if (!el) return;

    el.addEventListener("click", (e) => {
      fn();
      // Feedback haptique mobile
      if (navigator.vibrate) navigator.vibrate(30);
    });
  });
}

/* ═══════════════════════════════════════════════════════════
   5. VIP ZONE — Appui long pour révéler le bouton VIP
   ═══════════════════════════════════════════════════════════ */
function initVipZone() {
  const trigger    = document.getElementById("btnVipTrigger");
  const actual     = document.getElementById("btnVipActual");
  const progress   = document.getElementById("vipProgress");
  const hint       = document.getElementById("vipHint");
  if (!trigger || !actual || !progress) return;

  const holdDuration = config?.vip?.triggerHoldMs ?? 1800;
  let holdTimer     = null;
  let startTime     = null;
  let rafId         = null;
  let revealed      = false;

  // ── Lancer le compte à rebours ──────────────────────────
  function startHold() {
    if (revealed) return;
    startTime = Date.now();
    animateProgress();
    holdTimer = setTimeout(() => {
      revealVip();
    }, holdDuration);
  }

  // ── Annuler ─────────────────────────────────────────────
  function cancelHold() {
    if (revealed) return;
    clearTimeout(holdTimer);
    cancelAnimationFrame(rafId);
    progress.style.width = "0%";
    progress.setAttribute("aria-valuenow", "0");
  }

  // ── Barre de progression RAF ────────────────────────────
  function animateProgress() {
    const elapsed  = Date.now() - startTime;
    const pct      = Math.min((elapsed / holdDuration) * 100, 100);
    progress.style.width = `${pct}%`;
    progress.setAttribute("aria-valuenow", Math.round(pct));
    if (pct < 100) rafId = requestAnimationFrame(animateProgress);
  }

  // ── Révélation ──────────────────────────────────────────
  function revealVip() {
    revealed = true;
    cancelAnimationFrame(rafId);
    progress.style.width = "100%";

    // Masquer le trigger, afficher le vrai bouton
    trigger.style.display = "none";
    progress.style.display = "none";
    if (hint) hint.style.opacity = "0";
    actual.style.display  = "flex";
    actual.style.alignItems = "center";
    actual.style.justifyContent = "center";

    // Feedback haptique
    if (navigator.vibrate) navigator.vibrate([40, 30, 80]);

    showToast("🔓 VIP Access unlocked");

    // Tracking
    trackClickVip();

    // Listener sur le bouton réel
    actual.addEventListener("click", () => {
      trackEvent("vip_link_click", { platform: "vip" });
      if (navigator.vibrate) navigator.vibrate(30);
    });
  }

  // ── Events — Mouse ──────────────────────────────────────
  trigger.addEventListener("mousedown",  startHold);
  trigger.addEventListener("mouseup",    cancelHold);
  trigger.addEventListener("mouseleave", cancelHold);

  // ── Events — Touch (mobile) ─────────────────────────────
  trigger.addEventListener("touchstart", (e) => { e.preventDefault(); startHold(); },  { passive: false });
  trigger.addEventListener("touchend",   (e) => { e.preventDefault(); cancelHold(); }, { passive: false });
  trigger.addEventListener("touchcancel", cancelHold);
}

/* ═══════════════════════════════════════════════════════════
   6. TOAST NOTIFICATION
   ═══════════════════════════════════════════════════════════ */
let toastTimer = null;
function showToast(message, duration = 2800) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add("show");
  toastTimer = setTimeout(() => toast.classList.remove("show"), duration);
}

/* ═══════════════════════════════════════════════════════════
   7. UTILITAIRES
   ═══════════════════════════════════════════════════════════ */

// Détection mobile simple
function isMobile() {
  return /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
}

// Empêcher le zoom sur double-tap (iOS)
let lastTap = 0;
document.addEventListener("touchend", (e) => {
  const now = Date.now();
  if (now - lastTap < 300) e.preventDefault();
  lastTap = now;
}, { passive: false });
