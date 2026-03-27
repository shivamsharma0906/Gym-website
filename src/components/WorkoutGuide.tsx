import { useState, useEffect, useRef, useCallback } from 'react';
import './WorkoutGuide.css';

interface Workout {
  name: string;
  sets: string;
  reps: string;
  rest: string;
  emoji: string;
  muscle: string;
  tip: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Elite';
}

interface WorkoutDay {
  day: string;
  shortDay: string;
  focus: string;
  subFocus: string;
  icon: string;
  color: string;
  accentColor: string;
  totalTime: string;
  intensity: string;
  intensityScore: number; // 1–10
  calories: string;
  isRest: boolean;
  workouts: Workout[];
}

const DIFFICULTY_COLOR: Record<string, string> = {
  Beginner: '#22c55e',
  Intermediate: '#f59e0b',
  Advanced: '#e63946',
  Elite: '#a855f7',
};

const workoutPlan: WorkoutDay[] = [
  {
    day: 'Monday',
    shortDay: 'MON',
    focus: 'Chest',
    subFocus: 'Triceps',
    icon: '🏋️',
    color: '#e63946',
    accentColor: '#ff6b6b',
    totalTime: '75 min',
    intensity: 'High',
    intensityScore: 8,
    calories: '~480 cal',
    isRest: false,
    workouts: [
      { name: 'Barbell Bench Press', sets: '4', reps: '6–8', rest: '120s', emoji: '🔩', muscle: 'Upper Chest', tip: 'Drive feet into floor, retract scapula hard', difficulty: 'Advanced' },
      { name: 'Incline DB Press', sets: '4', reps: '8–10', rest: '90s', emoji: '📐', muscle: 'Upper Chest', tip: '30–45° incline — steeper = shoulders, not chest', difficulty: 'Intermediate' },
      { name: 'Weighted Dips', sets: '3', reps: '8–10', rest: '90s', emoji: '⬇️', muscle: 'Lower Chest', tip: 'Lean forward 30° to shift load to chest', difficulty: 'Advanced' },
      { name: 'Cable Crossover (Low)', sets: '3', reps: '12–15', rest: '60s', emoji: '🔗', muscle: 'Lower Chest', tip: 'Squeeze hard at peak, hold 1s', difficulty: 'Intermediate' },
      { name: 'Pec Deck / Machine Fly', sets: '3', reps: '12–15', rest: '60s', emoji: '🦋', muscle: 'Inner Chest', tip: 'Full stretch at open — feel the lengthening', difficulty: 'Beginner' },
      { name: 'Close-Grip Bench Press', sets: '4', reps: '8–10', rest: '90s', emoji: '💎', muscle: 'Triceps (Long)', tip: 'Elbows tucked at 45°, not flared', difficulty: 'Advanced' },
      { name: 'Skull Crushers', sets: '3', reps: '10–12', rest: '75s', emoji: '💀', muscle: 'Triceps (Long)', tip: 'Keep upper arms vertical throughout', difficulty: 'Intermediate' },
      { name: 'Rope Pushdowns', sets: '3', reps: '12–15', rest: '45s', emoji: '🪢', muscle: 'Triceps (Lateral)', tip: 'Split rope at bottom, pronate wrists slightly', difficulty: 'Beginner' },
    ],
  },
  {
    day: 'Tuesday',
    shortDay: 'TUE',
    focus: 'Back',
    subFocus: 'Biceps',
    icon: '🦍',
    color: '#f77f00',
    accentColor: '#ffa94d',
    totalTime: '80 min',
    intensity: 'Very High',
    intensityScore: 9,
    calories: '~530 cal',
    isRest: false,
    workouts: [
      { name: 'Conventional Deadlift', sets: '4', reps: '5–6', rest: '180s', emoji: '🔥', muscle: 'Full Back', tip: 'Bar over mid-foot, neutral spine always', difficulty: 'Elite' },
      { name: 'Weighted Pull-Ups', sets: '4', reps: '6–8', rest: '120s', emoji: '🧗', muscle: 'Lats', tip: 'Dead hang at bottom, chest to bar at top', difficulty: 'Advanced' },
      { name: 'Barbell Pendlay Row', sets: '4', reps: '8–10', rest: '90s', emoji: '🚣', muscle: 'Mid Back', tip: 'Bar touches floor each rep — full reset', difficulty: 'Advanced' },
      { name: 'Chest-Supported Row', sets: '3', reps: '10–12', rest: '75s', emoji: '🛋️', muscle: 'Rhomboids', tip: 'Eliminates momentum — pure muscle isolation', difficulty: 'Intermediate' },
      { name: 'Lat Pulldown (Wide)', sets: '3', reps: '10–12', rest: '60s', emoji: '⬇️', muscle: 'Lats', tip: 'Lean back 15°, pull to upper chest', difficulty: 'Beginner' },
      { name: 'Straight-Arm Pulldown', sets: '3', reps: '12–15', rest: '45s', emoji: '📏', muscle: 'Lats Isolation', tip: 'Arms stay straight — lat-only movement', difficulty: 'Intermediate' },
      { name: 'Barbell Curl', sets: '4', reps: '8–10', rest: '75s', emoji: '💪', muscle: 'Biceps (Long)', tip: 'No swinging — if you swing, drop the weight', difficulty: 'Intermediate' },
      { name: 'Incline DB Curl', sets: '3', reps: '10–12', rest: '60s', emoji: '📐', muscle: 'Biceps (Short)', tip: 'Incline stretches long head — max growth stimulus', difficulty: 'Intermediate' },
      { name: 'Hammer Curl', sets: '3', reps: '10–12', rest: '60s', emoji: '🔨', muscle: 'Brachialis', tip: 'Neutral grip hits brachialis — adds arm thickness', difficulty: 'Beginner' },
    ],
  },
  {
    day: 'Wednesday',
    shortDay: 'WED',
    focus: 'Legs',
    subFocus: 'Shoulders',
    icon: '🦵',
    color: '#2ec4b6',
    accentColor: '#6ee7b7',
    totalTime: '85 min',
    intensity: 'Extreme',
    intensityScore: 10,
    calories: '~650 cal',
    isRest: false,
    workouts: [
      { name: 'Back Squat', sets: '5', reps: '5', rest: '180s', emoji: '🏗️', muscle: 'Quads / Glutes', tip: 'Hip crease below knee every rep, no exceptions', difficulty: 'Elite' },
      { name: 'Romanian Deadlift', sets: '4', reps: '8–10', rest: '120s', emoji: '🇷🇴', muscle: 'Hamstrings', tip: 'Hinge hips back, bar drags down thighs', difficulty: 'Advanced' },
      { name: 'Leg Press (Feet High)', sets: '4', reps: '10–12', rest: '90s', emoji: '🦿', muscle: 'Glutes / Hams', tip: 'High foot placement = glute dominant', difficulty: 'Intermediate' },
      { name: 'Bulgarian Split Squat', sets: '3', reps: '10/leg', rest: '75s', emoji: '🇧🇬', muscle: 'Quads / Glutes', tip: 'Knee tracks over pinky toe', difficulty: 'Advanced' },
      { name: 'Seated Leg Curl', sets: '3', reps: '12–15', rest: '60s', emoji: '🦎', muscle: 'Hamstrings', tip: 'Seated version stretches better than lying', difficulty: 'Beginner' },
      { name: 'Standing Calf Raise', sets: '4', reps: '15–20', rest: '45s', emoji: '🧦', muscle: 'Gastrocnemius', tip: 'Full range: deep stretch at bottom, full flex at top', difficulty: 'Beginner' },
      { name: 'Seated OHP (DB)', sets: '4', reps: '8–10', rest: '90s', emoji: '🔝', muscle: 'Front / Side Delts', tip: 'Stop just below lockout to keep tension', difficulty: 'Intermediate' },
      { name: 'Lateral Raise (Cable)', sets: '4', reps: '12–15', rest: '45s', emoji: '🪽', muscle: 'Side Delts', tip: 'Cable keeps tension at bottom unlike dumbbells', difficulty: 'Intermediate' },
      { name: 'Rear Delt Face Pull', sets: '3', reps: '15–20', rest: '45s', emoji: '🎭', muscle: 'Rear Delts', tip: 'External rotate at end — elbows high and back', difficulty: 'Beginner' },
    ],
  },
  {
    day: 'Thursday',
    shortDay: 'THU',
    focus: 'Chest',
    subFocus: 'Triceps',
    icon: '🏋️',
    color: '#e63946',
    accentColor: '#ff6b6b',
    totalTime: '70 min',
    intensity: 'High',
    intensityScore: 8,
    calories: '~460 cal',
    isRest: false,
    workouts: [
      { name: 'Dumbbell Flat Press', sets: '4', reps: '8–10', rest: '90s', emoji: '🎲', muscle: 'Mid Chest', tip: 'Greater ROM than barbell — squeeze hard at top', difficulty: 'Intermediate' },
      { name: 'Low-to-High Cable Fly', sets: '4', reps: '12–15', rest: '60s', emoji: '📈', muscle: 'Upper Chest', tip: 'Cables set low — pull up and across', difficulty: 'Intermediate' },
      { name: 'Decline DB Press', sets: '3', reps: '10–12', rest: '75s', emoji: '📉', muscle: 'Lower Chest', tip: 'Often underdone — builds that square chest look', difficulty: 'Intermediate' },
      { name: 'Push-Up (Weighted)', sets: '3', reps: '12–15', rest: '60s', emoji: '💪', muscle: 'Full Chest', tip: 'Add plate on back or use resistance band', difficulty: 'Beginner' },
      { name: 'High-to-Low Cable Fly', sets: '3', reps: '12–15', rest: '60s', emoji: '📉', muscle: 'Lower Chest', tip: 'Cables set high — pull down and across', difficulty: 'Intermediate' },
      { name: 'Overhead Tricep Ext. (Cable)', sets: '4', reps: '10–12', rest: '75s', emoji: '🔺', muscle: 'Triceps (Long)', tip: 'Overhead = maximum long head stretch', difficulty: 'Intermediate' },
      { name: 'Tricep Dips (Bodyweight)', sets: '3', reps: '12–15', rest: '60s', emoji: '🪑', muscle: 'Triceps', tip: 'Stay upright for tricep emphasis', difficulty: 'Beginner' },
      { name: 'Diamond Push-Up', sets: '3', reps: 'Failure', rest: '60s', emoji: '💎', muscle: 'Triceps / Inner Chest', tip: 'Hands form diamond under sternum', difficulty: 'Advanced' },
    ],
  },
  {
    day: 'Friday',
    shortDay: 'FRI',
    focus: 'Back',
    subFocus: 'Biceps',
    icon: '🦍',
    color: '#f77f00',
    accentColor: '#ffa94d',
    totalTime: '80 min',
    intensity: 'Very High',
    intensityScore: 9,
    calories: '~510 cal',
    isRest: false,
    workouts: [
      { name: 'Rack Pull (Knee Height)', sets: '4', reps: '5–6', rest: '150s', emoji: '🏗️', muscle: 'Upper Back / Traps', tip: 'Builds thickness in upper back fast', difficulty: 'Elite' },
      { name: 'Seated Cable Row (Close)', sets: '4', reps: '8–10', rest: '90s', emoji: '🎯', muscle: 'Mid Back', tip: 'Pull to lower sternum, elbows past torso', difficulty: 'Intermediate' },
      { name: 'Single-Arm DB Row', sets: '4', reps: '10/side', rest: '75s', emoji: '🎸', muscle: 'Lats', tip: 'Brace on bench, full ROM — hip rotation allowed', difficulty: 'Intermediate' },
      { name: 'Lat Pulldown (Neutral Grip)', sets: '3', reps: '10–12', rest: '60s', emoji: '🤝', muscle: 'Lats', tip: 'Neutral grip reduces shoulder strain', difficulty: 'Beginner' },
      { name: 'Rear Delt DB Row (Prone)', sets: '3', reps: '12–15', rest: '60s', emoji: '🛋️', muscle: 'Rear Delts / Rhomboids', tip: 'Lie prone on 30° bench, arm straight', difficulty: 'Intermediate' },
      { name: 'Shrugs (Barbell)', sets: '3', reps: '12–15', rest: '60s', emoji: '🤷', muscle: 'Traps (Upper)', tip: 'Hold at top for 2s, avoid rolling shoulders', difficulty: 'Beginner' },
      { name: 'EZ-Bar Curl (21s)', sets: '3', reps: '21', rest: '90s', emoji: '🔢', muscle: 'Biceps Full', tip: '7 bottom half + 7 top half + 7 full reps', difficulty: 'Advanced' },
      { name: 'Concentration Curl', sets: '3', reps: '12/arm', rest: '60s', emoji: '🧘', muscle: 'Biceps (Peak)', tip: 'Elbow on inner thigh, full supination at top', difficulty: 'Intermediate' },
      { name: 'Cable Curl (Both Arms)', sets: '3', reps: '12–15', rest: '45s', emoji: '🧲', muscle: 'Biceps', tip: 'Constant cable tension beats free weights here', difficulty: 'Beginner' },
    ],
  },
  {
    day: 'Saturday',
    shortDay: 'SAT',
    focus: 'Legs',
    subFocus: 'Shoulders',
    icon: '🦵',
    color: '#2ec4b6',
    accentColor: '#6ee7b7',
    totalTime: '85 min',
    intensity: 'Extreme',
    intensityScore: 10,
    calories: '~630 cal',
    isRest: false,
    workouts: [
      { name: 'Front Squat', sets: '4', reps: '6–8', rest: '150s', emoji: '🏙️', muscle: 'Quads (Heavy)', tip: 'Elbows high and forward — clean grip or crossed-arms', difficulty: 'Elite' },
      { name: 'Sumo Deadlift', sets: '3', reps: '8–10', rest: '120s', emoji: '🤼', muscle: 'Glutes / Adductors', tip: 'Wide stance, toes out 45°, knees track out', difficulty: 'Advanced' },
      { name: 'Hack Squat', sets: '4', reps: '10–12', rest: '90s', emoji: '🔧', muscle: 'Quads / VMO', tip: 'Feet low and close — destroys the teardrop', difficulty: 'Advanced' },
      { name: 'Good Mornings', sets: '3', reps: '10–12', rest: '90s', emoji: '🌅', muscle: 'Hamstrings / Lower Back', tip: 'Light weight, big hinge — feel every hamstring fiber', difficulty: 'Advanced' },
      { name: 'Leg Extension (Slow)', sets: '3', reps: '15–20', rest: '45s', emoji: '🦾', muscle: 'Quad Isolation', tip: 'Slow 3s negative — increase time under tension', difficulty: 'Beginner' },
      { name: 'Seated Calf Raise', sets: '4', reps: '20–25', rest: '45s', emoji: '🦶', muscle: 'Soleus', tip: 'Seated targets soleus — often neglected', difficulty: 'Beginner' },
      { name: 'Barbell OHP (Standing)', sets: '4', reps: '6–8', rest: '120s', emoji: '🏆', muscle: 'Front / Side Delts', tip: 'Brace core hard — this is a full-body movement', difficulty: 'Elite' },
      { name: 'Arnold Press', sets: '3', reps: '10–12', rest: '75s', emoji: '🏅', muscle: 'All 3 Delt Heads', tip: 'Rotate through full range — no half reps', difficulty: 'Intermediate' },
      { name: 'Lateral Raise Drop Set', sets: '3', reps: '10+10+10', rest: '90s', emoji: '📉', muscle: 'Side Delts', tip: '3 weights in succession, no rest between drops', difficulty: 'Elite' },
    ],
  },
  {
    day: 'Sunday',
    shortDay: 'SUN',
    focus: 'Rest',
    subFocus: 'Recovery',
    icon: '😴',
    color: '#64748b',
    accentColor: '#94a3b8',
    totalTime: 'All day',
    intensity: 'Zero',
    intensityScore: 0,
    calories: 'Eat big',
    isRest: true,
    workouts: [],
  },
];

const WorkoutGuide = () => {
  const [selectedDay, setSelectedDay] = useState(0);
  const [expandedEx, setExpandedEx] = useState<number | null>(null);
  const [visibleExercises, setVisibleExercises] = useState<Set<number>>(new Set());
  const [isVisible, setIsVisible] = useState(false);
  const [completedSets, setCompletedSets] = useState<Record<string, boolean>>({});
  const sectionRef = useRef<HTMLElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.05 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    timerRef.current.forEach(clearTimeout);
    timerRef.current = [];
    setVisibleExercises(new Set());
    setExpandedEx(null);

    workoutPlan[selectedDay].workouts.forEach((_, i) => {
      const t = setTimeout(() => {
        setVisibleExercises(prev => new Set(prev).add(i));
      }, 60 + i * 70);
      timerRef.current.push(t);
    });

    return () => timerRef.current.forEach(clearTimeout);
  }, [selectedDay]);

  const toggleSet = useCallback((key: string) => {
    setCompletedSets(prev => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const current = workoutPlan[selectedDay];
  const totalSets = current.workouts.reduce((s, w) => s + parseInt(w.sets) || 0, 0);
  const completedCount = Object.values(completedSets).filter(Boolean).length;

  const restActivities = [
    { icon: '🧘', title: 'Mobility Work', desc: '20–30 min yoga or dynamic stretching. Focus on hips, thoracic spine, and shoulders.' },
    { icon: '🚶', title: 'Light Walk', desc: '30–45 min low-intensity walk. Promotes blood flow and active recovery.' },
    { icon: '🛁', title: 'Contrast Therapy', desc: 'Alternate cold (2 min) and hot (5 min) showers × 4 rounds. Reduces DOMS significantly.' },
    { icon: '😴', title: 'Sleep 8–9 hrs', desc: 'Muscle is built during sleep. Growth hormone peaks in deep sleep. Non-negotiable.' },
    { icon: '🥩', title: 'Protein Surplus', desc: 'Hit 1.8–2g/kg bodyweight. This is when nutrients are absorbed and used for repair.' },
    { icon: '📖', title: 'Mental Reset', desc: 'Visualize next week\'s lifts. Log this week\'s PRs. Plan your progressive overload.' },
  ];

  return (
    <section className="wg" id="workout-guide" ref={sectionRef}>
      {/* ─── Background ─── */}
      <canvas className="wg__canvas" id="wgCanvas" />
      <div className="wg__bg">
        <div className="wg__bg-orb wg__bg-orb--1" style={{ background: current.color }} />
        <div className="wg__bg-orb wg__bg-orb--2" style={{ background: current.color }} />
        <div className="wg__bg-grid" />
      </div>
      <div className="wg__left-bar" style={{ background: current.color }} />
      <div className="wg__scan-line" style={{ borderColor: current.color }} />

      <div className={`wg__container container${isVisible ? ' wg__container--visible' : ''}`}>

        {/* ─── Header ─── */}
        <div className="wg__header">
          <div className="wg__header-eyebrow">
            <div className="wg__eyebrow-dot" style={{ background: current.isRest ? '#64748b' : current.color }} />
            <span>Weekly Battle Plan</span>
            <div className="wg__eyebrow-line" />
          </div>
          <h2 className="wg__title">
            <span className="wg__title-sub">7-Day Hypertrophy</span>
            <span className="wg__title-main">Split Program</span>
          </h2>
          <p className="wg__subtitle">
            A science-driven PPL double-split — Push / Pull / Legs twice per week for maximum frequency and volume. Select a day to load your session.
          </p>
          {/* Week progress strip */}
          <div className="wg__week-strip">
            {workoutPlan.map((d, i) => (
              <button
                key={i}
                className={`wg__week-pip${selectedDay === i ? ' wg__week-pip--active' : ''}${d.isRest ? ' wg__week-pip--rest' : ''}`}
                style={selectedDay === i ? { background: d.color, borderColor: d.color } : {}}
                onClick={() => setSelectedDay(i)}
                title={d.day}
              >
                <span>{d.shortDay}</span>
                {!d.isRest && (
                  <div className="wg__week-bar" style={{ height: `${(d.intensityScore / 10) * 24}px`, background: d.color }} />
                )}
                {d.isRest && <span className="wg__week-rest-icon">😴</span>}
              </button>
            ))}
          </div>
        </div>

        {/* ─── Layout ─── */}
        <div className="wg__layout">

          {/* ─── Sidebar ─── */}
          <div className="wg__sidebar">
            <div className="wg__sidebar-track" />
            {workoutPlan.map((day, i) => (
              <button
                key={i}
                className={`wg__day${selectedDay === i ? ' wg__day--active' : ''}${day.isRest ? ' wg__day--rest' : ''}`}
                style={{ '--day-color': day.color } as React.CSSProperties}
                onClick={() => setSelectedDay(i)}
              >
                <div className="wg__day-left">
                  <div className="wg__day-dot-wrap">
                    <div className="wg__day-dot" />
                  </div>
                  <div className="wg__day-meta">
                    <span className="wg__day-short">{day.shortDay}</span>
                    <span className="wg__day-focus-label">
                      {day.isRest ? 'Rest Day' : `${day.focus} + ${day.subFocus}`}
                    </span>
                  </div>
                </div>
                <div className="wg__day-right">
                  {!day.isRest && (
                    <div className="wg__day-intensity-bar">
                      {Array(10).fill(null).map((_, j) => (
                        <div
                          key={j}
                          className="wg__day-intensity-seg"
                          style={{ background: j < day.intensityScore ? day.color : undefined }}
                        />
                      ))}
                    </div>
                  )}
                  <span className="wg__day-icon">{day.icon}</span>
                </div>
              </button>
            ))}
          </div>

          {/* ─── Main ─── */}
          <div className="wg__main">

            {/* ─── Rest Day View ─── */}
            {current.isRest ? (
              <div className="wg__rest-view">
                <div className="wg__rest-hero">
                  <div className="wg__rest-glyph">😴</div>
                  <div>
                    <h3 className="wg__rest-title">Recovery Day</h3>
                    <p className="wg__rest-sub">Muscles don't grow in the gym — they grow when you rest. Today is mandatory.</p>
                  </div>
                </div>
                <div className="wg__rest-grid">
                  {restActivities.map((a, i) => (
                    <div className="wg__rest-card" key={i}>
                      <div className="wg__rest-card-icon">{a.icon}</div>
                      <div className="wg__rest-card-title">{a.title}</div>
                      <p className="wg__rest-card-desc">{a.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {/* ─── Overview Card ─── */}
                <div
                  className="wg__overview"
                  style={{ '--ov-color': current.color, '--ov-accent': current.accentColor } as React.CSSProperties}
                >
                  <div className="wg__overview-gradient-border" />
                  <div className="wg__overview-glow" />

                  <div className="wg__overview-top">
                    <div className="wg__overview-icon-wrap">
                      <span className="wg__overview-emoji">{current.icon}</span>
                      <div className="wg__overview-ring wg__overview-ring--1" />
                      <div className="wg__overview-ring wg__overview-ring--2" />
                    </div>
                    <div className="wg__overview-info">
                      <span className="wg__overview-daytag">{current.day}</span>
                      <h3 className="wg__overview-focus">
                        {current.focus} <span style={{ color: current.accentColor }}>+ {current.subFocus}</span>
                      </h3>
                    </div>
                    {/* Completion ring */}
                    <div className="wg__completion-ring">
                      <svg width="56" height="56" viewBox="0 0 56 56" style={{ transform: 'rotate(-90deg)' }}>
                        <circle cx="28" cy="28" r="22" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="4" />
                        <circle
                          cx="28" cy="28" r="22" fill="none"
                          stroke={current.color} strokeWidth="4"
                          strokeDasharray={`${2 * Math.PI * 22}`}
                          strokeDashoffset={`${2 * Math.PI * 22 * (1 - completedCount / Math.max(totalSets, 1))}`}
                          strokeLinecap="round"
                          style={{ transition: 'stroke-dashoffset 0.5s ease' }}
                        />
                      </svg>
                      <div className="wg__completion-label">
                        <span className="wg__completion-num">{Math.round((completedCount / Math.max(totalSets, 1)) * 100)}%</span>
                        <span className="wg__completion-txt">done</span>
                      </div>
                    </div>
                  </div>

                  <div className="wg__overview-stats">
                    {[
                      { val: current.workouts.length, lbl: 'Exercises' },
                      { val: totalSets, lbl: 'Total Sets' },
                      { val: current.totalTime, lbl: 'Duration' },
                      { val: current.intensity, lbl: 'Intensity' },
                      { val: current.calories, lbl: 'Burn Est.' },
                    ].map(({ val, lbl }, i, arr) => (
                      <>
                        <div className="wg__overview-stat" key={lbl}>
                          <span className="wg__overview-stat-val" style={{ color: current.color }}>{val}</span>
                          <span className="wg__overview-stat-lbl">{lbl}</span>
                        </div>
                        {i < arr.length - 1 && <div className="wg__overview-divider" key={`div-${i}`} />}
                      </>
                    ))}
                  </div>

                  {/* Intensity meter */}
                  <div className="wg__intensity-meter">
                    <span className="wg__intensity-label">Intensity</span>
                    <div className="wg__intensity-track">
                      <div
                        className="wg__intensity-fill"
                        style={{ width: `${current.intensityScore * 10}%`, background: `linear-gradient(90deg, ${current.color}, ${current.accentColor})` }}
                      />
                    </div>
                    <span className="wg__intensity-score" style={{ color: current.color }}>{current.intensityScore}/10</span>
                  </div>
                </div>

                {/* ─── Exercise List ─── */}
                <div className="wg__exercises">
                  {current.workouts.map((workout, idx) => {
                    const setKey = `${selectedDay}-${idx}`;
                    const isExpanded = expandedEx === idx;
                    const isComplete = completedSets[setKey];

                    return (
                      <div
                        key={`${selectedDay}-${idx}`}
                        className={`wg__exercise${visibleExercises.has(idx) ? ' wg__exercise--visible' : ''}${isExpanded ? ' wg__exercise--expanded' : ''}${isComplete ? ' wg__exercise--done' : ''}`}
                        style={{ '--ex-color': current.color, '--ex-delay': `${idx * 0.06}s` } as React.CSSProperties}
                      >
                        {/* Rank */}
                        <div className="wg__ex-rank">
                          <span className="wg__ex-num">{String(idx + 1).padStart(2, '0')}</span>
                          {idx < current.workouts.length - 1 && <div className="wg__ex-connector" />}
                        </div>

                        {/* Card content */}
                        <div className="wg__ex-card" onClick={() => setExpandedEx(isExpanded ? null : idx)}>
                          <div className="wg__ex-top">
                            <div className="wg__ex-identity">
                              <span className="wg__ex-emoji">{workout.emoji}</span>
                              <div>
                                <h4 className="wg__ex-name">{workout.name}</h4>
                                <div className="wg__ex-badges">
                                  <span className="wg__ex-muscle">{workout.muscle}</span>
                                  <span
                                    className="wg__ex-difficulty"
                                    style={{ color: DIFFICULTY_COLOR[workout.difficulty], borderColor: DIFFICULTY_COLOR[workout.difficulty] + '40' }}
                                  >
                                    {workout.difficulty}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="wg__ex-metrics">
                              {[
                                { val: workout.sets, lbl: 'SETS' },
                                { val: workout.reps, lbl: 'REPS' },
                                { val: workout.rest, lbl: 'REST' },
                              ].map(({ val, lbl }) => (
                                <div className="wg__ex-metric" key={lbl}>
                                  <span className="wg__ex-metric-val">{val}</span>
                                  <span className="wg__ex-metric-lbl">{lbl}</span>
                                </div>
                              ))}
                              <button
                                className={`wg__ex-check${isComplete ? ' wg__ex-check--done' : ''}`}
                                style={isComplete ? { background: current.color, borderColor: current.color } : { borderColor: current.color + '60' }}
                                onClick={e => { e.stopPropagation(); toggleSet(setKey); }}
                              >
                                {isComplete ? '✓' : '○'}
                              </button>
                            </div>
                          </div>

                          {/* Expand arrow */}
                          <div className={`wg__ex-expand-arrow${isExpanded ? ' wg__ex-expand-arrow--open' : ''}`}>▾</div>

                          {/* Expanded tip */}
                          {isExpanded && (
                            <div className="wg__ex-tip" style={{ borderColor: current.color + '30' }}>
                              <span className="wg__ex-tip-icon" style={{ color: current.color }}>⚡</span>
                              <span className="wg__ex-tip-text">{workout.tip}</span>
                            </div>
                          )}

                          {/* Progress fill */}
                          <div className="wg__ex-progress">
                            <div
                              className="wg__ex-progress-fill"
                              style={{
                                width: `${((idx + 1) / current.workouts.length) * 100}%`,
                                background: `linear-gradient(90deg, ${current.color}99, ${current.accentColor}99)`,
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* ─── Pro Tip ─── */}
                <div className="wg__tip" style={{ borderColor: current.color + '35', background: current.color + '08' }}>
                  <div className="wg__tip-head">
                    <span className="wg__tip-icon" style={{ color: current.color }}>⚡</span>
                    <span className="wg__tip-label">Coach's Note for {current.day}</span>
                  </div>
                  <p className="wg__tip-text">
                    {selectedDay === 0 && 'Bench is the king. Warm up rotator cuff with band pull-aparts before loading. Your CNS needs 2–3 warm-up sets before working weight.'}
                    {selectedDay === 1 && 'Deadlift first while fresh — nothing else matters if your deadlift form breaks. Strap up after warm-up sets. Film your sets.'}
                    {selectedDay === 2 && 'Leg day is cardio too. Your breathing will be heavy on squats — this is normal. Brace like you\'re about to get punched before every rep.'}
                    {selectedDay === 3 && 'Variation day hits the chest from different angles. Cables > free weights for isolation today. Higher reps, squeeze every rep.'}
                    {selectedDay === 4 && 'EZ-bar 21s are brutally effective — choose a weight you can control for all 21 reps. This isn\'t a max-out set, it\'s a tempo set.'}
                    {selectedDay === 5 && 'Front squats require ankle mobility — if you\'re falling forward, elevate heels slightly. Arnold press is a full 180° rotation, don\'t cheat it.'}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WorkoutGuide;