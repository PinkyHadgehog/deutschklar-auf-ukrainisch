import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { useLang } from "@/context/LanguageContext";
import { GraduationCap } from "lucide-react";
import { toast } from "sonner";

const levels = ["A1", "A2", "B1", "B2", "C1", "C2"] as const;

const Signup = () => {
  const { signup } = useAuth();
  const { t } = useLang();
  const nav = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [level, setLevel] = useState<typeof levels[number]>("A1");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    await signup(name || t("auth.signup.namePlaceholder"), email || "olena@example.com", password, level);
    toast.success(t("auth.signup.successToast"));
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
        <h1 className="font-display text-2xl font-extrabold text-center">{t("auth.signup.title")}</h1>
        <p className="text-center text-muted-foreground text-sm mt-1">{t("auth.signup.subtitle")}</p>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <div>
            <Label htmlFor="name">{t("auth.signup.name")}</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder={t("auth.signup.namePlaceholder")} className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="email">{t("auth.signup.email")}</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t("auth.signup.emailPlaceholder")} className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="pw">{t("auth.signup.password")}</Label>
            <Input id="pw" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder={t("auth.signup.passwordPlaceholder")} className="mt-1.5" />
          </div>
          <div>
            <Label>{t("auth.signup.levelLabel")}</Label>
            <div className="grid grid-cols-6 gap-1.5 mt-1.5">
              {levels.map((l) => (
                <button type="button" key={l}
                  onClick={() => setLevel(l)}
                  className={`h-10 rounded-lg text-sm font-semibold border transition ${
                    level === l ? "bg-gradient-primary text-primary-foreground border-transparent" : "bg-background hover:bg-muted border-input"
                  }`}>{l}</button>
              ))}
            </div>
            <Link to="/test" className="text-xs text-primary hover:underline mt-2 inline-block">{t("auth.signup.dontKnowLevel")}</Link>
          </div>
          <Button type="submit" className="w-full bg-gradient-primary h-11">{t("auth.signup.submit")}</Button>
        </form>

        <div className="mt-5 text-sm text-center text-muted-foreground">
          {t("auth.signup.haveAccount")} <Link to="/login" className="text-primary font-semibold">{t("auth.signup.loginLink")}</Link>
        </div>
      </Card>
    </div>
  );
};

export default Signup;
