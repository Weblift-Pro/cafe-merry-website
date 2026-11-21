/* =========================================================
   CAFÉ MERRY – Interaktionen & Animationen
   ========================================================= */
(() => {
  "use strict";
  const doc = document.documentElement;
  doc.classList.add("js");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isMobile = () => window.matchMedia("(max-width: 860px)").matches;
  const D = window.MERRY || {};
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const ease = t => 1 - Math.pow(1 - t, 3);

  /* Bildquellen (Platzhalter – werden durch echte Café-Fotos ersetzt) */
  const U = id => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=78`;
  const IMG = {
    interior: U("photo-1554118811-1e0d58224f24"),
    latte: U("photo-1509042239860-f550ce710b93"),
    cake: U("photo-1578985545062-69928b1d9587"),
    kuku: U("photo-1525351484163-7529414344d8"),
    pasta: U("photo-1621996346565-e3dbc646d9a9"),
    breakfast: U("photo-1533089860892-a7c6f0a88666")
  };

  /* ---------- Bild-Fallback ---------- */
  const markFail = img => img.classList.add("img-fail");
  $$("img").forEach(img => {
    if (img.complete && img.naturalWidth === 0 && img.src) markFail(img);
    img.addEventListener("error", () => markFail(img), { once: true });
  });

  /* ---------- Seitenübergang ---------- */
  const reveal = () => requestAnimationFrame(() => doc.classList.add("is-loaded"));
  if (document.readyState === "complete") reveal(); else window.addEventListener("load", reveal);
  setTimeout(reveal, 1600); // Sicherheitsnetz, falls Bilder hängen
  window.addEventListener("pageshow", e => { if (e.persisted) { doc.classList.remove("is-leaving"); doc.classList.add("is-loaded"); } });

  const supportsVT = "startViewTransition" in document && CSS.supports("view-transition-name: none");
  document.addEventListener("click", e => {
    const a = e.target.closest("a");
    if (!a || reduce) return;
    const href = a.getAttribute("href");
    if (!href || href.startsWith("#") || a.target === "_blank" || a.hasAttribute("download")) return;
    if (/^(https?:|mailto:|tel:|sms:|whatsapp:)/i.test(href)) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    doc.classList.remove("menu-open");
    doc.classList.add("is-leaving");
    setTimeout(() => { window.location.href = href; }, 560);
  });

  /* ---------- Navigation ---------- */
  const header = $(".site-header");
  const fab = $(".fab");
  const onScrollNav = () => {
    const y = window.scrollY;
    header && header.classList.toggle("is-scrolled", y > 40);
    fab && fab.classList.toggle("show", y > window.innerHeight * 0.6);
  };
  onScrollNav();
  window.addEventListener("scroll", onScrollNav, { passive: true });

  const burger = $(".burger");
  if (burger) {
    burger.addEventListener("click", () => {
      const open = doc.classList.toggle("menu-open");
      burger.setAttribute("aria-expanded", open);
      $(".mobile-menu").setAttribute("aria-hidden", !open);
    });
    document.addEventListener("keydown", e => {
      if (e.key === "Escape" && doc.classList.contains("menu-open")) burger.click();
    });
  }

  /* ---------- Wort-für-Wort-Split ---------- */
  function splitWords(el) {
    let i = 0;
    const frag = document.createDocumentFragment();
    const word = (txt, wrap) => {
      const o = document.createElement("span"); o.className = "w";
      const inner = document.createElement("span"); inner.style.setProperty("--i", i++);
      if (wrap) { const w = wrap.cloneNode(false); w.textContent = txt; inner.appendChild(w); }
      else inner.textContent = txt;
      o.appendChild(inner); return o;
    };
    const handle = (text, wrap) => text.split(/(\s+)/).forEach(p => {
      if (!p) return;
      if (/^\s+$/.test(p)) frag.appendChild(document.createTextNode(" "));
      else frag.appendChild(word(p, wrap));
    });
    [...el.childNodes].forEach(n => {
      if (n.nodeType === 3) handle(n.textContent);
      else if (n.nodeType === 1) n.tagName === "BR" ? frag.appendChild(document.createElement("br")) : handle(n.textContent, n);
    });
    el.textContent = "";
    el.appendChild(frag);
    el.classList.add("split");
  }
  $$("[data-split]").forEach(splitWords);

  /* ---------- Einblenden beim Scrollen ---------- */
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
  }, { rootMargin: "0px 0px -10% 0px", threshold: 0.08 });
  const observeAll = () => $$(".reveal, .reveal-img, .split, .line-reveal").forEach(el => { if (!el.classList.contains("in")) io.observe(el); });
  // Hero-Headline startet mit dem Seitenaufbau
  const heroSplit = $(".hero .split, .page-hero .split");
  if (heroSplit) { heroSplit.style.setProperty("--d", ".35s"); }

  /* ---------- Inhalte aus data.js rendern ---------- */
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const tagHTML = t => `<span class="tag ${t === "vegan" ? "vegan" : t.includes("persisch") ? "special" : ""}">${esc(t)}</span>`;
  const priceHTML = p => p ? `<span class="price">${esc(p)}</span>` : `<span class="price pending">Preis folgt</span>`;
  const itemHTML = g => `
    <article class="menu-item reveal">
      <div>
        <h3>${esc(g.name)} ${(g.tags || []).map(tagHTML).join("")}</h3>
        <p>${esc(g.text || "")}</p>
      </div>
      ${priceHTML(g.preis)}
    </article>`;

  // Speisekarte (Seite "Speisen")
  const menuRoot = $("#menu-root");
  if (menuRoot && D.speisekarte) {
    const tabs = $("#menu-tabs");
    tabs.innerHTML = `<button class="menu-tab" role="tab" aria-selected="true" data-cat="alle">Alle</button>` +
      D.speisekarte.map(c => `<button class="menu-tab" role="tab" aria-selected="false" data-cat="${c.id}">${esc(c.titel)}</button>`).join("");
    menuRoot.innerHTML = D.speisekarte.map((c, ci) => `
      <section class="menu-cat" id="cat-${c.id}" data-cat="${c.id}" aria-labelledby="h-${c.id}">
        <div class="menu-cat-head reveal"><h2 id="h-${c.id}">${esc(c.titel)}</h2><span>${String(ci + 1).padStart(2, "0")} · ${esc(c.untertitel || "")}</span></div>
        ${c.gerichte.map(itemHTML).join("")}
      </section>`).join("");
    tabs.addEventListener("click", e => {
      const b = e.target.closest(".menu-tab"); if (!b) return;
      $$(".menu-tab", tabs).forEach(t => t.setAttribute("aria-selected", t === b));
      const cat = b.dataset.cat;
      $$(".menu-cat", menuRoot).forEach(s => { s.hidden = !(cat === "alle" || s.dataset.cat === cat); });
      $$(".menu-cat:not([hidden]) .reveal", menuRoot).forEach(el => el.classList.add("in"));
      window.scrollTo({ top: menuRoot.getBoundingClientRect().top + scrollY - 190, behavior: reduce ? "auto" : "smooth" });
    });
    // Direktlink z. B. speisen.html#vegan
    const h = location.hash.replace("#", "");
    if (h) { const t = $(`.menu-tab[data-cat="${h}"]`, tabs); if (t) setTimeout(() => t.click(), 700); }
  }

  // Einzelne Kategorie (z. B. auf Frühstücks- und Vegan-Seite)
  $$("[data-menu-cat]").forEach(root => {
    const c = (D.speisekarte || []).find(x => x.id === root.dataset.menuCat);
    if (c) root.innerHTML = c.gerichte.map(itemHTML).join("");
  });

  // Getränke
  const drinks = $("#drinks-root");
  if (drinks && D.getraenke) drinks.innerHTML = D.getraenke.map(itemHTML).join("");

  // Öffnungszeiten
  const dayIdx = (new Date().getDay() + 6) % 7;
  $$("[data-hours]").forEach(t => {
    t.innerHTML = (D.oeffnungszeiten || []).map((o, i) => `<tr class="${i === dayIdx ? "today" : ""}"><td>${esc(o.tag)}${i === dayIdx ? " · heute" : ""}</td><td>${esc(o.zeit)}</td></tr>`).join("");
  });
  $$("[data-today]").forEach(el => {
    const o = (D.oeffnungszeiten || [])[dayIdx];
    if (o) el.textContent = `Heute geöffnet: ${o.zeit}`;
  });

  // Neuigkeiten
  const news = $("#news-root");
  if (news && D.neuigkeiten) {
    news.innerHTML = D.neuigkeiten.map((n, i) => `
      <article class="card reveal" style="--d:${(i % 3) * 0.1}s">
        <div class="media"><img src="${IMG[n.bild] || IMG.latte}" alt="" loading="lazy" onerror="this.classList.add('img-fail')"></div>
        <div class="card-body">
          <span class="meta">${esc(n.kategorie)} · ${esc(n.datum)}</span>
          <h3>${esc(n.titel)}</h3>
          <p>${esc(n.text)}</p>
          <a class="text-link" href="kontakt.html">Vorbeikommen <span aria-hidden="true">→</span></a>
        </div>
      </article>`).join("");
  }

  observeAll();

  /* ---------- Scroll-getriebene Effekte ---------- */
  const speedEls = $$("[data-speed]");
  const splits = $$(".split-reveal");
  const hstories = $$(".hstory");
  const expands = $$(".expand");
  const heroMedia = $(".hero-media");

  function setupH() {
    hstories.forEach(h => {
      const track = $(".hstory-track", h);
      if (reduce || isMobile()) { h.style.height = ""; return; }
      const dist = track.scrollWidth - window.innerWidth;
      h.style.height = `${window.innerHeight + Math.max(dist, 0)}px`;
      h._dist = dist;
    });
  }

  function frame() {
    const vh = window.innerHeight;
    if (!reduce) {
      if (heroMedia) heroMedia.style.transform = `translate3d(0, ${scrollY * 0.28}px, 0)`;

      if (!isMobile()) speedEls.forEach(el => {
        const r = el.getBoundingClientRect();
        if (r.bottom < -200 || r.top > vh + 200) return;
        const c = r.top + r.height / 2 - vh / 2;
        el.style.transform = `translate3d(0, ${c * parseFloat(el.dataset.speed) * -1}px, 0)`;
      });

      splits.forEach(s => {
        const r = s.getBoundingClientRect();
        if (r.bottom < 0 || r.top > vh) return;
        // p: 0 = Sektion betritt den Bildschirm, 1 = Sektion sitzt mittig
        const p = clamp((vh - r.top) / (vh * 0.5 + r.height * 0.5));
        // geteilt (0.55) → weiter auseinander (1) → perfekt zusammen (0)
        const amt = p < 0.3 ? 0.55 + (p / 0.3) * 0.45 : 1 - ease(clamp((p - 0.3) / 0.6));
        $$(".strip", s).forEach((st, i) => {
          const dir = i % 2 ? 1 : -1;
          st.style.transform = `translate3d(${(i - 1.5) * amt * 22}px, ${dir * amt * 70}px, 0)`;
          st.style.borderRadius = amt > 0.02 ? `${Math.round(amt * 28)}px` : "";
        });
      });

      if (!isMobile()) hstories.forEach(h => {
        const r = h.getBoundingClientRect();
        const total = h.offsetHeight - vh;
        const p = clamp(-r.top / Math.max(total, 1));
        $(".hstory-track", h).style.transform = `translate3d(${-p * (h._dist || 0)}px, 0, 0)`;
        const bar = $(".hstory-progress i", h); if (bar) bar.style.transform = `scaleX(${p})`;
      });

      if (!isMobile()) expands.forEach(x => {
        const r = x.getBoundingClientRect();
        const total = x.offsetHeight - vh;
        const p = clamp(-r.top / Math.max(total, 1));
        const e = ease(clamp(p / 0.75));
        const m = $(".expand-media", x);
        const iy = 22 * (1 - e), ix = 31 * (1 - e), rad = 32 * (1 - e);
        m.style.clipPath = `inset(${iy}% ${ix}% ${iy}% ${ix}% round ${rad}px)`;
        $("img", m).style.transform = `scale(${1.2 - 0.2 * e})`;
        x.style.setProperty("--ov", e.toFixed(3));
        x.style.setProperty("--tx", clamp((p - 0.55) / 0.3).toFixed(3));
      });
    }
    ticking = false;
  }
  let ticking = false;
  const req = () => { if (!ticking) { ticking = true; requestAnimationFrame(frame); } };
  window.addEventListener("scroll", req, { passive: true });
  window.addEventListener("resize", () => { setupH(); req(); });
  window.addEventListener("load", () => { setupH(); req(); });
  setupH(); frame();

  /* ---------- Galerie: Filter ---------- */
  const filterRow = $(".filter-row");
  if (filterRow) {
    filterRow.addEventListener("click", e => {
      const b = e.target.closest(".menu-tab"); if (!b) return;
      $$(".menu-tab", filterRow).forEach(t => t.setAttribute("aria-selected", t === b));
      const f = b.dataset.filter;
      $$(".masonry figure").forEach(fig => fig.classList.toggle("is-hidden", !(f === "alle" || fig.dataset.cat === f)));
    });
  }

  /* ---------- Horizontale Galerie: Ziehen mit der Maus ---------- */
  $$(".h-gallery").forEach(g => {
    let down = false, sx = 0, sl = 0, moved = false;
    g.addEventListener("pointerdown", e => { if (e.pointerType !== "mouse") return; down = true; moved = false; sx = e.clientX; sl = g.scrollLeft; g.classList.add("dragging"); });
    window.addEventListener("pointerup", () => { down = false; g.classList.remove("dragging"); });
    g.addEventListener("pointermove", e => { if (!down) return; const dx = e.clientX - sx; if (Math.abs(dx) > 4) moved = true; g.scrollLeft = sl - dx; });
    g.addEventListener("click", e => { if (moved) { e.stopPropagation(); e.preventDefault(); } }, true);
  });

  /* ---------- Lightbox ---------- */
  const lbItems = $$("[data-lightbox]");
  if (lbItems.length) {
    const lb = document.createElement("div");
    lb.className = "lightbox"; lb.setAttribute("role", "dialog"); lb.setAttribute("aria-modal", "true"); lb.setAttribute("aria-label", "Bildansicht");
    lb.innerHTML = `<img alt=""><p class="lb-cap"></p>
      <button class="lb-btn lb-close" aria-label="Schließen">✕</button>
      <button class="lb-btn lb-prev" aria-label="Vorheriges Bild">←</button>
      <button class="lb-btn lb-next" aria-label="Nächstes Bild">→</button>`;
    document.body.appendChild(lb);
    const lbImg = $("img", lb), cap = $(".lb-cap", lb);
    let idx = 0, last = null;
    const visible = () => lbItems.filter(f => !f.classList.contains("is-hidden"));
    const show = i => {
      const list = visible(); idx = (i + list.length) % list.length;
      const img = $("img", list[idx]);
      lbImg.src = img.currentSrc || img.src; lbImg.alt = img.alt;
      cap.textContent = img.alt;
    };
    const open = el => { last = document.activeElement; show(visible().indexOf(el)); lb.classList.add("open"); $(".lb-close", lb).focus(); };
    const close = () => { lb.classList.remove("open"); last && last.focus(); };
    lbItems.forEach(el => {
      el.tabIndex = 0; el.setAttribute("role", "button");
      el.addEventListener("click", () => open(el));
      el.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(el); } });
    });
    $(".lb-close", lb).addEventListener("click", close);
    $(".lb-prev", lb).addEventListener("click", () => show(idx - 1));
    $(".lb-next", lb).addEventListener("click", () => show(idx + 1));
    lb.addEventListener("click", e => { if (e.target === lb) close(); });
    document.addEventListener("keydown", e => {
      if (!lb.classList.contains("open")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") show(idx - 1);
      if (e.key === "ArrowRight") show(idx + 1);
    });
  }

  /* ---------- Google Maps erst nach Zustimmung (DSGVO) ---------- */
  const mapBtn = $("[data-load-map]");
  if (mapBtn) mapBtn.addEventListener("click", () => {
    const box = mapBtn.closest(".map-box");
    const f = document.createElement("iframe");
    f.src = "https://www.google.com/maps?q=Caf%C3%A9+Merry,+Theaterstra%C3%9Fe+23,+88400+Biberach+an+der+Ri%C3%9F&z=17&output=embed";
    f.title = "Karte: Café Merry, Theaterstraße 23, Biberach";
    f.loading = "lazy"; f.referrerPolicy = "no-referrer-when-downgrade";
    box.appendChild(f);
    $(".map-consent", box).remove();
  });

  /* ---------- Kontaktformular → WhatsApp ---------- */
  const form = $("#contact-form");
  if (form) form.addEventListener("submit", e => {
    e.preventDefault();
    if (!form.reportValidity()) return;
    const fd = new FormData(form);
    const text = `Hallo Café Merry,\n\n${fd.get("nachricht")}\n\nViele Grüße\n${fd.get("name")}${fd.get("telefon") ? "\nTel.: " + fd.get("telefon") : ""}`;
    const url = `https://wa.me/${(D.kontakt || {}).whatsapp}?text=${encodeURIComponent(text)}`;
    const status = $("#form-status");
    status.innerHTML = `Deine Nachricht ist vorbereitet. <a class="text-link" href="${url}" target="_blank" rel="noopener">In WhatsApp öffnen und senden →</a>`;
    window.open(url, "_blank", "noopener");
  });

  /* ---------- Jahr im Footer ---------- */
  $$("[data-year]").forEach(el => el.textContent = new Date().getFullYear());
})();
