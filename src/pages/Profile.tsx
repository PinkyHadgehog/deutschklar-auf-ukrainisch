import { Navigate, Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";
import { useLang } from "@/context/LanguageContext";
import WeeklyGoalCard from "@/components/profile/WeeklyGoalCard";
import { Trophy, LogOut, Heart, CreditCard } from "lucide-react";
import { toast } from "sonner";

const Profile = () => {
  const { user, logout, updateUser } = useAuth();
  const { lang, setLang } = useLang();
  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="container max-w-4xl py-10">
      <h1 className="font-display text-3xl md:text-4xl font-extrabold">Профіль</h1>
      <p className="text-muted-foreground mt-1">Керуй акаунтом, підпискою та налаштуваннями.</p>

      <div className="mt-8 grid md:grid-cols-3 gap-5">
        <Card className="p-6 rounded-2xl border-0 shadow-soft md:col-span-2">
          <div className="font-display font-bold mb-4">Особисті дані</div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label>Ім'я</Label>
              <Input className="mt-1.5" defaultValue={user.name} onBlur={(e) => updateUser({ name: e.target.value })} />
            </div>
            <div>
              <Label>Email</Label>
              <Input className="mt-1.5" defaultValue={user.email} disabled />
            </div>
            <div>
              <Label>Поточний рівень</Label>
              <div className="mt-1.5 flex gap-1.5">
                {(["A1","A2","B1","B2","C1","C2"] as const).map((l) => (
                  <button key={l} onClick={() => updateUser({ level: l })}
                    className={`h-9 w-12 rounded-lg text-sm font-semibold border ${user.level === l ? "bg-gradient-primary text-primary-foreground border-transparent" : "hover:bg-muted"}`}>{l}</button>
                ))}
              </div>
            </div>
            <div>
              <Label>Денна ціль (хв)</Label>
              <Input type="number" className="mt-1.5" defaultValue={user.goalMinutes} onBlur={(e) => updateUser({ goalMinutes: Number(e.target.value) })} />
            </div>
          </div>
          <Button className="mt-5 bg-gradient-primary" onClick={() => toast.success("Збережено")}>Зберегти</Button>
        </Card>

        <Card className="p-6 rounded-2xl border-0 shadow-soft">
          <div className="font-display font-bold mb-4">Мова інтерфейсу</div>
          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => setLang("uk")} className={`p-3 rounded-xl border-2 text-sm font-semibold ${lang === "uk" ? "border-primary bg-primary-soft" : "border-border"}`}>🇺🇦 Українська</button>
            <button onClick={() => setLang("de")} className={`p-3 rounded-xl border-2 text-sm font-semibold ${lang === "de" ? "border-primary bg-primary-soft" : "border-border"}`}>🇩🇪 Deutsch</button>
          </div>

          <div className="mt-6 font-display font-bold mb-3">Пройдені лекції</div>
          <div className="space-y-2 max-h-64 overflow-auto pr-1">
            {user.completedLessons.length === 0 && (
              <div className="text-sm text-muted-foreground">Ще немає завершених лекцій. Завершіть першу — і вона з'явиться тут.</div>
            )}
            {user.completedLessons.map((l) => (
              <Link key={l.slug + l.completedAt} to={`/lesson/${l.slug}`} className="flex items-center gap-2 p-2.5 rounded-lg bg-accent-soft text-sm hover:bg-accent-soft/70 transition">
                <Trophy className="h-4 w-4 text-accent-foreground shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{l.title}</div>
                  <div className="text-xs text-muted-foreground">{l.level} · {new Date(l.completedAt).toLocaleDateString("uk-UA")} · +{l.points}</div>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-4 text-xs text-muted-foreground">Усього балів: <span className="font-bold text-foreground">{user.points}</span></div>
        </Card>

        <Card className="p-6 rounded-2xl border-0 shadow-soft md:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div className="font-display font-bold flex items-center gap-2"><CreditCard className="h-4 w-4 text-primary"/> Підписка</div>
            <Badge className="bg-primary text-primary-foreground capitalize">{user.plan}</Badge>
          </div>
          <div className="grid sm:grid-cols-3 gap-3 text-sm">
            <div className="p-3 rounded-xl bg-secondary/60"><div className="text-muted-foreground text-xs">Поточний план</div><div className="font-semibold capitalize">Klar {user.plan === "free" ? "Free" : user.plan}</div></div>
            <div className="p-3 rounded-xl bg-secondary/60"><div className="text-muted-foreground text-xs">Наступна оплата</div><div className="font-semibold">24.07.2026</div></div>
            <div className="p-3 rounded-xl bg-secondary/60"><div className="text-muted-foreground text-xs">Метод оплати</div><div className="font-semibold">•••• 4242</div></div>
          </div>
          <div className="mt-4 flex gap-2 flex-wrap">
            <Button asChild variant="outline"><Link to="/pricing">Змінити план</Link></Button>
            <Button variant="ghost" onClick={() => toast("Підписку скасовано — доступ до 24.07.2026")}>Скасувати підписку</Button>
          </div>
        </Card>

        <Card className="p-6 rounded-2xl border-0 shadow-soft">
          <div className="font-display font-bold mb-3 flex items-center gap-2"><Heart className="h-4 w-4 text-destructive"/> Обране</div>
          <div className="text-sm text-muted-foreground">Слова, лекції та теми, які ви зберегли, з'являться тут.</div>

          <Button variant="ghost" onClick={logout} className="mt-6 w-full text-destructive hover:text-destructive">
            <LogOut className="h-4 w-4 mr-1.5"/> Вийти
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
