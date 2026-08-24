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
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, level: User["level"]) => Promise<void>;
  logout: () => void;
  updateUser: (patch: Partial<User>) => void;
  completeLesson: (lesson: Omit<CompletedLesson, "completedAt">) => CompletedLesson;
  isLessonCompleted: (slug: string) => boolean;
}

const KEY = "dk_user";
const AuthContext = createContext<Ctx | null>(null);

const normalize = (u: User): User => ({
  ...u,
  completedLessons: u.completedLessons ?? [],
  points: u.points ?? 0,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Hydrate synchronously so gated routes (/saved, /profile) don't bounce to /login on refresh.
  const [user, setUser] = useState<User | null>(() => {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? normalize(JSON.parse(raw)) : null;
    } catch (error) {
      console.error("Could not load user", error);
      return null;
    }
  });


  const persist = (u: User | null) => {
    setUser(u);
    if (u) localStorage.setItem(KEY, JSON.stringify(u));
    else localStorage.removeItem(KEY);
  };

  const login = async (email: string, _password: string) => {
    persist({
      id: "u_1",
      name: email.split("@")[0] || "Олена",
      email,
      level: "A2",
      plan: "plus",
      goalMinutes: 20,
      streak: 7,
      joinedAt: new Date().toISOString(),
      completedLessons: [],
      points: 0,
    });
  };

  const signup = async (name: string, email: string, _password: string, level: User["level"]) => {
    persist({
      id: "u_1",
      name,
      email,
      level,
      plan: "free",
      goalMinutes: 15,
      streak: 1,
      joinedAt: new Date().toISOString(),
      completedLessons: [],
      points: 0,
    });
  };

  const logout = () => persist(null);
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
    <AuthContext.Provider value={{ user, login, signup, logout, updateUser, completeLesson, isLessonCompleted }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const c = useContext(AuthContext);
  if (!c) throw new Error("useAuth outside provider");
  return c;
};
