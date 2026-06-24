import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export interface User {
  id: string;
  name: string;
  email: string;
  level: "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
  plan: "free" | "plus" | "premium";
  goalMinutes: number;
  streak: number;
  joinedAt: string;
}

interface Ctx {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, level: User["level"]) => Promise<void>;
  logout: () => void;
  updateUser: (patch: Partial<User>) => void;
}

const KEY = "dk_user";
const AuthContext = createContext<Ctx | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem(KEY);
    if (raw) setUser(JSON.parse(raw));
  }, []);

  const persist = (u: User | null) => {
    setUser(u);
    if (u) localStorage.setItem(KEY, JSON.stringify(u));
    else localStorage.removeItem(KEY);
  };

  const login = async (email: string, _password: string) => {
    const u: User = {
      id: "u_1",
      name: email.split("@")[0] || "Олена",
      email,
      level: "A2",
      plan: "plus",
      goalMinutes: 20,
      streak: 7,
      joinedAt: new Date().toISOString(),
    };
    persist(u);
  };

  const signup = async (name: string, email: string, _password: string, level: User["level"]) => {
    const u: User = {
      id: "u_1",
      name,
      email,
      level,
      plan: "free",
      goalMinutes: 15,
      streak: 1,
      joinedAt: new Date().toISOString(),
    };
    persist(u);
  };

  const logout = () => persist(null);
  const updateUser = (patch: Partial<User>) => user && persist({ ...user, ...patch });

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const c = useContext(AuthContext);
  if (!c) throw new Error("useAuth outside provider");
  return c;
};
