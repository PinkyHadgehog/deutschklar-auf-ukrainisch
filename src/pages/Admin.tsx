import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, BookOpen, CreditCard, Plus } from "lucide-react";
import { toast } from "sonner";

const Admin = () => {
  const [lessons, setLessons] = useState([
    { id: 1, title: "Adjektivdeklination nach dem bestimmten Artikel", level: "B1", cat: "Adjektive" },
    { id: 2, title: "Perfekt mit sein und haben", level: "A2", cat: "Verben" },
    { id: 3, title: "Modalverben im Präsens", level: "A2", cat: "Verben" },
  ]);

  return (
    <div className="container py-10">
      <h1 className="font-display text-3xl md:text-4xl font-extrabold">Адмін-панель</h1>
      <p className="text-muted-foreground mt-1">Прев'ю: керування курсами, лекціями, квізами та користувачами.</p>

      <div className="mt-6 grid sm:grid-cols-3 gap-4">
        {[
          { i: Users, n: "1 248", l: "Користувачів", c: "bg-info-soft text-info" },
          { i: CreditCard, n: "382", l: "Активних підписок", c: "bg-primary-soft text-primary" },
          { i: BookOpen, n: "5 716", l: "Завершених лекцій", c: "bg-accent-soft text-accent-foreground" },
        ].map((s, i) => (
          <Card key={i} className="p-5 rounded-2xl border-0 shadow-soft">
            <div className={`h-10 w-10 rounded-xl ${s.c} grid place-items-center mb-3`}><s.i className="h-5 w-5"/></div>
            <div className="font-display text-3xl font-extrabold">{s.n}</div>
            <div className="text-sm text-muted-foreground">{s.l}</div>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="lessons" className="mt-8">
        <TabsList>
          <TabsTrigger value="lessons">Лекції</TabsTrigger>
          <TabsTrigger value="new">Нова лекція</TabsTrigger>
          <TabsTrigger value="users">Користувачі</TabsTrigger>
        </TabsList>

        <TabsContent value="lessons" className="mt-5">
          <Card className="rounded-2xl border-0 shadow-soft overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-secondary/60">
                <tr>
                  <th className="text-left p-3">ID</th>
                  <th className="text-left p-3">Назва</th>
                  <th className="text-left p-3">Рівень</th>
                  <th className="text-left p-3">Категорія</th>
                  <th className="p-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {lessons.map((l) => (
                  <tr key={l.id}>
                    <td className="p-3">#{l.id}</td>
                    <td className="p-3 font-medium">{l.title}</td>
                    <td className="p-3"><Badge variant="outline">{l.level}</Badge></td>
                    <td className="p-3 text-muted-foreground">{l.cat}</td>
                    <td className="p-3 text-right"><Button variant="ghost" size="sm">Редагувати</Button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </TabsContent>

        <TabsContent value="new" className="mt-5">
          <Card className="p-6 rounded-2xl border-0 shadow-soft max-w-2xl">
            <form onSubmit={(e) => { e.preventDefault(); toast.success("Лекцію створено"); }} className="space-y-4">
              <div>
                <Label>Назва (DE)</Label>
                <Input placeholder="z. B. Konjunktiv II" className="mt-1.5" />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label>Рівень</Label>
                  <select className="mt-1.5 h-10 w-full rounded-lg border border-input bg-background px-3 text-sm">
                    {["A1","A2","B1","B2","C1","C2"].map((l) => <option key={l}>{l}</option>)}
                  </select>
                </div>
                <div>
                  <Label>Категорія</Label>
                  <select className="mt-1.5 h-10 w-full rounded-lg border border-input bg-background px-3 text-sm">
                    <option>Verben</option><option>Adjektive</option><option>Substantive</option><option>Satzbau</option>
                  </select>
                </div>
              </div>
              <div>
                <Label>Пояснення (українською)</Label>
                <textarea className="mt-1.5 w-full min-h-[120px] rounded-lg border border-input bg-background p-3 text-sm" placeholder="Опишіть правило простою мовою…" />
              </div>
              <Button type="submit" className="bg-gradient-primary"><Plus className="h-4 w-4 mr-1"/> Створити лекцію</Button>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="mt-5">
          <Card className="rounded-2xl border-0 shadow-soft overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-secondary/60">
                <tr><th className="text-left p-3">Користувач</th><th className="text-left p-3">Email</th><th className="text-left p-3">Рівень</th><th className="text-left p-3">План</th></tr>
              </thead>
              <tbody className="divide-y">
                {[
                  { n: "Олена Коваль", e: "olena@example.com", lvl: "A2", p: "plus" },
                  { n: "Марʼяна Кравченко", e: "mariana@example.com", lvl: "B1", p: "premium" },
                  { n: "Андрій Шевченко", e: "andriy@example.com", lvl: "A1", p: "free" },
                ].map((u, i) => (
                  <tr key={i}>
                    <td className="p-3 font-medium">{u.n}</td>
                    <td className="p-3 text-muted-foreground">{u.e}</td>
                    <td className="p-3"><Badge variant="outline">{u.lvl}</Badge></td>
                    <td className="p-3 capitalize">{u.p}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;
