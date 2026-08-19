import { useEffect } from "react";
import { registerStudyClaim, type StudyActivityType } from "@/lib/studyTime";

/**
 * Registers this screen as an active learning area while mounted.
 * Higher `priority` wins when several claims overlap (e.g. lesson_exercises
 * takes over from lesson), so only one timer ever runs.
 */
export const useStudySession = (
  type: StudyActivityType,
  sourceId: string,
  options: { enabled?: boolean; priority?: number } = {}
) => {
  const { enabled = true, priority = 0 } = options;
  useEffect(() => {
    if (!enabled || !sourceId) return;
    return registerStudyClaim(type, sourceId, priority);
  }, [type, sourceId, enabled, priority]);
};
