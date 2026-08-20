import { Link, NavLink, useNavigate } from "react-router-dom";
import { GraduationCap, Globe, Menu, X, User2, Bookmark } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useLang } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navItemsPublic = [
  { to: "/courses", label: "Курси" },
  { to: "/placement-test", label: "Визначити рівень" },
  { to: "/#how", label: "Як це працює" },
  { to: "/pricing", label: "Тарифи" },
  { to: "/#faq", label: "FAQ" },
];

const navItemsAuthed = [
  { to: "/dashboard", key: "nav.dashboard" },
  { to: "/courses", key: "nav.courses" },
  { to: "/vocab", key: "nav.vocab" },
  { to: "/progress", key: "nav.progress" },
  { to: "/saved", label: "Збережене", icon: true },
];

type NavItem = { to: string; key?: string; label?: string; icon?: boolean };

export const Header = () => {
  const { lang, setLang, t } = useLang();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const nav = useNavigate();
  const items: NavItem[] = user ? navItemsAuthed : navItemsPublic;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-primary shadow-soft">
            <GraduationCap className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="leading-tight">
            <div className="font-display text-lg font-extrabold tracking-tight">
              deutsch<span className="text-primary">.</span>klar
            </div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground -mt-0.5">з Оксі</div>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {items.map((it) =>
            it.to.includes("#") ? (
              <Link
                key={it.to}
                to={it.to}
                className="px-3 py-2 text-sm font-medium rounded-lg transition-colors text-foreground/70 hover:text-foreground hover:bg-muted"
              >
                {it.label}
              </Link>
            ) : (
              <NavLink
                key={it.to}
                to={it.to}
                end={it.to === "/"}
                className={({ isActive }) =>
                  `px-3 py-2 text-sm font-medium rounded-lg transition-colors inline-flex items-center gap-1.5 ${
                    isActive ? "bg-primary-soft text-primary" : "text-foreground/70 hover:text-foreground hover:bg-muted"
                  }`
                }
              >
                {it.icon && <Bookmark className="h-4 w-4" />}
                {it.key ? t(it.key) : it.label}
              </NavLink>
            )
          )}
        </nav>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-1.5">
                <Globe className="h-4 w-4" />
                <span className="text-xs font-semibold uppercase">{lang}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setLang("uk")}>🇺🇦 Українська</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLang("de")}>🇩🇪 Deutsch</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2 hidden sm:flex">
                  <div className="h-7 w-7 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium">{user.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => nav("/profile")}><User2 className="h-4 w-4 mr-2"/> {t("nav.profile")}</DropdownMenuItem>
                <DropdownMenuItem onClick={() => nav("/admin")}>{t("nav.admin")}</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => { logout(); nav("/"); }}>{t("nav.logout")}</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => nav("/login")}>{t("nav.login")}</Button>
              <Button size="sm" onClick={() => nav("/signup")} className="bg-gradient-primary hover:opacity-95 shadow-soft">
                {t("nav.signup")}
              </Button>
            </div>
          )}

          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setOpen(!open)}>
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden border-t border-border bg-background">
          <div className="container py-3 flex flex-col gap-1">
            {items.map((it) =>
              it.to.includes("#") ? (
                <Link
                  key={it.to}
                  to={it.to}
                  onClick={() => setOpen(false)}
                  className="px-3 py-2.5 text-sm font-medium rounded-lg hover:bg-muted"
                >
                  {it.label}
                </Link>
              ) : (
                <NavLink
                  key={it.to}
                  to={it.to}
                  end={it.to === "/"}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `px-3 py-2.5 text-sm font-medium rounded-lg flex items-center gap-1.5 ${
                      isActive ? "bg-primary-soft text-primary" : "hover:bg-muted"
                    }`
                  }
                >
                  {it.icon && <Bookmark className="h-4 w-4" />}
                  {it.key ? t(it.key) : it.label}
                </NavLink>
              )
            )}
            {!user && (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Button variant="outline" onClick={() => { setOpen(false); nav("/login"); }}>{t("nav.login")}</Button>
                <Button onClick={() => { setOpen(false); nav("/signup"); }} className="bg-gradient-primary">{t("nav.signup")}</Button>
              </div>
            )}
            {user && (
              <>
                <NavLink to="/profile" onClick={() => setOpen(false)} className="px-3 py-2.5 text-sm rounded-lg hover:bg-muted">{t("nav.profile")}</NavLink>
                <button onClick={() => { logout(); setOpen(false); nav("/"); }} className="text-left px-3 py-2.5 text-sm rounded-lg hover:bg-muted">{t("nav.logout")}</button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
