import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Check } from "lucide-react";
import { plans } from "@/data/mock";
import { Link } from "react-router-dom";

const Pricing = () => {
  const [yearly, setYearly] = useState(false);
  return (
    <div className="container py-14">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="font-display text-3xl md:text-5xl font-extrabold">Прості тарифи. Без сюрпризів.</h1>
        <p className="text-muted-foreground mt-3">Перший тиждень — безкоштовно. Скасувати можна будь-коли.</p>
        <div className="mt-6 inline-flex items-center gap-3 p-1.5 rounded-full bg-secondary">
          <span className={`px-4 py-1.5 text-sm font-semibold rounded-full ${!yearly ? "bg-background shadow-sm" : "text-muted-foreground"}`}>Щомісяця</span>
          <Switch checked={yearly} onCheckedChange={setYearly} />
          <span className={`px-4 py-1.5 text-sm font-semibold rounded-full ${yearly ? "bg-background shadow-sm" : "text-muted-foreground"}`}>
            Щороку <Badge className="ml-1 bg-accent text-accent-foreground">−20%</Badge>
          </span>
        </div>
      </div>

      <div className="mt-12 grid md:grid-cols-3 gap-5 max-w-5xl mx-auto">
        {plans.map((p) => {
          const price = yearly ? (p.priceY / 12) : p.priceM;
          return (
            <Card key={p.id} className={`p-7 rounded-2xl border-0 relative ${p.highlight ? "bg-gradient-primary text-primary-foreground shadow-elevated md:-translate-y-3" : "shadow-soft"}`}>
              {p.highlight && <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground">Рекомендовано</Badge>}
              <div className="font-display font-extrabold text-2xl">{p.name}</div>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-5xl font-extrabold">{price === 0 ? "0 €" : `${price.toFixed(2)} €`}</span>
                <span className={`text-sm ${p.highlight ? "opacity-80" : "text-muted-foreground"}`}>/міс</span>
              </div>
              {yearly && p.priceY > 0 && (
                <div className={`text-xs mt-1 ${p.highlight ? "opacity-80" : "text-muted-foreground"}`}>Оплачується щорічно — {p.priceY} €</div>
              )}
              <ul className="mt-6 space-y-2.5 text-sm">
                {p.features.map((f) => (
                  <li key={f} className="flex gap-2"><Check className={`h-4 w-4 mt-0.5 shrink-0 ${p.highlight ? "" : "text-success"}`}/>{f}</li>
                ))}
              </ul>
              <Button asChild className={`w-full mt-7 h-11 ${p.highlight ? "bg-background text-primary hover:bg-background/90" : "bg-gradient-primary"}`}>
                <Link to="/signup">{p.id === "free" ? "Почати безкоштовно" : "7 днів безкоштовно"}</Link>
              </Button>
            </Card>
          );
        })}
      </div>

      <div className="text-center text-xs text-muted-foreground mt-8">
        Ціни вказані в євро з урахуванням ПДВ. Підтримуються Visa, Mastercard, SEPA, PayPal, Apple Pay, Google Pay.
      </div>
    </div>
  );
};

export default Pricing;
