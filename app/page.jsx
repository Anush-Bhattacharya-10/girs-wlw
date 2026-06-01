"use client";
import { useState, useEffect, useRef } from "react";

// ─── CONSTANTS ────────────────────────────────────────────────────────────────

const LOADING_LINES = [
  "Analyzing your terrible taste in women...",
  "Locating the only bed left in the universe...",
  "Sourcing the single umbrella for two...",
  "Calculating exact inches of pining per chapter...",
  "Activating the Enemies-to-Lovers protocol...",
  "Convincing both women they're 'just friends'...",
  "Deploying strategic hand-on-waist manoeuvre...",
  "Queuing the 'our eyes met across the room' moment...",
  "Buying mint for our smoochers...",
  "Curating cute music for heavy makeout..."
];

const MOCK_STORY = `The rain had started somewhere between the second argument and the third loaded silence.

Mira didn't look up when the door opened. She knew who it was — she always knew. Six months of 
this impossible orbit had calibrated her body to Lyra's frequencies in ways she wasn't ready to 
examine.

"You left your scarf," Lyra said. Her voice was doing that thing. The soft thing. The thing that 
made Mira's ribcage feel three sizes too small.

"Keep it." Mira turned a page she hadn't read. "It's cold out."

A pause that contained multitudes. Mira counted the seconds the way she counted Lyra's steps — 
helplessly, without meaning to.

"You never told me," Lyra said finally, "whether you hate me or not."

Mira set the book down very carefully. "I don't hate you."

"But."

"There is no but."

The lie sat between them like a third person. Lyra crossed the room in three steps — Mira had 
always known she would — and when her hand covered Mira's, it felt less like a touch and more 
like an ending to a sentence she'd been writing for half a year.

"I know," Lyra said quietly. "I know. Me too."

Outside, the city went on being oblivious. Inside, two women sat with their hands overlapping 
in the lamplight, terrified and finally, finally, almost honest.

—

*[Your full generated story will appear here after the AI weaves your characters, relationships, 
plot hook, and spice settings into something gloriously unhinged. This is just a taste.]*`;

// ─── SMALL UTILITY COMPONENTS ─────────────────────────────────────────────────

/** Glowing neon section heading */
const SectionHeading = ({ emoji, title, subtitle }) => (
    <div className="mb-6">
      <h2 className="text-xl font-bold tracking-widest uppercase text-pink-400 flex items-center gap-2">
        <span>{emoji}</span>
        <span style={{ textShadow: "0 0 12px #f472b6, 0 0 30px #f472b690" }}>
        {title}
      </span>
      </h2>
      {subtitle && (
          <p className="text-xs text-purple-300/60 mt-1 pl-7 tracking-wider">
            {subtitle}
          </p>
      )}
    </div>
);

/** Thin decorative divider */
const Divider = () => (
    <div className="relative my-10">
      <div className="absolute inset-0 flex items-center">
        <div
            className="w-full h-px"
            style={{
              background:
                  "linear-gradient(90deg, transparent, #a855f7, #ec4899, #a855f7, transparent)",
            }}
        />
      </div>
      <div className="relative flex justify-center">
      <span
          className="px-4 text-pink-400 text-lg"
          style={{ background: "#0d0a14" }}
      >
        ✦
      </span>
      </div>
    </div>
);

// ─── CHARACTER CARD ───────────────────────────────────────────────────────────

const CharacterCard = ({ character, onUpdate, onDelete }) => {
  const handleChange = (field, value) =>
      onUpdate(character.id, { ...character, [field]: value });

  return (
      <div
          className="relative rounded-xl p-4 border border-purple-500/30 bg-purple-950/30 backdrop-blur-sm transition-all duration-300 hover:border-pink-500/50 group"
          style={{ boxShadow: "0 0 20px #a855f710 inset" }}
      >
        {/* Delete button */}
        <button
            onClick={() => onDelete(character.id)}
            aria-label="Remove character"
            className="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center text-purple-400/50 hover:text-pink-400 hover:bg-pink-500/10 transition-all duration-200 opacity-0 group-hover:opacity-100 text-xs font-bold"
        >
          ✕
        </button>

        {/* Character index badge */}
        <div className="flex items-center gap-3 mb-3">
        <span
            className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-pink-300 border border-pink-500/40 shrink-0"
            style={{ background: "rgba(236,72,153,0.1)" }}
        >
          ♀
        </span>
          <input
              type="text"
              placeholder="Character name..."
              value={character.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="flex-1 bg-transparent text-white font-semibold text-sm placeholder-purple-400/40 border-b border-purple-500/30 focus:border-pink-400/70 outline-none py-0.5 transition-colors duration-200"
          />
        </div>

        {/* Traits */}
        <div className="pl-10">
          <label className="block text-xs text-purple-300/60 tracking-widest uppercase mb-1">
            Personality / Traits
          </label>
          <textarea
              placeholder="e.g. brooding academic, secretly soft, has a sword and a complex..."
              value={character.traits}
              onChange={(e) => handleChange("traits", e.target.value)}
              rows={2}
              className="w-full bg-black/20 rounded-lg border border-purple-500/20 text-purple-100 text-xs placeholder-purple-400/30 px-3 py-2 resize-none focus:outline-none focus:border-pink-400/50 transition-colors duration-200"
          />
        </div>
      </div>
  );
};

// ─── RELATIONSHIP ROW ─────────────────────────────────────────────────────────

const RelationshipRow = ({ relationship, characters, onUpdate, onDelete }) => {
  const handleChange = (field, value) =>
      onUpdate(relationship.id, { ...relationship, [field]: value });

  const charOptions = characters.filter((c) => c.name.trim() !== "");

  return (
      <div
          className="flex flex-wrap gap-3 items-center rounded-xl p-4 border border-pink-500/20 bg-pink-950/20 transition-all duration-300 hover:border-pink-500/40 group"
          style={{ boxShadow: "0 0 15px #ec489908 inset" }}
      >
        {/* Char A dropdown */}
        <div className="flex-1 min-w-[120px]">
          <label className="block text-xs text-pink-300/50 tracking-widest uppercase mb-1">
            She
          </label>
          <select
              value={relationship.charA}
              onChange={(e) => handleChange("charA", e.target.value)}
              className="w-full bg-black/40 border border-pink-500/30 rounded-lg text-pink-100 text-xs px-2 py-2 focus:outline-none focus:border-pink-400 transition-colors duration-200 cursor-pointer"
          >
            <option value="">-- Pick one --</option>
            {charOptions.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
            ))}
          </select>
        </div>

        {/* Connector glyph */}
        <div className="text-pink-400 text-sm mt-4 font-bold tracking-tighter select-none">
          ⟷
        </div>

        {/* Char B dropdown */}
        <div className="flex-1 min-w-[120px]">
          <label className="block text-xs text-pink-300/50 tracking-widest uppercase mb-1">
            Her
          </label>
          <select
              value={relationship.charB}
              onChange={(e) => handleChange("charB", e.target.value)}
              className="w-full bg-black/40 border border-pink-500/30 rounded-lg text-pink-100 text-xs px-2 py-2 focus:outline-none focus:border-pink-400 transition-colors duration-200 cursor-pointer"
          >
            <option value="">-- Pick one --</option>
            {charOptions.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
            ))}
          </select>
        </div>

        {/* Vibe input */}
        <div className="flex-[2] min-w-[160px]">
          <label className="block text-xs text-pink-300/50 tracking-widest uppercase mb-1">
            Current Vibe / Dynamic
          </label>
          <input
              type="text"
              placeholder="e.g. rivals who stare too long, former lovers, disaster duo..."
              value={relationship.vibe}
              onChange={(e) => handleChange("vibe", e.target.value)}
              className="w-full bg-black/40 border border-pink-500/30 rounded-lg text-pink-100 text-xs px-3 py-2 focus:outline-none focus:border-pink-400 placeholder-pink-300/20 transition-colors duration-200"
          />
        </div>

        {/* Delete row */}
        <button
            onClick={() => onDelete(relationship.id)}
            aria-label="Remove relationship"
            className="mt-4 w-6 h-6 rounded-full flex items-center justify-center text-pink-400/40 hover:text-pink-400 hover:bg-pink-500/10 transition-all duration-200 opacity-0 group-hover:opacity-100 text-xs font-bold shrink-0"
        >
          ✕
        </button>
      </div>
  );
};

// ─── SPICE METER ──────────────────────────────────────────────────────────────

const SPICE_LABELS = ["👀 Longing Glances", "💌 Slow Burn", "🌡 Getting Warmer", "🔥 Genuinely Hot", "💥 UNHINGED"];

const SpiceMeter = ({ value, onChange }) => (
    <div className="space-y-3">
      <div className="flex justify-between items-end">
        <label className="text-xs text-purple-300/60 tracking-widest uppercase">
          Spice / Burn Meter
        </label>
        <span
            className="text-sm font-bold text-pink-400"
            style={{ textShadow: "0 0 8px #f472b6" }}
        >
        {SPICE_LABELS[value - 1]}
      </span>
      </div>

      {/* Custom styled range */}
      <div className="relative">
        <input
            type="range"
            min={1}
            max={5}
            step={1}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className="w-full h-2 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(90deg, #ec4899 ${((value - 1) / 4) * 100}%, #2d1b36 ${((value - 1) / 4) * 100}%)`,
              WebkitAppearance: "none",
            }}
        />
      </div>

      {/* Pip labels */}
      <div className="flex justify-between px-0.5">
        {[1, 2, 3, 4, 5].map((n) => (
            <button
                key={n}
                onClick={() => onChange(n)}
                className={`text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 ${
                    n === value
                        ? "bg-pink-500 text-white scale-110"
                        : "text-purple-400/50 hover:text-purple-300"
                }`}
            >
              {n}
            </button>
        ))}
      </div>
    </div>
);

// ─── STORY OUTPUT ─────────────────────────────────────────────────────────────

const StoryOutput = ({ story }) => {
  if (!story) return null;

  return (
      <section className="mt-12">
        <div
            className="rounded-2xl p-8 border border-pink-500/30 relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #1a0a2e, #0d0618, #1a0a2e)",
              boxShadow: "0 0 60px #ec489920, 0 0 120px #a855f710",
            }}
        >
          {/* Corner decorations */}
          <div className="absolute top-4 left-4 text-pink-500/20 text-4xl select-none">❝</div>
          <div className="absolute bottom-4 right-4 text-pink-500/20 text-4xl select-none">❞</div>

          <SectionHeading
              emoji="📖"
              title="Your Story Unfolds"
              subtitle="Straight from the pining dimension"
          />

          <div
              className="text-purple-100/90 text-sm leading-relaxed whitespace-pre-wrap font-light tracking-wide"
              style={{ fontFamily: "'Georgia', serif" }}
          >
            {story}
          </div>

          {/* Copy button */}
          <button
              onClick={() => navigator.clipboard?.writeText(story)}
              className="mt-6 text-xs text-pink-400/60 hover:text-pink-300 border border-pink-500/20 hover:border-pink-400/40 rounded-lg px-4 py-2 transition-all duration-200"
          >
            📋 Copy Story to Clipboard
          </button>
        </div>
      </section>
  );
};

// ─── LOADING OVERLAY ──────────────────────────────────────────────────────────

const LoadingOverlay = ({ line }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md">
      <div
          className="text-center p-10 rounded-2xl border border-pink-500/40 max-w-sm mx-4"
          style={{
            background: "#0d0a14",
            boxShadow: "0 0 80px #ec489930, 0 0 160px #a855f718",
          }}
      >
        {/* Spinning glyph */}
        <div
            className="text-5xl mb-6 animate-spin inline-block"
            style={{ animationDuration: "3s" }}
        >
          🌀
        </div>
        <p
            className="text-pink-400 font-bold text-base mb-2"
            style={{ textShadow: "0 0 15px #f472b6" }}
        >
          Compiling your pining...
        </p>
        <p className="text-purple-300/70 text-sm leading-snug">{line}</p>
        {/* Progress dots */}
        <div className="flex justify-center gap-2 mt-6">
          {[0, 1, 2].map((i) => (
              <div
                  key={i}
                  className="w-2 h-2 rounded-full bg-pink-400 animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
              />
          ))}
        </div>
      </div>
    </div>
);

// ─── PROMPT BUILDER ───────────────────────────────────────────────────────────

/**
 * Assembles the entire state into a rich, structured prompt string.
 * In production, this string would be sent to your LLM API.
 */
const buildPrompt = ({ characters, relationships, plotHook, spiceLevel }) => {
  const charList = characters
      .filter((c) => c.name.trim())
      .map(
          (c, i) =>
              `  Character ${i + 1}: ${c.name}
    Traits: ${c.traits || "(no traits specified)"}`
      )
      .join("\n\n");

  const getCharName = (id) =>
      characters.find((c) => c.id === id)?.name ?? id;

  const relList = relationships
      .filter((r) => r.charA && r.charB)
      .map(
          (r, i) =>
              `  Relationship ${i + 1}: ${getCharName(r.charA)} ↔ ${getCharName(r.charB)}
    Dynamic: ${r.vibe || "(no vibe specified)"}`
      )
      .join("\n\n");

  const spiceDescriptions = {
    1: "Keep it completely clean — longing glances, meaningful silences, and pining only.",
    2: "Slow burn territory — emotional intimacy, charged moments, maybe one almost-kiss.",
    3: "Moderate heat — some physical closeness, confessions, tension breaking.",
    4: "Genuinely hot — explicit emotional and physical tension, leave little to imagination.",
    5: "Absolutely unhinged — max spice, no rules, chaos and passion fully unleashed.",
  };

  return `
═══════════════════════════════════════════════════════════════
                 GIREESHA'S WUH LUH WUH GENERATOR
                   ✦ COMPILED STORY PROMPT ✦
═══════════════════════════════════════════════════════════════

You are a creative writer specialising in sapphic (women-loving-women) fiction. 
Your task is to write a compelling, emotionally resonant short story based on 
the following character and relationship specifications. The writing should feel 
literary and character-driven, with strong internal monologue and vivid sensory detail.

────────────────────────────────────────────────────────────────
CHARACTERS
────────────────────────────────────────────────────────────────
${charList || "  (No characters defined — write original characters.)"}

────────────────────────────────────────────────────────────────
RELATIONSHIPS & DYNAMICS
────────────────────────────────────────────────────────────────
${relList || "  (No relationships defined — establish dynamics organically.)"}

────────────────────────────────────────────────────────────────
PLOT HOOK / SETTING
────────────────────────────────────────────────────────────────
${plotHook?.trim() || "  (No plot hook specified — use your best judgment.)"}

────────────────────────────────────────────────────────────────
SPICE LEVEL: ${spiceLevel}/5
────────────────────────────────────────────────────────────────
${spiceDescriptions[spiceLevel]}

────────────────────────────────────────────────────────────────
WRITING INSTRUCTIONS
────────────────────────────────────────────────────────────────
- Write at least 800 words of original prose fiction.
- Use close third-person or first-person perspective.
- Include rich internal monologue and emotional texture.
- Let the relationship dynamic and spice level guide the pacing.
- End on a satisfying or purposefully ambiguous note.
- Do NOT use clichés like "her heart raced" without subverting them.
- If characters are unnamed, give them compelling, fitting names.

Now write the story. Begin immediately with the prose — no preamble.
═══════════════════════════════════════════════════════════════
`.trim();
};

// ─── ID GENERATOR ─────────────────────────────────────────────────────────────
let _id = 1;
const uid = () => `id_${_id++}`;

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

export default function SapphicScribbler() {
  // ── State ──────────────────────────────────────────────────────────────────
    const [isMounted, setIsMounted] = useState(false);
    const [error, setError] = useState(null);
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsMounted(true);
    }, []);
  const [characters, setCharacters] = useState([
    { id: uid(), name: "", traits: "" },
    { id: uid(), name: "", traits: "" },
  ]);

  const [relationships, setRelationships] = useState([
    { id: uid(), charA: "", charB: "", vibe: "" },
  ]);

  const [plotHook, setPlotHook] = useState("");
  const [spiceLevel, setSpiceLevel] = useState(2);
  const [generatedStory, setGeneratedStory] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingLine, setLoadingLine] = useState("");

  const storyRef = useRef(null);

  // ── Character handlers ─────────────────────────────────────────────────────

  const addCharacter = () =>
      setCharacters((prev) => [...prev, { id: uid(), name: "", traits: "" }]);

  const updateCharacter = (id, updated) =>
      setCharacters((prev) => prev.map((c) => (c.id === id ? updated : c)));

  const deleteCharacter = (id) =>
      setCharacters((prev) => prev.filter((c) => c.id !== id));

  // ── Relationship handlers ──────────────────────────────────────────────────

  const addRelationship = () =>
      setRelationships((prev) => [
        ...prev,
        { id: uid(), charA: "", charB: "", vibe: "" },
      ]);

  const updateRelationship = (id, updated) =>
      setRelationships((prev) => prev.map((r) => (r.id === id ? updated : r)));

  const deleteRelationship = (id) =>
      setRelationships((prev) => prev.filter((r) => r.id !== id));

  // ── Main compile handler ───────────────────────────────────────────────────

    const handleCompile = async () => {
        // 1. Clear previous errors and initialize structural loading states
        setError(null);
        setIsLoading(true);
        setGeneratedStory("");

        // 2. Begin sequential loading phrase loop (700ms cycles)
        let lineIndex = 0;
        setLoadingLine(LOADING_LINES[0]);
        const interval = setInterval(() => {
            lineIndex = (lineIndex + 1) % LOADING_LINES.length;
            setLoadingLine(LOADING_LINES[lineIndex]);
        }, 700);

        try {
            // 3. Fire the real, live backend network transit request
            const response = await fetch('/api/generate-story', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    characters,      // Reactive local array state
                    relationships,   // Reactive local array state
                    plotHook,        // Dynamic text area state string
                    spiceLevel       // Selected dynamic pining integer
                }),
            });

            const data = await response.json();

            // 4. Inspect structural response errors
            if (!response.ok) {
                throw new Error(data.error || `Network execution failed with status ${response.status}`);
            }

            // 5. Mount the fresh prose to your viewport component state
            setGeneratedStory(data.story);

            // 6. Automatically trigger smooth-scroll layout engine
            requestAnimationFrame(() =>
                storyRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
            );

        } catch (err) {
            console.error("The Sapphic Scribbler Core Engine Error:", err);
            // Graceful error pipeline mounting to prevent UI crash loops
            setError(err.message || "An unexpected hitch occurred while spinning your yarn.");
        } finally {
            // 7. ALWAYS clear structural intervals and unmount overlay displays
            clearInterval(interval);
            setIsLoading(false);
        }
    };

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
      <>
        {/* ── Global style overrides (scoped to this component) ── */}
        <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@700&family=Nunito:wght@300;400;600;700&display=swap');

        /* Custom range thumb */
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #ec4899;
          box-shadow: 0 0 10px #ec489980;
          cursor: pointer;
          border: 2px solid #fce7f3;
          transition: transform 0.15s;
        }
        input[type="range"]::-webkit-slider-thumb:hover {
          transform: scale(1.2);
        }
        input[type="range"]::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #ec4899;
          box-shadow: 0 0 10px #ec489980;
          cursor: pointer;
          border: 2px solid #fce7f3;
        }

        /* Subtle animated background stars */
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.7; }
        }
        .star { animation: twinkle 3s ease-in-out infinite; }

        /* Glow pulse on compile button */
        @keyframes glow-pulse {
          0%, 100% { box-shadow: 0 0 20px #ec489960, 0 0 40px #a855f740; }
          50% { box-shadow: 0 0 40px #ec4899a0, 0 0 80px #a855f760; }
        }
        .btn-compile { animation: glow-pulse 2.5s ease-in-out infinite; }
        .btn-compile:hover { animation: none; box-shadow: 0 0 60px #ec4899b0, 0 0 120px #a855f780; }
      `}</style>

        {/* ── Loading overlay ── */}
        {isLoading && <LoadingOverlay line={loadingLine} />}

        {/* ── Page wrapper ── */}
        <div
            className="min-h-screen text-white"
            style={{
              background: "#0d0a14",
              backgroundImage: `
            radial-gradient(ellipse at 20% 10%, #2d0a4e40 0%, transparent 50%),
            radial-gradient(ellipse at 80% 90%, #4a0a3040 0%, transparent 50%),
            radial-gradient(ellipse at 50% 50%, #1a0a2e 0%, #0d0a14 70%)
          `,
              fontFamily: "'Nunito', sans-serif",
            }}
        >
          {/* ── Decorative background stars ── */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
                {isMounted && [...Array(30)].map((_, i) => (
                    <div
                        key={i}
                        className="star absolute rounded-full bg-white"
                        style={{
                            width: Math.random() > 0.8 ? "2px" : "1px",
                            height: Math.random() > 0.8 ? "2px" : "1px",
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 3}s`,
                            animationDuration: `${2 + Math.random() * 3}s`,
                        }}
                    />
                ))}
            </div>

          {/* ── Main container ── */}
          <div className="relative z-10 max-w-3xl mx-auto px-4 py-12">

            {/* ══════════════════════════════════════════════════════
              HEADER
          ══════════════════════════════════════════════════════ */}
            <header className="text-center mb-16">
              {/* Main title */}
              <div className="relative inline-block mb-2">
                <h1
                    className="text-4xl sm:text-5xl font-bold tracking-tight"
                    style={{
                      fontFamily: "'Cinzel Decorative', cursive",
                      background: "linear-gradient(135deg, #f9a8d4, #ec4899, #c084fc, #a855f7)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                      textShadow: "none",
                      filter: "drop-shadow(0 0 20px #ec489940)",
                    }}
                >
                  Gireesha&apos;s<br />WLW Generator
                </h1>
              </div>

              {/* Tagline */}
              <p className="text-purple-300/70 text-sm tracking-widest mt-3 uppercase">
                ✦ A Fanfic Forging Engine ✦
              </p>

              {/* Birthday dedication */}
              <div
                  className="mt-6 inline-block px-6 py-3 rounded-full border border-pink-500/30 text-xs text-pink-300/80 tracking-wider"
                  style={{ background: "rgba(236,72,153,0.05)" }}
              >
                Crafted with love for{" "}
                <span className="text-pink-400 font-bold">our favourite lesbian</span> on her birthday!
              </div>
            </header>

            {/* ══════════════════════════════════════════════════════
              SECTION 1 — CHARACTER FORGE
          ══════════════════════════════════════════════════════ */}
            <section aria-labelledby="character-forge-heading">
              <SectionHeading
                  emoji=""
                  title="Character Forge"
                  subtitle="Define the women who will ruin each other's lives (affectionately)"
              />

              <div className="space-y-3">
                {characters.map((char) => (
                    <CharacterCard
                        key={char.id}
                        character={char}
                        onUpdate={updateCharacter}
                        onDelete={deleteCharacter}
                    />
                ))}
              </div>

              <button
                  onClick={addCharacter}
                  className="mt-4 flex items-center gap-2 text-sm text-purple-300 hover:text-pink-300 border border-purple-500/30 hover:border-pink-400/50 rounded-xl px-5 py-2.5 transition-all duration-200 hover:bg-pink-500/5"
              >
                <span className="text-base">➕</span>
                <span>Add Character</span>
              </button>
            </section>

            <Divider />

            {/* ══════════════════════════════════════════════════════
              SECTION 2 — RELATIONSHIP MATRIX
          ══════════════════════════════════════════════════════ */}
            <section aria-labelledby="relationship-matrix-heading">
              <SectionHeading
                  emoji=""
                  title="Relationship Matrix"
                  subtitle="Link your disasters together and define the vibe"
              />

              <div className="space-y-3">
                {relationships.map((rel) => (
                    <RelationshipRow
                        key={rel.id}
                        relationship={rel}
                        characters={characters}
                        onUpdate={updateRelationship}
                        onDelete={deleteRelationship}
                    />
                ))}
              </div>

              <button
                  onClick={addRelationship}
                  className="mt-4 flex items-center gap-2 text-sm text-pink-300/80 hover:text-pink-300 border border-pink-500/30 hover:border-pink-400/50 rounded-xl px-5 py-2.5 transition-all duration-200 hover:bg-pink-500/5"
              >
                <span className="text-base">➕</span>
                <span>Add Relationship Link</span>
              </button>
            </section>

            <Divider />

            {/* ══════════════════════════════════════════════════════
              SECTION 3 — THE STORY LAUNCHPAD
          ══════════════════════════════════════════════════════ */}
            <section aria-labelledby="launchpad-heading">
              <SectionHeading
                  emoji=""
                  title="Story Launchpad"
                  subtitle="Set the stage and calibrate the tension"
              />

              {/* Plot hook textarea */}
              <div className="mb-8">
                <label className="block text-xs text-purple-300/60 tracking-widest uppercase mb-2">
                  Plot Hook / Setting
                </label>
                <textarea
                    placeholder="e.g. Two rival historians are trapped together during a museum lockdown. One of them definitely doesn't have feelings about it..."
                    value={plotHook}
                    onChange={(e) => setPlotHook(e.target.value)}
                    rows={4}
                    className="w-full rounded-xl border border-purple-500/30 bg-purple-950/20 text-purple-100 text-sm placeholder-purple-400/30 px-4 py-3 resize-none focus:outline-none focus:border-pink-400/60 transition-colors duration-200"
                    style={{ boxShadow: "0 0 15px #a855f708 inset" }}
                />
              </div>

              {/* Spice meter */}
              <div
                  className="rounded-xl p-5 border border-pink-500/20 bg-pink-950/10 mb-10"
                  style={{ boxShadow: "0 0 20px #ec489908 inset" }}
              >
                <SpiceMeter value={spiceLevel} onChange={setSpiceLevel} />
              </div>

              {/* ── THE BIG BUTTON ── */}
              <div className="flex justify-center">
                <button
                    onClick={handleCompile}
                    disabled={isLoading}
                    className="btn-compile relative overflow-hidden rounded-2xl px-12 py-5 font-bold text-lg text-white tracking-widest uppercase transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:animate-none"
                    style={{
                      background: "linear-gradient(135deg, #9333ea, #ec4899, #9333ea)",
                      backgroundSize: "200% 200%",
                      border: "1px solid rgba(255,255,255,0.15)",
                      fontFamily: "'Cinzel Decorative', cursive",
                      fontSize: "0.85rem",
                    }}
                    aria-label="Compile the story prompt and generate story"
                >
                  {/* Shimmer layer */}
                  <span
                      className="absolute inset-0 opacity-30 pointer-events-none"
                      style={{
                        background: "linear-gradient(90deg, transparent 0%, white 50%, transparent 100%)",
                        transform: "skewX(-20deg) translateX(-100%)",
                        animation: "shimmer 3s ease-in-out infinite",
                      }}
                  />
                  🔥 Compile Pining 🔥
                </button>
              </div>

              {/* Tiny helper note */}
              <p className="text-center text-purple-400/40 text-xs mt-4 tracking-wide">
                Open your browser console to see the compiled prompt string
              </p>
            </section>
              {error && (
                  <div className="my-4 p-4 rounded-lg bg-red-950/40 border border-pink-500/30 text-pink-200 flex items-start gap-3 backdrop-blur-md">
                      <span className="text-xl">⚠️</span>
                      <div className="flex-1">
                          <h4 className="font-bold text-pink-400">The Sapphic Scribbler encountered a hitch:</h4>
                          <p className="text-sm opacity-90">{error}</p>
                      </div>
                      <button
                          onClick={() => setError(null)}
                          className="text-pink-400 hover:text-pink-300 text-sm font-mono cursor-pointer"
                      >
                          [Dismiss]
                      </button>
                  </div>
              )}
            {/* ══════════════════════════════════════════════════════
              SECTION 4 — STORY OUTPUT
          ══════════════════════════════════════════════════════ */}
            <div ref={storyRef}>
              <StoryOutput story={generatedStory} />
            </div>

            {/* ── Footer ── */}
            <footer className="mt-20 text-center text-purple-500/30 text-xs tracking-widest pb-8">
              ✦ Made with entirely too much pining ✦
            </footer>
          </div>
        </div>
      </>
  );
}
