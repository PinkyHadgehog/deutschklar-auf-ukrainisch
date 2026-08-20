import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Compass, Clock, Layers, Gift, ArrowRight } from "lucide-react";
import { PLACEMENT_TEST_ROUTE, PLACEMENT_EVENTS, trackPlacementEvent } from "@/components/placement/placement";

const infos = [
  { icon: Clock, label: "≈ 10–15 хв" },
  { icon: Layers, label: "A1–C2" },
  { icon: Gift, label: "Безкоштовно" },
];

const PlacementIntro = () => (
  <div className="container max-w-3xl py-14 md:py-20">
    <Card className="p-8 md:p-12 rounded-3xl border-0 shadow-elevated text-center">
      <div className="h-16 w-16 rounded-2xl bg-gradient-primary grid place-items-center mx-auto mb-5">
        <Compass className="h-8 w-8 text-primary-foreground" />
      </div>
      <h1 className="font-display text-3xl md:text-4xl font-extrabold">Визнач свій рівень німецької</h1>
      <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
        Короткий адаптивний тест допоможе визначити твій орієнтовний рівень за шкалою CEFR A1–C2.
      </p>

      <div className="mt-8 grid sm:grid-cols-3 gap-3">
        {infos.map((i) => (
          <div key={i.label} className="rounded-xl bg-primary-soft/60 p-4 flex items-center justify-center gap-2">
            <i.icon className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold">{i.label}</span>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button
          asChild
          size="lg"
          className="bg-gradient-primary hover:opacity-95 shadow-elevated h-12 px-7"
          onClick={() => trackPlacementEvent(PLACEMENT_EVENTS.started, { source: "placement_intro" })}
        >
          <Link to={PLACEMENT_TEST_ROUTE}>Почати тест <ArrowRight className="ml-1.5 h-4 w-4" /></Link>
        </Button>
        <Button asChild size="lg" variant="outline" className="h-12 px-7">
          <Link to="/">Повернутися на головну</Link>
        </Button>
      </div>

      <p className="text-xs text-muted-foreground mt-6 max-w-lg mx-auto">
        Результат — орієнтовна рекомендація за міжнародною шкалою CEFR / GER, а не офіційний мовний сертифікат.
      </p>
    </Card>
  </div>
);

export default PlacementIntro;
