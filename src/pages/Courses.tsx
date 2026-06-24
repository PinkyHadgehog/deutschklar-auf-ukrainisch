import { useState } from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { courses } from "@/data/mock";
import { Lock, ArrowRight } from "lucide-react";

const Courses = () => {
  const [level, setLevel] = useState<string>("all");
  const filtered = level === "all" ? courses : courses.filter((c) => c.level === level);

  return (
    <div className="container py-10 md:py-14">
      <div className="max-w-3xl">
        <h1 className="font-display text-3xl md:text-4xl font-extrabold">Курси за рівнями</h1>
        <p className="text-muted-foreground mt-2">Структуровані програми від A1 до C2. Обирай рівень — і вчись послідовно.</p>
      </div>

      <div className="mt-7 flex flex-wrap gap-2">
        {["all", "A1", "A2", "B1", "B2", "C1", "C2"].map((l) => (
          <button key={l} onClick={() => setLevel(l)}
            className={`px-4 h-9 rounded-full text-sm font-semibold border transition ${
              level === l ? "bg-gradient-primary text-primary-foreground border-transparent" : "bg-background hover:bg-muted border-input"
            }`}>
            {l === "all" ? "Усі рівні" : l}
          </button>
        ))}
      </div>

      <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((c) => (
          <Card key={c.level} className="p-6 rounded-2xl border-0 shadow-soft group hover:-translate-y-1 transition relative overflow-hidden">
            {c.premium && (
              <Badge className="absolute top-4 right-4 bg-accent text-accent-foreground gap-1"><Lock className="h-3 w-3"/> Premium</Badge>
            )}
            <div className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${c.color} grid place-items-center text-white font-display font-extrabold text-2xl mb-4 shadow-soft`}>{c.level}</div>
            <h3 className="font-display font-bold text-xl">{c.title}</h3>
            <p className="text-sm text-muted-foreground mt-1.5">{c.description}</p>
            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{c.lessons} лекцій</span>
              <span className="font-semibold text-primary">{c.progress}%</span>
            </div>
            <Progress value={c.progress} className="h-1.5 mt-2" />
            <Button asChild variant="outline" className="w-full mt-5">
              <Link to="/grammar">{c.progress > 0 ? "Продовжити" : "Почати"} <ArrowRight className="ml-1.5 h-4 w-4" /></Link>
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Courses;
