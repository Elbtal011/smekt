import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";

export const Footer = () => {
  return (
    <footer className="border-t border-slate-200 bg-[#0A1B2E] text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <Link to="/" className="inline-flex items-baseline gap-2 text-2xl font-bold tracking-tight">
              <span>SMEKT</span>
              <span className="text-[0.56em] font-semibold tracking-[0.22em] text-slate-300">IMMO</span>
            </Link>
            <p className="text-sm leading-7 text-slate-300">
              Kompetente Immobilienverwaltung, technisches Property Management und qualifizierte Mieterauswahl. Wir sichern die optimale und wertstabile Betreuung Ihrer Objekte.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">Navigation</h4>
            <ul className="space-y-2 text-sm text-slate-300">
              <li><Link to="/" className="transition-colors hover:text-sky-300">Startseite</Link></li>
              <li><Link to="/leistungsübersicht" className="transition-colors hover:text-sky-300">Wohnen & Service</Link></li>
              <li><Link to="/kontakt" className="transition-colors hover:text-sky-300">Kontakt & Bewerbung</Link></li>
              <li><Link to="/unternehmen" className="transition-colors hover:text-sky-300">Unternehmen</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">Leistungsspektrum</h4>
            <ul className="space-y-2 text-sm text-slate-300">
              <li>Mietverwaltung</li>
              <li>Technisches Gebaeudemanagement</li>
              <li>Kaufmaennische Abwicklung</li>
              <li>Digitale Bewerberpruefung</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">Kontakt</h4>
            <div className="space-y-3 text-sm text-slate-300">
              <p>Weseler Weg 5<br />46244 Bottrop<br />Deutschland</p>
              <p>+49 089 244 108 610</p>
              <p>info@smeimmo.com</p>
              <p>Mo-Fr: 9:00-18:00 Uhr</p>
            </div>
          </div>
        </div>

        <Separator className="my-8 bg-white/15" />

        <div className="flex flex-col items-center justify-between gap-4 text-sm text-slate-400 md:flex-row">
          <div>© 2026 SMEKT Verwaltungsgesellschaft mbH. Alle Rechte vorbehalten.</div>
          <div className="flex gap-6">
            <Link to="/impressum" className="transition-colors hover:text-sky-300">Impressum</Link>
            <Link to="/datenschutz" className="transition-colors hover:text-sky-300">Datenschutz</Link>
            <Link to="/agb" className="transition-colors hover:text-sky-300">AGB</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
