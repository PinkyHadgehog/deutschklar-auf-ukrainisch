/**
 * Zentrale API-Schicht für den Lektionsfortschritt.
 * PostgreSQL ist die maßgebliche Datenquelle.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
  || "http://127.0.0.1:8000";


export type BackendLessonStatus =
  | "not_started"
  | "in_progress"
  | "completed";

export interface BackendLessonProgress {
  lesson_id: number;
  slug: string;
  status: BackendLessonStatus;
  progress_percent: number;
  started_at: string | null;
  completed_at: string | null;
}


/**
 * Ruft den gespeicherten Lektionsfortschritt
 * des angemeldeten Nutzers über FastAPI ab.
 */
export const getLessonProgress = async (
  slug: string,
  token: string
): Promise<BackendLessonProgress> => {

  const response = await fetch(
    `${API_BASE_URL}/lesson-progress/by-slug/${encodeURIComponent(slug)}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    }
  );

  // Fehler vom Backend behandeln
  if (!response.ok) {
    throw new Error(
      `Failed to load lesson progress: ${response.status}`
    );
  }

  // JSON-Antwort von FastAPI zurückgeben
  return (await response.json()) as BackendLessonProgress;
};



/**
 * Startet eine Lektion für den angemeldeten Nutzer.
 * Der Fortschritt wird in PostgreSQL gespeichert.
 */
export const startLesson = async (
  slug: string,
  token: string
): Promise<void> => {
  const response = await fetch(
    `${API_BASE_URL}/lesson-progress/start`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ slug }),
    }
  );

  if (!response.ok) {
    throw new Error(
      `Failed to start lesson: ${response.status}`
    );
  }

  const data = await response.json();

  if (data.status !== "in_progress" || data.progress_percent !== 25) {
    throw new Error("Lesson was not started");
  }
};



/**
 * Setzt eine begonnene Lektion auf 0 % zurück.
 * Der neue Status wird in PostgreSQL gespeichert.
 */
export const resetLesson = async (
  slug: string,
  token: string
): Promise<void> => {
  const response = await fetch(
    `${API_BASE_URL}/lesson-progress/reset`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ slug }),
    }
  );

  if (!response.ok) {
    throw new Error(
      `Failed to reset lesson: ${response.status}`
    );
  }

  const data = await response.json();

  if (
    data.status !== "not_started" ||
    data.progress_percent !== 0
  ) {
    throw new Error("Lesson was not reset");
  }
};



/**
 * Schließt eine begonnene Lektion ab.
 * Der Abschluss wird dauerhaft in PostgreSQL gespeichert.
 */
export const completeLessonProgress = async (
  slug: string,
  token: string
): Promise<void> => {
  const response = await fetch(
    `${API_BASE_URL}/lesson-progress/complete`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ slug }),
    }
  );

  if (!response.ok) {
    throw new Error(
      `Failed to complete lesson: ${response.status}`
    );
  }

  const data = await response.json();

  if (
    data.status !== "completed" ||
    data.progress_percent !== 100
  ) {
    throw new Error("Lesson was not completed");
  }
};


/**
 * Ruft alle Lektionsfortschritte des angemeldeten
 * Nutzers über FastAPI aus PostgreSQL ab.
 */
export const getAllLessonProgressFromApi = async (
  token: string
): Promise<BackendLessonProgress[]> => {
  const response = await fetch(
    `${API_BASE_URL}/lesson-progress`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      `Failed to load lesson progress: ${response.status}`
    );
  }

  const data: unknown = await response.json();

  // Die Antwort muss eine Liste sein
  if (!Array.isArray(data)) {
    throw new Error("Invalid lesson progress response");
  }

  return data as BackendLessonProgress[];
};



