/**
 * Simple deterministic, rule-based recommendation engine (frontend only).
 *
 * Priority: started lesson (100) → weak quiz (<70%) → vocabulary mistakes → next lesson (50).
 *
 * Later this can be replaced 1:1 by:
 *   GET /api/recommendations  -> Recommendation[]
 */

import { grammarCategories, vocabThemes, type Level } from "@/data/mock";
import { getAllLessonProgress } from "@/lib/lessonProgress";
import { getCompletionEvents } from "@/lib/weeklyStats";

export type RecommendationType =
  | "continue_lesson"
  | "repeat_quiz"
  | "vocabulary_review"
  | "next_lesson";

export type RecommendationReason =
  | "lesson_started"
  | "low_quiz_score"
  | "vocabulary_mistakes"
  | "next_in_sequence";

export interface Recommendation {
  id: string;
  type: RecommendationType;
  title: string;
  level: Level;
  priority: number;
  reason: RecommendationReason;
  context: string;
  href: string;
  score?: number;
  mistakes?: number;
}

export interface LessonRef {
  slug: string;
  title: string;
  level: Level;
  order: number;
}

const LEVELS: Level[] = ["A1", "A2", "B1", "B2", "C1", "C2"];

/** Flat, ordered index of every lesson available in the course structure. */
export const lessonIndex: LessonRef[] = (() => {
  const out: LessonRef[] = [];
  let order = 0;
  grammarCategories.forEach((cat) => {
    cat.topics.forEach((topic) => {
      if (topic.sub?.length) {
        topic.sub.forEach((s) => {
          out.push({ slug: s.slug, title: s.titleDe || s.title, level: topic.level, order: order++ });
        });
      } else {
        out.push({ slug: topic.slug, title: topic.titleDe || topic.title, level: topic.level, order: order++ });
      }
    });
  });
  // de-dupe by slug (first occurrence wins)
  const seen = new Set<string>();
  return out.filter((l) => (seen.has(l.slug) ? false : (seen.add(l.slug), true)));
})();

const findLesson = (slug: string) => lessonIndex.find((l) => l.slug === slug);

const RECENT_DAYS = 21;
const isRecent = (iso: string) =>
  Date.now() - new Date(iso).getTime() <= RECENT_DAYS * 24 * 60 * 60 * 1000;

interface QuizTopicStats {
  topicId: string;
  latestScorePct: number;
  latestAt: number;
  recentMistakes: number;
}

const quizStats = (): QuizTopicStats[] => {
  const map = new Map<string, QuizTopicStats>();
  getCompletionEvents().forEach((e) => {
    if (e.type !== "vocabulary_quiz_completed") return;
    const at = new Date(e.completedAt).getTime();
    const pct = e.total > 0 ? Math.round((e.score / e.total) * 100) : 0;
    const cur = map.get(e.topicId);
    const mistakes = isRecent(e.completedAt) ? Math.max(0, e.total - e.score) : 0;
    if (!cur) {
      map.set(e.topicId, { topicId: e.topicId, latestScorePct: pct, latestAt: at, recentMistakes: mistakes });
    } else {
      cur.recentMistakes += mistakes;
      if (at >= cur.latestAt) {
        cur.latestAt = at;
        cur.latestScorePct = pct;
      }
    }
  });
  return Array.from(map.values());
};

const themeById = (id: string) => vocabThemes.find((t) => t.id === id);

export interface RecommendationInput {
  level: Level;
  completedLessonSlugs?: string[];
}

export const getRecommendations = (input: RecommendationInput): Recommendation[] => {
  const { level } = input;
  const recs: Recommendation[] = [];
  const progress = getAllLessonProgress();
  const completed = new Set<string>(input.completedLessonSlugs ?? []);
  Object.values(progress).forEach((p) => {
    if (p.status === "completed") completed.add(p.lessonId);
  });

  // 1. Started but unfinished lessons — most recent first.
  Object.values(progress)
    .filter((p) => p.status === "started")
    .map((p) => ({ p, lesson: findLesson(p.lessonId) }))
    .filter((x) => !!x.lesson)
    .sort((a, b) => (b.p.updatedAt ?? 0) - (a.p.updatedAt ?? 0))
    .forEach(({ lesson }, i) => {
      recs.push({
        id: lesson!.slug,
        type: "continue_lesson",
        title: lesson!.title,
        level: lesson!.level,
        priority: 100 - i,
        reason: "lesson_started",
        context: "Продовжити урок",
        href: `/lesson/${lesson!.slug}`,
      });
    });

  const stats = quizStats();

  // 2. Weak quiz results (latest result below 70%).
  stats
    .filter((s) => s.latestScorePct < 70)
    .forEach((s) => {
      const theme = themeById(s.topicId);
      if (!theme) return;
      recs.push({
        id: `quiz-${s.topicId}`,
        type: "repeat_quiz",
        title: theme.titleDe,
        level,
        priority: 90 - Math.floor(s.latestScorePct / 10),
        reason: "low_quiz_score",
        context: `Повторити Quiz · ${s.latestScorePct}%`,
        href: `/vocab?tab=quiz&topic=${s.topicId}`,
        score: s.latestScorePct,
      });
    });

  // 3. Vocabulary topics with repeated recent mistakes.
  stats
    .filter((s) => s.recentMistakes >= 3)
    .forEach((s) => {
      const theme = themeById(s.topicId);
      if (!theme) return;
      recs.push({
        id: `vocab-${s.topicId}`,
        type: "vocabulary_review",
        title: `Wortschatz: ${theme.titleDe}`,
        level,
        priority: 80 + Math.min(s.recentMistakes, 10),
        reason: "vocabulary_mistakes",
        context: `Повторити слова · ${s.recentMistakes} помилок`,
        href: `/vocab?tab=flash&topic=${s.topicId}`,
        mistakes: s.recentMistakes,
      });
    });

  // 4. Fallback: next suitable lessons for the learner's level.
  const levelIdx = Math.max(0, LEVELS.indexOf(level));
  const alreadySuggested = new Set(recs.map((r) => r.id));
  const nextLessons = lessonIndex
    .filter((l) => l.level === level && !completed.has(l.slug) && !alreadySuggested.has(l.slug))
    .sort((a, b) => a.order - b.order);
  const fallbackLessons = nextLessons.length
    ? nextLessons
    : lessonIndex
        .filter(
          (l) =>
            LEVELS.indexOf(l.level) === levelIdx + 1 &&
            !completed.has(l.slug) &&
            !alreadySuggested.has(l.slug),
        )
        .sort((a, b) => a.order - b.order);

  fallbackLessons.slice(0, 4).forEach((l, i) => {
    recs.push({
      id: l.slug,
      type: "next_lesson",
      title: l.title,
      level: l.level,
      priority: 50 - i,
      reason: "next_in_sequence",
      context: "Наступний урок",
      href: `/lesson/${l.slug}`,
    });
  });

  // Fallback vocabulary topic for brand-new learners (no activity at all).
  if (stats.length === 0 && vocabThemes.length) {
    const theme = vocabThemes[0];
    recs.push({
      id: `vocab-start-${theme.id}`,
      type: "vocabulary_review",
      title: `Wortschatz: ${theme.titleDe}`,
      level,
      priority: 45,
      reason: "next_in_sequence",
      context: "Словник для твого рівня",
      href: `/vocab?tab=flash&topic=${theme.id}`,
    });
  }

  // De-duplicate: unique learning action per row.
  const seen = new Set<string>();
  return recs
    .sort((a, b) => b.priority - a.priority)
    .filter((r) => {
      const key = `${r.type === "next_lesson" || r.type === "continue_lesson" ? "lesson" : r.type}:${r.id}`;
      if (seen.has(key) || seen.has(`lesson:${r.id}`)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, 4);
};
