import { Link, useParams } from "react-router-dom";
const Legal = () => {
  const { kind } = useParams();
  const isImp = kind === "impressum";
  return (
    <div className="container max-w-3xl py-14 prose prose-slate">
      <h1 className="font-display text-3xl font-extrabold">{isImp ? "Impressum" : "Datenschutz"}</h1>
      <p className="text-muted-foreground">
        {isImp
          ? "deutsch.klar mit Oksi · Musterstraße 1, 10115 Berlin · Kontakt: hi@deutschklar.app"
          : "Ми поважаємо вашу приватність. Дані використовуються лише для роботи платформи та персоналізації навчання."}
      </p>
      <p className="mt-4"><Link to="/" className="text-primary">← На головну</Link></p>
    </div>
  );
};
export default Legal;
