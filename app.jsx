// Main app — Cúpula Futurista landing
const { useState, useEffect, useRef, useMemo, useCallback } = React;

// ----- Tweak defaults (host-rewritable JSON block) -----
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "terracotta",
  "headingFont": "geometric",
  "density": "comfortable",
  "heroVariant": "fullbleed",
  "animVariant": "blueprint",
  "showAnim": true,
  "headlinePT": "Espaços, reimaginados com cuidado.",
  "headlineEN": "Spaces, reimagined with care.",
  "lang": "pt"
}/*EDITMODE-END*/;

// Accent palettes
const ACCENTS = {
  gold:       { hex: "#B89968", name: "Gold" },
  terracotta: { hex: "#B5552E", name: "Terracotta" },
  sage:       { hex: "#7A8B6F", name: "Sage" },
  ink:        { hex: "#1A1A1A", name: "Ink" },
};

const HEADING_FONTS = {
  geometric: { stack: "'Familjen Grotesk', 'Inter Tight', sans-serif", name: "Geometric" },
  serif:     { stack: "'Fraunces', 'Cormorant Garamond', serif", name: "Editorial" },
  mono:      { stack: "'JetBrains Mono', 'IBM Plex Mono', monospace", name: "Mono" },
};

const DENSITIES = {
  cozy:        { scale: 0.85, name: "Cozy" },
  comfortable: { scale: 1.0, name: "Comfortable" },
  spacious:    { scale: 1.18, name: "Spacious" },
};

// ----- Small helpers -----
function useTweaks(defaults) {
  const [tweaks, setTweaks] = useState(defaults);
  const set = useCallback((keyOrObj, value) => {
    const patch = typeof keyOrObj === "string" ? { [keyOrObj]: value } : keyOrObj;
    setTweaks(prev => ({ ...prev, ...patch }));
    try {
      window.parent.postMessage({ type: "__edit_mode_set_keys", edits: patch }, "*");
    } catch (e) {}
  }, []);
  return [tweaks, set];
}

// Smooth scroll
function smoothScrollTo(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - 70;
  window.scrollTo({ top, behavior: "smooth" });
}

// ----- Logo -----
function Logo({ light = false, mark = false }) {
  const color = light ? "#FAF7F2" : "var(--cf-ink)";
  return (
    <a href="#top" onClick={(e) => { e.preventDefault(); smoothScrollTo("top"); }} className="cf-logo" aria-label="Cúpula Futurista" style={{ color }}>
      {!mark && (
        <span className="cf-logo-word">
          <span className="cf-logo-name">Cúpula Futurista</span>
        </span>
      )}
    </a>
  );
}

// ----- Nav -----
function Nav({ T, lang, setLang, scrolled, overDark }) {
  const [open, setOpen] = useState(false);
  return (
    <header className={`cf-nav ${scrolled ? "is-scrolled" : ""} ${overDark ? "is-over-dark" : ""}`} role="banner">
      <div className="cf-nav-inner">
        <Logo light={!scrolled || overDark} />

        <nav className="cf-nav-links" aria-label="Primary">
          {[
            ["home", T.nav_home],
            ["services", T.nav_services],
            ["work", T.nav_work],
            ["about", T.nav_about],
            ["contact", T.nav_contact],
          ].map(([id, label]) => (
            <a key={id} href={`#${id}`} onClick={(e) => { e.preventDefault(); smoothScrollTo(id); }}>{label}</a>
          ))}
        </nav>

        <div className="cf-nav-right">
          <div className="cf-lang" role="group" aria-label="Language">
            <button className={lang === "pt" ? "is-on" : ""} onClick={() => setLang("pt")} aria-label="Português">
              <span>PT</span>
            </button>
            <span className="cf-lang-sep" aria-hidden="true">/</span>
            <button className={lang === "en" ? "is-on" : ""} onClick={() => setLang("en")} aria-label="English">
              <span>EN</span>
            </button>
          </div>
          <a href="#contact" onClick={(e) => { e.preventDefault(); smoothScrollTo("contact"); }} className="cf-btn cf-btn-primary cf-nav-cta">{T.nav_quote}</a>
          <button className="cf-burger" aria-label="Menu" aria-expanded={open} onClick={() => setOpen(o => !o)}>
            <span /><span /><span />
          </button>
        </div>
      </div>

      {open && (
        <div className="cf-nav-drawer">
          {[
            ["home", T.nav_home],
            ["services", T.nav_services],
            ["work", T.nav_work],
            ["about", T.nav_about],
            ["contact", T.nav_contact],
          ].map(([id, label]) => (
            <a key={id} href={`#${id}`} onClick={(e) => { e.preventDefault(); setOpen(false); smoothScrollTo(id); }}>{label}</a>
          ))}
          <a href="#contact" onClick={(e) => { e.preventDefault(); setOpen(false); smoothScrollTo("contact"); }} className="cf-btn cf-btn-primary">{T.nav_quote}</a>
        </div>
      )}
    </header>
  );
}

// ----- Hero -----
function Hero({ T, headline, variant }) {
  const ref = useRef(null);
  const [y, setY] = useState(0);
  useEffect(() => {
    const onScroll = () => setY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const heroImg = "uploads/antoine-gravier-ndzN00BH9mg-unsplash.jpg";
  const heroSplit = "https://images.unsplash.com/photo-1615873968403-89e068629265?w=1400&auto=format&fit=crop";

  if (variant === "split") {
    return (
      <section id="home" className="cf-hero cf-hero-split" data-screen-label="01 Hero">
        <div className="cf-hero-split-text">
          <div className="cf-eyebrow">{T.hero_kicker}</div>
          <h1 className="cf-hero-title">{headline.split(",").map((part, i) => (
            <span key={i} className="cf-hero-line">{part}{i === 0 ? "," : ""}</span>
          ))}</h1>
          <p className="cf-hero-sub">{T.hero_sub}</p>
          <div className="cf-hero-ctas">
            <a href="#contact" onClick={(e) => { e.preventDefault(); smoothScrollTo("contact"); }} className="cf-btn cf-btn-primary cf-btn-lg">{T.hero_cta_primary}</a>
            <a href="#work" onClick={(e) => { e.preventDefault(); smoothScrollTo("work"); }} className="cf-btn cf-btn-ghost cf-btn-lg">{T.hero_cta_secondary} →</a>
          </div>
        </div>
        <div className="cf-hero-split-img">
          <img src={heroSplit} alt="Renovated Portuguese interior" loading="eager" />
        </div>
      </section>
    );
  }

  return (
    <section id="home" ref={ref} className="cf-hero cf-hero-fullbleed" data-screen-label="01 Hero">
      <div className="cf-hero-bg" style={{ transform: `translateY(${y * 0.3}px) scale(${1 + y * 0.0003})` }}>
        <img src={heroImg} alt="Beautifully renovated Portuguese home" />
      </div>
      <div className="cf-hero-overlay" />

      <div className="cf-hero-content">
        <div className="cf-eyebrow cf-eyebrow-light">{T.hero_kicker}</div>
        <h1 className="cf-hero-title">
          {headline.split(",").map((part, i, arr) => (
            <span key={i} className="cf-hero-line">{part.trim()}{i < arr.length - 1 ? "," : ""}</span>
          ))}
        </h1>
        <p className="cf-hero-sub">{T.hero_sub}</p>
        <div className="cf-hero-ctas">
          <a href="#contact" onClick={(e) => { e.preventDefault(); smoothScrollTo("contact"); }} className="cf-btn cf-btn-primary cf-btn-lg">{T.hero_cta_primary}</a>
          <a href="#work" onClick={(e) => { e.preventDefault(); smoothScrollTo("work"); }} className="cf-btn cf-btn-light cf-btn-lg">{T.hero_cta_secondary} →</a>
        </div>
      </div>

      <button className="cf-hero-scroll" onClick={() => smoothScrollTo("strip")} aria-label={T.hero_scroll}>
        <span>{T.hero_scroll}</span>
        <svg viewBox="0 0 12 24" width="10" height="20"><path d="M 6 0 L 6 22 M 1 17 L 6 22 L 11 17" stroke="currentColor" strokeWidth="1.2" fill="none" /></svg>
      </button>
    </section>
  );
}

// ----- Marquee strip -----
function Strip({ T }) {
  const items = [T.strip_a, T.strip_b, T.strip_c, T.strip_d, T.strip_e];
  return (
    <div id="strip" className="cf-strip" aria-hidden="true">
      <div className="cf-strip-track">
        {[...items, ...items, ...items].map((item, i) => (
          <span key={i} className="cf-strip-item">
            <svg viewBox="0 0 24 24" width="14" height="14"><circle cx="12" cy="12" r="2.5" fill="currentColor" /></svg>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

// ----- Services -----
function Services({ T }) {
  const services = [
    { num: "01", title: T.serv_1_title, body: T.serv_1_body, icon: "renovation", details: T.serv_1_details },
    { num: "02", title: T.serv_2_title, body: T.serv_2_body, icon: "construction", details: T.serv_2_details },
    { num: "03", title: T.serv_3_title, body: T.serv_3_body, icon: "maintenance", details: T.serv_3_details },
  ];
  return (
    <section id="services" className="cf-section" data-screen-label="04 Services">
      <div className="cf-container">
        <header className="cf-section-head">
          <div className="cf-eyebrow">{T.serv_eyebrow}</div>
          <h2 className="cf-h2" style={{ whiteSpace: "pre-line" }}>{T.serv_title}</h2>
        </header>
        <div className="cf-serv-grid">
          {services.map((s) => (
            <ServiceCard key={s.num} s={s} T={T} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ServiceCard({ s, T }) {
  const [flipped, setFlipped] = useState(false);
  const toggle = () => setFlipped(f => !f);
  const onKey = (e) => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(); }
    if (e.key === "Escape" && flipped) { setFlipped(false); }
  };
  return (
    <article className={`cf-serv-card ${flipped ? "is-flipped" : ""}`}>
      <div className="cf-serv-flip">
        <div
          className="cf-serv-face cf-serv-front"
          role="button"
          tabIndex={flipped ? -1 : 0}
          aria-pressed={flipped}
          aria-hidden={flipped}
          onClick={toggle}
          onKeyDown={onKey}
        >
          <div className="cf-serv-num">{s.num}</div>
          <ServiceIcon kind={s.icon} />
          <h3 className="cf-serv-title">{s.title}</h3>
          <p className="cf-serv-body">{s.body}</p>
          <span className="cf-serv-link">{T.serv_more} →</span>
        </div>
        <div className="cf-serv-face cf-serv-back" aria-hidden={!flipped}>
          <button
            type="button"
            className="cf-serv-close"
            onClick={toggle}
            tabIndex={flipped ? 0 : -1}
            aria-label={T.serv_back_close}
          >←</button>
          <div className="cf-serv-num">{s.num}</div>
          <h3 className="cf-serv-title">{s.title}</h3>
          <ul className="cf-serv-list">
            {s.details.map((d, i) => <li key={i}>{d}</li>)}
          </ul>
          <a
            href="#contact"
            onClick={(e) => { e.preventDefault(); setFlipped(false); smoothScrollTo("contact"); }}
            className="cf-serv-link"
            tabIndex={flipped ? 0 : -1}
          >{T.serv_back_cta} →</a>
        </div>
      </div>
    </article>
  );
}

function ServiceIcon({ kind }) {
  const stroke = "var(--cf-ink)";
  if (kind === "renovation") {
    // Paint roller: roller cylinder, yoke, handle, with a wet-paint accent stripe above
    return (
      <svg viewBox="0 0 64 64" width="40" height="40" aria-hidden="true">
        <rect x="8" y="8" width="48" height="3" fill="var(--cf-accent)" />
        <rect x="10" y="14" width="44" height="9" rx="1" fill="none" stroke={stroke} strokeWidth="1.4" />
        <path d="M 50 23 L 50 30 L 32 30 L 32 36" fill="none" stroke={stroke} strokeWidth="1.4" strokeLinejoin="round" />
        <rect x="28" y="36" width="8" height="18" rx="1" fill="none" stroke={stroke} strokeWidth="1.4" />
      </svg>
    );
  }
  if (kind === "construction") {
    // Blueprint sheet: page outline with folded corner, subtle grid, accent floor plan
    return (
      <svg viewBox="0 0 64 64" width="40" height="40" aria-hidden="true">
        <path d="M 12 8 L 44 8 L 54 18 L 54 56 L 12 56 Z" fill="none" stroke={stroke} strokeWidth="1.4" strokeLinejoin="round" />
        <path d="M 44 8 L 44 18 L 54 18" fill="none" stroke={stroke} strokeWidth="1.4" strokeLinejoin="round" />
        <line x1="12" y1="26" x2="54" y2="26" stroke={stroke} strokeWidth="0.7" />
        <line x1="12" y1="36" x2="54" y2="36" stroke="var(--cf-accent)" strokeWidth="1.4" />
        <line x1="12" y1="46" x2="54" y2="46" stroke={stroke} strokeWidth="0.7" />
        <line x1="22" y1="18" x2="22" y2="56" stroke={stroke} strokeWidth="0.7" />
        <line x1="33" y1="18" x2="33" y2="56" stroke="var(--cf-accent)" strokeWidth="1.4" />
        <line x1="44" y1="18" x2="44" y2="56" stroke={stroke} strokeWidth="0.7" />
      </svg>
    );
  }
  // Maintenance: toolbox — arched handle, body, lid line, accent latch
  return (
    <svg viewBox="0 0 64 64" width="40" height="40" aria-hidden="true">
      <path d="M 22 22 L 22 16 Q 22 12 26 12 L 38 12 Q 42 12 42 16 L 42 22" fill="none" stroke={stroke} strokeWidth="1.4" strokeLinejoin="round" />
      <rect x="8" y="22" width="48" height="34" fill="none" stroke={stroke} strokeWidth="1.4" />
      <line x1="8" y1="32" x2="56" y2="32" stroke={stroke} strokeWidth="1" />
      <rect x="28" y="29" width="8" height="3" fill="var(--cf-accent)" />
    </svg>
  );
}

// ----- Why -----
function Why({ T }) {
  const items = [
    { num: "01", t: T.why_1_title, b: T.why_1_body },
    { num: "02", t: T.why_2_title, b: T.why_2_body },
    { num: "03", t: T.why_3_title, b: T.why_3_body },
    { num: "04", t: T.why_4_title, b: T.why_4_body },
  ];
  const gridRef = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { setInView(true); io.disconnect(); }
      });
    }, { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <section className="cf-section cf-section-tinted" data-screen-label="05 Why">
      <div className="cf-container">
        <header className="cf-section-head">
          <div className="cf-eyebrow">{T.why_eyebrow}</div>
          <h2 className="cf-h2" style={{ whiteSpace: "pre-line" }}>{T.why_title}</h2>
        </header>
        <div ref={gridRef} className={`cf-why-grid ${inView ? "is-in" : ""}`}>
          {items.map((it, i) => (
            <div key={it.num} className="cf-why-cell" style={{ "--i": i }}>
              <div className="cf-why-num">{it.num}</div>
              <h3 className="cf-why-title">{it.t}</h3>
              <p className="cf-why-body">{it.b}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ----- Portfolio -----
function Portfolio({ T }) {
  const projects = [
    { img: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1000&auto=format&fit=crop", title: T.port_proj_1, type: T.port_type_1, span: 2 },
    { img: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=900&auto=format&fit=crop", title: T.port_proj_2, type: T.port_type_2, span: 1 },
    { img: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=900&auto=format&fit=crop", title: T.port_proj_3, type: T.port_type_3, span: 1 },
    { img: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=900&auto=format&fit=crop", title: T.port_proj_4, type: T.port_type_4, span: 1 },
    { img: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=900&auto=format&fit=crop", title: T.port_proj_7, type: T.port_type_7, span: 1 },
    { img: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=900&auto=format&fit=crop", title: T.port_proj_5, type: T.port_type_5, span: 2 },
    { img: "https://images.unsplash.com/photo-1615874959474-d609969a20ed?w=900&auto=format&fit=crop", title: T.port_proj_6, type: T.port_type_6, span: 1 },
  ];

  return (
    <section id="work" className="cf-section" data-screen-label="06 Portfolio">
      <div className="cf-container">
        <header className="cf-section-head cf-section-head-row">
          <div>
            <div className="cf-eyebrow">{T.port_eyebrow}</div>
            <h2 className="cf-h2" style={{ whiteSpace: "pre-line" }}>{T.port_title}</h2>
          </div>
          <p className="cf-section-aside">{T.port_sub}</p>
        </header>

        <div className="cf-port-grid">
          {projects.map((p, i) => (
            <a key={i} href="https://instagram.com/cupulafuturista" target="_blank" rel="noopener" className={`cf-port-card cf-port-span-${p.span}`}>
              <div className="cf-port-img">
                <img src={p.img} alt={p.title} loading="lazy" />
              </div>
              <div className="cf-port-meta">
                <div>
                  <div className="cf-port-type">{p.type}</div>
                  <div className="cf-port-title">{p.title}</div>
                </div>
                <div className="cf-port-year">{T.port_year}</div>
              </div>
              <div className="cf-port-overlay">
                <span className="cf-port-overlay-icon">↗</span>
              </div>
            </a>
          ))}
        </div>

        <div className="cf-port-foot">
          <a href="https://instagram.com/cupulafuturista" target="_blank" rel="noopener" className="cf-btn cf-btn-ghost">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" /></svg>
            {T.port_view_ig} @cupulafuturista
          </a>
        </div>
      </div>
    </section>
  );
}

// ----- Testimonials -----
function Testimonials({ T }) {
  const quotes = [
    { q: T.test_1_quote, n: T.test_1_name, r: T.test_1_role },
    { q: T.test_2_quote, n: T.test_2_name, r: T.test_2_role },
    { q: T.test_3_quote, n: T.test_3_name, r: T.test_3_role },
    { q: T.test_4_quote, n: T.test_4_name, r: T.test_4_role },
    { q: T.test_5_quote, n: T.test_5_name, r: T.test_5_role },
  ];
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % quotes.length), 7000);
    return () => clearInterval(t);
  }, [quotes.length]);

  return (
    <section className="cf-section cf-section-dark" data-screen-label="07 Testimonials">
      <div className="cf-container">
        <header className="cf-section-head">
          <div className="cf-eyebrow cf-eyebrow-light">{T.test_eyebrow}</div>
          <h2 className="cf-h2 cf-h2-light" style={{ whiteSpace: "pre-line" }}>{T.test_title}</h2>
        </header>

        <div className="cf-test-split">
          <div className="cf-test-quote-col">
            <svg className="cf-test-mark-xl" viewBox="0 0 40 32" width="80" height="64" aria-hidden="true">
              <path d="M 0 32 L 0 16 C 0 7 7 0 16 0 L 16 6 C 11 6 8 10 8 14 L 8 16 L 16 16 L 16 32 Z M 24 32 L 24 16 C 24 7 31 0 40 0 L 40 6 C 35 6 32 10 32 14 L 32 16 L 40 16 L 40 32 Z" fill="var(--cf-accent)" />
            </svg>
            <div className="cf-test-quote-stage">
              {quotes.map((q, i) => (
                <blockquote key={i} className={`cf-test-quote-card ${i === idx ? "is-active" : ""}`} aria-hidden={i !== idx}>
                  <p className="cf-test-quote-xl">{q.q}</p>
                </blockquote>
              ))}
            </div>
          </div>

          <div className="cf-test-list-wrap">
            <ol className="cf-test-list" role="tablist">
              {quotes.map((q, i) => (
                <li key={i}>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={i === idx}
                    className={`cf-test-list-item ${i === idx ? "is-active" : ""}`}
                    onClick={() => setIdx(i)}
                  >
                    <span className="cf-test-list-num">{String(i + 1).padStart(2, "0")}</span>
                    <span className="cf-test-list-body">
                      <span className="cf-test-list-name">{q.n}</span>
                      <span className="cf-test-list-role">{q.r}</span>
                    </span>
                    <span className="cf-test-list-bar" aria-hidden="true" />
                  </button>
                </li>
              ))}
            </ol>
            <div className="cf-test-more">
              <span className="cf-test-more-count">{T.test_more}</span>
              <a
                href="#work"
                onClick={(e) => { e.preventDefault(); smoothScrollTo("work"); }}
                className="cf-test-more-link"
              >
                {T.test_more_link} <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ----- Stat with count-up animation -----
function CountUpStat({ value, duration = 1500 }) {
  // Parse leading numeric portion + suffix (e.g. "30+" → 30 / "+", "100%" → 100 / "%")
  const match = String(value).match(/^(\d+)(.*)$/);
  const target = match ? parseInt(match[1], 10) : 0;
  const suffix = match ? match[2] : "";
  const [shown, setShown] = useState(target ? 0 : value);
  const ref = useRef(null);
  const startedRef = useRef(false);

  useEffect(() => {
    if (!target) return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting && !startedRef.current) {
          startedRef.current = true;
          const t0 = performance.now();
          const tick = (now) => {
            const t = Math.min(1, (now - t0) / duration);
            const eased = 1 - Math.pow(1 - t, 3);
            setShown(Math.round(target * eased));
            if (t < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      });
    }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, [target, duration]);

  return <span ref={ref}>{target ? `${shown}${suffix}` : value}</span>;
}

// ----- About -----
function About({ T }) {
  const stats = [
    { n: T.about_stat_1_n, l: T.about_stat_1_l },
    { n: T.about_stat_2_n, l: T.about_stat_2_l },
    { n: T.about_stat_3_n, l: T.about_stat_3_l },
    { n: T.about_stat_4_n, l: T.about_stat_4_l },
  ];
  return (
    <section id="about" className="cf-section" data-screen-label="08 About">
      <div className="cf-container">
        <div className="cf-about-grid">
          <div className="cf-about-text">
            <div className="cf-eyebrow">{T.about_eyebrow}</div>
            <h2 className="cf-h2" style={{ whiteSpace: "pre-line" }}>{T.about_title}</h2>
            <p className="cf-about-p">{T.about_p1}</p>
            <p className="cf-about-p">{T.about_p2}</p>
            <div className="cf-about-stats">
              {stats.map((s, i) => (
                <div key={i} className="cf-about-stat">
                  <div className="cf-about-stat-n"><CountUpStat value={s.n} /></div>
                  <div className="cf-about-stat-l">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="cf-about-img">
            <img src="uploads/image.png" alt="Equipa em obra" loading="lazy" />
            <div className="cf-about-img-cap">
              <div className="cf-about-img-cap-l">, Em obra</div>
              <div className="cf-about-img-cap-v">Lisboa, 2025</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ----- Contact -----
function Contact({ T, lang }) {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", type: "", message: "" });
  const onSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 5000);
    setForm({ name: "", email: "", phone: "", type: "", message: "" });
  };

  return (
    <section id="contact" className="cf-section cf-section-contact" data-screen-label="09 Contact">
      <div className="cf-container">
        <div className="cf-contact-grid">
          <div className="cf-contact-text">
            <div className="cf-eyebrow">{T.contact_eyebrow}</div>
            <h2 className="cf-h2" style={{ whiteSpace: "pre-line" }}>{T.contact_title}</h2>
            <p className="cf-lede">{T.contact_sub}</p>

            <ul className="cf-contact-info">
              <li>
                <span className="cf-contact-info-l">{T.contact_phone_l}</span>
                <span>+351 912 345 678</span>
              </li>
              <li>
                <span className="cf-contact-info-l">{T.contact_email_l}</span>
                <span>ola@cupulafuturista.pt</span>
              </li>
              <li>
                <span className="cf-contact-info-l">{T.contact_loc_l}</span>
                <span>{T.contact_loc_v}</span>
              </li>
              <li>
                <span className="cf-contact-info-l">{T.contact_ig_l}</span>
                <a href="https://instagram.com/cupulafuturista" target="_blank" rel="noopener">@cupulafuturista</a>
              </li>
            </ul>
          </div>

          <form className="cf-contact-form" onSubmit={onSubmit}>
            <div className="cf-field">
              <label htmlFor="cf-name">{T.contact_name}</label>
              <input id="cf-name" type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="cf-field-row">
              <div className="cf-field">
                <label htmlFor="cf-email">{T.contact_email}</label>
                <input id="cf-email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <div className="cf-field">
                <label htmlFor="cf-phone">{T.contact_phone}</label>
                <input id="cf-phone" type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
            </div>
            <div className="cf-field">
              <label htmlFor="cf-type">{T.contact_type}</label>
              <select id="cf-type" required value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                <option value="" disabled hidden>,</option>
                <option value="renovation">{T.contact_type_1}</option>
                <option value="construction">{T.contact_type_2}</option>
                <option value="maintenance">{T.contact_type_3}</option>
                <option value="other">{T.contact_type_4}</option>
              </select>
            </div>
            <div className="cf-field">
              <label htmlFor="cf-msg">{T.contact_message}</label>
              <textarea id="cf-msg" rows="5" placeholder={T.contact_message_ph} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
            </div>
            <button type="submit" className="cf-btn cf-btn-primary cf-btn-lg cf-btn-block">{sent ? "✓ " + T.contact_sent : T.contact_send}</button>
            <p className="cf-contact-response">{T.contact_response}</p>
          </form>
        </div>
      </div>
    </section>
  );
}

// ----- Footer -----
function Footer({ T, setLang, lang }) {
  return (
    <footer className="cf-footer" data-screen-label="10 Footer">
      <div className="cf-container">
        <div className="cf-foot-top">
          <div className="cf-foot-brand">
            <Logo />
            <p className="cf-foot-tag">{T.foot_tag}</p>
          </div>

          <div className="cf-foot-col">
            <div className="cf-foot-col-h">{T.foot_quick}</div>
            <a href="#home" onClick={(e) => { e.preventDefault(); smoothScrollTo("home"); }}>{T.nav_home}</a>
            <a href="#services" onClick={(e) => { e.preventDefault(); smoothScrollTo("services"); }}>{T.nav_services}</a>
            <a href="#work" onClick={(e) => { e.preventDefault(); smoothScrollTo("work"); }}>{T.nav_work}</a>
            <a href="#about" onClick={(e) => { e.preventDefault(); smoothScrollTo("about"); }}>{T.nav_about}</a>
            <a href="#contact" onClick={(e) => { e.preventDefault(); smoothScrollTo("contact"); }}>{T.nav_contact}</a>
          </div>

          <div className="cf-foot-col">
            <div className="cf-foot-col-h">{T.foot_contact}</div>
            <a href="tel:+351912345678">+351 912 345 678</a>
            <a href="mailto:ola@cupulafuturista.pt">ola@cupulafuturista.pt</a>
            <span>{T.contact_loc_v}</span>
          </div>

          <div className="cf-foot-col">
            <div className="cf-foot-col-h">{T.foot_social}</div>
            <a href="https://instagram.com/cupulafuturista" target="_blank" rel="noopener" className="cf-foot-ig">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" /></svg>
              @cupulafuturista
            </a>
          </div>
        </div>

        <div className="cf-foot-bot">
          <span>© 2026 Cúpula Futurista · {T.foot_rights}</span>
          <a href="#">{T.foot_legal}</a>
        </div>
      </div>
    </footer>
  );
}

// ----- Tweaks panel (custom, since we want it bilingual + branded) -----
function TweaksUI({ tweaks, set, T, lang }) {
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const onMsg = (e) => {
      if (!e.data) return;
      if (e.data.type === "__activate_edit_mode") setShown(true);
      if (e.data.type === "__deactivate_edit_mode") setShown(false);
    };
    window.addEventListener("message", onMsg);
    window.parent.postMessage({ type: "__edit_mode_available" }, "*");
    return () => window.removeEventListener("message", onMsg);
  }, []);

  if (!shown) return null;

  const Section = ({ label, children }) => (
    <div className="cf-tw-sec">
      <div className="cf-tw-sec-l">{label}</div>
      {children}
    </div>
  );

  const Seg = ({ value, options, onChange }) => (
    <div className="cf-tw-seg">
      {options.map(o => (
        <button key={o.v} className={value === o.v ? "is-on" : ""} onClick={() => onChange(o.v)}>{o.l}</button>
      ))}
    </div>
  );

  return (
    <div className="cf-tw">
      <div className="cf-tw-head">
        <span className="cf-tw-title">{T.tw_title}</span>
        <button className="cf-tw-close" onClick={() => {
          setShown(false);
          window.parent.postMessage({ type: "__edit_mode_dismissed" }, "*");
        }} aria-label="Close">×</button>
      </div>

      <Section label={T.tw_accent}>
        <div className="cf-tw-swatches">
          {Object.entries(ACCENTS).map(([k, v]) => (
            <button key={k} className={`cf-tw-swatch ${tweaks.accent === k ? "is-on" : ""}`} onClick={() => set("accent", k)} style={{ background: v.hex }} aria-label={v.name} title={v.name} />
          ))}
        </div>
      </Section>

      <Section label={T.tw_heading_font}>
        <Seg value={tweaks.headingFont} onChange={(v) => set("headingFont", v)}
          options={[
            { v: "geometric", l: "Geo" },
            { v: "serif", l: "Serif" },
            { v: "mono", l: "Mono" },
          ]} />
      </Section>

      <Section label={T.tw_density}>
        <Seg value={tweaks.density} onChange={(v) => set("density", v)}
          options={[
            { v: "cozy", l: "−" },
            { v: "comfortable", l: "•" },
            { v: "spacious", l: "+" },
          ]} />
      </Section>

      <Section label={T.tw_hero_variant}>
        <Seg value={tweaks.heroVariant} onChange={(v) => set("heroVariant", v)}
          options={[
            { v: "fullbleed", l: lang === "pt" ? "Inteiro" : "Full" },
            { v: "split", l: "Split" },
          ]} />
      </Section>

      <Section label={T.tw_anim_variant}>
        <Seg value={tweaks.animVariant} onChange={(v) => set("animVariant", v)}
          options={[
            { v: "blueprint", l: lang === "pt" ? "Planta" : "Blueprint" },
            { v: "photo", l: "Foto" },
            { v: "iso", l: "Iso" },
          ]} />
      </Section>

      <Section label={T.tw_show_anim}>
        <Seg value={tweaks.showAnim ? "on" : "off"} onChange={(v) => set("showAnim", v === "on")}
          options={[
            { v: "on", l: lang === "pt" ? "Sim" : "On" },
            { v: "off", l: lang === "pt" ? "Não" : "Off" },
          ]} />
      </Section>

      <Section label={T.tw_headline}>
        <textarea
          className="cf-tw-text"
          rows="2"
          value={lang === "pt" ? tweaks.headlinePT : tweaks.headlineEN}
          onChange={(e) => set(lang === "pt" ? "headlinePT" : "headlineEN", e.target.value)}
        />
      </Section>
    </div>
  );
}

// ----- Root -----
function App() {
  const [tweaks, setTweaks] = useTweaks(TWEAK_DEFAULTS);
  const [lang, setLang] = useState(tweaks.lang || "pt");
  const [scrolled, setScrolled] = useState(false);
  const [overDark, setOverDark] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50);
      const navBand = 80;
      const dark = document.querySelectorAll(".cf-section-dark");
      let hit = false;
      dark.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top <= navBand && r.bottom >= 0) hit = true;
      });
      setOverDark(hit);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang === "pt" ? "pt-PT" : "en";
  }, [lang]);

  const T = window.CF_I18N[lang];
  const accent = ACCENTS[tweaks.accent].hex;
  const headingFont = HEADING_FONTS[tweaks.headingFont].stack;
  const density = DENSITIES[tweaks.density].scale;

  // Apply CSS vars
  useEffect(() => {
    const r = document.documentElement;
    r.style.setProperty("--cf-accent", accent);
    r.style.setProperty("--cf-heading", headingFont);
    r.style.setProperty("--cf-density", density);
  }, [accent, headingFont, density]);

  const headline = lang === "pt" ? tweaks.headlinePT : tweaks.headlineEN;

  return (
    <div id="top">
      <Nav T={T} lang={lang} setLang={setLang} scrolled={scrolled} overDark={overDark} />
      <Hero T={T} headline={headline} variant={tweaks.heroVariant} />
      <Strip T={T} />
      {tweaks.showAnim && <ScrollAnimSection variant={tweaks.animVariant} T={T} />}
      <Services T={T} />
      <Why T={T} />
      <Portfolio T={T} />
      <Testimonials T={T} />
      <About T={T} />
      <Contact T={T} lang={lang} />
      <Footer T={T} lang={lang} setLang={setLang} />
      <TweaksUI tweaks={tweaks} set={setTweaks} T={T} lang={lang} />
    </div>
  );
}

window.App = App;
