import { Link } from "react-router-dom";
import { Instagram, Youtube, GraduationCap } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="mt-24 border-t border-border bg-secondary/40">
      <div className="container py-12 grid gap-10 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-primary">
              <GraduationCap className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="font-display font-extrabold text-lg">deutsch<span className="text-primary">.</span>klar</div>
          </div>
          <p className="text-sm text-muted-foreground max-w-xs">
            Платформа для системного вивчення німецької українською — від A1 до C2.
          </p>
          <div className="flex gap-3 mt-4">
            <a href="#" aria-label="Instagram" className="h-9 w-9 grid place-items-center rounded-full bg-background border hover:text-primary hover:border-primary transition">
              <Instagram className="h-4 w-4" />
            </a>
            <a href="#" aria-label="YouTube" className="h-9 w-9 grid place-items-center rounded-full bg-background border hover:text-primary hover:border-primary transition">
              <Youtube className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div>
          <div className="font-semibold mb-3">Платформа</div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/courses" className="hover:text-foreground">Курси</Link></li>
            <li><Link to="/grammar" className="hover:text-foreground">Граматика</Link></li>
            <li><Link to="/vocab" className="hover:text-foreground">Словник</Link></li>
            <li><Link to="/test" className="hover:text-foreground">Тест на рівень</Link></li>
            <li><Link to="/pricing" className="hover:text-foreground">Тарифи</Link></li>
          </ul>
        </div>

        <div>
          <div className="font-semibold mb-3">Допомога</div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><a href="#faq" className="hover:text-foreground">Часті питання</a></li>
            <li><a href="mailto:hi@deutschklar.app" className="hover:text-foreground">Контакт</a></li>
            <li><Link to="/legal/impressum" className="hover:text-foreground">Imprint / Impressum</Link></li>
            <li><Link to="/legal/datenschutz" className="hover:text-foreground">Datenschutz</Link></li>
          </ul>
        </div>

        <div>
          <div className="font-semibold mb-3">Підпишись на оновлення</div>
          <p className="text-sm text-muted-foreground mb-3">Нові уроки, поради й безкоштовні матеріали — раз на тиждень.</p>
          <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="email@example.com" className="flex-1 h-10 rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            <button className="h-10 px-4 rounded-lg bg-gradient-primary text-primary-foreground text-sm font-semibold">OK</button>
          </form>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="container py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <div>© {new Date().getFullYear()} deutsch.klar mit Oksi. Усі права захищено.</div>
          <div>Зроблено з ❤️ для української спільноти в Німеччині та поза нею.</div>
        </div>
      </div>
    </footer>
  );
};
