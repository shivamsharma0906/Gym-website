import { useState, useEffect, useRef, useCallback } from 'react';
import './DietPlans.css';

/* ─────────────────── TYPES ─────────────────── */
interface Meal {
  time: string;
  mealTag: 'Pre-Workout' | 'Post-Workout' | 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack' | 'Before Bed';
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  emoji: string;
  ingredients: string[];
  swap: string;
}

interface Supplement {
  name: string;
  timing: string;
  dose: string;
  benefit: string;
  emoji: string;
}

interface DietPlan {
  name: string;
  tagline: string;
  icon: string;
  goal: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  color: string;
  accent: string;
  intensityScore: number;
  meals: Meal[];
  supplements: Supplement[];
  shoppingList: string[];
  prepTip: string;
}

/* ─────────────────── MEAL TAG COLORS ─────────────────── */
const TAG_COLOR: Record<string, string> = {
  'Pre-Workout': '#f59e0b',
  'Post-Workout': '#e63946',
  'Breakfast': '#f77f00',
  'Lunch': '#2ec4b6',
  'Dinner': '#a855f7',
  'Snack': '#64748b',
  'Before Bed': '#475569',
};

/* ─────────────────── DATA ─────────────────── */
const vegPlans: DietPlan[] = [
  {
    name: 'Muscle Builder',
    tagline: 'Maximum Anabolic Stimulus',
    icon: '💪',
    goal: 'Lean Muscle Gain',
    calories: 2600, protein: 120, carbs: 350, fats: 80,
    color: '#22c55e', accent: '#16a34a',
    intensityScore: 8,
    meals: [
      { time: '6:30 AM', mealTag: 'Breakfast', name: 'Paneer Bhurji + Multigrain Paratha', calories: 480, protein: 28, carbs: 52, fats: 18, emoji: '🫓', ingredients: ['100g paneer', '2 parathas', '1 tomato', '½ capsicum', 'spices'], swap: 'Replace paratha with oats chilla for lower carbs' },
      { time: '9:30 AM', mealTag: 'Snack', name: 'Banana + Peanut Butter + Sprouts Bowl', calories: 360, protein: 18, carbs: 48, fats: 14, emoji: '🥜', ingredients: ['2 bananas', '2 tbsp peanut butter', '50g mixed sprouts'], swap: 'Swap banana for apple if avoiding sugar spikes' },
      { time: '12:30 PM', mealTag: 'Lunch', name: 'Chole + Brown Rice + Raita + Salad', calories: 580, protein: 26, carbs: 88, fats: 10, emoji: '🍚', ingredients: ['200g chickpeas', '1 cup brown rice', '100g curd', 'cucumber', 'onion'], swap: 'Use quinoa instead of brown rice for more protein' },
      { time: '4:00 PM', mealTag: 'Pre-Workout', name: 'Sattu Shake + Dry Fruits', calories: 340, protein: 20, carbs: 44, fats: 8, emoji: '🥤', ingredients: ['4 tbsp sattu', '200ml milk', '10 almonds', '5 dates'], swap: 'Add 1 scoop plant protein for extra 20g protein' },
      { time: '7:00 PM', mealTag: 'Post-Workout', name: 'Dal Makhani + 2 Roti + Paneer Sabzi', calories: 560, protein: 30, carbs: 64, fats: 18, emoji: '🫘', ingredients: ['150g dal', '2 whole wheat rotis', '100g paneer', 'spices', '1 tsp ghee'], swap: 'Skip ghee on cut days; add on bulk days' },
      { time: '9:30 PM', mealTag: 'Before Bed', name: 'Turmeric Milk + Soaked Almonds + Walnut', calories: 280, protein: 14, carbs: 22, fats: 14, emoji: '🥛', ingredients: ['250ml full-fat milk', 'turmeric', '8 almonds', '4 walnuts'], swap: 'Use casein powder in milk for slower absorption' },
    ],
    supplements: [
      { name: 'Creatine Monohydrate', timing: 'Post-Workout', dose: '5g', benefit: 'Strength & muscle volume', emoji: '⚡' },
      { name: 'Plant Protein', timing: 'Post-Workout', dose: '30g', benefit: 'Muscle protein synthesis', emoji: '🌿' },
      { name: 'Vitamin D3', timing: 'Morning (with meal)', dose: '2000 IU', benefit: 'Testosterone & immunity', emoji: '☀️' },
      { name: 'Omega-3 (Flaxseed)', timing: 'With lunch', dose: '2 caps', benefit: 'Joint health & inflammation', emoji: '🐟' },
    ],
    shoppingList: ['Paneer 500g', 'Chickpeas 1kg', 'Brown rice 2kg', 'Sattu 500g', 'Whole wheat flour 2kg', 'Dal (black) 500g', 'Peanut butter 500g', 'Almonds 200g', 'Walnuts 100g', 'Mixed sprouts 500g', 'Full-fat milk 2L', 'Curd 500g'],
    prepTip: 'Soak chickpeas & lentils overnight every Sunday. Batch-cook brown rice for 3 days. Pre-cut vegetables for the week. Keeps prep under 30 min/day.',
  },
  {
    name: 'Fat Shredder',
    tagline: 'Aggressive Deficit Protocol',
    icon: '🔥',
    goal: 'Fat Loss & Definition',
    calories: 1600, protein: 110, carbs: 150, fats: 55,
    color: '#f77f00', accent: '#ea580c',
    intensityScore: 9,
    meals: [
      { time: '7:00 AM', mealTag: 'Breakfast', name: 'Moong Dal Chilla (3 pcs) + Green Chutney', calories: 280, protein: 22, carbs: 30, fats: 6, emoji: '🥞', ingredients: ['100g moong dal batter', 'onion', 'green chilli', 'coriander chutney'], swap: 'Add grated paneer inside for extra 10g protein' },
      { time: '10:00 AM', mealTag: 'Snack', name: 'Papaya + Apple + Roasted Chana', calories: 180, protein: 8, carbs: 30, fats: 3, emoji: '🍎', ingredients: ['150g papaya', '1 medium apple', '30g roasted chana'], swap: 'Skip fruit; only roasted chana if sugar-sensitive' },
      { time: '1:00 PM', mealTag: 'Lunch', name: 'Palak Paneer + 1 Roti + Cucumber Raita', calories: 380, protein: 26, carbs: 32, fats: 14, emoji: '🥬', ingredients: ['150g paneer', '200g spinach', '1 roti', '100g curd', 'cucumber'], swap: 'Use tofu instead of paneer to reduce fat by 30%' },
      { time: '4:30 PM', mealTag: 'Pre-Workout', name: 'Black Coffee + Handful Almonds', calories: 120, protein: 4, carbs: 4, fats: 9, emoji: '☕', ingredients: ['1 cup black coffee (no sugar)', '10 almonds'], swap: 'Green tea if caffeine-sensitive' },
      { time: '7:30 PM', mealTag: 'Post-Workout', name: 'Mixed Veg Soup + Grilled Tofu', calories: 320, protein: 28, carbs: 24, fats: 12, emoji: '🍲', ingredients: ['200g tofu', 'broccoli', 'carrot', 'beans', 'tomato broth'], swap: 'Replace tofu with low-fat paneer for taste' },
      { time: '9:00 PM', mealTag: 'Before Bed', name: 'Curd + Flax Seeds + Cinnamon', calories: 160, protein: 12, carbs: 14, fats: 6, emoji: '🫙', ingredients: ['200g low-fat curd', '1 tbsp flax seeds', 'cinnamon powder'], swap: 'Add chia seeds for omega-3 boost' },
    ],
    supplements: [
      { name: 'L-Carnitine', timing: '30 min pre-workout', dose: '2g', benefit: 'Fat mobilization', emoji: '🔥' },
      { name: 'Green Tea Extract', timing: 'Morning empty stomach', dose: '500mg', benefit: 'Thermogenesis', emoji: '🍵' },
      { name: 'Magnesium', timing: 'Before bed', dose: '400mg', benefit: 'Sleep quality & cortisol', emoji: '😴' },
      { name: 'B-Complex', timing: 'With breakfast', dose: '1 tab', benefit: 'Metabolism & energy', emoji: '⚡' },
    ],
    shoppingList: ['Moong dal 500g', 'Paneer (low-fat) 300g', 'Tofu 400g', 'Spinach 500g', 'Papaya 1 full', 'Cucumber 4 pcs', 'Low-fat curd 1kg', 'Roasted chana 200g', 'Flax seeds 200g', 'Broccoli 400g', 'Coffee beans 250g', 'Almonds 150g'],
    prepTip: 'Meal prep all soups Sunday evening. Pre-portion chana & almonds in zip bags. Keep chilla batter in fridge (lasts 48 hrs). This keeps you honest — no cooking = no excuses.',
  },
  {
    name: 'Performance Fuel',
    tagline: 'Athlete-Grade Energy System',
    icon: '⚡',
    goal: 'Athletic Performance',
    calories: 3000, protein: 135, carbs: 420, fats: 85,
    color: '#2ec4b6', accent: '#0d9488',
    intensityScore: 7,
    meals: [
      { time: '6:30 AM', mealTag: 'Breakfast', name: 'Upma + Sambar + Coconut Chutney + Sprouts', calories: 520, protein: 20, carbs: 82, fats: 14, emoji: '🥣', ingredients: ['1.5 cups semolina upma', '150ml sambar', 'coconut chutney', '50g sprouts'], swap: 'Replace upma with poha for lighter option' },
      { time: '9:30 AM', mealTag: 'Snack', name: 'Banana + Sattu Drink + Peanut Butter Sandwich', calories: 480, protein: 22, carbs: 72, fats: 14, emoji: '🍌', ingredients: ['2 bananas', '3 tbsp sattu', '2 bread slices', '1.5 tbsp peanut butter'], swap: 'Use sweet potato instead of bread for clean carbs' },
      { time: '12:30 PM', mealTag: 'Lunch', name: 'Rajma + Brown Rice + Curd + Salad', calories: 680, protein: 30, carbs: 108, fats: 12, emoji: '🍛', ingredients: ['200g rajma', '1.5 cups rice', '150g curd', 'onion tomato salad'], swap: 'Mixed beans (rajma + chana) for more micro variety' },
      { time: '3:30 PM', mealTag: 'Pre-Workout', name: 'Dates + Rice Cakes + Coconut Water', calories: 380, protein: 6, carbs: 74, fats: 2, emoji: '🥥', ingredients: ['6 dates', '4 rice cakes', '400ml coconut water'], swap: 'Banana + honey on toast works equally well' },
      { time: '6:30 PM', mealTag: 'Post-Workout', name: 'Paneer Bhurji + 3 Rotis + Dal + 1 tsp Ghee', calories: 720, protein: 38, carbs: 74, fats: 24, emoji: '🫓', ingredients: ['150g paneer', '3 whole wheat rotis', 'dal', '1 tsp ghee'], swap: 'Add extra roti on high-volume training days' },
      { time: '9:30 PM', mealTag: 'Before Bed', name: 'Kheer (Low Sugar) + Walnuts', calories: 360, protein: 16, carbs: 52, fats: 10, emoji: '🍮', ingredients: ['200ml milk kheer', '1 tbsp sugar', 'cardamom', '4 walnuts'], swap: 'Oats porridge with banana is simpler alternative' },
    ],
    supplements: [
      { name: 'Creatine Monohydrate', timing: 'Post-Workout', dose: '5g', benefit: 'Power output & recovery', emoji: '⚡' },
      { name: 'Electrolyte Mix', timing: 'During training', dose: '1 sachet', benefit: 'Hydration & cramping prevention', emoji: '💧' },
      { name: 'Ashwagandha (KSM-66)', timing: 'Before bed', dose: '600mg', benefit: 'Cortisol & endurance', emoji: '🌿' },
      { name: 'Iron + Folate', timing: 'With lunch', dose: '1 tab', benefit: 'Oxygen transport (critical for vegans)', emoji: '🩸' },
    ],
    shoppingList: ['Semolina 500g', 'Rajma 1kg', 'Brown rice 2kg', 'Dates 300g', 'Rice cakes 1 pack', 'Coconut water 6 cans', 'Paneer 500g', 'Sattu 500g', 'Peanut butter 500g', 'Whole wheat flour 2kg', 'Ghee 200g', 'Milk 3L', 'Walnuts 150g'],
    prepTip: 'Carb-load the night before heavy training days. Keep rice cakes & dates as portable pre-workout fuel. Batch cook rajma/dal twice a week. Coconut water > sports drinks.',
  },
];

const nonVegPlans: DietPlan[] = [
  {
    name: 'Muscle Builder',
    tagline: 'Maximum Protein Protocol',
    icon: '💪',
    goal: 'Lean Muscle Gain',
    calories: 2800, protein: 185, carbs: 300, fats: 88,
    color: '#e63946', accent: '#b91c1c',
    intensityScore: 9,
    meals: [
      { time: '7:00 AM', mealTag: 'Breakfast', name: 'Egg Bhurji (4 eggs) + Toast + Banana', calories: 520, protein: 36, carbs: 44, fats: 18, emoji: '🍳', ingredients: ['4 whole eggs', '2 multigrain toasts', '1 banana', 'onion', 'tomato', 'spices'], swap: '5 egg whites + 1 yolk if watching cholesterol' },
      { time: '10:00 AM', mealTag: 'Snack', name: 'Whey Protein Shake + Almonds', calories: 380, protein: 42, carbs: 20, fats: 12, emoji: '🥤', ingredients: ['1 scoop whey (30g)', '250ml milk', '15 almonds', '1 banana (optional)'], swap: 'Dahi (250g) + 2 boiled eggs if avoiding supplements' },
      { time: '1:00 PM', mealTag: 'Lunch', name: 'Chicken Curry + Brown Rice + Dal + Salad', calories: 680, protein: 48, carbs: 72, fats: 18, emoji: '🍗', ingredients: ['200g chicken breast', '1 cup brown rice', '150g dal', 'salad'], swap: 'Mutton on rest days for zinc & iron boost' },
      { time: '4:00 PM', mealTag: 'Pre-Workout', name: 'Boiled Eggs (2) + Peanut Butter Toast', calories: 320, protein: 22, carbs: 28, fats: 14, emoji: '🥚', ingredients: ['2 boiled eggs', '2 bread slices', '1.5 tbsp peanut butter'], swap: 'Banana + peanut butter if no eggs available' },
      { time: '7:00 PM', mealTag: 'Post-Workout', name: 'Fish Tikka + 2 Rotis + Dal + Curd', calories: 620, protein: 46, carbs: 58, fats: 16, emoji: '🐟', ingredients: ['200g fish (rohu/surmai)', '2 rotis', '100g dal', '100g curd'], swap: 'Chicken breast grilled as alternate to fish' },
      { time: '9:30 PM', mealTag: 'Before Bed', name: 'Casein/Slow Protein + Almonds', calories: 340, protein: 34, carbs: 14, fats: 14, emoji: '🥛', ingredients: ['1 scoop casein in milk', '10 almonds', 'cinnamon'], swap: '300g curd + 1 tbsp peanut butter (natural casein)' },
    ],
    supplements: [
      { name: 'Whey Protein', timing: 'Post-Workout', dose: '30g', benefit: 'Fast muscle protein synthesis', emoji: '🥛' },
      { name: 'Casein Protein', timing: 'Before bed', dose: '30g', benefit: 'Overnight muscle repair', emoji: '😴' },
      { name: 'Creatine Monohydrate', timing: 'Post-Workout', dose: '5g', benefit: 'Strength & cell volumization', emoji: '⚡' },
      { name: 'Vitamin D3 + K2', timing: 'Morning (with meal)', dose: '5000 IU + 100mcg', benefit: 'Testosterone & bone density', emoji: '☀️' },
    ],
    shoppingList: ['Eggs 3 dozen', 'Chicken breast 1.5kg', 'Fish (rohu/surmai) 1kg', 'Whey protein 1 pack', 'Casein protein 1 pack', 'Brown rice 2kg', 'Whole wheat flour 2kg', 'Dal 500g', 'Peanut butter 500g', 'Almonds 200g', 'Full-fat milk 3L', 'Curd 1kg'],
    prepTip: 'Marinate chicken/fish Sunday night. Boil a dozen eggs at a time — lasts 5 days in fridge. Batch cook dal and rice every 2 days. Prepping saves 45 min daily.',
  },
  {
    name: 'Fat Shredder',
    tagline: 'Aggressive Deficit — High Protein',
    icon: '🔥',
    goal: 'Fat Loss & Definition',
    calories: 1800, protein: 165, carbs: 130, fats: 65,
    color: '#f77f00', accent: '#ea580c',
    intensityScore: 10,
    meals: [
      { time: '7:30 AM', mealTag: 'Breakfast', name: 'Boiled Eggs (4) + Multigrain Toast + Coffee', calories: 350, protein: 30, carbs: 28, fats: 14, emoji: '🥚', ingredients: ['4 boiled eggs', '2 multigrain toasts', '1 cup black coffee'], swap: '4 egg whites + 1 yolk + 1 toast if cutting harder' },
      { time: '10:30 AM', mealTag: 'Snack', name: 'Apple + Walnuts', calories: 180, protein: 4, carbs: 24, fats: 9, emoji: '🍎', ingredients: ['1 medium apple', '8 walnuts'], swap: 'Cucumber + peanut butter on very low carb days' },
      { time: '1:00 PM', mealTag: 'Lunch', name: 'Tandoori Chicken Salad + Raita', calories: 420, protein: 48, carbs: 18, fats: 16, emoji: '🍖', ingredients: ['200g tandoori chicken breast', 'lettuce', 'cucumber', 'tomato', '100g raita'], swap: 'Add a roti if energy dips — deficit can be flexible' },
      { time: '4:00 PM', mealTag: 'Pre-Workout', name: 'Black Coffee + Protein Bar', calories: 210, protein: 22, carbs: 18, fats: 6, emoji: '☕', ingredients: ['1 cup black coffee', '1 protein bar (choose < 200 kcal)'], swap: '2 boiled eggs + black coffee if no bars available' },
      { time: '7:00 PM', mealTag: 'Post-Workout', name: 'Grilled Fish + Steamed Broccoli + Soup', calories: 380, protein: 44, carbs: 16, fats: 14, emoji: '🐠', ingredients: ['200g grilled surmai/rohu', '200g steamed broccoli', '1 bowl clear soup'], swap: 'Grilled chicken breast is perfect swap for fish' },
      { time: '9:00 PM', mealTag: 'Before Bed', name: 'Curd + Flax Seeds + Eggs', calories: 260, protein: 24, carbs: 10, fats: 14, emoji: '🫙', ingredients: ['200g low-fat curd', '1 tbsp flax seeds', '2 boiled eggs'], swap: 'Cottage cheese (paneer) if extra curd isn\'t appealing' },
    ],
    supplements: [
      { name: 'L-Carnitine', timing: 'Pre-workout (30 min before)', dose: '2g', benefit: 'Fat oxidation boost', emoji: '🔥' },
      { name: 'Whey Isolate', timing: 'Post-workout', dose: '30g', benefit: 'Fast protein, minimal carbs/fat', emoji: '🥛' },
      { name: 'CLA', timing: 'With meals (3x)', dose: '1g each', benefit: 'Body composition', emoji: '⚖️' },
      { name: 'Zinc + Magnesium', timing: 'Before bed', dose: 'ZMA formula', benefit: 'Testosterone & deep sleep', emoji: '😴' },
    ],
    shoppingList: ['Eggs 3 dozen', 'Chicken breast 1.5kg', 'Fish (surmai) 1kg', 'Protein bars 7 pcs', 'Whey isolate 1 pack', 'Broccoli 1kg', 'Cucumber 6 pcs', 'Apple 7 pcs', 'Walnuts 150g', 'Low-fat curd 1kg', 'Multigrain bread 1 loaf', 'Flax seeds 200g', 'Coffee beans 250g'],
    prepTip: 'Meal prep is non-negotiable on a cut. Weigh everything the first 2 weeks to calibrate your eye. Grilled chicken/fish stays fresh 3 days refrigerated. Never go grocery shopping hungry.',
  },
  {
    name: 'Performance Fuel',
    tagline: 'Elite Athlete Nutrition',
    icon: '⚡',
    goal: 'Athletic Performance',
    calories: 3200, protein: 175, carbs: 390, fats: 95,
    color: '#2ec4b6', accent: '#0d9488',
    intensityScore: 8,
    meals: [
      { time: '6:30 AM', mealTag: 'Breakfast', name: 'Omelette (4 eggs) + Aloo Paratha + Curd', calories: 620, protein: 36, carbs: 68, fats: 24, emoji: '🫓', ingredients: ['4 egg omelette', '2 aloo parathas', '150g curd', '1 tsp ghee'], swap: 'Egg fried rice with 3 eggs for carb-heavy AM training' },
      { time: '9:30 AM', mealTag: 'Snack', name: 'Chicken Sandwich + Banana + OJ', calories: 520, protein: 34, carbs: 68, fats: 12, emoji: '🥪', ingredients: ['100g chicken breast', '2 bread slices', '1 banana', 'fresh orange juice'], swap: 'Tuna sandwich for omega-3 boost' },
      { time: '12:30 PM', mealTag: 'Lunch', name: 'Mutton Curry + Steamed Rice + Dal + Salad', calories: 780, protein: 48, carbs: 88, fats: 26, emoji: '🍛', ingredients: ['200g mutton', '1.5 cups rice', '100g dal', 'salad'], swap: 'Chicken curry on lighter days — mutton for heavy days' },
      { time: '3:30 PM', mealTag: 'Pre-Workout', name: 'Sattu Shake + Dates + Peanuts', calories: 380, protein: 18, carbs: 58, fats: 10, emoji: '🥤', ingredients: ['4 tbsp sattu', '200ml milk', '6 dates', '20g peanuts'], swap: 'Mass gainer shake if weight gain is stalling' },
      { time: '6:30 PM', mealTag: 'Post-Workout', name: 'Egg Fried Rice + Chicken Soup', calories: 700, protein: 44, carbs: 82, fats: 20, emoji: '🍚', ingredients: ['3 eggs', '1.5 cups rice', '150g chicken', 'soy sauce', 'vegetables'], swap: 'Add shrimp to fried rice for lean protein variety' },
      { time: '9:30 PM', mealTag: 'Before Bed', name: 'Turmeric Milk + Walnuts + Boiled Egg', calories: 360, protein: 22, carbs: 18, fats: 22, emoji: '🥛', ingredients: ['250ml full-fat milk', 'turmeric', '4 walnuts', '2 boiled eggs'], swap: 'Greek yogurt with honey replaces milk on stomach-sensitive nights' },
    ],
    supplements: [
      { name: 'Creatine Monohydrate', timing: 'Post-Workout', dose: '5g', benefit: 'Explosive power & ATP', emoji: '⚡' },
      { name: 'Whey Protein', timing: 'Post-Workout', dose: '30g', benefit: 'Rapid muscle repair', emoji: '🥛' },
      { name: 'Beta-Alanine', timing: '30 min pre-workout', dose: '3.2g', benefit: 'Endurance & lactic buffering', emoji: '🏃' },
      { name: 'Fish Oil', timing: 'With meals (2x)', dose: '2g EPA/DHA', benefit: 'Recovery & joint health', emoji: '🐟' },
    ],
    shoppingList: ['Eggs 4 dozen', 'Chicken breast 1.5kg', 'Mutton 1kg', 'Sattu 500g', 'Steamed rice 3kg', 'Whole wheat bread 2 loaves', 'Dates 300g', 'Peanuts 300g', 'Full-fat milk 3L', 'Curd 1kg', 'Walnuts 150g', 'Potatoes 1kg', 'Fresh OJ 6 bottles'],
    prepTip: 'On heavy training weeks, increase carbs by 15%. Keep sattu sachets in gym bag as emergency fuel. Mutton has superior zinc for testosterone — include 2x per week minimum.',
  },
];

/* ─────────────────── SVG DONUT CHART ─────────────────── */
const DonutChart = ({ protein, carbs, fats }: { protein: number; carbs: number; fats: number }) => {
  const total = protein * 4 + carbs * 4 + fats * 9;
  const proteinPct = (protein * 4) / total;
  const carbsPct = (carbs * 4) / total;
  const fatsPct = (fats * 9) / total;

  const R = 52; const C = 2 * Math.PI * R;
  const segments = [
    { pct: proteinPct, color: '#e63946', label: 'Protein', offset: 0 },
    { pct: carbsPct, color: '#f77f00', label: 'Carbs', offset: proteinPct },
    { pct: fatsPct, color: '#2ec4b6', label: 'Fats', offset: proteinPct + carbsPct },
  ];

  return (
    <div className="dp__donut-wrap">
      <svg viewBox="0 0 120 120" className="dp__donut-svg">
        <circle cx="60" cy="60" r={R} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="14" />
        {segments.map(({ pct, color: sc, offset }) => (
          <circle
            key={sc}
            cx="60" cy="60" r={R}
            fill="none"
            stroke={sc}
            strokeWidth="14"
            strokeDasharray={`${pct * C} ${C}`}
            strokeDashoffset={`${-offset * C}`}
            strokeLinecap="butt"
            style={{ transform: 'rotate(-90deg)', transformOrigin: '60px 60px', transition: 'stroke-dasharray 0.8s ease' }}
          />
        ))}
        <circle cx="60" cy="60" r="34" fill="#0a0a0a" />
      </svg>
      <div className="dp__donut-legend">
        {segments.map(({ color: sc, label, pct }) => (
          <div className="dp__donut-leg-item" key={label}>
            <div className="dp__donut-leg-dot" style={{ background: sc }} />
            <span className="dp__donut-leg-label">{label}</span>
            <span className="dp__donut-leg-val" style={{ color: sc }}>{Math.round(pct * 100)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ─────────────────── WATER TRACKER ─────────────────── */
const WaterTracker = () => {
  const [glasses, setGlasses] = useState(0);
  const target = 8;
  return (
    <div className="dp__water">
      <div className="dp__water-header">
        <span className="dp__water-icon">💧</span>
        <span className="dp__water-label">Hydration Tracker</span>
        <span className="dp__water-count">{glasses}/{target} glasses</span>
      </div>
      <div className="dp__water-glasses">
        {Array(target).fill(null).map((_, i) => (
          <button
            key={i}
            className={`dp__water-glass${i < glasses ? ' dp__water-glass--full' : ''}`}
            onClick={() => setGlasses(i < glasses ? i : i + 1)}
            title={`Glass ${i + 1}`}
          >
            <div className="dp__water-fill" style={{ height: i < glasses ? '100%' : '0%' }} />
            <span>🥛</span>
          </button>
        ))}
      </div>
      <div className="dp__water-bar">
        <div className="dp__water-fill-bar" style={{ width: `${(glasses / target) * 100}%` }} />
      </div>
      <div className="dp__water-tip">
        {glasses < 4 ? '⚠️ Critically low — hydrate now' : glasses < 6 ? '📈 Getting there — keep going' : glasses < 8 ? '✅ Almost there!' : '🏆 Hydration goal crushed!'}
      </div>
    </div>
  );
};

/* ─────────────────── SHOPPING LIST MODAL ─────────────────── */
const ShoppingList = ({ items, onClose }: { items: string[]; onClose: () => void }) => (
  <div className="dp__modal-backdrop" onClick={onClose}>
    <div className="dp__modal" onClick={e => e.stopPropagation()}>
      <div className="dp__modal-head">
        <span className="dp__modal-title">🛒 Weekly Shopping List</span>
        <button className="dp__modal-close" onClick={onClose}>✕</button>
      </div>
      <div className="dp__modal-items">
        {items.map((item, i) => (
          <label key={i} className="dp__modal-item">
            <input type="checkbox" />
            <span>{item}</span>
          </label>
        ))}
      </div>
      <p className="dp__modal-note">Print or screenshot this list before your weekly grocery run.</p>
    </div>
  </div>
);

/* ─────────────────── COMPONENT ─────────────────── */
const DietPlans = () => {
  const [dietType, setDietType] = useState<'veg' | 'nonveg'>('nonveg');
  const [activePlan, setActivePlan] = useState(0);
  const [completedMeals, setCompletedMeals] = useState<Set<string>>(new Set());
  const [expandedMeal, setExpandedMeal] = useState<number | null>(null);
  const [showShopping, setShowShopping] = useState(false);
  const [activeTab, setActiveTab] = useState<'meals' | 'supplements' | 'prep'>('meals');
  const [isVisible, setIsVisible] = useState(false);
  const [visibleMeals, setVisibleMeals] = useState<Set<number>>(new Set());
  const sectionRef = useRef<HTMLElement>(null);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const currentPlans = dietType === 'veg' ? vegPlans : nonVegPlans;
  const plan = currentPlans[activePlan];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.05 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    plan.meals.forEach((_, i) => {
      const t = setTimeout(() => setVisibleMeals(prev => new Set(prev).add(i)), 80 + i * 80);
      timersRef.current.push(t);
    });
    return () => timersRef.current.forEach(clearTimeout);
  }, [activePlan, dietType, plan.meals]);

  const toggleMeal = useCallback((key: string) => {
    setCompletedMeals(prev => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }, []);

  const totalCalsConsumed = plan.meals
    .filter((_, i) => completedMeals.has(`${dietType}-${activePlan}-${i}`))
    .reduce((s, m) => s + m.calories, 0);

  const calPct = Math.min((totalCalsConsumed / plan.calories) * 100, 100);

  return (
    <section className="dp" id="diet-plans" ref={sectionRef} key={`${dietType}-${activePlan}`}>
      {/* BG */}
      <div className="dp__bg">
        <div className="dp__bg-orb dp__bg-orb--1" style={{ background: plan.color }} />
        <div className="dp__bg-orb dp__bg-orb--2" style={{ background: plan.accent }} />
        <div className="dp__bg-grid" />
      </div>
      <div className="dp__left-bar" style={{ background: plan.color }} />

      <div className={`dp__container container${isVisible ? ' dp__container--visible' : ''}`}>

        {/* ─── HEADER ─── */}
        <div className="dp__header">
          <div className="dp__eyebrow">
            <div className="dp__eyebrow-dot" style={{ background: plan.color }} />
            <span>Nutrition Science</span>
            <div className="dp__eyebrow-line" />
          </div>
          <h2 className="dp__title">
            <span className="dp__title-sub">Precision Indian</span>
            <span className="dp__title-main">Diet Protocols</span>
          </h2>
          <p className="dp__subtitle">
            Nutrition accounts for 80% of your results. Macro-optimised Indian meal plans for every goal — built by our registered dietitian.
          </p>

          {/* DIET TOGGLE */}
          <div className="dp__toggle">
            {(['veg', 'nonveg'] as const).map(type => (
              <button
                key={type}
                className={`dp__toggle-btn${dietType === type ? ' dp__toggle-btn--active' : ''}`}
                style={dietType === type ? { borderColor: type === 'veg' ? '#22c55e' : '#e63946', background: type === 'veg' ? '#22c55e18' : '#e6394618' } : {}}
                onClick={() => { setDietType(type); setActivePlan(0); setCompletedMeals(new Set()); }}
              >
                <span className="dp__toggle-marker" style={{ background: type === 'veg' ? '#22c55e' : '#e63946' }} />
                {type === 'veg' ? '🥬 Vegetarian' : '🍗 Non-Vegetarian'}
              </button>
            ))}
          </div>
        </div>

        {/* ─── PLAN TABS ─── */}
        <div className="dp__plan-tabs">
          {currentPlans.map((dp, i) => (
            <button
              key={i}
              className={`dp__plan-tab${activePlan === i ? ' dp__plan-tab--active' : ''}`}
              style={{ '--dp-color': dp.color } as React.CSSProperties}
              onClick={() => { setActivePlan(i); setCompletedMeals(new Set()); setActiveTab('meals'); }}
            >
              <div className="dp__plan-tab-icon">{dp.icon}</div>
              <div>
                <div className="dp__plan-tab-name">{dp.name}</div>
                <div className="dp__plan-tab-goal">{dp.goal}</div>
              </div>
              {activePlan === i && (
                <div className="dp__plan-tab-bar">
                  {Array(10).fill(null).map((_, j) => (
                    <div key={j} className="dp__plan-tab-seg" style={{ background: j < dp.intensityScore ? dp.color : undefined }} />
                  ))}
                </div>
              )}
            </button>
          ))}
        </div>

        {/* ─── OVERVIEW ROW ─── */}
        <div className="dp__overview-row">

          {/* MACRO PANEL */}
          <div className="dp__macro-panel" style={{ '--dp-color': plan.color, '--dp-accent': plan.accent } as React.CSSProperties}>
            <div className="dp__macro-border" />
            <div className="dp__macro-glow" />
            <div className="dp__macro-head">
              <div>
                <div className="dp__macro-tagline">{plan.tagline}</div>
                <div className="dp__macro-cals">
                  <span className="dp__macro-cals-num" style={{ color: plan.color }}>{plan.calories.toLocaleString()}</span>
                  <span className="dp__macro-cals-unit">kcal / day</span>
                </div>
              </div>
              <DonutChart protein={plan.protein} carbs={plan.carbs} fats={plan.fats} />
            </div>
            <div className="dp__macro-stats">
              {[
                { label: 'Protein', val: `${plan.protein}g`, color: '#e63946', pct: Math.round((plan.protein * 4 / (plan.protein * 4 + plan.carbs * 4 + plan.fats * 9)) * 100) },
                { label: 'Carbs', val: `${plan.carbs}g`, color: '#f77f00', pct: Math.round((plan.carbs * 4 / (plan.protein * 4 + plan.carbs * 4 + plan.fats * 9)) * 100) },
                { label: 'Fats', val: `${plan.fats}g`, color: '#2ec4b6', pct: Math.round((plan.fats * 9 / (plan.protein * 4 + plan.carbs * 4 + plan.fats * 9)) * 100) },
              ].map(({ label, val, color: mc, pct }) => (
                <div className="dp__macro-stat" key={label}>
                  <div className="dp__macro-stat-top">
                    <span className="dp__macro-stat-label">{label}</span>
                    <span className="dp__macro-stat-val" style={{ color: mc }}>{val}</span>
                  </div>
                  <div className="dp__macro-bar-track">
                    <div className="dp__macro-bar-fill" style={{ width: `${pct}%`, background: mc }} />
                  </div>
                  <span className="dp__macro-stat-pct">{pct}% of calories</span>
                </div>
              ))}
            </div>

            {/* Calorie progress */}
            <div className="dp__cal-progress">
              <div className="dp__cal-progress-head">
                <span className="dp__cal-label">Today's progress</span>
                <span className="dp__cal-count" style={{ color: plan.color }}>{totalCalsConsumed} / {plan.calories} kcal</span>
              </div>
              <div className="dp__cal-track">
                <div className="dp__cal-fill" style={{ width: `${calPct}%`, background: `linear-gradient(90deg, ${plan.color}, ${plan.accent})` }} />
              </div>
            </div>

            <button className="dp__shopping-btn" style={{ borderColor: plan.color + '60', color: plan.color }} onClick={() => setShowShopping(true)}>
              🛒 Generate Shopping List
            </button>
          </div>

          {/* WATER TRACKER */}
          <div className="dp__side-col">
            <WaterTracker />
          </div>
        </div>

        {/* ─── INNER TABS ─── */}
        <div className="dp__inner-tabs">
          {(['meals', 'supplements', 'prep'] as const).map(tab => (
            <button
              key={tab}
              className={`dp__inner-tab${activeTab === tab ? ' dp__inner-tab--active' : ''}`}
              style={activeTab === tab ? { borderColor: plan.color, color: plan.color, background: plan.color + '12' } : {}}
              onClick={() => setActiveTab(tab)}
            >
              {{ meals: '🍽️ Meal Timeline', supplements: '💊 Supplements', prep: '📋 Meal Prep Tips' }[tab]}
            </button>
          ))}
        </div>

        {/* ─── MEALS TAB ─── */}
        {activeTab === 'meals' && (
          <div className="dp__meals">
            <div className="dp__meals-track" style={{ background: `linear-gradient(to bottom, ${plan.color}80, transparent)` }} />
            {plan.meals.map((meal, idx) => {
              const key = `${dietType}-${activePlan}-${idx}`;
              const done = completedMeals.has(key);
              const expanded = expandedMeal === idx;
              const tagColor = TAG_COLOR[meal.mealTag] || '#888';
              return (
                <div
                  key={key}
                  className={`dp__meal${visibleMeals.has(idx) ? ' dp__meal--visible' : ''}${done ? ' dp__meal--done' : ''}${expanded ? ' dp__meal--expanded' : ''}`}
                  style={{ '--dm-delay': `${idx * 0.07}s`, '--dm-color': plan.color } as React.CSSProperties}
                >
                  {/* Timeline dot */}
                  <div className="dp__meal-timeline">
                    <div className="dp__meal-dot" style={{ background: done ? plan.color : 'transparent', borderColor: plan.color }}>
                      {done && <span>✓</span>}
                    </div>
                  </div>

                  {/* Card */}
                  <div className="dp__meal-card" onClick={() => setExpandedMeal(expanded ? null : idx)}>
                    <div className="dp__meal-card-top">
                      <div className="dp__meal-left">
                        <div className="dp__meal-time-tag">
                          <span className="dp__meal-time">{meal.time}</span>
                          <span className="dp__meal-tag" style={{ color: tagColor, borderColor: tagColor + '40' }}>{meal.mealTag}</span>
                        </div>
                        <div className="dp__meal-identity">
                          <span className="dp__meal-emoji">{meal.emoji}</span>
                          <h4 className="dp__meal-name">{meal.name}</h4>
                        </div>
                        <div className="dp__meal-macros">
                          <span style={{ color: '#e63946' }}>P: {meal.protein}g</span>
                          <span>·</span>
                          <span style={{ color: '#f77f00' }}>C: {meal.carbs}g</span>
                          <span>·</span>
                          <span style={{ color: '#2ec4b6' }}>F: {meal.fats}g</span>
                        </div>
                      </div>

                      <div className="dp__meal-right">
                        <div className="dp__meal-kcal" style={{ color: plan.color }}>{meal.calories}</div>
                        <div className="dp__meal-kcal-lbl">kcal</div>
                        <button
                          className={`dp__meal-check${done ? ' dp__meal-check--done' : ''}`}
                          style={{ borderColor: plan.color + '80', ...(done ? { background: plan.color } : {}) }}
                          onClick={e => { e.stopPropagation(); toggleMeal(key); }}
                        >
                          {done ? '✓' : '○'}
                        </button>
                      </div>
                    </div>

                    {/* Expand */}
                    <div className={`dp__meal-expand-arrow${expanded ? ' dp__meal-expand-arrow--open' : ''}`}>▾</div>

                    {expanded && (
                      <div className="dp__meal-expanded" style={{ borderTopColor: plan.color + '30' }}>
                        <div className="dp__meal-exp-section">
                          <div className="dp__meal-exp-label" style={{ color: plan.color }}>📦 Ingredients</div>
                          <div className="dp__meal-ingredients">
                            {meal.ingredients.map((ing, j) => <span key={j} className="dp__meal-ing">{ing}</span>)}
                          </div>
                        </div>
                        <div className="dp__meal-exp-section">
                          <div className="dp__meal-exp-label" style={{ color: plan.color }}>🔄 Smart Swap</div>
                          <p className="dp__meal-swap">{meal.swap}</p>
                        </div>
                      </div>
                    )}

                    {/* Progress line */}
                    <div className="dp__meal-progress">
                      <div className="dp__meal-progress-fill" style={{ width: `${(meal.calories / plan.calories) * 100}%`, background: plan.color }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ─── SUPPLEMENTS TAB ─── */}
        {activeTab === 'supplements' && (
          <div className="dp__supps">
            {plan.supplements.map((supp, i) => (
              <div className="dp__supp-card" key={i} style={{ '--dp-color': plan.color } as React.CSSProperties}>
                <div className="dp__supp-emoji">{supp.emoji}</div>
                <div className="dp__supp-info">
                  <div className="dp__supp-name">{supp.name}</div>
                  <div className="dp__supp-benefit">{supp.benefit}</div>
                </div>
                <div className="dp__supp-meta">
                  <div className="dp__supp-dose" style={{ color: plan.color }}>{supp.dose}</div>
                  <div className="dp__supp-timing">{supp.timing}</div>
                </div>
              </div>
            ))}
            <div className="dp__supp-disclaimer">
              ⚠️ Supplements are optional — food first, always. Consult a doctor before starting any new supplement protocol. These are general recommendations; individual needs vary.
            </div>
          </div>
        )}

        {/* ─── PREP TAB ─── */}
        {activeTab === 'prep' && (
          <div className="dp__prep">
            <div className="dp__prep-card" style={{ borderColor: plan.color + '40' }}>
              <div className="dp__prep-icon">{plan.icon}</div>
              <div className="dp__prep-title" style={{ color: plan.color }}>Meal Prep Strategy — {plan.name}</div>
              <p className="dp__prep-text">{plan.prepTip}</p>
            </div>
            <div className="dp__prep-grid">
              {[
                { icon: '📅', title: 'Sunday Prep', text: 'Batch cook grains & legumes. Marinate proteins. Pre-cut all vegetables. Label containers by day.' },
                { icon: '🧊', title: 'Storage', text: 'Cooked proteins: 3 days. Cooked grains: 4 days. Cut vegetables: 3 days. Always airtight containers.' },
                { icon: '⏱️', title: 'Time Budget', text: 'Full Sunday prep takes 90 min. Cuts daily cooking to 20 min. ROI: 5 hrs saved per week.' },
                { icon: '🎯', title: 'Portioning', text: 'Use a food scale for first 2 weeks. Then eye-ball. Accuracy matters most in the first 30 days.' },
              ].map((tip, i) => (
                <div className="dp__prep-tip" key={i}>
                  <div className="dp__prep-tip-icon">{tip.icon}</div>
                  <div className="dp__prep-tip-title">{tip.title}</div>
                  <p className="dp__prep-tip-text">{tip.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── NOTE ─── */}
        <div className="dp__note" style={{ borderColor: '#2ec4b6' + '40', background: '#2ec4b618' }}>
          <span className="dp__note-icon">🧪</span>
          <div className="dp__note-text">
            <strong style={{ color: '#2ec4b6' }}>Dietitian's Note:</strong> These are template plans based on common Indian dietary patterns. Individualise based on bloodwork, food intolerances, and training volume.{' '}
            <em>Hydration goal: 3–4L water daily. Add nimbu pani or coconut water post-workout.</em>
          </div>
        </div>
      </div>

      {/* SHOPPING LIST MODAL */}
      {showShopping && <ShoppingList items={plan.shoppingList} onClose={() => setShowShopping(false)} />}
    </section>
  );
};

export default DietPlans;