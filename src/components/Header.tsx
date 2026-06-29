import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { label: "Startseite", href: "/" },
  { label: "Wohnen & Service", href: "/leistungsübersicht" },
  { label: "Kontakt & Bewerbung", href: "/kontakt" },
  { label: "Unternehmen", href: "/unternehmen" },
];

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex h-[76px] items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-baseline gap-2 text-xl font-bold tracking-tight text-slate-950 md:text-2xl"
            aria-label="SMEKT IMMO Verwaltungsgesellschaft mbH Startseite"
          >
            <span>SMEKT</span>
            <span className="text-[0.56em] font-semibold tracking-[0.22em] text-slate-600">IMMO</span>
          </Link>

          <nav className="hidden items-center gap-8 lg:flex" aria-label="Hauptnavigation">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className="text-sm font-medium text-slate-700 transition-colors hover:text-sky-700"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:block">
            <Button asChild>
              <Link to="/kontakt">Bewerbung starten</Link>
            </Button>
          </div>

          <button
            type="button"
            className="rounded-md border border-slate-200 p-2 lg:hidden"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-label="Menü öffnen"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {isMenuOpen && (
          <nav className="border-t border-slate-200 py-3 lg:hidden" aria-label="Mobile Navigation">
            <div className="space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.href}
                  className="block rounded-md px-3 py-2 text-base font-medium text-slate-800 hover:bg-slate-100 hover:text-sky-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};
