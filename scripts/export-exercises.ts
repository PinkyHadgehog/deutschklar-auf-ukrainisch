// Exportiert die 15 Übungen einer Lektion als JSON für das Python-Seeding.
// Ausführen: bun scripts/export-exercises.ts
// Liest die Daten direkt aus src/content/a1/verben.ts — nichts wird neu definiert.
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { verbenA1 } from "../src/content/a1/verben";
import type { ExerciseItem } from "../src/content/exerciseSets";

const LESSON_SLUG = "regelmaessige-verben";
const OUT = resolve(import.meta.dir, "../data/export", `${LESSON_SLUG}.json`);
const EXPECTED = 15;
const SUPPORTED = ["mc", "multi", "gap", "tf", "order", "translate", "match", "correct", "writeFree"] as const;

type Row = {
  lesson_slug: string;
  exercise_key: string;
  position: number;
  type: string;
  payload: Record<string, unknown>;
  solution: Record<string, unknown>;
  explain: string | null;
};

const arr = (v: string | string[]) => (Array.isArray(v) ? v : [v]);
const errors: string[] = [];
const need = (cond: unknown, msg: string) => { if (!cond) errors.push(msg); };
const str = (v: unknown) => typeof v === "string" && v.trim().length > 0;

function split(item: ExerciseItem, pos: number): Pick<Row, "payload" | "solution"> {
  const at = `#${pos} (${item.type})`;
  switch (item.type) {
    case "mc":
    case "multi": {
      need(str(item.q), `${at}: q fehlt`);
      need(Array.isArray(item.options) && item.options.length >= 2, `${at}: options fehlen`);
      const idx = item.type === "mc" ? [item.correct] : item.correct;
      need(idx.length > 0 && idx.every((i) => Number.isInteger(i) && i >= 0 && i < item.options.length), `${at}: ungültiger Lösungsindex`);
      return { payload: { q: item.q, options: item.options }, solution: { correct: item.correct } };
    }
    case "tf":
      need(str(item.q), `${at}: q fehlt`);
      need(typeof item.correct === "boolean", `${at}: correct muss boolean sein`);
      return { payload: { q: item.q }, solution: { correct: item.correct } };
    case "gap": {
      need(str(item.q), `${at}: q fehlt`);
      const a = arr(item.answer);
      need(a.length && a.every(str), `${at}: answer fehlt`);
      return { payload: { q: item.q, ...(item.hint ? { hint: item.hint } : {}) }, solution: { accepted: a } };
    }
    case "order":
      need(str(item.prompt), `${at}: prompt fehlt`);
      need(item.words?.length && item.correct?.length === item.words.length, `${at}: words/correct passen nicht`);
      need([...item.words].sort().join("|") === [...item.correct].sort().join("|"), `${at}: correct enthält andere Wörter als words`);
      return { payload: { prompt: item.prompt, words: item.words }, solution: { correct: item.correct } };
    case "translate": {
      need(str(item.prompt) && str(item.uk), `${at}: prompt/uk fehlt`);
      const a = arr(item.de);
      need(a.length && a.every(str), `${at}: de fehlt`);
      return { payload: { prompt: item.prompt, uk: item.uk }, solution: { accepted: a } };
    }
    case "match": {
      need(str(item.prompt), `${at}: prompt fehlt`);
      need(item.pairs?.length >= 2 && item.pairs.every((p) => str(p.left) && str(p.right)), `${at}: pairs unvollständig`);
      // Rechte Spalte stabil alphabetisch — verrät die Zuordnung nicht, bleibt bei Re-Exporten gleich.
      const right = item.pairs.map((p) => p.right).sort((a, b) => a.localeCompare(b, "de"));
      return { payload: { prompt: item.prompt, left: item.pairs.map((p) => p.left), right }, solution: { pairs: item.pairs } };
    }
    case "correct": {
      need(str(item.prompt) && str(item.wrong), `${at}: prompt/wrong fehlt`);
      const a = arr(item.correct);
      need(a.length && a.every(str), `${at}: correct fehlt`);
      return { payload: { prompt: item.prompt, wrong: item.wrong }, solution: { accepted: a } };
    }
    case "writeFree":
      need(str(item.prompt) && str(item.sample), `${at}: prompt/sample fehlt`);
      // Muster ist nur ein Beispiel — keine automatische Bewertung nach Länge.
      return { payload: { prompt: item.prompt }, solution: { sample: item.sample, grading: "manual_review", auto_gradable: false } };
    default:
      errors.push(`${at}: nicht unterstützter Typ`);
      return { payload: {}, solution: {} };
  }
}

const items = verbenA1[LESSON_SLUG]?.exercises15;
if (!items) { console.error(`Lektion "${LESSON_SLUG}" nicht gefunden.`); process.exit(1); }
need(items.length === EXPECTED, `Erwartet ${EXPECTED} Übungen, gefunden ${items.length}`);

const rows: Row[] = items.map((item, i) => {
  const position = i + 1;
  need((SUPPORTED as readonly string[]).includes(item.type), `#${position}: Typ "${item.type}" nicht unterstützt`);
  return {
    lesson_slug: LESSON_SLUG,
    exercise_key: `${LESSON_SLUG}-${String(position).padStart(2, "0")}`,
    position,
    type: item.type,
    ...split(item, position),
    explain: item.explain ?? null,
  };
});

need(new Set(rows.map((r) => r.exercise_key)).size === rows.length, "exercise_key nicht eindeutig");
need(new Set(rows.map((r) => r.position)).size === rows.length, "position nicht eindeutig");

if (errors.length) { console.error("Validierung fehlgeschlagen:\n- " + errors.join("\n- ")); process.exit(1); }

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, JSON.stringify({ lesson_slug: LESSON_SLUG, count: rows.length, exercises: rows }, null, 2) + "\n", "utf8");
const types = rows.reduce<Record<string, number>>((m, r) => ((m[r.type] = (m[r.type] ?? 0) + 1), m), {});
console.log(`OK: ${rows.length} Übungen → ${OUT}`, types);
