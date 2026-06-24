import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { GraduationCap } from "lucide-react";
import { toast } from "sonner";

const Login = () => {
  const { login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await login(email || "olena@example.com", password);
    setLoading(false);
    toast.success("З поверненням! 👋");
    nav("/dashboard");
  };

  return (
    <div className="min-h-[80vh] grid place-items-center py-12 px-4 bg-gradient-hero">
      <Card className="w-full max-w-md p-8 rounded-2xl shadow-elevated border-0">
        <div className="flex justify-center mb-5">
          <div className="h-12 w-12 rounded-2xl bg-gradient-primary grid place-items-center">
            <GraduationCap className="h-6 w-6 text-primary-foreground" />
          </div>
        </div>
        <h1 className="font-display text-2xl font-extrabold text-center">З поверненням!</h1>
        <p className="text-center text-muted-foreground text-sm mt-1">Увійдіть, щоб продовжити навчання.</p>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="ви@example.com" className="mt-1.5" />
          </div>
          <div>
            <div className="flex items-center justify-between">
              <Label htmlFor="pw">Пароль</Label>
              <a href="#" className="text-xs text-primary hover:underline">Забули пароль?</a>
            </div>
            <Input id="pw" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="mt-1.5" />
          </div>
          <Button type="submit" disabled={loading} className="w-full bg-gradient-primary h-11">
            {loading ? "Вхід…" : "Увійти"}
          </Button>
        </form>

        <div className="mt-5 text-sm text-center text-muted-foreground">
          Ще немає акаунту? <Link to="/signup" className="text-primary font-semibold">Зареєструйтесь</Link>
        </div>
      </Card>
    </div>
  );
};

export default Login;
