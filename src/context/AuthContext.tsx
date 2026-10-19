import { createContext, useContext, useState, ReactNode } from "react";

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
  signup: (name: string, email: string, password: string, level: User["level"]) => Promise<void>;
  logout: () => void;
  updateUser: (patch: Partial<User>) => void;
  completeLesson: (lesson: Omit<CompletedLesson, "completedAt">) => CompletedLesson;
  isLessonCompleted: (slug: string) => boolean;
}

const KEY = "dk_user";
const AuthContext = createContext<Ctx | null>(null);


export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Nutzer ist beim Laden der Anwendung zunächst nicht angemeldet.
  const [user, setUser] = useState<User | null>(null);

  // Speichert das JWT für authentifizierte API-Anfragen
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const persist = (u: User | null) => {
    setUser(u);
  };

const login = async (email: string, password: string) => {
  // 1. Zugangsdaten an FastAPI senden
  const response = await fetch("http://127.0.0.1:8000/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error("Ungültige E-Mail oder Passwort");
  }

  // 2. JWT aus der Backend-Antwort lesen
  const data = await response.json();
  const token: string = data.access_token;

  // 3. Nutzerprofil mit JWT abrufen
  const profileResponse = await fetch("http://127.0.0.1:8000/users/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!profileResponse.ok) {
    throw new Error("Nutzerprofil konnte nicht geladen werden");
  }

  const profile = await profileResponse.json();

  // 4. Nutzer mit echten Backend-Daten im React-State speichern
  persist({
    id: String(profile.id),
    name: profile.name,
    email: profile.email,
    level: "A2",
    plan: "free",
    goalMinutes: 20,
    streak: 0,
    joinedAt: profile.created_at,
    completedLessons: [],
    points: 0,
  });

  // JWT nach erfolgreichem Login im React-State speichern
setAccessToken(token);
};

const signup = async (
  name: string,
  email: string,
  password: string,
  level: User["level"]
) => {
  const response = await fetch("http://127.0.0.1:8000/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      email,
      password,
    }),
  });

  if (!response.ok) {
    throw new Error("Registration failed");
  }

  const createdUser = await response.json();

  persist({
    id: String(createdUser.id),
    name: createdUser.name,
    email: createdUser.email,
    level,
    plan: "free",
    goalMinutes: 15,
    streak: 1,
    joinedAt: createdUser.created_at,
    completedLessons: [],
    points: 0,
  });
};

  
  const logout = () => {
      //entfernt das JWT aus dem React-State
      setAccessToken(null);
      //entfernt die Nutzerdaten aus dem React-State und aus localStorage.
      persist(null);
  };
  const updateUser = (patch: Partial<User>) => user && persist({ ...user, ...patch });

  const completeLesson: Ctx["completeLesson"] = (lesson) => {
    const entry: CompletedLesson = { ...lesson, completedAt: new Date().toISOString() };
    if (!user) return entry;
    const existingIdx = user.completedLessons.findIndex((l) => l.slug === lesson.slug);
    const alreadyDone = existingIdx >= 0;
    const completedLessons = alreadyDone
      ? user.completedLessons.map((l, i) => (i === existingIdx ? entry : l))
      : [entry, ...user.completedLessons];
    const points = alreadyDone ? user.points : user.points + lesson.points;
    persist({ ...user, completedLessons, points });
    return entry;
  };

  const isLessonCompleted = (slug: string) =>
    !!user?.completedLessons.some((l) => l.slug === slug);

  return (
    <AuthContext.Provider value={{ user, accessToken, login, signup, logout, updateUser, completeLesson, isLessonCompleted }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const c = useContext(AuthContext);
  if (!c) throw new Error("useAuth outside provider");
  return c;
};
