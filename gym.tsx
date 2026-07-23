import { useState, useEffect, useRef } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
 
/* ─────────────────────────────── THEME ─────────────────────────────── */
const G = {
  bg: "#080808",
  surface: "#111111",
  surface2: "#191919",
  border: "#252525",
  red: "#E8001D",
  redDark: "#B5001A",
  white: "#F2F0E8",
  muted: "#888880",
  font: "'Barlow Condensed', sans-serif",
  fontBody: "'Barlow', sans-serif",
};
 
const injectFonts = () => {
  if (document.getElementById("gfonts")) return;
  const l = document.createElement("link");
  l.id = "gfonts";
  l.rel = "stylesheet";
  l.href = "https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,400;0,600;0,700;0,900;1,700&family=Barlow:wght@300;400;500;600&display=swap";
  document.head.appendChild(l);
};
 
/* ─────────────────────────────── DATA ─────────────────────────────── */
const WORKOUTS = {
  Chest: [
    { name: "Barbell Bench Press", sets: "4×8", duration: "45 min", instructions: ["Lie flat on bench, grip slightly wider than shoulder-width", "Unrack bar, lower slowly to mid-chest with elbows at 75°", "Drive bar up explosively, fully extending arms", "Maintain arch, feet flat on floor throughout"], mistakes: ["Bouncing bar off chest", "Flaring elbows 90°", "Lifting hips off bench"] },
    { name: "Incline Dumbbell Press", sets: "3×10", duration: "35 min", instructions: ["Set bench to 30-45°, hold dumbbells at shoulder height", "Press up in a slight arc, touch at top", "Lower with control over 2-3 seconds", "Keep shoulder blades retracted"], mistakes: ["Too steep an incline (turns into shoulder press)", "Dropping dumbbells fast"] },
    { name: "Cable Fly", sets: "3×12", duration: "25 min", instructions: ["Stand between cables set at chest height", "Slight forward lean, slight bend in elbows", "Bring hands together in arc motion", "Squeeze pecs hard at center"], mistakes: ["Straight arms (elbow injury risk)", "Rounding shoulders forward"] },
  ],
  Back: [
    { name: "Deadlift", sets: "4×5", duration: "50 min", instructions: ["Stand with mid-foot under bar, hip-width stance", "Hinge hips back, grip bar double-overhand", "Brace core, push floor away while keeping bar close", "Lock hips and knees simultaneously at top"], mistakes: ["Rounding lower back", "Bar drifting away from body", "Jerking the bar off floor"] },
    { name: "Pull-Up", sets: "4×8", duration: "30 min", instructions: ["Hang from bar, shoulder-width overhand grip", "Initiate by depressing shoulder blades", "Pull elbows to ribs, chin over bar", "Lower with full control"], mistakes: ["Kipping without strength base", "Partial range of motion"] },
    { name: "Barbell Row", sets: "3×10", duration: "35 min", instructions: ["Hinge to ~45° torso angle, overhand grip", "Pull bar to lower ribcage, elbows back", "Squeeze shoulder blades together at top", "Control descent"], mistakes: ["Jerking with hips", "Pulling to stomach instead of ribs"] },
  ],
  Legs: [
    { name: "Back Squat", sets: "4×8", duration: "50 min", instructions: ["Bar on traps, feet shoulder-width, toes out 15-30°", "Brace core and breath, break hips and knees simultaneously", "Descend until hip crease below knees", "Drive through whole foot to stand"], mistakes: ["Knees caving inward", "Forward lean from weak core", "Shallow depth"] },
    { name: "Romanian Deadlift", sets: "3×10", duration: "35 min", instructions: ["Hold bar at hip level, slight knee bend", "Push hips back, let bar drag down thighs", "Feel hamstring stretch, keep back flat", "Drive hips forward to return"], mistakes: ["Bending knees too much (becomes deadlift)", "Rounding back"] },
    { name: "Leg Press", sets: "4×12", duration: "30 min", instructions: ["Feet shoulder-width on platform", "Lower sled until knees at 90°", "Push through heels without locking knees", "Keep lower back on pad"], mistakes: ["Letting knees cave", "Locking knees fully at top"] },
  ],
  Arms: [
    { name: "Barbell Curl", sets: "3×12", duration: "25 min", instructions: ["Stand upright, underhand grip, elbows at sides", "Curl bar to shoulder level, squeeze bicep", "Lower with control over 2 seconds", "No swinging of hips"], mistakes: ["Swinging body for momentum", "Incomplete range of motion"] },
    { name: "Tricep Dips", sets: "3×12", duration: "25 min", instructions: ["Support body on parallel bars, slight forward lean", "Lower until upper arms parallel to floor", "Press up to near-lockout", "Elbows tracking back, not out"], mistakes: ["Going too deep (shoulder stress)", "Flaring elbows wide"] },
    { name: "Hammer Curl", sets: "3×12", duration: "20 min", instructions: ["Neutral grip (thumbs up), elbows at sides", "Curl up without rotating wrists", "Squeeze brachialis at top", "Full extension at bottom"], mistakes: ["Rotating to supinated grip", "Using momentum"] },
  ],
  Shoulders: [
    { name: "Overhead Press", sets: "4×8", duration: "40 min", instructions: ["Bar on front delts, grip just outside shoulders", "Brace core, press bar in slight arc overhead", "Tuck chin as bar passes face", "Full lockout overhead, arms vertical"], mistakes: ["Pressing forward (not vertical)", "Excessive back arch", "Shrugging at top"] },
    { name: "Lateral Raise", sets: "4×15", duration: "20 min", instructions: ["Slight forward lean, slight elbow bend", "Raise arms to shoulder height in arc", "Lead with elbows, not hands", "Control descent, no swinging"], mistakes: ["Raising hands above elbows", "Using too heavy weight with momentum"] },
    { name: "Face Pull", sets: "3×15", duration: "20 min", instructions: ["Cable at face height, rope attachment", "Pull to face, hands beside ears", "External rotate at end — elbows back and high", "Control return"], mistakes: ["Pulling to neck/chin", "Elbows dropping below shoulder"] },
  ],
};
 
const TRAINERS = [
  { name: "Vikram Singh", role: "Head Strength Coach", exp: "12 yrs", certs: "CSCS, NSCA-CPT", emoji: "💪" },
  { name: "Priya Sharma", role: "Nutrition & Yoga", exp: "9 yrs", certs: "RD, RYT-500", emoji: "🌿" },
  { name: "Arjun Mehta", role: "Boxing & Cardio", exp: "8 yrs", certs: "USA Boxing Coach", emoji: "🥊" },
  { name: "Sneha Kapoor", role: "Body Transformation", exp: "7 yrs", certs: "ACSM-EP, Precision Nutrition", emoji: "🏆" },
];
 
const DIET = {
  weightloss: {
    veg: {
      breakfast: "Moong dal chilla (2 pcs) + green chutney + 1 cup green tea (No sugar) — ~320 kcal",
      lunch: "1 cup brown rice + palak dal + mixed sabzi + cucumber raita — ~480 kcal",
      snack: "Handful of roasted chana + 1 seasonal fruit — ~180 kcal",
      dinner: "2 multigrain rotis + grilled paneer tikka + tomato soup — ~420 kcal",
      total: "~1400 kcal | Protein 75g | Carbs 155g | Fat 38g",
    },
    nonveg: {
      breakfast: "2 egg white omelette with spinach + 1 multigrain toast + black coffee — ~280 kcal",
      lunch: "Grilled chicken breast 150g + brown rice 1 cup + dal soup — ~520 kcal",
      snack: "Boiled egg 2 + cucumber sticks + lemon water — ~160 kcal",
      dinner: "Fish curry (surmai/rohu) + 2 bajra rotis + onion salad — ~440 kcal",
      total: "~1400 kcal | Protein 110g | Carbs 130g | Fat 32g",
    },
  },
  musclegain: {
    veg: {
      breakfast: "Paneer bhurji (100g paneer) + 3 multigrain rotis + 1 glass full-fat milk — ~650 kcal",
      lunch: "2 cups rice + chana masala + curd 200g + 1 banana — ~750 kcal",
      snack: "Peanut butter sandwich (2 slices) + 1 glass whole milk — ~480 kcal",
      dinner: "3 rotis + dal makhani + paneer sabzi + 2 tsp ghee — ~680 kcal",
      total: "~2560 kcal | Protein 115g | Carbs 310g | Fat 72g",
    },
    nonveg: {
      breakfast: "4 whole eggs scrambled + 3 multigrain rotis + 250ml milk + banana — ~720 kcal",
      lunch: "Chicken curry 200g + 2 cups rice + rajma + lassi — ~820 kcal",
      snack: "Tuna sandwich + 2 boiled eggs + fruit juice — ~500 kcal",
      dinner: "Mutton curry 150g + 3 rotis + dal tadka + salad — ~700 kcal",
      total: "~2740 kcal | Protein 170g | Carbs 290g | Fat 78g",
    },
  },
};
 
const PLANS = [
  { name: "IRON", price: 999, period: "month", color: "#888880", features: ["Full gym access", "Locker room", "Basic equipment", "2 group classes/mo", "Fitness assessment"] },
  { name: "TITAN", price: 1999, period: "month", color: G.red, features: ["Everything in Iron", "Unlimited group classes", "1 PT session/month", "Nutrition consultation", "Body scan monthly", "Guest pass (2/mo)"], popular: true },
  { name: "LEGEND", price: 3499, period: "month", color: "#C8A400", features: ["Everything in Titan", "4 PT sessions/month", "Custom meal plan", "Recovery room access", "Priority booking", "Merchandise credit ₹500"] },
];
 
const TESTIMONIALS = [
  { name: "Rahul D.", result: "Lost 22 kg in 5 months", quote: "IRONFORGE completely changed how I see fitness. The trainers are relentless in the best possible way.", before: "108kg", after: "86kg" },
  { name: "Anita S.", result: "Gained 8 kg muscle in 4 months", quote: "The diet plans and structured workouts gave me results I never thought were possible at 34.", before: "52kg", after: "60kg" },
  { name: "Karan M.", result: "Marathon ready in 3 months", quote: "Started from zero cardio. Now I run 21km comfortably. Best investment of my life.", before: "88kg", after: "76kg" },
];
 
/* ─────────────────────────────── UTILS ─────────────────────────────── */
const fmt = (n) => n.toLocaleString("en-IN");
const today = () => new Date().toISOString().split("T")[0];
const monthKey = () => { const d = new Date(); return `${d.getFullYear()}-${d.getMonth() + 1}`; };
 
/* ─────────────────────────────── STYLES ─────────────────────────────── */
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,400;0,600;0,700;0,900;1,700&family=Barlow:wght@300;400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body, #root { background: ${G.bg}; color: ${G.white}; font-family: ${G.fontBody}; min-height: 100vh; }
  ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: ${G.bg}; } ::-webkit-scrollbar-thumb { background: ${G.border}; border-radius: 3px; }
  ::selection { background: ${G.red}; color: #fff; }
  input, textarea { outline: none; }
  button { cursor: pointer; border: none; background: none; font-family: inherit; }
 
  .page { min-height: 100vh; padding: 0 0 80px; }
  .section { max-width: 1200px; margin: 0 auto; padding: 80px 24px; }
  .section-sm { max-width: 1200px; margin: 0 auto; padding: 48px 24px; }
  .tag { display: inline-block; font-family: ${G.font}; font-size: 11px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: ${G.red}; margin-bottom: 12px; }
  .h1 { font-family: ${G.font}; font-size: clamp(56px, 10vw, 120px); font-weight: 900; line-height: 0.92; letter-spacing: -1px; text-transform: uppercase; color: ${G.white}; }
  .h2 { font-family: ${G.font}; font-size: clamp(36px, 6vw, 72px); font-weight: 900; line-height: 0.95; text-transform: uppercase; color: ${G.white}; }
  .h3 { font-family: ${G.font}; font-size: 28px; font-weight: 700; text-transform: uppercase; color: ${G.white}; }
  .h4 { font-family: ${G.font}; font-size: 20px; font-weight: 700; text-transform: uppercase; color: ${G.white}; }
  .red { color: ${G.red}; }
  .muted { color: ${G.muted}; }
  .body { font-size: 16px; line-height: 1.7; color: ${G.muted}; font-weight: 400; }
  .divider { height: 1px; background: ${G.border}; margin: 0; }
 
  .btn-red { display: inline-flex; align-items: center; gap: 8px; padding: 14px 32px; background: ${G.red}; color: #fff; font-family: ${G.font}; font-size: 16px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; border-radius: 2px; transition: background 0.2s, transform 0.15s; }
  .btn-red:hover { background: ${G.redDark}; transform: translateY(-1px); }
  .btn-red:active { transform: scale(0.98); }
  .btn-ghost { display: inline-flex; align-items: center; gap: 8px; padding: 13px 32px; background: transparent; color: ${G.white}; font-family: ${G.font}; font-size: 16px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; border: 1px solid ${G.border}; border-radius: 2px; transition: border-color 0.2s, color 0.2s, transform 0.15s; }
  .btn-ghost:hover { border-color: ${G.red}; color: ${G.red}; transform: translateY(-1px); }
 
  .card { background: ${G.surface}; border: 1px solid ${G.border}; border-radius: 4px; padding: 28px; transition: border-color 0.2s, transform 0.2s; }
  .card:hover { border-color: ${G.red}40; transform: translateY(-2px); }
  .card-flat { background: ${G.surface}; border: 1px solid ${G.border}; border-radius: 4px; padding: 28px; }
 
  .nav { position: sticky; top: 0; z-index: 100; background: ${G.bg}cc; backdrop-filter: blur(12px); border-bottom: 1px solid ${G.border}; }
  .nav-inner { max-width: 1200px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; padding: 0 24px; height: 64px; }
  .nav-logo { font-family: ${G.font}; font-size: 24px; font-weight: 900; letter-spacing: 2px; text-transform: uppercase; cursor: pointer; }
  .nav-links { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
  .nav-link { font-family: ${G.font}; font-size: 13px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; color: ${G.muted}; padding: 8px 12px; border-radius: 2px; transition: color 0.2s; cursor: pointer; }
  .nav-link:hover, .nav-link.active { color: ${G.white}; }
  .nav-link.active { color: ${G.red}; }
 
  .hero { min-height: calc(100vh - 64px); display: flex; align-items: center; position: relative; overflow: hidden; background: ${G.bg}; }
  .hero::before { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse 80% 60% at 50% 100%, ${G.red}18 0%, transparent 70%); pointer-events: none; }
  .hero-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; width: 100%; max-width: 1200px; margin: 0 auto; padding: 60px 24px; }
  .hero-visual { position: relative; display: flex; flex-direction: column; gap: 16px; }
  .hero-stat-card { background: ${G.surface}; border: 1px solid ${G.border}; border-radius: 4px; padding: 20px 24px; display: flex; align-items: center; gap: 16px; }
  .hero-bg-text { position: absolute; top: -40px; right: -20px; font-family: ${G.font}; font-size: 200px; font-weight: 900; color: ${G.white}04; line-height: 1; pointer-events: none; user-select: none; }
 
  .grid-2 { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; }
  .grid-3 { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 24px; }
  .grid-4 { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; }
 
  .tab-bar { display: flex; gap: 4px; background: ${G.surface}; border: 1px solid ${G.border}; border-radius: 4px; padding: 4px; }
  .tab { padding: 10px 20px; font-family: ${G.font}; font-size: 14px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; border-radius: 2px; color: ${G.muted}; transition: all 0.2s; cursor: pointer; }
  .tab.active { background: ${G.red}; color: #fff; }
  .tab:hover:not(.active) { color: ${G.white}; }
 
  .input-field { width: 100%; background: ${G.surface2}; border: 1px solid ${G.border}; color: ${G.white}; font-family: ${G.fontBody}; font-size: 15px; padding: 14px 16px; border-radius: 2px; transition: border-color 0.2s; }
  .input-field:focus { border-color: ${G.red}; }
  .input-field::placeholder { color: ${G.muted}; }
 
  .workout-cat-btn { padding: 10px 20px; font-family: ${G.font}; font-size: 14px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; border: 1px solid ${G.border}; border-radius: 2px; color: ${G.muted}; background: transparent; transition: all 0.2s; cursor: pointer; }
  .workout-cat-btn.active { border-color: ${G.red}; color: ${G.red}; background: ${G.red}15; }
  .workout-cat-btn:hover:not(.active) { border-color: ${G.border}; color: ${G.white}; }
 
  .ex-card { background: ${G.surface}; border: 1px solid ${G.border}; border-radius: 4px; overflow: hidden; transition: border-color 0.25s, transform 0.2s; cursor: pointer; }
  .ex-card:hover { border-color: ${G.red}50; transform: translateY(-3px); }
  .ex-card-head { padding: 24px; border-bottom: 1px solid ${G.border}; }
  .ex-card-body { padding: 24px; }
  .ex-expanded { border-color: ${G.red}70 !important; }
 
  .plan-card { border-radius: 4px; padding: 36px 28px; position: relative; overflow: hidden; transition: transform 0.2s; }
  .plan-card:hover { transform: translateY(-4px); }
  .plan-popular { position: absolute; top: 0; right: 0; background: ${G.red}; font-family: ${G.font}; font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; padding: 6px 14px; }
 
  .attendance-day { width: 36px; height: 36px; border-radius: 2px; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 600; font-family: ${G.font}; border: 1px solid ${G.border}; cursor: pointer; transition: all 0.15s; }
  .attendance-day.present { background: ${G.red}25; border-color: ${G.red}; color: ${G.red}; }
  .attendance-day.today { border-color: ${G.white}40; color: ${G.white}; }
  .attendance-day:hover { border-color: ${G.red}60; }
 
  .progress-bar { height: 6px; background: ${G.border}; border-radius: 3px; overflow: hidden; }
  .progress-fill { height: 100%; background: ${G.red}; border-radius: 3px; transition: width 0.6s ease; }
 
  @media (max-width: 768px) {
    .hero-grid { grid-template-columns: 1fr; gap: 40px; }
    .hero-bg-text { display: none; }
    .nav-links { gap: 2px; }
    .nav-link { font-size: 11px; padding: 6px 8px; }
    .section { padding: 60px 16px; }
  }
 
  @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes pulse-red { 0%, 100% { box-shadow: 0 0 0 0 ${G.red}40; } 50% { box-shadow: 0 0 0 8px ${G.red}00; } }
  .fade-up { animation: fadeUp 0.6s ease both; }
  .fade-up-1 { animation: fadeUp 0.6s ease 0.1s both; }
  .fade-up-2 { animation: fadeUp 0.6s ease 0.2s both; }
  .fade-up-3 { animation: fadeUp 0.6s ease 0.3s both; }
  .pulse-dot { animation: pulse-red 2s infinite; }
`;
 
/* ─────────────────────────────── COMPONENTS ─────────────────────────────── */
 
function Nav({ page, setPage, user }) {
  const links = ["Home", "About", "Workouts", "Diet", "Membership", "Dashboard", "Contact"];
  return (
    <nav className="nav">
      <div className="nav-inner">
        <div className="nav-logo" onClick={() => setPage("Home")}>
          <span style={{ color: G.red }}>IRON</span>FORGE
        </div>
        <div className="nav-links">
          {links.map((l) => (
            <div key={l} className={`nav-link ${page === l ? "active" : ""}`} onClick={() => setPage(l)}>{l}</div>
          ))}
          {user && <div style={{ width: 8, height: 8, borderRadius: "50%", background: G.red, boxShadow: `0 0 8px ${G.red}`, marginLeft: 4 }} className="pulse-dot" />}
        </div>
      </div>
    </nav>
  );
}
 
function StatPill({ val, label, icon }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <div style={{ width: 44, height: 44, background: `${G.red}20`, border: `1px solid ${G.red}40`, borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{icon}</div>
      <div>
        <div style={{ fontFamily: G.font, fontSize: 26, fontWeight: 900, color: G.white, lineHeight: 1 }}>{val}</div>
        <div style={{ fontSize: 12, color: G.muted, fontWeight: 400 }}>{label}</div>
      </div>
    </div>
  );
}
 
/* ═══════════════════════════════════ HOME ═══════════════════════════════════ */
function HomePage({ setPage }) {
  return (
    <div className="page">
      {/* HERO */}
      <section className="hero">
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, overflow: "hidden", pointerEvents: "none" }}>
          <div style={{ position: "absolute", top: "10%", right: "-5%", width: "45%", height: "80%", background: `linear-gradient(135deg, ${G.red}08 0%, transparent 60%)`, borderRadius: "0 0 0 200px" }} />
          <div style={{ position: "absolute", bottom: 0, left: "20%", width: "60%", height: 1, background: `linear-gradient(90deg, transparent, ${G.red}30, transparent)` }} />
        </div>
        <div className="hero-grid">
          <div className="fade-up">
            <div className="tag">Est. 2018 · Premium Fitness</div>
            <div className="h1" style={{ marginBottom: 8 }}>
              FORGE YOUR<br />
              <span className="red">LIMITS.</span>
            </div>
            <div className="body" style={{ maxWidth: 420, marginBottom: 36, marginTop: 16 }}>
              Elite training, science-backed nutrition, and relentless coaching — built for those who refuse ordinary.
            </div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <button className="btn-red" onClick={() => setPage("Membership")}>Join Now →</button>
              <button className="btn-ghost" onClick={() => setPage("Workouts")}>View Programs</button>
            </div>
          </div>
          <div className="hero-visual fade-up-2">
            <div style={{ fontSize: 140, textAlign: "center", lineHeight: 1, marginBottom: 8, filter: "grayscale(0.3)" }}>🏋️</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <StatPill val="500+" label="Active Members" icon="👥" />
              <StatPill val="12+" label="Expert Trainers" icon="🎯" />
              <StatPill val="98%" label="Success Rate" icon="📈" />
              <StatPill val="6 AM" label="Opens Daily" icon="⏰" />
            </div>
          </div>
        </div>
      </section>
 
      {/* RED BAR MARQUEE */}
      <div style={{ background: G.red, padding: "14px 0", overflow: "hidden" }}>
        <div style={{ fontFamily: G.font, fontSize: 14, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: "#fff", display: "flex", gap: 48 }}>
          {Array(6).fill("STRENGTH · ENDURANCE · DISCIPLINE · RESULTS · TRANSFORM").map((t, i) => (
            <span key={i} style={{ whiteSpace: "nowrap" }}>{t}</span>
          ))}
        </div>
      </div>
 
      {/* WHY US */}
      <section className="section">
        <div style={{ marginBottom: 48 }}>
          <div className="tag">Why IRONFORGE</div>
          <div className="h2">Built Different</div>
        </div>
        <div className="grid-3">
          {[
            { icon: "🏅", title: "Certified Trainers", body: "Every trainer holds nationally accredited certifications. Minimum 5 years hands-on experience. Zero mediocrity." },
            { icon: "⚙️", title: "World-Class Equipment", body: "Hammer Strength, Eleiko barbells, Concept2 rowers — 15,000 sq ft of purpose-built training space." },
            { icon: "📊", title: "Results-Driven", body: "Monthly body composition scans. Personalized programming. Accountable tracking. Your results are our KPI." },
            { icon: "🍽️", title: "Nutrition Science", body: "In-house registered dietitian. Indian-specific meal plans. Supplement guidance without guesswork." },
            { icon: "🔄", title: "Recovery First", body: "Dedicated foam rolling zone, sauna access, contrast therapy — because progress is made between sessions." },
            { icon: "📱", title: "Tech-Enabled", body: "App-based attendance, progress photos, workout logging — your entire fitness journey in one place." },
          ].map((f) => (
            <div className="card" key={f.title}>
              <div style={{ fontSize: 32, marginBottom: 16 }}>{f.icon}</div>
              <div className="h4" style={{ marginBottom: 10 }}>{f.title}</div>
              <div className="body" style={{ fontSize: 14 }}>{f.body}</div>
            </div>
          ))}
        </div>
      </section>
 
      <div className="divider" />
 
      {/* TESTIMONIALS */}
      <section className="section">
        <div style={{ marginBottom: 48 }}>
          <div className="tag">Transformations</div>
          <div className="h2">Real People.<br /><span className="red">Real Results.</span></div>
        </div>
        <div className="grid-3">
          {TESTIMONIALS.map((t) => (
            <div className="card" key={t.name} style={{ borderLeft: `3px solid ${G.red}` }}>
              <div style={{ fontFamily: G.font, fontSize: 48, color: G.red, lineHeight: 1, marginBottom: 8 }}>"</div>
              <p className="body" style={{ marginBottom: 20, fontStyle: "italic" }}>{t.quote}</p>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                <div>
                  <div style={{ fontFamily: G.font, fontSize: 18, fontWeight: 700, color: G.white }}>{t.name}</div>
                  <div style={{ color: G.red, fontSize: 13, fontWeight: 600 }}>{t.result}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 12, color: G.muted }}>Before → After</div>
                  <div style={{ fontFamily: G.font, fontSize: 16, color: G.white }}>{t.before} → <span className="red">{t.after}</span></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
 
      <div className="divider" />
 
      {/* VIDEO SECTION */}
      <section className="section">
        <div style={{ marginBottom: 48 }}>
          <div className="tag">Inside IRONFORGE</div>
          <div className="h2">Feel the Energy</div>
        </div>
        <div style={{ background: G.surface, border: `1px solid ${G.border}`, borderRadius: 4, aspectRatio: "16/7", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
            <div style={{ fontSize: 80 }}>🎬</div>
            <div style={{ fontFamily: G.font, fontSize: 20, color: G.muted, letterSpacing: 2 }}>FACILITY TOUR · COMING SOON</div>
            <div className="body" style={{ textAlign: "center", maxWidth: 400 }}>Our full 15,000 sq ft facility tour video is being produced. Book a live visit instead.</div>
            <button className="btn-red" onClick={() => setPage("Contact")}>Book a Tour →</button>
          </div>
        </div>
      </section>
 
      {/* CTA BANNER */}
      <section style={{ background: G.red, padding: "80px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <div className="h2" style={{ color: "#fff", marginBottom: 12 }}>READY TO START?</div>
          <div style={{ color: "#fff", opacity: 0.85, fontSize: 18, marginBottom: 32 }}>First week free. No contracts. Cancel anytime.</div>
          <button onClick={() => setPage("Membership")} style={{ background: "#fff", color: G.red, padding: "16px 48px", fontFamily: G.font, fontSize: 18, fontWeight: 900, letterSpacing: 1, textTransform: "uppercase", border: "none", borderRadius: 2, cursor: "pointer" }}>
            View Membership Plans →
          </button>
        </div>
      </section>
    </div>
  );
}
 
/* ═══════════════════════════════════ ABOUT ═══════════════════════════════════ */
function AboutPage() {
  return (
    <div className="page">
      <section className="section">
        <div className="tag">Our Story</div>
        <div className="h1" style={{ marginBottom: 24 }}>IRON<span className="red">FORGE</span></div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "start" }}>
          <div>
            <div className="body" style={{ marginBottom: 20, fontSize: 18, color: G.white, fontWeight: 300, lineHeight: 1.6 }}>
              Founded in 2018 in the heart of Mumbai, IRONFORGE was built on a single belief: <em>everyone deserves elite fitness coaching</em> — not just athletes.
            </div>
            <div className="body" style={{ marginBottom: 20 }}>
              We grew from a 2,000 sq ft box gym to a 15,000 sq ft performance facility with over 500 active members across all fitness levels. What never changed? Our obsessive attention to results.
            </div>
            <div className="body">
              Every coach, every program, every piece of equipment was chosen with one question in mind: does this make our members better? If the answer isn't a clear yes — it doesn't belong here.
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              { icon: "🎯", label: "Mission", text: "To deliver world-class fitness coaching that transforms not just bodies, but habits, mindsets, and lives — for every Indian who walks through our doors." },
              { icon: "🔭", label: "Vision", text: "To be India's benchmark premium fitness brand — where science, culture, and coaching unite to create the healthiest generation this country has ever seen." },
              { icon: "⚡", label: "Values", text: "Relentless improvement. Radical honesty. Zero shortcuts. Client-first always. Community over competition." },
            ].map((v) => (
              <div className="card-flat" key={v.label}>
                <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                  <div style={{ fontSize: 24 }}>{v.icon}</div>
                  <div>
                    <div className="tag" style={{ marginBottom: 4 }}>{v.label}</div>
                    <div className="body" style={{ fontSize: 14 }}>{v.text}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
 
      <div className="divider" />
 
      <section className="section">
        <div className="tag">Our Team</div>
        <div className="h2" style={{ marginBottom: 48 }}>The Coaches<br />Behind the <span className="red">Results</span></div>
        <div className="grid-4">
          {TRAINERS.map((t) => (
            <div className="card" key={t.name} style={{ textAlign: "center" }}>
              <div style={{ width: 72, height: 72, borderRadius: "50%", background: `${G.red}20`, border: `2px solid ${G.red}40`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: 32 }}>{t.emoji}</div>
              <div className="h4" style={{ marginBottom: 4 }}>{t.name}</div>
              <div style={{ color: G.red, fontFamily: G.font, fontSize: 13, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 }}>{t.role}</div>
              <div style={{ fontSize: 13, color: G.muted, marginBottom: 4 }}>{t.exp} experience</div>
              <div style={{ fontSize: 12, color: G.muted, borderTop: `1px solid ${G.border}`, paddingTop: 8, marginTop: 8 }}>{t.certs}</div>
            </div>
          ))}
        </div>
      </section>
 
      <div className="divider" />
 
      <section className="section">
        <div className="tag">By The Numbers</div>
        <div className="h2" style={{ marginBottom: 48 }}>What We've Built</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 16 }}>
          {[
            { num: "500+", label: "Active Members" },
            { num: "12", label: "Expert Coaches" },
            { num: "15K", label: "Sq Ft Facility" },
            { num: "2000+", label: "Transformations" },
            { num: "98%", label: "Retention Rate" },
            { num: "6", label: "Years Running" },
          ].map((s) => (
            <div key={s.label} style={{ background: G.surface, border: `1px solid ${G.border}`, borderRadius: 4, padding: "24px 20px", textAlign: "center" }}>
              <div style={{ fontFamily: G.font, fontSize: 48, fontWeight: 900, color: G.red, lineHeight: 1 }}>{s.num}</div>
              <div style={{ fontSize: 13, color: G.muted, marginTop: 6 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
 
/* ═══════════════════════════════════ WORKOUTS ═══════════════════════════════════ */
function WorkoutsPage() {
  const cats = Object.keys(WORKOUTS);
  const [cat, setCat] = useState("Chest");
  const [open, setOpen] = useState(null);
 
  return (
    <div className="page">
      <section className="section">
        <div className="tag">Training Library</div>
        <div className="h1" style={{ marginBottom: 12 }}>WORKOUT<br /><span className="red">GUIDE</span></div>
        <div className="body" style={{ maxWidth: 500, marginBottom: 48 }}>Science-backed exercises with step-by-step coaching cues, optimal sets/reps, and common mistakes to avoid.</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 40 }}>
          {cats.map((c) => (
            <button key={c} className={`workout-cat-btn ${cat === c ? "active" : ""}`} onClick={() => { setCat(c); setOpen(null); }}>
              {c}
            </button>
          ))}
        </div>
 
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 20 }}>
          {WORKOUTS[cat].map((ex, i) => (
            <div key={ex.name} className={`ex-card ${open === i ? "ex-expanded" : ""}`} onClick={() => setOpen(open === i ? null : i)}>
              <div className="ex-card-head">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <div className="h4" style={{ marginBottom: 6 }}>{ex.name}</div>
                    <div style={{ display: "flex", gap: 12 }}>
                      <span style={{ fontSize: 12, color: G.red, fontFamily: G.font, fontWeight: 700 }}>{ex.sets}</span>
                      <span style={{ fontSize: 12, color: G.muted }}>·</span>
                      <span style={{ fontSize: 12, color: G.muted }}>{ex.duration}</span>
                    </div>
                  </div>
                  <div style={{ color: G.red, fontSize: 18, transition: "transform 0.3s", transform: open === i ? "rotate(45deg)" : "none" }}>+</div>
                </div>
              </div>
              {open === i && (
                <div className="ex-card-body" style={{ borderTop: `1px solid ${G.border}` }}>
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: 11, color: G.red, fontFamily: G.font, fontWeight: 700, letterSpacing: 2, marginBottom: 10, textTransform: "uppercase" }}>Step-by-Step</div>
                    {ex.instructions.map((step, j) => (
                      <div key={j} style={{ display: "flex", gap: 10, marginBottom: 8 }}>
                        <div style={{ minWidth: 20, height: 20, background: G.red, borderRadius: 2, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: "#fff", marginTop: 2 }}>{j + 1}</div>
                        <div style={{ fontSize: 14, color: G.muted, lineHeight: 1.5 }}>{step}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ background: `${G.red}10`, border: `1px solid ${G.red}25`, borderRadius: 4, padding: "12px 16px" }}>
                    <div style={{ fontSize: 11, color: G.red, fontFamily: G.font, fontWeight: 700, letterSpacing: 2, marginBottom: 8, textTransform: "uppercase" }}>⚠ Common Mistakes</div>
                    {ex.mistakes.map((m, j) => (
                      <div key={j} style={{ fontSize: 13, color: G.muted, marginBottom: 4 }}>· {m}</div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
 
/* ═══════════════════════════════════ DIET ═══════════════════════════════════ */
function DietPage() {
  const [goal, setGoal] = useState("weightloss");
  const [vegTab, setVegTab] = useState("veg");
  const plan = DIET[goal][vegTab];
  const icons = { breakfast: "🌅", lunch: "☀️", snack: "🍎", dinner: "🌙" };
 
  return (
    <div className="page">
      <section className="section">
        <div className="tag">Nutrition Science</div>
        <div className="h1" style={{ marginBottom: 12 }}>DIET<br /><span className="red">PLANS</span></div>
        <div className="body" style={{ maxWidth: 500, marginBottom: 48 }}>Indian-specific, practical meal plans built by our registered dietitian. No exotic ingredients — just real food that works.</div>
 
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 32 }}>
          <div className="tab-bar">
            <div className={`tab ${goal === "weightloss" ? "active" : ""}`} onClick={() => setGoal("weightloss")}>⬇ Weight Loss</div>
            <div className={`tab ${goal === "musclegain" ? "active" : ""}`} onClick={() => setGoal("musclegain")}>⬆ Muscle Gain</div>
          </div>
          <div className="tab-bar">
            <div className={`tab ${vegTab === "veg" ? "active" : ""}`} onClick={() => setVegTab("veg")}>🌿 Vegetarian</div>
            <div className={`tab ${vegTab === "nonveg" ? "active" : ""}`} onClick={() => setVegTab("nonveg")}>🍗 Non-Veg</div>
          </div>
        </div>
 
        <div style={{ background: `${G.red}15`, border: `1px solid ${G.red}30`, borderRadius: 4, padding: "12px 20px", marginBottom: 32, display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 16 }}>📊</span>
          <div style={{ fontFamily: G.font, fontSize: 14, fontWeight: 700, color: G.white }}>{plan.total}</div>
        </div>
 
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
          {Object.entries({ breakfast: plan.breakfast, lunch: plan.lunch, snack: plan.snack, dinner: plan.dinner }).map(([meal, content]) => (
            <div className="card" key={meal}>
              <div style={{ fontSize: 28, marginBottom: 12 }}>{icons[meal]}</div>
              <div className="tag" style={{ marginBottom: 8 }}>{meal}</div>
              <div style={{ fontSize: 14, color: G.muted, lineHeight: 1.7 }}>{content}</div>
            </div>
          ))}
        </div>
 
        <div style={{ marginTop: 48, background: G.surface, border: `1px solid ${G.border}`, borderRadius: 4, padding: 32 }}>
          <div className="tag">Pro Tips</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginTop: 16 }}>
            {[
              "Drink 2.5–3L water daily. Add lemon + himalayan salt if sweating heavily.",
              "Eat every 3–4 hrs to maintain steady energy. Never skip breakfast on training days.",
              "Post-workout: 20–30g protein within 45 mins. Prefer whole food over supplements.",
              "Track portions for 2 weeks at least. Eye-balling leads to 40% calorie miscounts.",
            ].map((tip, i) => (
              <div key={i} style={{ display: "flex", gap: 12 }}>
                <div style={{ color: G.red, fontFamily: G.font, fontSize: 20, fontWeight: 900, lineHeight: 1, minWidth: 20 }}>0{i + 1}</div>
                <div style={{ fontSize: 13, color: G.muted, lineHeight: 1.6 }}>{tip}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
 
/* ═══════════════════════════════════ MEMBERSHIP ═══════════════════════════════════ */
function MembershipPage({ setPage }) {
  return (
    <div className="page">
      <section className="section">
        <div className="tag">Membership</div>
        <div className="h1" style={{ marginBottom: 12 }}>CHOOSE YOUR<br /><span className="red">PLAN</span></div>
        <div className="body" style={{ maxWidth: 500, marginBottom: 60 }}>No lock-in contracts. Cancel anytime. First week free for all new members.</div>
 
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20, alignItems: "start" }}>
          {PLANS.map((p) => (
            <div key={p.name} className="plan-card" style={{ background: p.popular ? `${G.red}15` : G.surface, border: `1px solid ${p.popular ? G.red : G.border}` }}>
              {p.popular && <div className="plan-popular">Most Popular</div>}
              <div style={{ color: p.color, fontFamily: G.font, fontSize: 14, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", marginBottom: 8 }}>{p.name}</div>
              <div style={{ fontFamily: G.font, fontSize: 56, fontWeight: 900, color: G.white, lineHeight: 1 }}>₹{fmt(p.price)}</div>
              <div style={{ fontSize: 13, color: G.muted, marginBottom: 28 }}>per {p.period}</div>
              <div style={{ height: 1, background: G.border, marginBottom: 24 }} />
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 32 }}>
                {p.features.map((f) => (
                  <div key={f} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <div style={{ color: G.red, fontWeight: 700, fontSize: 14, marginTop: 2, minWidth: 14 }}>✓</div>
                    <div style={{ fontSize: 14, color: G.muted }}>{f}</div>
                  </div>
                ))}
              </div>
              <button className={p.popular ? "btn-red" : "btn-ghost"} style={{ width: "100%", justifyContent: "center" }} onClick={() => setPage("Contact")}>
                Get Started →
              </button>
            </div>
          ))}
        </div>
 
        <div style={{ marginTop: 60, background: G.surface, border: `1px solid ${G.border}`, borderRadius: 4, padding: 32 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 24 }}>
            {[
              { icon: "🔓", title: "No Lock-In", text: "Month-to-month. Pause or cancel anytime without penalty." },
              { icon: "🎁", title: "First Week Free", text: "Try any plan free for 7 days. No credit card required." },
              { icon: "🔄", title: "Upgrade Anytime", text: "Move between plans seamlessly. Price difference prorated." },
              { icon: "👥", title: "Corporate Plans", text: "Groups of 10+ get 20% discount. Contact us for details." },
            ].map((f) => (
              <div key={f.title} style={{ display: "flex", gap: 14 }}>
                <div style={{ fontSize: 24 }}>{f.icon}</div>
                <div>
                  <div style={{ fontFamily: G.font, fontSize: 16, fontWeight: 700, color: G.white, marginBottom: 4 }}>{f.title}</div>
                  <div style={{ fontSize: 13, color: G.muted, lineHeight: 1.5 }}>{f.text}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
 
/* ═══════════════════════════════════ DASHBOARD ═══════════════════════════════════ */
function DashboardPage() {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("if_user") || "null"));
  const [form, setForm] = useState({ name: "", email: "", password: "", goal: "weightloss" });
  const [isLogin, setIsLogin] = useState(true);
  const [attendance, setAttendance] = useState(() => JSON.parse(localStorage.getItem("if_attendance") || "{}"));
  const [weights, setWeights] = useState(() => JSON.parse(localStorage.getItem("if_weights") || "[]"));
  const [newWeight, setNewWeight] = useState("");
  const [error, setError] = useState("");
 
  const saveUser = (u) => { setUser(u); localStorage.setItem("if_user", JSON.stringify(u)); };
  const saveAttendance = (a) => { setAttendance(a); localStorage.setItem("if_attendance", JSON.stringify(a)); };
  const saveWeights = (w) => { setWeights(w); localStorage.setItem("if_weights", JSON.stringify(w)); };
 
  const handleAuth = () => {
    if (!form.email || !form.password) { setError("Please fill all fields"); return; }
    if (isLogin) {
      const stored = JSON.parse(localStorage.getItem("if_accounts") || "{}");
      if (!stored[form.email] || stored[form.email].password !== form.password) { setError("Invalid credentials"); return; }
      saveUser(stored[form.email]);
    } else {
      if (!form.name) { setError("Name required"); return; }
      const stored = JSON.parse(localStorage.getItem("if_accounts") || "{}");
      const newU = { name: form.name, email: form.email, password: form.password, goal: form.goal, joinedAt: today() };
      stored[form.email] = newU;
      localStorage.setItem("if_accounts", JSON.stringify(stored));
      saveUser(newU);
    }
    setError("");
  };
 
  const toggleAttendance = () => {
    const t = today();
    const updated = { ...attendance, [t]: !attendance[t] };
    saveAttendance(updated);
  };
 
  const addWeight = () => {
    const v = parseFloat(newWeight);
    if (!v || v < 30 || v > 250) { return; }
    const entry = { date: today(), weight: v };
    const updated = [...weights.filter(w => w.date !== today()), entry].sort((a, b) => a.date.localeCompare(b.date)).slice(-30);
    saveWeights(updated);
    setNewWeight("");
  };
 
  const logout = () => { setUser(null); localStorage.removeItem("if_user"); };
 
  const getDaysInMonth = () => {
    const d = new Date(); const year = d.getFullYear(); const month = d.getMonth();
    const days = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    return { days, firstDay, month, year };
  };
 
  const presentCount = Object.values(attendance).filter(Boolean).length;
  const monthPresent = Object.entries(attendance).filter(([k, v]) => {
    const d = new Date(k); return d.getMonth() === new Date().getMonth() && v;
  }).length;
 
  if (!user) {
    return (
      <div className="page" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "80vh" }}>
        <div style={{ width: "100%", maxWidth: 440, background: G.surface, border: `1px solid ${G.border}`, borderRadius: 4, padding: 40 }}>
          <div className="h3" style={{ marginBottom: 4 }}>{isLogin ? "Welcome Back" : "Join IRONFORGE"}</div>
          <div className="body" style={{ marginBottom: 28, fontSize: 14 }}>{isLogin ? "Sign in to track your progress" : "Create your free account"}</div>
          {error && <div style={{ color: G.red, fontSize: 13, marginBottom: 16, background: `${G.red}15`, border: `1px solid ${G.red}30`, borderRadius: 2, padding: "10px 14px" }}>{error}</div>}
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
            {!isLogin && <input className="input-field" placeholder="Full Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />}
            <input className="input-field" type="email" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            <input className="input-field" type="password" placeholder="Password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
            {!isLogin && (
              <select className="input-field" value={form.goal} onChange={e => setForm({ ...form, goal: e.target.value })}>
                <option value="weightloss">Goal: Weight Loss</option>
                <option value="musclegain">Goal: Muscle Gain</option>
              </select>
            )}
          </div>
          <button className="btn-red" style={{ width: "100%", justifyContent: "center" }} onClick={handleAuth}>{isLogin ? "Sign In" : "Create Account"} →</button>
          <div style={{ textAlign: "center", marginTop: 16, fontSize: 13, color: G.muted }}>
            {isLogin ? "New here?" : "Already have an account?"}{" "}
            <span style={{ color: G.red, cursor: "pointer" }} onClick={() => { setIsLogin(!isLogin); setError(""); }}>{isLogin ? "Create account" : "Sign in"}</span>
          </div>
        </div>
      </div>
    );
  }
 
  const { days, firstDay, month, year } = getDaysInMonth();
  const monthName = new Date(year, month).toLocaleString("default", { month: "long" });
  const todayNum = new Date().getDate();
 
  return (
    <div className="page">
      <section className="section">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16, marginBottom: 48 }}>
          <div>
            <div className="tag">Member Dashboard</div>
            <div className="h2">Welcome, <span className="red">{user.name.split(" ")[0]}</span></div>
            <div className="body" style={{ fontSize: 14 }}>Goal: {user.goal === "weightloss" ? "⬇ Weight Loss" : "⬆ Muscle Gain"} · Member since {user.joinedAt}</div>
          </div>
          <button className="btn-ghost" onClick={logout}>Sign Out</button>
        </div>
 
        {/* STATS ROW */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 16, marginBottom: 40 }}>
          {[
            { label: "Total Sessions", val: presentCount, icon: "🏋️" },
            { label: "This Month", val: monthPresent, icon: "📅" },
            { label: "Streak (days)", val: (() => { let s = 0; let d = new Date(); while (true) { const k = d.toISOString().split("T")[0]; if (!attendance[k]) break; s++; d.setDate(d.getDate() - 1); } return s; })(), icon: "🔥" },
            { label: "Current Weight", val: weights.length ? `${weights[weights.length - 1].weight}kg` : "—", icon: "⚖️" },
          ].map((s) => (
            <div key={s.label} style={{ background: G.surface, border: `1px solid ${G.border}`, borderRadius: 4, padding: "20px 16px" }}>
              <div style={{ fontSize: 20, marginBottom: 8 }}>{s.icon}</div>
              <div style={{ fontFamily: G.font, fontSize: 32, fontWeight: 900, color: G.red, lineHeight: 1 }}>{s.val}</div>
              <div style={{ fontSize: 12, color: G.muted, marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
 
        {/* ATTENDANCE + WEIGHT GRID */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 32 }}>
          {/* ATTENDANCE CALENDAR */}
          <div className="card-flat">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div className="h4">{monthName} {year}</div>
              <button className={`btn-${attendance[today()] ? "ghost" : "red"}`} style={{ padding: "8px 16px", fontSize: 13 }} onClick={toggleAttendance}>
                {attendance[today()] ? "✓ Marked" : "Mark Today"}
              </button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4, marginBottom: 8 }}>
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(d => (
                <div key={d} style={{ textAlign: "center", fontSize: 11, color: G.muted, padding: "4px 0" }}>{d}</div>
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4 }}>
              {Array(firstDay).fill(null).map((_, i) => <div key={`e${i}`} />)}
              {Array(days).fill(null).map((_, i) => {
                const day = i + 1;
                const key = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                const isToday = day === todayNum;
                const present = attendance[key];
                return (
                  <div key={day} className={`attendance-day ${present ? "present" : ""} ${isToday && !present ? "today" : ""}`} onClick={() => { const u = { ...attendance, [key]: !attendance[key] }; saveAttendance(u); }}>
                    {day}
                  </div>
                );
              })}
            </div>
            <div style={{ marginTop: 16, display: "flex", gap: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}><div style={{ width: 12, height: 12, background: `${G.red}25`, border: `1px solid ${G.red}`, borderRadius: 1 }} /><span style={{ fontSize: 12, color: G.muted }}>Present</span></div>
            </div>
          </div>
 
          {/* WEIGHT TRACKER */}
          <div className="card-flat">
            <div className="h4" style={{ marginBottom: 16 }}>Weight Tracker</div>
            <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
              <input className="input-field" type="number" placeholder="Enter weight (kg)" value={newWeight} onChange={e => setNewWeight(e.target.value)} style={{ flex: 1 }} onKeyDown={e => e.key === "Enter" && addWeight()} />
              <button className="btn-red" style={{ padding: "14px 20px" }} onClick={addWeight}>+</button>
            </div>
            {weights.length > 0 ? (
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={weights} margin={{ top: 4, right: 4, bottom: 4, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={G.border} />
                  <XAxis dataKey="date" tick={{ fill: G.muted, fontSize: 10 }} tickFormatter={v => v.slice(5)} />
                  <YAxis tick={{ fill: G.muted, fontSize: 10 }} domain={["auto", "auto"]} />
                  <Tooltip contentStyle={{ background: G.surface2, border: `1px solid ${G.border}`, borderRadius: 4, fontSize: 12 }} labelStyle={{ color: G.muted }} itemStyle={{ color: G.red }} />
                  <Line type="monotone" dataKey="weight" stroke={G.red} strokeWidth={2} dot={{ fill: G.red, r: 3 }} activeDot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ height: 180, display: "flex", alignItems: "center", justifyContent: "center", color: G.muted, fontSize: 14 }}>
                Add your first weight entry to see the chart
              </div>
            )}
          </div>
        </div>
 
        {/* MONTHLY ATTENDANCE BAR CHART */}
        {Object.keys(attendance).length > 0 && (
          <div className="card-flat" style={{ marginBottom: 0 }}>
            <div className="h4" style={{ marginBottom: 20 }}>Attendance History</div>
            <ResponsiveContainer width="100%" height={140}>
              <BarChart data={(() => {
                const months = {};
                Object.entries(attendance).forEach(([k, v]) => {
                  if (!v) return;
                  const m = k.slice(0, 7);
                  months[m] = (months[m] || 0) + 1;
                });
                return Object.entries(months).slice(-6).map(([k, v]) => ({ month: k.slice(5), sessions: v }));
              })()} margin={{ top: 4, right: 4, bottom: 4, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={G.border} vertical={false} />
                <XAxis dataKey="month" tick={{ fill: G.muted, fontSize: 11 }} />
                <YAxis tick={{ fill: G.muted, fontSize: 11 }} />
                <Tooltip contentStyle={{ background: G.surface2, border: `1px solid ${G.border}`, borderRadius: 4, fontSize: 12 }} labelStyle={{ color: G.muted }} itemStyle={{ color: G.red }} />
                <Bar dataKey="sessions" fill={G.red} radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </section>
    </div>
  );
}
 
/* ═══════════════════════════════════ CONTACT ═══════════════════════════════════ */
function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "General Inquiry", message: "" });
  const [sent, setSent] = useState(false);
 
  const handleSubmit = () => {
    if (!form.name || !form.email || !form.message) return;
    setSent(true);
  };
 
  return (
    <div className="page">
      <section className="section">
        <div className="tag">Get In Touch</div>
        <div className="h1" style={{ marginBottom: 48 }}>CONTACT<br /><span className="red">US</span></div>
 
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48 }}>
          {/* FORM */}
          <div>
            {sent ? (
              <div style={{ background: `${G.red}15`, border: `1px solid ${G.red}`, borderRadius: 4, padding: 40, textAlign: "center" }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
                <div className="h3" style={{ marginBottom: 8 }}>Message Sent!</div>
                <div className="body">We'll get back to you within 24 hours.</div>
                <button className="btn-red" style={{ marginTop: 24 }} onClick={() => setSent(false)}>Send Another</button>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <input className="input-field" placeholder="Full Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                <input className="input-field" type="email" placeholder="Email Address" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                <select className="input-field" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })}>
                  <option>General Inquiry</option>
                  <option>Membership Query</option>
                  <option>Personal Training</option>
                  <option>Book a Tour</option>
                  <option>Corporate Plans</option>
                </select>
                <textarea className="input-field" placeholder="Your message..." value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} style={{ height: 140, resize: "vertical" }} />
                <button className="btn-red" onClick={handleSubmit}>Send Message →</button>
              </div>
            )}
          </div>
 
          {/* INFO */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {[
              { icon: "📍", label: "Location", val: "IRONFORGE Fitness\n42, Lower Parel West\nMumbai, Maharashtra 400013" },
              { icon: "📞", label: "Phone", val: "+91 98765 43210\n+91 22 4567 8900" },
              { icon: "✉️", label: "Email", val: "hello@ironforge.in\ntraining@ironforge.in" },
              { icon: "🕐", label: "Hours", val: "Mon–Fri: 6:00 AM – 10:00 PM\nSat–Sun: 7:00 AM – 8:00 PM" },
            ].map((info) => (
              <div key={info.label} style={{ display: "flex", gap: 16 }}>
                <div style={{ width: 44, height: 44, background: `${G.red}20`, border: `1px solid ${G.red}30`, borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, minWidth: 44 }}>{info.icon}</div>
                <div>
                  <div style={{ fontFamily: G.font, fontSize: 13, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: G.red, marginBottom: 4 }}>{info.label}</div>
                  {info.val.split("\n").map((line, i) => <div key={i} style={{ fontSize: 14, color: G.muted }}>{line}</div>)}
                </div>
              </div>
            ))}
 
            {/* MAP PLACEHOLDER */}
            <div style={{ background: G.surface, border: `1px solid ${G.border}`, borderRadius: 4, height: 180, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 8, marginTop: 8 }}>
              <div style={{ fontSize: 32 }}>🗺️</div>
              <div style={{ fontSize: 13, color: G.muted }}>Lower Parel West, Mumbai</div>
              <a href="https://maps.google.com" target="_blank" rel="noreferrer" style={{ color: G.red, fontSize: 12, fontFamily: G.font, fontWeight: 700, letterSpacing: 1 }}>OPEN IN MAPS ↗</a>
            </div>
          </div>
        </div>
 
        {/* SOCIAL */}
        <div style={{ marginTop: 60, borderTop: `1px solid ${G.border}`, paddingTop: 40, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 20 }}>
          <div className="h4">Follow the Journey</div>
          <div style={{ display: "flex", gap: 12 }}>
            {[
              { name: "Instagram", icon: "📸", url: "#" },
              { name: "YouTube", icon: "▶️", url: "#" },
              { name: "Facebook", icon: "👍", url: "#" },
              { name: "WhatsApp", icon: "💬", url: "#" },
            ].map((s) => (
              <a key={s.name} href={s.url} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", background: G.surface, border: `1px solid ${G.border}`, borderRadius: 4, fontSize: 13, color: G.muted, textDecoration: "none", fontFamily: G.font, fontWeight: 600, letterSpacing: 1, transition: "border-color 0.2s, color 0.2s" }}
                onMouseOver={e => { e.currentTarget.style.borderColor = G.red; e.currentTarget.style.color = G.white; }}
                onMouseOut={e => { e.currentTarget.style.borderColor = G.border; e.currentTarget.style.color = G.muted; }}>
                {s.icon} {s.name}
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
 
/* ═══════════════════════════════════ FOOTER ═══════════════════════════════════ */
function Footer({ setPage }) {
  return (
    <footer style={{ background: G.surface, borderTop: `1px solid ${G.border}`, padding: "48px 24px 24px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 40, marginBottom: 48 }}>
          <div>
            <div style={{ fontFamily: G.font, fontSize: 28, fontWeight: 900, letterSpacing: 2, marginBottom: 12 }}>
              <span style={{ color: G.red }}>IRON</span>FORGE
            </div>
            <div style={{ fontSize: 13, color: G.muted, lineHeight: 1.7 }}>Mumbai's premier performance gym. Forging champions since 2018.</div>
          </div>
          <div>
            <div style={{ fontFamily: G.font, fontSize: 13, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: G.white, marginBottom: 16 }}>Quick Links</div>
            {["Home", "About", "Workouts", "Diet", "Membership"].map(l => (
              <div key={l} style={{ fontSize: 13, color: G.muted, marginBottom: 8, cursor: "pointer" }} onClick={() => setPage(l)}
                onMouseOver={e => (e.currentTarget as HTMLElement).style.color = G.red} onMouseOut={e => (e.currentTarget as HTMLElement).style.color = G.muted}>{l}</div>
            ))}
          </div>
          <div>
            <div style={{ fontFamily: G.font, fontSize: 13, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: G.white, marginBottom: 16 }}>Programs</div>
            {["Strength Training", "Fat Loss", "Muscle Building", "Cardio & HIIT", "Yoga & Mobility"].map(p => (
              <div key={p} style={{ fontSize: 13, color: G.muted, marginBottom: 8 }}>{p}</div>
            ))}
          </div>
          <div>
            <div style={{ fontFamily: G.font, fontSize: 13, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: G.white, marginBottom: 16 }}>Contact</div>
            <div style={{ fontSize: 13, color: G.muted, marginBottom: 8 }}>42, Lower Parel West, Mumbai</div>
            <div style={{ fontSize: 13, color: G.muted, marginBottom: 8 }}>+91 98765 43210</div>
            <div style={{ fontSize: 13, color: G.muted, marginBottom: 16 }}>hello@ironforge.in</div>
            <button className="btn-red" style={{ padding: "10px 20px", fontSize: 13 }} onClick={() => setPage("Contact")}>Get In Touch</button>
          </div>
        </div>
        <div style={{ borderTop: `1px solid ${G.border}`, paddingTop: 20, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
          <div style={{ fontSize: 12, color: G.muted }}>© 2025 IRONFORGE Fitness Pvt. Ltd. All rights reserved.</div>
          <div style={{ fontSize: 12, color: G.muted }}>Designed for those who refuse average.</div>
        </div>
      </div>
    </footer>
  );
}
 
/* ═══════════════════════════════════ APP ═══════════════════════════════════ */
export default function App() {
  const [page, setPage] = useState("Home");
  const user = JSON.parse(localStorage.getItem("if_user") || "null");
 
  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, [page]);
 
  const pages = { Home: HomePage, About: AboutPage, Workouts: WorkoutsPage, Diet: DietPage, Membership: MembershipPage, Dashboard: DashboardPage, Contact: ContactPage };
  const PageComp = pages[page] || HomePage;
 
  return (
    <>
      <style>{css}</style>
      <Nav page={page} setPage={setPage} user={user} />
      <PageComp setPage={setPage} />
      <Footer setPage={setPage} />
    </>
  );
}