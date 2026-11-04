import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

// --------------------------------------------------
// TYPES
// --------------------------------------------------

export interface CompletedLesson {
  slug: string;
  title: string;
  level: "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
  completedAt: string;
  points: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  level: "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
  plan: "free" | "plus" | "premium";
  goalMinutes: number;
  streak: number;
  joinedAt: string;
  completedLessons: CompletedLesson[];
  points: number;
}

interface Ctx {
  user: User | null;
  accessToken: string | null;

  login: (email: string, password: string) => Promise<void>;

  signup: (
    name: string,
    email: string,
    password: string,
    level: User["level"]
  ) => Promise<void>;

  logout: () => Promise<void>;

  updateUser: (patch: Partial<User>) => void;

  completeLesson: (
    lesson: Omit<CompletedLesson, "completedAt">
  ) => CompletedLesson;

  isLessonCompleted: (slug: string) => boolean;
}

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const AuthContext = createContext<Ctx | null>(null);

// --------------------------------------------------
// AUTH PROVIDER
// --------------------------------------------------

export const AuthProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [user, setUser] = useState<User | null>(null);

  const [accessToken, setAccessToken] = useState<
    string | null
  >(null);

  const [isAuthLoading, setIsAuthLoading] = useState(true);

  const restoreAttempted = useRef(false);

  const persist = (u: User | null) => {
    setUser(u);
  };

  // --------------------------------------------------
  // 1. SESSION RESTORE
  // --------------------------------------------------

  useEffect(() => {
    if (restoreAttempted.current) return;

    restoreAttempted.current = true;

    const restoreSession = async () => {
      try {
        // Refresh-Cookie an FastAPI senden
        const response = await fetch(
          `${API_URL}/auth/refresh`,
          {
            method: "POST",
            credentials: "include",
          }
        );

        // Kein gültiges Cookie vorhanden
        if (!response.ok) {
          if (response.status !== 401) {
            console.error(
              "Session refresh failed:",
              response.status
            );
          }

          return;
        }

        // Neuen Access Token auslesen
        const data = await response.json();
        const token: string = data.access_token;

        // Nutzerprofil aus PostgreSQL laden
        const profileResponse = await fetch(
          `${API_URL}/users/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!profileResponse.ok) {
          throw new Error(
            "Nutzerprofil konnte nicht geladen werden"
          );
        }

        const profile = await profileResponse.json();

        // Nutzer im React-State wiederherstellen
        setUser({
          id: String(profile.id),
          name: profile.name,
          email: profile.email,


          // Gespeichertes Sprachniveau aus PostgreSQL
          level: profile.level,

          plan: "free",
          goalMinutes: 20,
          streak: 0,
          joinedAt: profile.created_at,
          completedLessons: [],
          points: 0,
        });

        // JWT im React-State speichern
        setAccessToken(token);
      } catch (error) {
        console.error(
          "Fehler bei der Sitzungswiederherstellung:",
          error
        );
      } finally {
        // Authentifizierungsprüfung abschließen
        setIsAuthLoading(false);
      }
    };

    void restoreSession();
  }, []);

  // --------------------------------------------------
  // 2. LOGIN
  // --------------------------------------------------

  const login = async (
    email: string,
    password: string
  ): Promise<void> => {
    // Zugangsdaten an FastAPI senden
    const response = await fetch(
      `${API_URL}/login`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(
        "Ungültige E-Mail oder Passwort"
      );
    }

    // JWT aus der Backend-Antwort lesen
    const data = await response.json();
    const token: string = data.access_token;

    // Nutzerprofil mit JWT abrufen
    const profileResponse = await fetch(
      `${API_URL}/users/me`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!profileResponse.ok) {
      throw new Error(
        "Nutzerprofil konnte nicht geladen werden"
      );
    }

    const profile = await profileResponse.json();

    // Authentifizierten Nutzer speichern
    persist({
      id: String(profile.id),
      name: profile.name,
      email: profile.email,

      // Gespeichertes Sprachniveau aus PostgreSQL
      level: profile.level,

      plan: "free",
      goalMinutes: 20,
      streak: 0,
      joinedAt: profile.created_at,
      completedLessons: [],
      points: 0,
    });

    // JWT für geschützte API-Anfragen speichern
    setAccessToken(token);
  };

  // --------------------------------------------------
  // 3. SIGNUP
  // --------------------------------------------------

  const signup = async (
    name: string,
    email: string,
    password: string,
    level: User["level"]
  ): Promise<void> => {
    // Nutzer in PostgreSQL anlegen
    const response = await fetch(
      `${API_URL}/users`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          name,
          email,
          password,
          level,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Registration failed");
    }

    // Nach erfolgreicher Registrierung
    // automatisch anmelden
    await login(email, password);
  };

  // --------------------------------------------------
  // 4. LOGOUT
  // --------------------------------------------------

  const logout = async (): Promise<void> => {
    // Refresh-Session im Backend beenden
    const response = await fetch(
      `${API_URL}/auth/logout`,
      {
        method: "POST",
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error(
        `Logout fehlgeschlagen: HTTP ${response.status}`
      );
    }

    // JWT aus dem React-State entfernen
    setAccessToken(null);

    // Nutzerprofil aus dem React-State entfernen
    persist(null);
  };

  // --------------------------------------------------
  // 5. UPDATE USER
  // --------------------------------------------------

  const updateUser = (patch: Partial<User>) => {
    if (!user) return;

    persist({
      ...user,
      ...patch,
    });
  };

  // --------------------------------------------------
  // 6. COMPLETE LESSON
  // --------------------------------------------------

  const completeLesson: Ctx["completeLesson"] = (
    lesson
  ) => {
    const entry: CompletedLesson = {
      ...lesson,
      completedAt: new Date().toISOString(),
    };

    if (!user) return entry;

    const existingIdx = user.completedLessons.findIndex(
      (l) => l.slug === lesson.slug
    );

    const alreadyDone = existingIdx >= 0;

    const completedLessons = alreadyDone
      ? user.completedLessons.map((l, i) =>
          i === existingIdx ? entry : l
        )
      : [entry, ...user.completedLessons];

    // Keine doppelten Punkte für dieselbe Lektion
    const points = alreadyDone
      ? user.points
      : user.points + lesson.points;

    persist({
      ...user,
      completedLessons,
      points,
    });

    return entry;
  };

  // --------------------------------------------------
  // 7. CHECK LESSON COMPLETION
  // --------------------------------------------------

  const isLessonCompleted = (
    slug: string
  ): boolean => {
    return !!user?.completedLessons.some(
      (lesson) => lesson.slug === slug
    );
  };

  // --------------------------------------------------
  // 8. AUTH LOADING
  // --------------------------------------------------

  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Anmeldung wird geprüft…
      </div>
    );
  }

  // --------------------------------------------------
  // 9. AUTH CONTEXT PROVIDER
  // --------------------------------------------------

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        login,
        signup,
        logout,
        updateUser,
        completeLesson,
        isLessonCompleted,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// --------------------------------------------------
// 10. USE AUTH HOOK
// --------------------------------------------------

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth outside provider");
  }

  return context;
};
