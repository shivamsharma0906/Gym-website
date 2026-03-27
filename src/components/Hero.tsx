// Hero.tsx — Awwwards-Level Interactive Experience
import { useEffect, useRef, useState } from 'react';
import {
  motion, useSpring, useTransform, useMotionValue, useMotionTemplate,
} from 'framer-motion';
import './Hero.css';

/* ── Constants ── */
const RADIUS       = 28;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const CHARS        = '!<>-_\\/[]{}—=+*^?#@$%&~|';

/* ── Variants ── */
const staggerContainer = {
  hidden : {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.25 } },
};
const fadeUp = {
  hidden : { opacity: 0, y: 36 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 80, damping: 20 } },
};
const fadeRight = {
  hidden : { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0, transition: { type: 'spring' as const, stiffness: 65, damping: 18, delay: 0.45 } },
};

/* ── Text Scramble ── */
interface ScrambleProps { text: string; delay?: number; duration?: number; className?: string; }
const ScrambleText = ({ text, delay = 0, duration = 1.5, className }: ScrambleProps) => {
  const [out, setOut] = useState(() =>
    text.split('').map(c => (c === ' ' ? ' ' : CHARS[0])).join('')
  );
  useEffect(() => {
    let raf = 0;
    let start: number | null = null;
    const ms = duration * 1000;
    const t = setTimeout(() => {
      const tick = (now: number) => {
        if (!start) start = now;
        const p = Math.min((now - start) / ms, 1);
        const locked = Math.floor(p * text.length);
        setOut(text.split('').map((ch, i) => {
          if (ch === ' ') return ' ';
          if (i < locked) return ch;
          return CHARS[Math.floor(Math.random() * CHARS.length)];
        }).join(''));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, delay * 1000);
    return () => { clearTimeout(t); cancelAnimationFrame(raf); };
  }, [text, delay, duration]);
  return <span className={className}>{out}</span>;
};

/* ── Magnetic Button ── */
interface MagBtnProps { href: string; children: React.ReactNode; className: string; threshold?: number; strength?: number; }
const MagneticButton = ({ href, children, className, threshold = 90, strength = 0.38 }: MagBtnProps) => {
  const ref = useRef<HTMLElement>(null);
  const bx = useMotionValue(0), by = useMotionValue(0);
  const tx = useMotionValue(0), ty = useMotionValue(0);
  const cfg  = { stiffness: 200, damping: 16 };
  const tcfg = { stiffness: 300, damping: 20 };
  const bsx = useSpring(bx, cfg),  bsy = useSpring(by, cfg);
  const tsx = useSpring(tx, tcfg), tsy = useSpring(ty, tcfg);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      if (!ref.current) return;
      const r  = ref.current.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width  / 2);
      const dy = e.clientY - (r.top  + r.height / 2);
      const d  = Math.hypot(dx, dy);
      if (d < threshold) {
        bx.set(dx * strength);      by.set(dy * strength);
        tx.set(dx * strength * 1.5); ty.set(dy * strength * 1.5);
      } else {
        bx.set(0); by.set(0); tx.set(0); ty.set(0);
      }
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, [threshold, strength, bx, by, tx, ty]);

  return (
    // @ts-ignore
    <motion.a ref={ref} href={href} className={className} style={{ x: bsx, y: bsy, display: 'inline-flex' }}>
      <motion.span style={{ x: tsx, y: tsy, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
        {children}
      </motion.span>
    </motion.a>
  );
};

/* ── Hero ── */
const Hero = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  /* Global mouse (normalised 0..1) for 3D tilt + glare */
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const tiltCfg = { stiffness: 55, damping: 18 };
  const rotateY = useSpring(useTransform(mouseX, [0, 1], [-12, 12]), tiltCfg);
  const rotateX = useSpring(useTransform(mouseY, [0, 1], [8,  -8]),  tiltCfg);
  const glareX  = useTransform(mouseX, [0, 1], ['0%', '100%']);
  const glareY  = useTransform(mouseY, [0, 1], ['0%', '100%']);
  const glare   = useMotionTemplate`radial-gradient(circle at ${glareX} ${glareY}, rgba(255,255,255,0.08) 0%, transparent 55%)`;

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    mouseX.set(e.clientX / window.innerWidth);
    mouseY.set(e.clientY / window.innerHeight);
  };
  const handleMouseLeave = () => { mouseX.set(0.5); mouseY.set(0.5); };

  /* ── Canvas: HiDPI + mouse repulsion + motion trail ── */
  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx    = canvas.getContext('2d')!;
    let animId   = 0;
    const mouse  = { x: -999, y: -999 };

    const onMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    };
    window.addEventListener('mousemove', onMove);

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const w = canvas.offsetWidth, h = canvas.offsetHeight;
      canvas.width  = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener('resize', resize);

    const W = () => canvas.offsetWidth;
    const H = () => canvas.offsetHeight;

    const particles = Array.from({ length: 95 }, () => {
      const vx = (Math.random() - 0.5) * 0.5;
      const vy = (Math.random() - 0.5) * 0.5;
      return {
        x: Math.random() * W(), y: Math.random() * H(),
        vx, vy, baseVx: vx, baseVy: vy,
        r: Math.random() * 2 + 0.5,
        o: Math.random() * 0.45 + 0.12,
      };
    });

    const draw = () => {
      const w = W(), h = H();
      /* Motion trail instead of clearRect */
      ctx.fillStyle = 'rgba(6,6,6,0.18)';
      ctx.fillRect(0, 0, w, h);

      particles.forEach(p => {
        /* Mouse repulsion */
        const dx = p.x - mouse.x, dy = p.y - mouse.y;
        const d  = Math.hypot(dx, dy);
        if (d < 150 && d > 0) {
          const f = ((150 - d) / 150) * 1.2;
          p.vx += (dx / d) * f; p.vy += (dy / d) * f;
        }
        /* Drift back */
        p.vx += (p.baseVx - p.vx) * 0.02;
        p.vy += (p.baseVy - p.vy) * 0.02;
        /* Speed cap + friction */
        const sp = Math.hypot(p.vx, p.vy);
        if (sp > 4) { p.vx = p.vx / sp * 4; p.vy = p.vy / sp * 4; }
        p.vx *= 0.97; p.vy *= 0.97;
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;

        /* Glow halo */
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4.5);
        g.addColorStop(0, `rgba(230,0,26,${p.o})`);
        g.addColorStop(1, 'rgba(230,0,26,0)');
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 4.5, 0, Math.PI * 2);
        ctx.fillStyle = g; ctx.fill();
        /* Core */
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(230,0,26,${Math.min(p.o + 0.15, 0.9)})`; ctx.fill();
      });

      /* Connections */
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i], b = particles[j];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < 140) {
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(230,0,26,${0.13 * (1 - dist / 140)})`;
            ctx.lineWidth = 0.6; ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
    };
  }, []);

  const floatCards = [
    { pos: 'card-1', icon: '🔥', label: 'Calories Burned', val: '850 kcal', delta: '↑ 12%' },
    { pos: 'card-2', icon: '💪', label: 'Workouts Done',   val: '1,247',   delta: '↑ 8%'  },
    { pos: 'card-3', icon: '⭐', label: 'Rating',          val: '4.9 / 5.0', delta: null  },
  ];

  return (
    <section
      className="hero" id="hero"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* ── Decorative background ── */}
      <canvas ref={canvasRef} className="hero__canvas" aria-hidden="true" />
      <div className="hero__grid-overlay" aria-hidden="true" />
      <div className="hero__red-slash"    aria-hidden="true" />
      <div className="hero__scan-line"    aria-hidden="true" />
      <div className="hero__red-glow"     aria-hidden="true" />

      {/* Film grain SVG */}
      <svg className="hero__grain" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
        <filter id="hero-noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="200%" height="200%" filter="url(#hero-noise)" />
      </svg>

      <div className="hero__corner hero__corner--tl" aria-hidden="true" />
      <div className="hero__corner hero__corner--tr" aria-hidden="true" />
      <div className="hero__corner hero__corner--bl" aria-hidden="true" />
      <div className="hero__corner hero__corner--br" aria-hidden="true" />

      <div className="hero__container container">

        {/* ── LEFT COLUMN ── */}
        <motion.div className="hero__content" variants={staggerContainer} initial="hidden" animate="visible">
          <motion.div className="hero__badge" variants={fadeUp}>
            <span className="hero__badge-dot" />
            #1 Premium Fitness Center
          </motion.div>

          <motion.p className="hero__eyebrow" variants={fadeUp}>Est. 2018 · Mumbai, India</motion.p>

          <motion.h1 className="hero__title" variants={fadeUp}>
            <ScrambleText text="Forge Your"   delay={0.3} duration={1.4} />
            <ScrambleText text=" Limits."     delay={0.7} duration={1.2} className="hero__title--accent" />
            <ScrambleText text=" Break Them." delay={1.1} duration={1.1} className="hero__title--outline" />
          </motion.h1>

          <motion.p className="hero__description" variants={fadeUp}>
            Elite training, science-backed nutrition, and relentless coaching —
            built for those who refuse ordinary.
          </motion.p>

          <motion.div className="hero__actions" variants={fadeUp}>
            <MagneticButton href="#pricing" className="hero__btn-main" threshold={90} strength={0.38}>
              Start Your Journey
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </MagneticButton>
            <MagneticButton href="#programs" className="hero__btn-outline" threshold={80} strength={0.3}>
              Explore Programs
            </MagneticButton>
          </motion.div>

          <motion.div className="hero__stats" variants={fadeUp}>
            {[
              { num: '15K+', lbl: 'Members'     },
              { num: '50+',  lbl: 'Trainers'    },
              { num: '98%',  lbl: 'Success Rate' },
              { num: '6 AM', lbl: 'Opens Daily'  },
            ].map(({ num, lbl }) => (
              <div className="hero__stat" key={lbl}>
                <span className="hero__stat-num">{num}</span>
                <span className="hero__stat-lbl">{lbl}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* ── RIGHT COLUMN ── */}
        <motion.div className="hero__visual" variants={fadeRight} initial="hidden" animate="visible">
          <div className="hero__orbit hero__orbit--1" aria-hidden="true"><div className="hero__orb-dot" /></div>
          <div className="hero__orbit hero__orbit--2" aria-hidden="true" />
          <div className="hero__orbit hero__orbit--3" aria-hidden="true" />

          <div className="hero__hex-frame">
            <span className="hero__hex-emoji">🏋️</span>
          </div>

          {/* 3D Holographic Tilt Cards */}
          {floatCards.map(({ pos, icon, label, val, delta }, idx) => (
            <motion.div
              key={pos}
              className={`hero__float-card hero__float-card--${pos}`}
              style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring' as const, stiffness: 80, damping: 16, delay: 0.65 + idx * 0.12 }}
            >
              {/* Moving glare / sheen */}
              <motion.div className="hero__float-glare" style={{ background: glare }} aria-hidden="true" />
              <span className="hero__float-icon">{icon}</span>
              <div>
                <div className="hero__float-label">{label}</div>
                <div className="hero__float-val">
                  {val} {delta && <span className="hero__float-delta">{delta}</span>}
                </div>
              </div>
            </motion.div>
          ))}

          {/* Animated SVG progress ring */}
          <div className="hero__ring-wrap">
            <svg width="80" height="80" viewBox="0 0 72 72" style={{ transform: 'rotate(-90deg)' }}>
              <circle cx="36" cy="36" r={RADIUS} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="4" />
              <motion.circle
                cx="36" cy="36" r={RADIUS} fill="none"
                stroke="#E6001A" strokeWidth="4" strokeLinecap="round"
                strokeDasharray={CIRCUMFERENCE}
                initial={{ strokeDashoffset: CIRCUMFERENCE }}
                animate={{ strokeDashoffset: CIRCUMFERENCE * (1 - 0.85) }}
                transition={{ duration: 2, ease: 'easeOut', delay: 1.2 }}
              />
            </svg>
            <div className="hero__ring-label">
              <span className="hero__ring-num">85%</span>
              <span className="hero__ring-txt">Goal</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;