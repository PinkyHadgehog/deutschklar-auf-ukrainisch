/** Single source of truth for the placement-test funnel. */
export const PLACEMENT_ROUTE = "/placement-test";
export const PLACEMENT_TEST_ROUTE = "/test";

/** Analytics-ready event names (no provider wired yet). */
export const PLACEMENT_EVENTS = {
  ctaClicked: "placement_test_cta_clicked",
  started: "placement_test_started",
  completed: "placement_test_completed",
  resultViewed: "placement_result_viewed",
  recommendedCourseClicked: "recommended_course_clicked",
} as const;

export type PlacementEvent = (typeof PLACEMENT_EVENTS)[keyof typeof PLACEMENT_EVENTS];

/** Placeholder tracker — later replaced by a real analytics provider. */
export const trackPlacementEvent = (event: PlacementEvent, payload?: Record<string, unknown>) => {
  if (typeof window === "undefined") return;
  (window as unknown as { __placementEvents?: unknown[] }).__placementEvents ??= [];
  (window as unknown as { __placementEvents: unknown[] }).__placementEvents.push({ event, payload, ts: Date.now() });
};

export const PLACEMENT_META = "10–15 хв · A1–C2 · персональна рекомендація";
export const PLACEMENT_META_SHORT = "CEFR A1–C2 · приблизно 10–15 хв";
