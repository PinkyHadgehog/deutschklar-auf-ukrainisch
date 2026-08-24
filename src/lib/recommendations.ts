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
import { getReviewCounts, wordsToReviewLabel } from "@/lib/vocabMistakes";

export type RecommendationType =
  | "continue_lesson"
  | "vocabulary_review"
  | "weak_quiz"
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
  /** True when `context` is an i18n key (resolve with t()) rather than final text. */
  isContextKey?: boolean;
  contextParams?: Record<string, string | number>;
  href: string;
  score?: number;
  mistakeCount?: number;
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
  /** Items already shown elsewhere on the Dashboard (e.g. last completed lesson). */
  excludeIds?: string[];
}

export const getRecommendations = (input: RecommendationInput): Recommendation[] => {
  const { level } = input;
  const exclude = new Set(input.excludeIds ?? []);
  const progress = getAllLessonProgress();
  const completed = new Set<string>(input.completedLessonSlugs ?? []);
  Object.values(progress).forEach((p) => {
    if (p.status === "completed") completed.add(p.lessonId);
  });

  const stats = quizStats();
  const reviewCounts = getReviewCounts();

  const byType: Record<RecommendationType, Recommendation[]> = {
    continue_lesson: [],
    vocabulary_review: [],
    weak_quiz: [],
    next_lesson: [],
  };

  // A. Started but unfinished lessons — most recently started first.
  Object.values(progress)
    .filter((p) => p.status === "started")
    .map((p) => ({ p, lesson: findLesson(p.lessonId) }))
    .filter((x) => !!x.lesson && !exclude.has(x.lesson!.slug))
    .sort((a, b) => (b.p.updatedAt ?? 0) - (a.p.updatedAt ?? 0))
    .forEach(({ lesson }, i) => {
      byType.continue_lesson.push({
        id: lesson!.slug,
        type: "continue_lesson",
        title: lesson!.title,
        level: lesson!.level,
        priority: 100 - i,
        reason: "lesson_started",
        context: "dashboard.recommendations.continueLesson",
        isContextKey: true,
        href: `/lesson/${lesson!.slug}`,
      });
    });

  // B. Vocabulary topics with distinct words waiting for review.
  Object.entries(reviewCounts)
    .filter(([, n]) => n >= 3)
    .sort((a, b) => b[1] - a[1])
    .forEach(([topicId, n], i) => {
      const theme = themeById(topicId);
      if (!theme) return;
      byType.vocabulary_review.push({
        id: `vocab-${topicId}`,
        type: "vocabulary_review",
        title: `Wortschatz: ${theme.titleDe}`,
        level,
        priority: 90 - i,
        reason: "vocabulary_mistakes",
        context: wordsToReviewLabel(n),
        href: `/vocab?tab=flash&topic=${topicId}`,
        mistakeCount: n,
      });
    });

  // C. Weak quiz results (latest result below 70%).
  stats
    .filter((s) => s.latestScorePct < 70)
    .sort((a, b) => a.latestScorePct - b.latestScorePct)
    .forEach((s, i) => {
      const theme = themeById(s.topicId);
      if (!theme) return;
      byType.weak_quiz.push({
        id: `quiz-${s.topicId}`,
        type: "weak_quiz",
        title: theme.titleDe,
        level,
        priority: 80 - i,
        reason: "low_quiz_score",
        context: "dashboard.recommendations.quizRepeat",
        isContextKey: true,
        contextParams: { pct: s.latestScorePct },
        href: `/vocab?tab=quiz&topic=${s.topicId}`,
        score: s.latestScorePct,
      });
    });

  // D. Next suitable lessons in the learner's level sequence.
  const levelIdx = Math.max(0, LEVELS.indexOf(level));
  const startedIds = new Set(byType.continue_lesson.map((r) => r.id));
  const pickNext = (lvl: Level) =>
    lessonIndex
      .filter(
        (l) =>
          l.level === lvl &&
          !completed.has(l.slug) &&
          !startedIds.has(l.slug) &&
          !exclude.has(l.slug),
      )
      .sort((a, b) => a.order - b.order);
  const nextLessons = pickNext(level).length
    ? pickNext(level)
    : LEVELS[levelIdx + 1]
      ? pickNext(LEVELS[levelIdx + 1])
      : [];
  nextLessons.slice(0, 4).forEach((l, i) => {
    byType.next_lesson.push({
      id: l.slug,
      type: "next_lesson",
      title: l.title,
      level: l.level,
      priority: 50 - i,
      reason: "next_in_sequence",
      context: i === 0 ? "dashboard.recommendations.nextLesson" : "dashboard.recommendations.recommendedLesson",
      isContextKey: true,
      href: `/lesson/${l.slug}`,
    });
  });

  // Review first: vocabulary and weak quizzes outrank linear course navigation,
  // which the Dashboard learning journey already covers.
  const order: RecommendationType[] = [
    "vocabulary_review",
    "weak_quiz",
    "continue_lesson",
    "next_lesson",
  ];
  const out: Recommendation[] = [];
  const usedIds = new Set<string>();
  const push = (r?: Recommendation) => {
    if (!r || usedIds.has(r.id) || out.length >= 4) return;
    usedIds.add(r.id);
    out.push(r);
  };
  order.forEach((t) => push(byType[t][0]));

  // Fill remaining slots only with genuinely different items (no fake problems):
  // extra personalized items first, generic next lessons last.
  if (out.length < 4) {
    order.forEach((t) => byType[t].slice(1).forEach((r) => t !== "next_lesson" && push(r)));
  }
  if (out.length < 4 && out.filter((r) => r.type === "next_lesson").length === 0) {
    byType.next_lesson.forEach((r) => push(r));
  }

  return out;
};
