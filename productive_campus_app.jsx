import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  Circle,
  Clock3,
  Cloud,
  CloudOff,
  Download,
  GraduationCap,
  Headphones,
  Home,
  LayoutGrid,
  ListTodo,
  MoreHorizontal,
  NotebookPen,
  Pause,
  Play,
  Plus,
  RotateCcw,
  Search,
  Settings,
  Sparkles,
  Trash2,
  Upload,
  Waves,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const STORAGE_KEY = "momentum-campus-premium-v2";
const DEFAULT_VIEW = "dashboard";

const themes = {
  obsidian: {
    name: "Obsidian",
    background:
      "radial-gradient(circle at 0% 0%, rgba(99,102,241,0.16), transparent 24%), radial-gradient(circle at 100% 0%, rgba(14,165,233,0.10), transparent 22%), linear-gradient(180deg, #060912 0%, #0b1220 48%, #080d18 100%)",
    panel: "rgba(10, 16, 28, 0.80)",
    panelSoft: "rgba(255,255,255,0.045)",
    panelStrong: "rgba(255,255,255,0.07)",
    border: "rgba(255,255,255,0.08)",
    text: "#F8FAFC",
    muted: "#98A6BC",
    accent: "#7C3AED",
    accent2: "#38BDF8",
    accentSoft: "rgba(124,58,237,0.16)",
    success: "#22C55E",
    danger: "#FB7185",
    shadow: "0 24px 80px rgba(0,0,0,0.34)",
  },
  pearl: {
    name: "Pearl",
    background:
      "radial-gradient(circle at 100% 0%, rgba(59,130,246,0.14), transparent 24%), radial-gradient(circle at 0% 0%, rgba(168,85,247,0.10), transparent 24%), linear-gradient(180deg, #fbfdff 0%, #eef3fa 50%, #e9eef6 100%)",
    panel: "rgba(255,255,255,0.82)",
    panelSoft: "rgba(15,23,42,0.04)",
    panelStrong: "rgba(15,23,42,0.07)",
    border: "rgba(15,23,42,0.08)",
    text: "#0F172A",
    muted: "#667085",
    accent: "#2563EB",
    accent2: "#8B5CF6",
    accentSoft: "rgba(37,99,235,0.12)",
    success: "#16A34A",
    danger: "#E11D48",
    shadow: "0 24px 80px rgba(120,136,166,0.16)",
  },
  evergreen: {
    name: "Evergreen",
    background:
      "radial-gradient(circle at 0% 0%, rgba(16,185,129,0.15), transparent 24%), radial-gradient(circle at 100% 0%, rgba(34,197,94,0.08), transparent 22%), linear-gradient(180deg, #06130e 0%, #0b1c16 48%, #08140f 100%)",
    panel: "rgba(8, 24, 18, 0.80)",
    panelSoft: "rgba(255,255,255,0.045)",
    panelStrong: "rgba(255,255,255,0.07)",
    border: "rgba(255,255,255,0.08)",
    text: "#ECFDF5",
    muted: "#95B8A6",
    accent: "#10B981",
    accent2: "#84CC16",
    accentSoft: "rgba(16,185,129,0.16)",
    success: "#34D399",
    danger: "#FB7185",
    shadow: "0 24px 80px rgba(0,0,0,0.34)",
  },
  rose: {
    name: "Rose",
    background:
      "radial-gradient(circle at 0% 0%, rgba(244,114,182,0.15), transparent 24%), radial-gradient(circle at 100% 0%, rgba(249,115,22,0.08), transparent 22%), linear-gradient(180deg, #170a11 0%, #201019 48%, #16090f 100%)",
    panel: "rgba(28, 14, 24, 0.80)",
    panelSoft: "rgba(255,255,255,0.045)",
    panelStrong: "rgba(255,255,255,0.07)",
    border: "rgba(255,255,255,0.08)",
    text: "#FFF1F7",
    muted: "#D0A9BD",
    accent: "#EC4899",
    accent2: "#FB7185",
    accentSoft: "rgba(236,72,153,0.16)",
    success: "#34D399",
    danger: "#FB7185",
    shadow: "0 24px 80px rgba(0,0,0,0.34)",
  },
  sunrise: {
    name: "Sunrise",
    background:
      "radial-gradient(circle at 100% 0%, rgba(249,115,22,0.14), transparent 24%), radial-gradient(circle at 0% 0%, rgba(245,158,11,0.10), transparent 24%), linear-gradient(180deg, #fffaf2 0%, #fff1dd 50%, #f8e8d3 100%)",
    panel: "rgba(255,255,255,0.82)",
    panelSoft: "rgba(120,53,15,0.04)",
    panelStrong: "rgba(120,53,15,0.07)",
    border: "rgba(120,53,15,0.08)",
    text: "#3A220F",
    muted: "#83624C",
    accent: "#F97316",
    accent2: "#F59E0B",
    accentSoft: "rgba(249,115,22,0.12)",
    success: "#16A34A",
    danger: "#E11D48",
    shadow: "0 24px 80px rgba(150,102,55,0.16)",
  },
  lunar: {
    name: "Lunar",
    background:
      "radial-gradient(circle at 0% 0%, rgba(148,163,184,0.15), transparent 24%), radial-gradient(circle at 100% 0%, rgba(99,102,241,0.08), transparent 22%), linear-gradient(180deg, #0a0d14 0%, #111827 48%, #0a0d14 100%)",
    panel: "rgba(17, 24, 39, 0.82)",
    panelSoft: "rgba(255,255,255,0.045)",
    panelStrong: "rgba(255,255,255,0.07)",
    border: "rgba(255,255,255,0.08)",
    text: "#F8FAFC",
    muted: "#A3B0C3",
    accent: "#94A3B8",
    accent2: "#818CF8",
    accentSoft: "rgba(148,163,184,0.16)",
    success: "#22C55E",
    danger: "#FB7185",
    shadow: "0 24px 80px rgba(0,0,0,0.34)",
  },
};

const backgrounds = {
  glow: {
    name: "Soft glow",
    overlay:
      "radial-gradient(circle at 12% 14%, rgba(255,255,255,0.08), transparent 18%), radial-gradient(circle at 88% 12%, rgba(255,255,255,0.06), transparent 18%), radial-gradient(circle at 50% 100%, rgba(255,255,255,0.05), transparent 28%)",
  },
  grid: {
    name: "Grid",
    overlay:
      "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
    backgroundSize: "28px 28px",
  },
  mesh: {
    name: "Mesh",
    overlay:
      "radial-gradient(circle at 20% 25%, rgba(255,255,255,0.06), transparent 14%), radial-gradient(circle at 75% 24%, rgba(255,255,255,0.06), transparent 14%), radial-gradient(circle at 50% 74%, rgba(255,255,255,0.05), transparent 20%)",
  },
  spotlight: {
    name: "Spotlight",
    overlay:
      "radial-gradient(circle at 50% 10%, rgba(255,255,255,0.08), transparent 28%), radial-gradient(circle at 50% 110%, rgba(255,255,255,0.05), transparent 24%)",
  },
  paper: {
    name: "Paper grain",
    overlay:
      "radial-gradient(rgba(255,255,255,0.02) 0.6px, transparent 0.8px)",
    backgroundSize: "12px 12px",
  },
  plain: {
    name: "Minimal",
    overlay: "none",
  },
};

const classicalPresets = {
  nocturne: {
    name: "Nocturne",
    description: "Soft late-night piano loop",
    bpm: 68,
    steps: [
      { notes: [60, 67], beat: 1.5 },
      { notes: [64], beat: 0.5 },
      { notes: [67, 72], beat: 1 },
      { notes: [64], beat: 1 },
      { notes: [62, 69], beat: 1.5 },
      { notes: [65], beat: 0.5 },
      { notes: [69, 74], beat: 1 },
      { notes: [65], beat: 1 },
    ],
  },
  sonata: {
    name: "Study Sonata",
    description: "Slightly brighter classical study flow",
    bpm: 84,
    steps: [
      { notes: [55, 60, 64], beat: 1 },
      { notes: [60], beat: 0.5 },
      { notes: [64], beat: 0.5 },
      { notes: [57, 62, 65], beat: 1 },
      { notes: [62], beat: 0.5 },
      { notes: [65], beat: 0.5 },
      { notes: [59, 64, 67], beat: 1 },
      { notes: [64], beat: 0.5 },
      { notes: [67], beat: 0.5 },
      { notes: [60, 65, 69], beat: 1 },
      { notes: [65], beat: 0.5 },
      { notes: [69], beat: 0.5 },
    ],
  },
  chamber: {
    name: "Chamber",
    description: "Steady baroque-inspired pattern",
    bpm: 92,
    steps: [
      { notes: [52, 59, 64], beat: 0.75 },
      { notes: [59], beat: 0.25 },
      { notes: [64], beat: 0.5 },
      { notes: [55, 62, 67], beat: 0.75 },
      { notes: [62], beat: 0.25 },
      { notes: [67], beat: 0.5 },
      { notes: [57, 64, 69], beat: 0.75 },
      { notes: [64], beat: 0.25 },
      { notes: [69], beat: 0.5 },
      { notes: [59, 67, 71], beat: 0.75 },
      { notes: [67], beat: 0.25 },
      { notes: [71], beat: 0.5 },
    ],
  },
};

const ambientPresets = {
  rain: {
    name: "Rain",
    description: "Soft high-frequency rainfall",
    buffer: "white",
    filterType: "highpass",
    frequency: 3200,
    q: 0.2,
    gain: 0.2,
  },
  brown: {
    name: "Brown noise",
    description: "Warm low-end study noise",
    buffer: "brown",
    filterType: "lowpass",
    frequency: 900,
    q: 0.4,
    gain: 0.18,
  },
  ocean: {
    name: "Ocean",
    description: "Slow wide noise with movement",
    buffer: "white",
    filterType: "lowpass",
    frequency: 700,
    q: 0.8,
    gain: 0.16,
    lfoFrequency: 0.08,
    lfoDepth: 0.04,
  },
  fireplace: {
    name: "Fireplace",
    description: "Warm filtered crackle texture",
    buffer: "brown",
    filterType: "bandpass",
    frequency: 1200,
    q: 0.7,
    gain: 0.14,
  },
};

const dashboardQuotes = [
  "Make the next step obvious and the rest gets easier.",
  "A calm system beats a motivational spike.",
  "Protect your attention and school gets lighter.",
  "Clear priorities remove half the stress.",
];

function uid() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function localDateKey(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

const todayKey = () => localDateKey();

function formatDate(value) {
  if (!value) return "No date";
  const [y, m, d] = value.split("-").map(Number);
  const date = new Date(y, (m || 1) - 1, d || 1);
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    weekday: "short",
  });
}

function sortTasks(items) {
  const rank = { high: 0, medium: 1, low: 2 };
  return [...items].sort((a, b) => {
    if (a.completed !== b.completed) return Number(a.completed) - Number(b.completed);
    if (!!a.dueDate !== !!b.dueDate) return a.dueDate ? -1 : 1;
    if (a.dueDate && b.dueDate && a.dueDate !== b.dueDate) return a.dueDate.localeCompare(b.dueDate);
    if ((rank[a.priority] ?? 5) !== (rank[b.priority] ?? 5)) return (rank[a.priority] ?? 5) - (rank[b.priority] ?? 5);
    return (b.createdAt || 0) - (a.createdAt || 0);
  });
}

function sortAssignments(items) {
  const rank = { high: 0, medium: 1, low: 2 };
  const status = { "in-progress": 0, "not-started": 1, done: 2 };
  return [...items].sort((a, b) => {
    if (!!a.dueDate !== !!b.dueDate) return a.dueDate ? -1 : 1;
    if (a.dueDate && b.dueDate && a.dueDate !== b.dueDate) return a.dueDate.localeCompare(b.dueDate);
    if ((status[a.status] ?? 5) !== (status[b.status] ?? 5)) return (status[a.status] ?? 5) - (status[b.status] ?? 5);
    return (rank[a.priority] ?? 5) - (rank[b.priority] ?? 5);
  });
}

function sortPlanner(items) {
  return [...items].sort((a, b) => `${a.date}-${a.start}`.localeCompare(`${b.date}-${b.start}`));
}

function habitStreak(habit) {
  let streak = 0;
  const cursor = new Date();
  while (true) {
    const key = localDateKey(cursor);
    if (habit.completions?.[key]) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}

function midiToFrequency(midi) {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

function createWhiteNoiseBuffer(ctx, seconds = 2) {
  const sampleRate = ctx.sampleRate;
  const buffer = ctx.createBuffer(1, sampleRate * seconds, sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i += 1) {
    data[i] = Math.random() * 2 - 1;
  }
  return buffer;
}

function createBrownNoiseBuffer(ctx, seconds = 2) {
  const sampleRate = ctx.sampleRate;
  const buffer = ctx.createBuffer(1, sampleRate * seconds, sampleRate);
  const data = buffer.getChannelData(0);
  let lastOut = 0;
  for (let i = 0; i < data.length; i += 1) {
    const white = Math.random() * 2 - 1;
    lastOut = (lastOut + 0.02 * white) / 1.02;
    data[i] = lastOut * 3.5;
  }
  return buffer;
}

const defaultState = {
  view: DEFAULT_VIEW,
  settings: {
    theme: "obsidian",
    background: "glow",
    username: "Udhav",
    focusMinutes: 35,
    shortBreakMinutes: 7,
    longBreakMinutes: 18,
    autoStartBreaks: false,
    cloudEnabled: false,
    supabaseUrl: "",
    supabaseAnonKey: "",
    workspaceId: "",
    moreTab: "music",
    musicPreset: "nocturne",
    ambientPreset: "rain",
    musicPlaying: false,
    ambientPlaying: false,
    musicVolume: 0.42,
    ambientVolume: 0.28,
  },
  quickNote: "Dump thoughts, reminders, or distractions here so your head stays clear.",
  tasks: [
    {
      id: uid(),
      title: "Review one lecture with full focus",
      dueDate: todayKey(),
      priority: "high",
      area: "School",
      notes: "One clean session. No switching tabs.",
      completed: false,
      createdAt: Date.now() - 1000,
    },
    {
      id: uid(),
      title: "Plan tomorrow's top priorities",
      dueDate: todayKey(),
      priority: "medium",
      area: "Life",
      notes: "Keep it realistic.",
      completed: false,
      createdAt: Date.now() - 2000,
    },
  ],
  habits: [
    { id: uid(), name: "Study 60 minutes", emoji: "📚", completions: {} },
    { id: uid(), name: "No reels during focus block", emoji: "📵", completions: {} },
    { id: uid(), name: "Sleep before 1 AM", emoji: "🌙", completions: {} },
  ],
  planner: [
    { id: uid(), title: "Deep work", date: todayKey(), start: "09:00", end: "10:30" },
    { id: uid(), title: "Lecture review", date: todayKey(), start: "19:00", end: "20:00" },
  ],
  assignments: [
    { id: uid(), title: "Raptor practice", course: "ITM207", dueDate: todayKey(), priority: "high", status: "in-progress" },
    { id: uid(), title: "Finish weekly reading notes", course: "BUS221", dueDate: "", priority: "medium", status: "not-started" },
  ],
  notes: [
    {
      id: uid(),
      title: "Exam prep system",
      content: `1. Lecture review
2. Practice questions
3. Blurting sheet
4. One timed run`,
      updatedAt: Date.now(),
    },
  ],
  focus: {
    mode: "focus",
    secondsLeft: 35 * 60,
    running: false,
    sessionsCompleted: 0,
    totalFocusMinutes: 0,
    intent: "Finish the hardest thing first.",
  },
};

function loadInitialState() {
  if (typeof window === "undefined") return defaultState;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState;
    const parsed = JSON.parse(raw);
    return {
      ...defaultState,
      ...parsed,
      settings: { ...defaultState.settings, ...(parsed.settings || {}) },
      focus: { ...defaultState.focus, ...(parsed.focus || {}) },
      tasks: Array.isArray(parsed.tasks) ? parsed.tasks : defaultState.tasks,
      habits: Array.isArray(parsed.habits) ? parsed.habits : defaultState.habits,
      planner: Array.isArray(parsed.planner) ? parsed.planner : defaultState.planner,
      assignments: Array.isArray(parsed.assignments) ? parsed.assignments : defaultState.assignments,
      notes: Array.isArray(parsed.notes) ? parsed.notes : defaultState.notes,
    };
  } catch {
    return defaultState;
  }
}

function Surface({ theme, className = "", children, strong = false }) {
  return (
    <div
      className={`rounded-[30px] border backdrop-blur-2xl ${className}`}
      style={{
        background: strong ? theme.panelStrong : theme.panel,
        borderColor: theme.border,
        boxShadow: theme.shadow,
      }}
    >
      {children}
    </div>
  );
}

function SectionTitle({ title, subtitle, action, theme }) {
  return (
    <div className="flex items-start justify-between gap-4 mb-4">
      <div>
        <h2 className="text-lg md:text-xl font-semibold tracking-tight">{title}</h2>
        {subtitle ? (
          <p className="text-sm mt-1" style={{ color: theme.muted }}>
            {subtitle}
          </p>
        ) : null}
      </div>
      {action}
    </div>
  );
}

function Badge({ theme, children, tone = "default" }) {
  const styles = {
    default: { background: theme.panelSoft, color: theme.text },
    accent: { background: theme.accentSoft, color: theme.accent },
    success: { background: "rgba(34,197,94,0.14)", color: theme.success },
    danger: { background: "rgba(244,63,94,0.14)", color: theme.danger },
  };
  return (
    <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium" style={styles[tone]}>
      {children}
    </span>
  );
}

function PrimaryButton({ theme, children, onClick, icon: Icon, className = "", type = "button", ghost = false }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-medium transition active:scale-[0.98] ${className}`}
      style={
        ghost
          ? { background: theme.panelSoft, color: theme.text, border: `1px solid ${theme.border}` }
          : { background: `linear-gradient(135deg, ${theme.accent}, ${theme.accent2})`, color: "white", border: `1px solid ${theme.accent}` }
      }
    >
      {Icon ? <Icon size={16} /> : null}
      {children}
    </button>
  );
}

function MetricCard({ theme, label, value, sub }) {
  return (
    <div className="rounded-[24px] border p-4" style={{ borderColor: theme.border, background: theme.panelSoft }}>
      <div className="text-sm" style={{ color: theme.muted }}>
        {label}
      </div>
      <div className="text-[1.95rem] font-semibold tracking-tight mt-1">{value}</div>
      {sub ? (
        <div className="text-sm mt-1" style={{ color: theme.muted }}>
          {sub}
        </div>
      ) : null}
    </div>
  );
}

function Segmented({ theme, items, value, onChange }) {
  return (
    <div className="inline-flex rounded-2xl border p-1" style={{ borderColor: theme.border, background: theme.panelSoft }}>
      {items.map((item) => {
        const selected = value === item.value;
        return (
          <button
            key={item.value}
            onClick={() => onChange(item.value)}
            className="rounded-xl px-3 py-2 text-sm font-medium"
            style={{
              background: selected ? theme.accentSoft : "transparent",
              color: selected ? theme.accent : theme.muted,
            }}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}

function FocusRing({ theme, progress, label, value, sub }) {
  return (
    <div
      className="rounded-full p-[10px] mx-auto"
      style={{
        width: 250,
        height: 250,
        background: `conic-gradient(${theme.accent} ${progress}%, ${theme.accent2} ${Math.min(progress + 10, 100)}%, rgba(255,255,255,0.08) 0%)`,
      }}
    >
      <div className="rounded-full h-full w-full grid place-items-center text-center" style={{ background: theme.panel }}>
        <div>
          <div className="text-xs uppercase tracking-[0.18em]" style={{ color: theme.muted }}>
            {label}
          </div>
          <div className="text-[3.5rem] md:text-[4.2rem] font-semibold tracking-[-0.08em] leading-none mt-2">{value}</div>
          <div className="text-sm mt-2" style={{ color: theme.muted }}>
            {sub}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductiveCampusApp() {
  const [app, setApp] = useState(loadInitialState);
  const [syncStatus, setSyncStatus] = useState("local-only");
  const [taskFilter, setTaskFilter] = useState("today");
  const [noteSearch, setNoteSearch] = useState("");
  const [toast, setToast] = useState("");
  const [taskDraft, setTaskDraft] = useState({ title: "", dueDate: "", priority: "medium", area: "School", notes: "" });
  const [assignmentDraft, setAssignmentDraft] = useState({ title: "", course: "", dueDate: "", priority: "medium" });
  const [plannerDraft, setPlannerDraft] = useState({ title: "", date: todayKey(), start: "09:00", end: "10:00" });
  const [noteDraft, setNoteDraft] = useState({ title: "", content: "" });
  const syncTimeout = useRef(null);
  const supabaseRef = useRef(null);
  const justLoadedCloud = useRef(false);
  const audioContextRef = useRef(null);
  const noiseBuffersRef = useRef({});
  const ambientEngineRef = useRef({ stop: null, gain: null });
  const musicEngineRef = useRef({ stop: null, gain: null, intervalId: null });

  const theme = themes[app.settings.theme] || themes.obsidian;
  const background = backgrounds[app.settings.background] || backgrounds.glow;

  const tasks = useMemo(() => sortTasks(app.tasks || []), [app.tasks]);
  const assignments = useMemo(() => sortAssignments(app.assignments || []), [app.assignments]);
  const planner = useMemo(() => sortPlanner(app.planner || []), [app.planner]);
  const notes = useMemo(() => [...(app.notes || [])].sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0)), [app.notes]);

  const today = todayKey();
  const todayTasks = tasks.filter((task) => !task.completed && (!task.dueDate || task.dueDate === today));
  const upcomingAssignments = assignments.filter((item) => item.status !== "done").slice(0, 4);
  const completedTasks = tasks.filter((task) => task.completed).length;
  const completedHabits = (app.habits || []).filter((habit) => habit.completions?.[today]).length;
  const bestHabitStreak = (app.habits || []).length ? Math.max(...app.habits.map((habit) => habitStreak(habit)), 0) : 0;
  const noteResults = notes.filter((note) => `${note.title} ${note.content}`.toLowerCase().includes(noteSearch.toLowerCase()));
  const completionRate = tasks.length ? Math.round((completedTasks / tasks.length) * 100) : 0;
  const quote = dashboardQuotes[new Date().getDate() % dashboardQuotes.length];

  const focusTotal = app.focus.mode === "focus" ? app.settings.focusMinutes * 60 : ((app.focus.sessionsCompleted % 4 === 0 ? app.settings.longBreakMinutes : app.settings.shortBreakMinutes) || 7) * 60;
  const focusProgress = focusTotal ? Math.max(0, Math.min(100, Math.round(((focusTotal - app.focus.secondsLeft) / focusTotal) * 100))) : 0;
  const focusLabel = `${String(Math.floor(app.focus.secondsLeft / 60)).padStart(2, "0")}:${String(app.focus.secondsLeft % 60).padStart(2, "0")}`;

  const syncText = {
    "local-only": "Saved on this device",
    "missing-config": "Add Supabase details to sync across devices",
    connecting: "Connecting to cloud",
    syncing: "Syncing changes",
    synced: "Synced across devices",
    "ready-to-sync": "Cloud is ready",
    error: "Cloud sync error",
  }[syncStatus];

  const ensureAudioContext = async () => {
    if (typeof window === "undefined") return null;
    if (!audioContextRef.current) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return null;
      audioContextRef.current = new AudioCtx();
    }
    if (audioContextRef.current.state === "suspended") {
      await audioContextRef.current.resume();
    }
    return audioContextRef.current;
  };

  const stopAmbient = () => {
    if (ambientEngineRef.current.stop) ambientEngineRef.current.stop();
    ambientEngineRef.current = { stop: null, gain: null };
  };

  const stopMusic = () => {
    if (musicEngineRef.current.stop) musicEngineRef.current.stop();
    musicEngineRef.current = { stop: null, gain: null, intervalId: null };
  };

  const triggerSynthNote = (ctx, destination, midi, when, duration, volume = 0.12, type = "triangle") => {
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(midiToFrequency(midi), when);
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(type === "triangle" ? 1800 : 2400, when);
    gain.gain.setValueAtTime(0.0001, when);
    gain.gain.linearRampToValueAtTime(volume, when + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, when + duration);
    oscillator.connect(filter);
    filter.connect(gain);
    gain.connect(destination);
    oscillator.start(when);
    oscillator.stop(when + duration + 0.05);
  };

  const startMusic = async () => {
    stopMusic();
    const ctx = await ensureAudioContext();
    if (!ctx) return;
    const preset = classicalPresets[app.settings.musicPreset] || classicalPresets.nocturne;
    const gain = ctx.createGain();
    gain.gain.value = app.settings.musicVolume;
    gain.connect(ctx.destination);

    const state = {
      nextTime: ctx.currentTime + 0.08,
      stepIndex: 0,
      intervalId: null,
    };

    const schedule = () => {
      while (state.nextTime < ctx.currentTime + 0.24) {
        const step = preset.steps[state.stepIndex % preset.steps.length];
        const duration = (60 / preset.bpm) * (step.beat || 1);
        const notes = Array.isArray(step.notes) ? step.notes : [step.notes];
        notes.forEach((note, index) => {
          triggerSynthNote(ctx, gain, note, state.nextTime + index * 0.02, duration * 0.92, index === 0 ? 0.16 : 0.08, index === 0 ? "triangle" : "sine");
        });
        state.nextTime += duration;
        state.stepIndex += 1;
      }
    };

    schedule();
    state.intervalId = window.setInterval(schedule, 100);

    musicEngineRef.current = {
      gain,
      intervalId: state.intervalId,
      stop: () => {
        if (state.intervalId) window.clearInterval(state.intervalId);
        try {
          gain.disconnect();
        } catch {}
      },
    };
  };

  const startAmbient = async () => {
    stopAmbient();
    const ctx = await ensureAudioContext();
    if (!ctx) return;
    const preset = ambientPresets[app.settings.ambientPreset] || ambientPresets.rain;
    const source = ctx.createBufferSource();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();
    const noiseBufferKey = `${preset.buffer}`;

    if (!noiseBuffersRef.current[noiseBufferKey]) {
      noiseBuffersRef.current[noiseBufferKey] = preset.buffer === "brown" ? createBrownNoiseBuffer(ctx) : createWhiteNoiseBuffer(ctx);
    }

    source.buffer = noiseBuffersRef.current[noiseBufferKey];
    source.loop = true;
    filter.type = preset.filterType;
    filter.frequency.value = preset.frequency;
    filter.Q.value = preset.q;
    gain.gain.value = app.settings.ambientVolume * preset.gain;

    source.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    source.start();

    let lfo = null;
    let lfoGain = null;

    if (preset.lfoFrequency && preset.lfoDepth) {
      lfo = ctx.createOscillator();
      lfoGain = ctx.createGain();
      lfo.type = "sine";
      lfo.frequency.value = preset.lfoFrequency;
      lfoGain.gain.value = preset.lfoDepth;
      lfo.connect(lfoGain);
      lfoGain.connect(gain.gain);
      lfo.start();
    }

    ambientEngineRef.current = {
      gain,
      stop: () => {
        try {
          source.stop();
        } catch {}
        try {
          source.disconnect();
          filter.disconnect();
          gain.disconnect();
        } catch {}
        if (lfo) {
          try {
            lfo.stop();
            lfo.disconnect();
          } catch {}
        }
        if (lfoGain) {
          try {
            lfoGain.disconnect();
          } catch {}
        }
      },
    };
  };

  const toggleMusicPlayback = async () => {
    if (app.settings.musicPlaying) {
      stopMusic();
      setApp((prev) => ({ ...prev, settings: { ...prev.settings, musicPlaying: false } }));
      return;
    }
    await startMusic();
    setApp((prev) => ({ ...prev, settings: { ...prev.settings, musicPlaying: true } }));
    setToast(`${classicalPresets[app.settings.musicPreset].name} started`);
  };

  const toggleAmbientPlayback = async () => {
    if (app.settings.ambientPlaying) {
      stopAmbient();
      setApp((prev) => ({ ...prev, settings: { ...prev.settings, ambientPlaying: false } }));
      return;
    }
    await startAmbient();
    setApp((prev) => ({ ...prev, settings: { ...prev.settings, ambientPlaying: true } }));
    setToast(`${ambientPresets[app.settings.ambientPreset].name} started`);
  };

  useEffect(() => {
    if (ambientEngineRef.current.gain) {
      const preset = ambientPresets[app.settings.ambientPreset] || ambientPresets.rain;
      ambientEngineRef.current.gain.gain.value = app.settings.ambientVolume * preset.gain;
    }
  }, [app.settings.ambientVolume, app.settings.ambientPreset]);

  useEffect(() => {
    if (musicEngineRef.current.gain) {
      musicEngineRef.current.gain.gain.value = app.settings.musicVolume;
    }
  }, [app.settings.musicVolume]);

  useEffect(() => {
    return () => {
      stopMusic();
      stopAmbient();
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(app));
  }, [app]);

  useEffect(() => {
    if (!toast) return undefined;
    const timeout = window.setTimeout(() => setToast(""), 2200);
    return () => clearTimeout(timeout);
  }, [toast]);

  useEffect(() => {
    let interval;
    if (app.focus.running) {
      interval = window.setInterval(() => {
        setApp((prev) => {
          if (prev.focus.secondsLeft <= 1) {
            const finishedFocus = prev.focus.mode === "focus";
            const nextMode = prev.focus.mode === "focus" ? "break" : "focus";
            const nextSessions = finishedFocus ? (prev.focus.sessionsCompleted || 0) + 1 : prev.focus.sessionsCompleted || 0;
            const nextMinutes = finishedFocus ? (prev.focus.totalFocusMinutes || 0) + (prev.settings.focusMinutes || 35) : prev.focus.totalFocusMinutes || 0;
            const breakLength = nextSessions % 4 === 0 ? prev.settings.longBreakMinutes : prev.settings.shortBreakMinutes;
            const nextSeconds = nextMode === "focus" ? (prev.settings.focusMinutes || 35) * 60 : (breakLength || 7) * 60;
            return {
              ...prev,
              focus: {
                ...prev.focus,
                running: nextMode === "break" ? prev.settings.autoStartBreaks : false,
                mode: nextMode,
                secondsLeft: nextSeconds,
                sessionsCompleted: nextSessions,
                totalFocusMinutes: nextMinutes,
              },
            };
          }
          return { ...prev, focus: { ...prev.focus, secondsLeft: prev.focus.secondsLeft - 1 } };
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [app.focus.running, app.settings.autoStartBreaks, app.settings.focusMinutes, app.settings.longBreakMinutes, app.settings.shortBreakMinutes]);

  useEffect(() => {
    const setupCloud = async () => {
      if (!app.settings.cloudEnabled) {
        supabaseRef.current = null;
        setSyncStatus("local-only");
        return;
      }
      if (!app.settings.supabaseUrl || !app.settings.supabaseAnonKey || !app.settings.workspaceId) {
        setSyncStatus("missing-config");
        return;
      }
      try {
        const mod = await import("@supabase/supabase-js");
        supabaseRef.current = mod.createClient(app.settings.supabaseUrl, app.settings.supabaseAnonKey);
        setSyncStatus("connecting");
        const { data, error } = await supabaseRef.current
          .from("productivity_snapshots")
          .select("payload")
          .eq("workspace_id", app.settings.workspaceId)
          .maybeSingle();
        if (error) throw error;
        if (data?.payload) {
          justLoadedCloud.current = true;
          setApp((prev) => ({
            ...prev,
            ...data.payload,
            settings: { ...prev.settings, ...(data.payload.settings || {}), cloudEnabled: true },
          }));
          setSyncStatus("synced");
        } else {
          setSyncStatus("ready-to-sync");
        }
      } catch (error) {
        console.error(error);
        setSyncStatus("error");
      }
    };
    setupCloud();
  }, [app.settings.cloudEnabled, app.settings.supabaseUrl, app.settings.supabaseAnonKey, app.settings.workspaceId]);

  useEffect(() => {
    if (!app.settings.cloudEnabled || !supabaseRef.current || !app.settings.workspaceId) return;
    if (justLoadedCloud.current) {
      justLoadedCloud.current = false;
      return;
    }
    clearTimeout(syncTimeout.current);
    syncTimeout.current = window.setTimeout(async () => {
      try {
        setSyncStatus("syncing");
        const payload = JSON.parse(JSON.stringify(app));
        const { error } = await supabaseRef.current.from("productivity_snapshots").upsert(
          {
            workspace_id: app.settings.workspaceId,
            payload,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "workspace_id" }
        );
        if (error) throw error;
        setSyncStatus("synced");
      } catch (error) {
        console.error(error);
        setSyncStatus("error");
      }
    }, 1000);
    return () => clearTimeout(syncTimeout.current);
  }, [app]);

  const addTask = (e) => {
    e.preventDefault();
    if (!taskDraft.title.trim()) return;
    setApp((prev) => ({
      ...prev,
      tasks: [
        {
          id: uid(),
          title: taskDraft.title.trim(),
          dueDate: taskDraft.dueDate,
          priority: taskDraft.priority,
          area: taskDraft.area,
          notes: taskDraft.notes.trim(),
          completed: false,
          createdAt: Date.now(),
        },
        ...prev.tasks,
      ],
    }));
    setTaskDraft({ title: "", dueDate: "", priority: "medium", area: "School", notes: "" });
    setToast("Task added");
  };

  const toggleTask = (task) => {
    setApp((prev) => ({
      ...prev,
      tasks: prev.tasks.map((item) => (item.id === task.id ? { ...item, completed: !item.completed } : item)),
    }));
  };

  const toggleHabit = (habit) => {
    const done = !!habit.completions?.[today];
    setApp((prev) => ({
      ...prev,
      habits: prev.habits.map((item) =>
        item.id === habit.id
          ? { ...item, completions: { ...item.completions, [today]: !done } }
          : item
      ),
    }));
  };

  const addAssignment = (e) => {
    e.preventDefault();
    if (!assignmentDraft.title.trim()) return;
    setApp((prev) => ({
      ...prev,
      assignments: [
        {
          id: uid(),
          title: assignmentDraft.title.trim(),
          course: assignmentDraft.course.trim() || "Course",
          dueDate: assignmentDraft.dueDate,
          priority: assignmentDraft.priority,
          status: "not-started",
        },
        ...prev.assignments,
      ],
    }));
    setAssignmentDraft({ title: "", course: "", dueDate: "", priority: "medium" });
    setToast("Assignment added");
  };

  const updateAssignmentStatus = (item, status) => {
    setApp((prev) => ({
      ...prev,
      assignments: prev.assignments.map((assignment) => (assignment.id === item.id ? { ...assignment, status } : assignment)),
    }));
  };

  const addPlannerBlock = (e) => {
    e.preventDefault();
    if (!plannerDraft.title.trim()) return;
    setApp((prev) => ({
      ...prev,
      planner: [
        ...prev.planner,
        {
          id: uid(),
          title: plannerDraft.title.trim(),
          date: plannerDraft.date,
          start: plannerDraft.start,
          end: plannerDraft.end,
        },
      ],
    }));
    setPlannerDraft({ title: "", date: todayKey(), start: "09:00", end: "10:00" });
    setToast("Block added");
  };

  const addNote = (e) => {
    e.preventDefault();
    if (!noteDraft.title.trim() && !noteDraft.content.trim()) return;
    setApp((prev) => ({
      ...prev,
      notes: [
        {
          id: uid(),
          title: noteDraft.title.trim() || "Untitled",
          content: noteDraft.content,
          updatedAt: Date.now(),
        },
        ...prev.notes,
      ],
    }));
    setNoteDraft({ title: "", content: "" });
    setToast("Note saved");
  };

  const exportData = () => {
    const blob = new Blob([JSON.stringify(app, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "momentum-campus-backup.json";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const importData = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        setApp({
          ...defaultState,
          ...parsed,
          settings: { ...defaultState.settings, ...(parsed.settings || {}) },
          focus: { ...defaultState.focus, ...(parsed.focus || {}) },
        });
        setToast("Backup imported");
      } catch {
        alert("That backup file could not be imported.");
      }
    };
    reader.readAsText(file);
  };

  const navItems = [
    { key: "dashboard", label: "Home", icon: Home },
    { key: "planner", label: "Planner", icon: CalendarDays },
    { key: "focus", label: "Focus", icon: Clock3 },
    { key: "study", label: "Study", icon: GraduationCap },
    { key: "more", label: "More", icon: MoreHorizontal },
  ];

  const taskViews = {
    today: tasks.filter((task) => !task.completed && (!task.dueDate || task.dueDate === today)),
    all: tasks,
    done: tasks.filter((task) => task.completed),
  };

  const renderDashboard = () => (
    <div className="space-y-5 md:space-y-6">
      <Surface theme={theme} className="p-5 md:p-6 lg:p-7 overflow-hidden relative">
        <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(circle at 88% 18%, ${theme.accentSoft}, transparent 24%)` }} />
        <div className="relative grid lg:grid-cols-[1.18fr_0.82fr] gap-6 items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 border text-xs mb-4" style={{ borderColor: theme.border, background: theme.panelSoft, color: theme.muted }}>
              <Sparkles size={13} />
              Premium layout, now with music and ambience
            </div>
            <h1 className="text-3xl md:text-5xl font-semibold tracking-[-0.055em] leading-[1.02] max-w-3xl">
              Your school and focus system, finally designed like a real product.
            </h1>
            <p className="text-sm md:text-base mt-4 max-w-2xl" style={{ color: theme.muted }}>
              Clean hierarchy, fewer distractions, plus a separate sound space for classical study music and ambient noise.
            </p>
            <div className="flex flex-wrap gap-3 mt-6">
              <PrimaryButton theme={theme} icon={Play} onClick={() => setApp((prev) => ({ ...prev, view: "focus" }))}>
                Start focus session
              </PrimaryButton>
              <PrimaryButton theme={theme} ghost icon={Headphones} onClick={() => setApp((prev) => ({ ...prev, view: "more", settings: { ...prev.settings, moreTab: "music" } }))}>
                Open music
              </PrimaryButton>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <MetricCard theme={theme} label="Today" value={todayTasks.length} sub="open tasks" />
            <MetricCard theme={theme} label="Streak" value={`${bestHabitStreak}d`} sub="best habit run" />
            <MetricCard theme={theme} label="Focus" value={`${app.focus.totalFocusMinutes}m`} sub="deep work logged" />
            <MetricCard theme={theme} label="Completion" value={`${completionRate}%`} sub="task finish rate" />
          </div>
        </div>
      </Surface>

      <div className="grid xl:grid-cols-[1.1fr_0.9fr] gap-5 md:gap-6">
        <Surface theme={theme} className="p-5">
          <SectionTitle
            title="Task lane"
            subtitle="A tighter, better-scanning task surface."
            theme={theme}
            action={<Segmented theme={theme} items={[{ label: "Today", value: "today" }, { label: "All", value: "all" }, { label: "Done", value: "done" }]} value={taskFilter} onChange={setTaskFilter} />}
          />
          <div className="space-y-3 max-h-[420px] overflow-auto pr-1">
            {taskViews[taskFilter].map((task) => (
              <div key={task.id} className="rounded-[24px] border p-4" style={{ borderColor: theme.border, background: theme.panelSoft }}>
                <div className="flex items-start gap-3">
                  <button onClick={() => toggleTask(task)} className="mt-0.5" style={{ color: task.completed ? theme.success : theme.accent }}>
                    {task.completed ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className={`font-medium ${task.completed ? "line-through opacity-60" : ""}`}>{task.title}</div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge theme={theme}>{task.area}</Badge>
                      <Badge theme={theme} tone={task.priority === "high" ? "danger" : task.priority === "medium" ? "accent" : "default"}>{task.priority}</Badge>
                      {task.dueDate ? <Badge theme={theme}>{formatDate(task.dueDate)}</Badge> : null}
                    </div>
                    {task.notes ? <div className="text-sm mt-3" style={{ color: theme.muted }}>{task.notes}</div> : null}
                  </div>
                </div>
              </div>
            ))}
            {!taskViews[taskFilter].length ? <div className="text-sm" style={{ color: theme.muted }}>Nothing in this lane.</div> : null}
          </div>
        </Surface>

        <Surface theme={theme} className="p-5">
          <SectionTitle title="Capture" subtitle="Fast entry for anything you need to remember." theme={theme} />
          <form className="space-y-3" onSubmit={addTask}>
            <input
              value={taskDraft.title}
              onChange={(e) => setTaskDraft((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="What needs to get done?"
              className="w-full rounded-[24px] border px-4 py-3 bg-transparent outline-none"
              style={{ borderColor: theme.border, background: theme.panelSoft }}
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                type="date"
                value={taskDraft.dueDate}
                onChange={(e) => setTaskDraft((prev) => ({ ...prev, dueDate: e.target.value }))}
                className="w-full rounded-[24px] border px-4 py-3 bg-transparent outline-none"
                style={{ borderColor: theme.border, background: theme.panelSoft }}
              />
              <select
                value={taskDraft.priority}
                onChange={(e) => setTaskDraft((prev) => ({ ...prev, priority: e.target.value }))}
                className="w-full rounded-[24px] border px-4 py-3 bg-transparent outline-none"
                style={{ borderColor: theme.border, background: theme.panelSoft }}
              >
                <option value="high">High priority</option>
                <option value="medium">Medium priority</option>
                <option value="low">Low priority</option>
              </select>
            </div>
            <input
              value={taskDraft.area}
              onChange={(e) => setTaskDraft((prev) => ({ ...prev, area: e.target.value }))}
              placeholder="Area or course"
              className="w-full rounded-[24px] border px-4 py-3 bg-transparent outline-none"
              style={{ borderColor: theme.border, background: theme.panelSoft }}
            />
            <textarea
              value={app.quickNote}
              onChange={(e) => setApp((prev) => ({ ...prev, quickNote: e.target.value }))}
              placeholder="Quick capture or brain dump"
              className="w-full min-h-[160px] rounded-[24px] border px-4 py-4 bg-transparent outline-none resize-none"
              style={{ borderColor: theme.border, background: theme.panelSoft }}
            />
            <PrimaryButton theme={theme} type="submit" icon={Plus} className="w-full">
              Add task
            </PrimaryButton>
          </form>
        </Surface>
      </div>
    </div>
  );

  const renderPlanner = () => (
    <div className="grid xl:grid-cols-[0.96fr_1.04fr] gap-5 md:gap-6">
      <Surface theme={theme} className="p-5">
        <SectionTitle title="Plan the day" subtitle="A quiet schedule builder for study and life blocks." theme={theme} />
        <form className="space-y-3" onSubmit={addPlannerBlock}>
          <input
            value={plannerDraft.title}
            onChange={(e) => setPlannerDraft((prev) => ({ ...prev, title: e.target.value }))}
            placeholder="Block title"
            className="w-full rounded-[24px] border px-4 py-3 bg-transparent outline-none"
            style={{ borderColor: theme.border, background: theme.panelSoft }}
          />
          <div className="grid grid-cols-3 gap-3">
            <input
              type="date"
              value={plannerDraft.date}
              onChange={(e) => setPlannerDraft((prev) => ({ ...prev, date: e.target.value }))}
              className="w-full rounded-[24px] border px-4 py-3 bg-transparent outline-none"
              style={{ borderColor: theme.border, background: theme.panelSoft }}
            />
            <input
              type="time"
              value={plannerDraft.start}
              onChange={(e) => setPlannerDraft((prev) => ({ ...prev, start: e.target.value }))}
              className="w-full rounded-[24px] border px-4 py-3 bg-transparent outline-none"
              style={{ borderColor: theme.border, background: theme.panelSoft }}
            />
            <input
              type="time"
              value={plannerDraft.end}
              onChange={(e) => setPlannerDraft((prev) => ({ ...prev, end: e.target.value }))}
              className="w-full rounded-[24px] border px-4 py-3 bg-transparent outline-none"
              style={{ borderColor: theme.border, background: theme.panelSoft }}
            />
          </div>
          <PrimaryButton theme={theme} type="submit" icon={Plus} className="w-full">
            Add block
          </PrimaryButton>
        </form>

        <div className="grid grid-cols-2 gap-3 mt-4">
          <button
            onClick={() => setPlannerDraft({ title: "Deep work", date: today, start: "09:00", end: "10:30" })}
            className="rounded-[24px] border p-4 text-left"
            style={{ borderColor: theme.border, background: theme.panelSoft }}
          >
            <div className="font-medium">Morning deep work</div>
            <div className="text-sm mt-1" style={{ color: theme.muted }}>09:00 — 10:30</div>
          </button>
          <button
            onClick={() => setPlannerDraft({ title: "Lecture review", date: today, start: "19:00", end: "20:00" })}
            className="rounded-[24px] border p-4 text-left"
            style={{ borderColor: theme.border, background: theme.panelSoft }}
          >
            <div className="font-medium">Lecture review</div>
            <div className="text-sm mt-1" style={{ color: theme.muted }}>19:00 — 20:00</div>
          </button>
        </div>
      </Surface>

      <Surface theme={theme} className="p-5">
        <SectionTitle title="Timeline" subtitle="Designed to read cleanly on phone and desktop." theme={theme} />
        <div className="space-y-3 max-h-[620px] overflow-auto pr-1">
          {planner.map((block) => (
            <div key={block.id} className="rounded-[24px] border p-4" style={{ borderColor: theme.border, background: block.date === today ? theme.panelStrong : theme.panelSoft }}>
              <div className="flex items-start gap-3">
                <div className="h-11 w-11 rounded-2xl flex items-center justify-center shrink-0" style={{ background: theme.accentSoft, color: theme.accent }}>
                  <CalendarDays size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium">{block.title}</div>
                  <div className="text-sm mt-1" style={{ color: theme.muted }}>
                    {formatDate(block.date)} • {block.start} — {block.end}
                  </div>
                </div>
                <button
                  onClick={() => setApp((prev) => ({ ...prev, planner: prev.planner.filter((item) => item.id !== block.id) }))}
                  className="rounded-2xl p-2"
                  style={{ background: theme.panel, color: theme.muted }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
          {!planner.length ? <div className="text-sm" style={{ color: theme.muted }}>No blocks yet.</div> : null}
        </div>
      </Surface>
    </div>
  );

  const renderFocus = () => (
    <div className="grid xl:grid-cols-[1.08fr_0.92fr] gap-5 md:gap-6">
      <Surface theme={theme} className="p-6 md:p-8 text-center overflow-hidden relative">
        <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(circle at top, ${theme.accentSoft}, transparent 34%)` }} />
        <div className="relative">
          <SectionTitle title="Focus room" subtitle="A premium timer with one job: keep you locked in." theme={theme} />
          <FocusRing
            theme={theme}
            progress={focusProgress}
            label={app.focus.mode === "focus" ? "Focus mode" : "Break mode"}
            value={focusLabel}
            sub={app.focus.intent || "One clean session."}
          />
          <div className="flex justify-center gap-3 mt-6 flex-wrap">
            <PrimaryButton theme={theme} icon={app.focus.running ? Pause : Play} onClick={() => setApp((prev) => ({ ...prev, focus: { ...prev.focus, running: !prev.focus.running } }))}>
              {app.focus.running ? "Pause" : "Start"}
            </PrimaryButton>
            <PrimaryButton theme={theme} ghost icon={RotateCcw} onClick={() => setApp((prev) => ({ ...prev, focus: { ...prev.focus, running: false, mode: "focus", secondsLeft: (prev.settings.focusMinutes || 35) * 60 } }))}>
              Reset
            </PrimaryButton>
          </div>
          <div className="grid grid-cols-3 gap-3 mt-6">
            <MetricCard theme={theme} label="Sessions" value={app.focus.sessionsCompleted} />
            <MetricCard theme={theme} label="Minutes" value={app.focus.totalFocusMinutes} />
            <MetricCard theme={theme} label="Habits done" value={completedHabits} />
          </div>
        </div>
      </Surface>

      <div className="space-y-5 md:space-y-6">
        <Surface theme={theme} className="p-5">
          <SectionTitle title="Session intent" subtitle="Write the one thing this session is for." theme={theme} />
          <textarea
            value={app.focus.intent}
            onChange={(e) => setApp((prev) => ({ ...prev, focus: { ...prev.focus, intent: e.target.value } }))}
            className="w-full min-h-[150px] rounded-[24px] border px-4 py-4 outline-none resize-none bg-transparent"
            style={{ borderColor: theme.border, background: theme.panelSoft }}
          />
        </Surface>

        <Surface theme={theme} className="p-5">
          <SectionTitle title="Timer settings" subtitle="Adjust your rhythm without clutter." theme={theme} />
          <div className="space-y-4">
            {[
              ["Focus minutes", "focusMinutes"],
              ["Short break", "shortBreakMinutes"],
              ["Long break", "longBreakMinutes"],
            ].map(([label, key]) => (
              <div key={key}>
                <div className="text-sm mb-2" style={{ color: theme.muted }}>{label}</div>
                <input
                  type="range"
                  min={key === "focusMinutes" ? 15 : 3}
                  max={key === "focusMinutes" ? 90 : 30}
                  value={app.settings[key]}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    setApp((prev) => {
                      const next = { ...prev, settings: { ...prev.settings, [key]: value } };
                      if (key === "focusMinutes" && prev.focus.mode === "focus" && !prev.focus.running) {
                        next.focus = { ...prev.focus, secondsLeft: value * 60 };
                      }
                      return next;
                    });
                  }}
                  className="w-full"
                />
                <div className="text-sm mt-1" style={{ color: theme.muted }}>{app.settings[key]} minutes</div>
              </div>
            ))}
            <label className="flex items-center justify-between gap-3 rounded-[24px] border p-4" style={{ borderColor: theme.border, background: theme.panelSoft }}>
              <div>
                <div className="font-medium">Auto-start breaks</div>
                <div className="text-sm" style={{ color: theme.muted }}>Keep the flow moving automatically.</div>
              </div>
              <input type="checkbox" checked={app.settings.autoStartBreaks} onChange={(e) => setApp((prev) => ({ ...prev, settings: { ...prev.settings, autoStartBreaks: e.target.checked } }))} />
            </label>
          </div>
        </Surface>
      </div>
    </div>
  );

  const renderStudy = () => (
    <div className="grid xl:grid-cols-[0.96fr_1.04fr] gap-5 md:gap-6">
      <div className="space-y-5 md:space-y-6">
        <Surface theme={theme} className="p-5">
          <SectionTitle title="Assignments" subtitle="Deadlines and progress without the mess." theme={theme} />
          <form className="space-y-3 mb-4" onSubmit={addAssignment}>
            <input
              value={assignmentDraft.title}
              onChange={(e) => setAssignmentDraft((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="Assignment, quiz, reading"
              className="w-full rounded-[24px] border px-4 py-3 bg-transparent outline-none"
              style={{ borderColor: theme.border, background: theme.panelSoft }}
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                value={assignmentDraft.course}
                onChange={(e) => setAssignmentDraft((prev) => ({ ...prev, course: e.target.value }))}
                placeholder="Course"
                className="w-full rounded-[24px] border px-4 py-3 bg-transparent outline-none"
                style={{ borderColor: theme.border, background: theme.panelSoft }}
              />
              <input
                type="date"
                value={assignmentDraft.dueDate}
                onChange={(e) => setAssignmentDraft((prev) => ({ ...prev, dueDate: e.target.value }))}
                className="w-full rounded-[24px] border px-4 py-3 bg-transparent outline-none"
                style={{ borderColor: theme.border, background: theme.panelSoft }}
              />
            </div>
            <select
              value={assignmentDraft.priority}
              onChange={(e) => setAssignmentDraft((prev) => ({ ...prev, priority: e.target.value }))}
              className="w-full rounded-[24px] border px-4 py-3 bg-transparent outline-none"
              style={{ borderColor: theme.border, background: theme.panelSoft }}
            >
              <option value="high">High priority</option>
              <option value="medium">Medium priority</option>
              <option value="low">Low priority</option>
            </select>
            <PrimaryButton theme={theme} type="submit" icon={Plus} className="w-full">
              Add assignment
            </PrimaryButton>
          </form>

          <div className="space-y-3 max-h-[420px] overflow-auto pr-1">
            {assignments.map((item) => (
              <div key={item.id} className="rounded-[24px] border p-4" style={{ borderColor: theme.border, background: theme.panelSoft }}>
                <div className="font-medium">{item.title}</div>
                <div className="text-sm mt-1" style={{ color: theme.muted }}>
                  {item.course || "Course"}{item.dueDate ? ` • ${formatDate(item.dueDate)}` : ""}
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  <Badge theme={theme}>{item.priority}</Badge>
                  <Badge theme={theme} tone={item.status === "done" ? "success" : item.status === "in-progress" ? "accent" : "default"}>{item.status.replace("-", " ")}</Badge>
                </div>
                <div className="grid grid-cols-3 gap-2 mt-4">
                  {[
                    ["not-started", "Not started"],
                    ["in-progress", "In progress"],
                    ["done", "Done"],
                  ].map(([value, label]) => (
                    <button
                      key={value}
                      onClick={() => updateAssignmentStatus(item, value)}
                      className="rounded-2xl px-3 py-3 text-sm border"
                      style={{
                        borderColor: item.status === value ? theme.accent : theme.border,
                        background: item.status === value ? theme.accentSoft : theme.panel,
                        color: item.status === value ? theme.accent : theme.text,
                      }}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Surface>

        <Surface theme={theme} className="p-5">
          <SectionTitle title="Habits" subtitle="A small daily system that stays out of the way." theme={theme} />
          <div className="space-y-3">
            {(app.habits || []).map((habit) => {
              const done = !!habit.completions?.[today];
              return (
                <button
                  key={habit.id}
                  onClick={() => toggleHabit(habit)}
                  className="w-full text-left rounded-[24px] border p-4"
                  style={{ borderColor: theme.border, background: theme.panelSoft }}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{habit.emoji}</div>
                    <div className="flex-1">
                      <div className="font-medium">{habit.name}</div>
                      <div className="text-sm mt-1" style={{ color: theme.muted }}>{done ? "Completed today" : "Tap to mark complete"}</div>
                    </div>
                    <div style={{ color: done ? theme.success : theme.muted }}>
                      {done ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </Surface>
      </div>

      <Surface theme={theme} className="p-5">
        <SectionTitle title="Study vault" subtitle="Notes, lecture plans, and anything you need to keep." theme={theme} />
        <div className="relative mb-4">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: theme.muted }} />
          <input
            value={noteSearch}
            onChange={(e) => setNoteSearch(e.target.value)}
            placeholder="Search notes"
            className="w-full rounded-[24px] border pl-10 pr-4 py-3 bg-transparent outline-none"
            style={{ borderColor: theme.border, background: theme.panelSoft }}
          />
        </div>
        <form className="space-y-3 mb-4" onSubmit={addNote}>
          <input
            value={noteDraft.title}
            onChange={(e) => setNoteDraft((prev) => ({ ...prev, title: e.target.value }))}
            placeholder="Note title"
            className="w-full rounded-[24px] border px-4 py-3 bg-transparent outline-none"
            style={{ borderColor: theme.border, background: theme.panelSoft }}
          />
          <textarea
            value={noteDraft.content}
            onChange={(e) => setNoteDraft((prev) => ({ ...prev, content: e.target.value }))}
            placeholder="Write lecture notes, ideas, or study plans here..."
            className="w-full min-h-[180px] rounded-[24px] border px-4 py-3 bg-transparent outline-none resize-none"
            style={{ borderColor: theme.border, background: theme.panelSoft }}
          />
          <PrimaryButton theme={theme} type="submit" icon={NotebookPen} className="w-full">
            Save note
          </PrimaryButton>
        </form>
        <div className="space-y-3 max-h-[420px] overflow-auto pr-1">
          {noteResults.map((note) => (
            <div key={note.id} className="rounded-[24px] border p-4" style={{ borderColor: theme.border, background: theme.panelSoft }}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-medium">{note.title}</div>
                  <div className="text-xs mt-1" style={{ color: theme.muted }}>Updated {new Date(note.updatedAt).toLocaleDateString()}</div>
                </div>
                <button
                  onClick={() => setApp((prev) => ({ ...prev, notes: prev.notes.filter((item) => item.id !== note.id) }))}
                  className="rounded-2xl p-2"
                  style={{ background: theme.panel, color: theme.muted }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <div className="text-sm mt-3 whitespace-pre-wrap" style={{ color: theme.muted }}>{note.content}</div>
            </div>
          ))}
          {!noteResults.length ? <div className="text-sm" style={{ color: theme.muted }}>No notes yet.</div> : null}
        </div>
      </Surface>
    </div>
  );

  const renderMore = () => {
    const musicPreset = classicalPresets[app.settings.musicPreset] || classicalPresets.nocturne;
    const ambientPreset = ambientPresets[app.settings.ambientPreset] || ambientPresets.rain;

    if (app.settings.moreTab === "music") {
      return (
        <div className="grid xl:grid-cols-[1fr_1fr] gap-5 md:gap-6">
          <Surface theme={theme} className="p-5">
            <SectionTitle title="Classical music" subtitle="Built-in classical-inspired study loops." theme={theme} action={<Badge theme={theme} tone={app.settings.musicPlaying ? "accent" : "default"}>{app.settings.musicPlaying ? "Playing" : "Stopped"}</Badge>} />
            <div className="rounded-[26px] border p-5 mb-4" style={{ borderColor: theme.border, background: theme.panelSoft }}>
              <div className="text-sm" style={{ color: theme.muted }}>Current preset</div>
              <div className="text-2xl font-semibold mt-1">{musicPreset.name}</div>
              <div className="text-sm mt-2" style={{ color: theme.muted }}>{musicPreset.description}</div>
              <div className="mt-4">
                <PrimaryButton theme={theme} icon={app.settings.musicPlaying ? Pause : Play} onClick={toggleMusicPlayback}>
                  {app.settings.musicPlaying ? "Pause music" : "Play music"}
                </PrimaryButton>
              </div>
            </div>
            <div className="grid sm:grid-cols-3 gap-3">
              {Object.entries(classicalPresets).map(([key, preset]) => (
                <button
                  key={key}
                  onClick={() => setApp((prev) => ({ ...prev, settings: { ...prev.settings, musicPreset: key } }))}
                  className="rounded-[24px] border p-4 text-left"
                  style={{
                    borderColor: app.settings.musicPreset === key ? theme.accent : theme.border,
                    background: app.settings.musicPreset === key ? theme.accentSoft : theme.panelSoft,
                    color: app.settings.musicPreset === key ? theme.accent : theme.text,
                  }}
                >
                  <div className="font-medium">{preset.name}</div>
                  <div className="text-sm mt-1" style={{ color: app.settings.musicPreset === key ? theme.accent : theme.muted }}>{preset.description}</div>
                </button>
              ))}
            </div>
            <div className="mt-5">
              <div className="text-sm mb-2" style={{ color: theme.muted }}>Music volume</div>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={app.settings.musicVolume}
                onChange={(e) => setApp((prev) => ({ ...prev, settings: { ...prev.settings, musicVolume: Number(e.target.value) } }))}
                className="w-full"
              />
              <div className="text-sm mt-1" style={{ color: theme.muted }}>{Math.round(app.settings.musicVolume * 100)}%</div>
            </div>
          </Surface>

          <Surface theme={theme} className="p-5">
            <SectionTitle title="Ambient sounds" subtitle="Separate ambience layer for studying or focus sessions." theme={theme} action={<Badge theme={theme} tone={app.settings.ambientPlaying ? "accent" : "default"}>{app.settings.ambientPlaying ? "Playing" : "Stopped"}</Badge>} />
            <div className="rounded-[26px] border p-5 mb-4" style={{ borderColor: theme.border, background: theme.panelSoft }}>
              <div className="text-sm" style={{ color: theme.muted }}>Current ambience</div>
              <div className="text-2xl font-semibold mt-1">{ambientPreset.name}</div>
              <div className="text-sm mt-2" style={{ color: theme.muted }}>{ambientPreset.description}</div>
              <div className="mt-4">
                <PrimaryButton theme={theme} ghost icon={app.settings.ambientPlaying ? Pause : Play} onClick={toggleAmbientPlayback}>
                  {app.settings.ambientPlaying ? "Pause ambience" : "Play ambience"}
                </PrimaryButton>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {Object.entries(ambientPresets).map(([key, preset]) => (
                <button
                  key={key}
                  onClick={() => setApp((prev) => ({ ...prev, settings: { ...prev.settings, ambientPreset: key } }))}
                  className="rounded-[24px] border p-4 text-left"
                  style={{
                    borderColor: app.settings.ambientPreset === key ? theme.accent : theme.border,
                    background: app.settings.ambientPreset === key ? theme.accentSoft : theme.panelSoft,
                    color: app.settings.ambientPreset === key ? theme.accent : theme.text,
                  }}
                >
                  <div className="font-medium">{preset.name}</div>
                  <div className="text-sm mt-1" style={{ color: app.settings.ambientPreset === key ? theme.accent : theme.muted }}>{preset.description}</div>
                </button>
              ))}
            </div>
            <div className="mt-5">
              <div className="text-sm mb-2" style={{ color: theme.muted }}>Ambient volume</div>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={app.settings.ambientVolume}
                onChange={(e) => setApp((prev) => ({ ...prev, settings: { ...prev.settings, ambientVolume: Number(e.target.value) } }))}
                className="w-full"
              />
              <div className="text-sm mt-1" style={{ color: theme.muted }}>{Math.round(app.settings.ambientVolume * 100)}%</div>
            </div>
          </Surface>
        </div>
      );
    }

    return (
      <div className="grid xl:grid-cols-[1fr_1fr] gap-5 md:gap-6">
        <Surface theme={theme} className="p-5">
          <SectionTitle title="Appearance" subtitle="More themes and more background styles." theme={theme} />
          <div>
            <div className="text-sm mb-3" style={{ color: theme.muted }}>Theme</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {Object.entries(themes).map(([key, item]) => (
                <button
                  key={key}
                  onClick={() => setApp((prev) => ({ ...prev, settings: { ...prev.settings, theme: key } }))}
                  className="rounded-[24px] border p-4 text-left"
                  style={{ borderColor: app.settings.theme === key ? theme.accent : theme.border, background: item.background, color: item.text }}
                >
                  <div className="font-medium">{item.name}</div>
                </button>
              ))}
            </div>
          </div>
          <div className="mt-5">
            <div className="text-sm mb-3" style={{ color: theme.muted }}>Background</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {Object.entries(backgrounds).map(([key, item]) => (
                <button
                  key={key}
                  onClick={() => setApp((prev) => ({ ...prev, settings: { ...prev.settings, background: key } }))}
                  className="rounded-[24px] border p-4 text-left"
                  style={{ borderColor: app.settings.background === key ? theme.accent : theme.border, background: theme.panelSoft }}
                >
                  <div className="font-medium">{item.name}</div>
                </button>
              ))}
            </div>
          </div>
        </Surface>

        <Surface theme={theme} className="p-5">
          <SectionTitle title="Sync and backup" subtitle="Local by default, cloud ready for cross-device use." theme={theme} />
          <div className="rounded-[24px] border p-4 mb-4" style={{ borderColor: theme.border, background: theme.panelSoft }}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-medium">Sync status</div>
                <div className="text-sm mt-1" style={{ color: theme.muted }}>{syncText}</div>
              </div>
              <div style={{ color: syncStatus === "synced" ? theme.success : theme.muted }}>
                {app.settings.cloudEnabled ? <Cloud size={18} /> : <CloudOff size={18} />}
              </div>
            </div>
          </div>

          <label className="flex items-center justify-between gap-3 rounded-[24px] border p-4 mb-4" style={{ borderColor: theme.border, background: theme.panelSoft }}>
            <div>
              <div className="font-medium">Enable cloud sync</div>
              <div className="text-sm" style={{ color: theme.muted }}>Use the same workspace ID on each device.</div>
            </div>
            <input type="checkbox" checked={app.settings.cloudEnabled} onChange={(e) => setApp((prev) => ({ ...prev, settings: { ...prev.settings, cloudEnabled: e.target.checked } }))} />
          </label>

          <div className="space-y-3">
            <input
              value={app.settings.username}
              onChange={(e) => setApp((prev) => ({ ...prev, settings: { ...prev.settings, username: e.target.value } }))}
              placeholder="Your name"
              className="w-full rounded-[24px] border px-4 py-3 bg-transparent outline-none"
              style={{ borderColor: theme.border, background: theme.panelSoft }}
            />
            <input
              value={app.settings.workspaceId}
              onChange={(e) => setApp((prev) => ({ ...prev, settings: { ...prev.settings, workspaceId: e.target.value } }))}
              placeholder="Workspace ID"
              className="w-full rounded-[24px] border px-4 py-3 bg-transparent outline-none"
              style={{ borderColor: theme.border, background: theme.panelSoft }}
            />
            <input
              value={app.settings.supabaseUrl}
              onChange={(e) => setApp((prev) => ({ ...prev, settings: { ...prev.settings, supabaseUrl: e.target.value } }))}
              placeholder="Supabase project URL"
              className="w-full rounded-[24px] border px-4 py-3 bg-transparent outline-none"
              style={{ borderColor: theme.border, background: theme.panelSoft }}
            />
            <input
              value={app.settings.supabaseAnonKey}
              onChange={(e) => setApp((prev) => ({ ...prev, settings: { ...prev.settings, supabaseAnonKey: e.target.value } }))}
              placeholder="Supabase anon key"
              className="w-full rounded-[24px] border px-4 py-3 bg-transparent outline-none"
              style={{ borderColor: theme.border, background: theme.panelSoft }}
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-3 mt-4">
            <PrimaryButton theme={theme} ghost icon={Download} onClick={exportData} className="w-full">
              Export backup
            </PrimaryButton>
            <label className="inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-medium cursor-pointer border" style={{ background: theme.panelSoft, color: theme.text, borderColor: theme.border }}>
              <Upload size={16} />
              Import backup
              <input type="file" accept="application/json" onChange={importData} className="hidden" />
            </label>
          </div>
        </Surface>
      </div>
    );
  };

  const pageContent = {
    dashboard: renderDashboard(),
    planner: renderPlanner(),
    focus: renderFocus(),
    study: renderStudy(),
    more: renderMore(),
  }[app.view];

  return (
    <div className="min-h-screen" style={{ background: theme.background, color: theme.text }}>
      <style>{`
        * { box-sizing: border-box; }
        html, body, #root { min-height: 100%; }
        body { margin: 0; font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
        input, textarea, select, button { font: inherit; }
        input::placeholder, textarea::placeholder { color: ${theme.muted}; }
      `}</style>

      <div className="fixed inset-0 pointer-events-none" style={{ backgroundImage: background.overlay, backgroundSize: background.backgroundSize || "auto" }} />

      <AnimatePresence>
        {toast ? (
          <motion.div
            initial={{ opacity: 0, y: -14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            className="fixed top-5 left-1/2 -translate-x-1/2 z-50 px-4 py-3 rounded-2xl border backdrop-blur-2xl text-sm font-medium"
            style={{ background: theme.panel, borderColor: theme.border, boxShadow: theme.shadow }}
          >
            {toast}
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-5 lg:px-6 pb-28 lg:pb-10">
        <div className="grid lg:grid-cols-[270px_minmax(0,1fr)] gap-6 lg:gap-8 pt-4 md:pt-6 lg:pt-8">
          <aside className="hidden lg:block">
            <div className="sticky top-6 space-y-4">
              <Surface theme={theme} className="p-5">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-2xl flex items-center justify-center" style={{ background: theme.accentSoft, color: theme.accent }}>
                    <LayoutGrid size={20} />
                  </div>
                  <div>
                    <div className="font-semibold tracking-tight">Momentum Campus</div>
                    <div className="text-sm" style={{ color: theme.muted }}>Premium school productivity</div>
                  </div>
                </div>
                <div className="mt-5 rounded-[24px] border p-4" style={{ borderColor: theme.border, background: theme.panelSoft }}>
                  <div className="text-sm" style={{ color: theme.muted }}>Welcome back</div>
                  <div className="text-lg font-semibold mt-1">{app.settings.username || "there"}</div>
                </div>
              </Surface>

              <Surface theme={theme} className="p-3">
                <div className="space-y-2">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const active = app.view === item.key;
                    return (
                      <button
                        key={item.key}
                        onClick={() => setApp((prev) => ({ ...prev, view: item.key }))}
                        className="w-full rounded-2xl px-4 py-3 flex items-center gap-3 text-left transition"
                        style={{ background: active ? theme.accentSoft : "transparent", color: active ? theme.accent : theme.text }}
                      >
                        <Icon size={18} />
                        <span className="font-medium">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </Surface>

              <Surface theme={theme} className="p-5">
                <div className="text-sm" style={{ color: theme.muted }}>Audio status</div>
                <div className="space-y-3 mt-4">
                  <div className="rounded-[22px] border p-4" style={{ borderColor: theme.border, background: theme.panelSoft }}>
                    <div className="text-xs uppercase tracking-[0.14em]" style={{ color: theme.muted }}>Music</div>
                    <div className="font-medium mt-1">{app.settings.musicPlaying ? classicalPresets[app.settings.musicPreset].name : "Off"}</div>
                  </div>
                  <div className="rounded-[22px] border p-4" style={{ borderColor: theme.border, background: theme.panelSoft }}>
                    <div className="text-xs uppercase tracking-[0.14em]" style={{ color: theme.muted }}>Ambient</div>
                    <div className="font-medium mt-1">{app.settings.ambientPlaying ? ambientPresets[app.settings.ambientPreset].name : "Off"}</div>
                  </div>
                </div>
              </Surface>
            </div>
          </aside>

          <main className="min-w-0">
            <div className="sticky top-0 z-10 py-4 md:py-5 backdrop-blur-sm">
              <Surface theme={theme} className="p-4 md:p-5">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="text-sm" style={{ color: theme.muted }}>Today</div>
                    <h1 className="text-2xl md:text-3xl font-semibold mt-1 tracking-tight">
                      {app.view === "dashboard" && "A cleaner home for your work"}
                      {app.view === "planner" && "Day planner"}
                      {app.view === "focus" && "Focus room"}
                      {app.view === "study" && "Study hub"}
                      {app.view === "more" && (app.settings.moreTab === "music" ? "Music and ambience" : "More settings")}
                    </h1>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge theme={theme} tone="accent">{syncText}</Badge>
                    {app.settings.musicPlaying ? <Badge theme={theme}>Music on</Badge> : null}
                    {app.settings.ambientPlaying ? <Badge theme={theme}>Ambient on</Badge> : null}
                    <div className="text-sm" style={{ color: theme.muted }}>
                      {new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}
                    </div>
                  </div>
                </div>
              </Surface>
            </div>

            {app.view === "more" ? (
              <div className="mb-5">
                <Segmented
                  theme={theme}
                  items={[
                    { label: "Music", value: "music" },
                    { label: "Settings", value: "settings" },
                  ]}
                  value={app.settings.moreTab}
                  onChange={(value) => setApp((prev) => ({ ...prev, settings: { ...prev.settings, moreTab: value } }))}
                />
              </div>
            ) : null}

            <AnimatePresence mode="wait">
              <motion.div key={`${app.view}-${app.settings.moreTab}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
                {pageContent}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>

      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-20 px-3 pb-3">
        <div className="mx-auto max-w-2xl rounded-[30px] p-2 border backdrop-blur-2xl" style={{ background: theme.panel, borderColor: theme.border, boxShadow: theme.shadow }}>
          <div className="grid grid-cols-5 gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = app.view === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => setApp((prev) => ({ ...prev, view: item.key }))}
                  className="rounded-2xl py-2.5 px-1 flex flex-col items-center gap-1 text-[11px]"
                  style={{ background: active ? theme.accentSoft : "transparent", color: active ? theme.accent : theme.muted }}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
}
