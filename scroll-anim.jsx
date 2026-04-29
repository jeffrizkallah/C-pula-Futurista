// "How we work" section — sticky two-column layout
// Left: heading + numbered steps that light up as the user scrolls
// Right: before/after image slider whose divider sweeps with scroll progress

const { useState, useRef, useEffect } = React;

function useScrollProgress(ref) {
  const [p, setP] = useState(0);
  useEffect(() => {
    function update() {
      if (!ref.current) return;
      const r = ref.current.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = r.height + vh;
      const seen = vh - r.top;
      setP(Math.max(0, Math.min(1, seen / total)));
    }
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [ref]);
  return p;
}

function BeforeAfterSlider({ before, after, beforeLabel, afterLabel, pos }) {
  return (
    <div className="cf-ba">
      <img src={after} alt={afterLabel} className="cf-ba-img" draggable="false" />
      <div className="cf-ba-clip" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        <img src={before} alt={beforeLabel} className="cf-ba-img" draggable="false" />
      </div>
      <span className="cf-ba-tag cf-ba-tag-l" style={{ opacity: pos > 8 ? 1 : 0 }}>{beforeLabel}</span>
      <span className="cf-ba-tag cf-ba-tag-r" style={{ opacity: pos < 92 ? 1 : 0 }}>{afterLabel}</span>
      <div className="cf-ba-divider" style={{ left: `${pos}%` }} />
    </div>
  );
}

function ScrollAnimSection({ T }) {
  const ref = useRef(null);
  const progress = useScrollProgress(ref);

  // Slider sweep: hold "before" while approaching, sweep through middle, hold "after" while leaving
  const sweep = Math.max(0, Math.min(1, (progress - 0.2) / 0.55));
  const pos = (1 - sweep) * 100;

  const steps = [T.anim_step1, T.anim_step2, T.anim_step3, T.anim_step4, T.anim_step5];
  const activeStep = Math.min(steps.length - 1, Math.floor(progress * steps.length));
  // Rail fill: grows from the first dot to the active dot's center
  const railFill = Math.max(0, Math.min(1, (activeStep + (progress * steps.length - activeStep)) / (steps.length - 1)));

  return (
    <section ref={ref} className="cf-anim-section" id="how-we-work" data-screen-label="03 Before/After">
      <div className="cf-anim-wrap">
        <div className="cf-anim-text">
          <div className="cf-eyebrow">{T.anim_eyebrow}</div>
          <h2 className="cf-h2" style={{ whiteSpace: "pre-line" }}>{T.anim_title}</h2>
          <p className="cf-lede">{T.anim_body}</p>

          <div className="cf-anim-rail">
            <span className="cf-anim-rail-line" aria-hidden="true" />
            <span className="cf-anim-rail-fill" aria-hidden="true" style={{ height: `${railFill * 100}%` }} />
            <ol className="cf-anim-steps">
              {steps.map((s, i) => (
                <li key={i} className={i <= activeStep ? "is-active" : ""}>
                  <span className="cf-anim-step-dot" aria-hidden="true" />
                  <span className="cf-anim-step-num">{String(i + 1).padStart(2, "0")}</span>
                  <span className="cf-anim-step-label">{s}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="cf-anim-canvas">
          <div className="cf-anim-frame">
            <BeforeAfterSlider
              before="uploads/Gemini_Generated_Image_bgibmabgibmabgib.png"
              after="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1600&auto=format&fit=crop"
              beforeLabel={T.anim_before}
              afterLabel={T.anim_after}
              pos={pos}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

window.ScrollAnimSection = ScrollAnimSection;
window.BeforeAfterSlider = BeforeAfterSlider;
