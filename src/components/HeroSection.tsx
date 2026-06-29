import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const HeroSection = () => {
  return (
    <section className="property-hero-surface">
      <div className="absolute inset-0">
        <img
          src="/lovable-uploads/8da215fa-e00e-46ad-acb1-6fddfe11057e.png"
          alt="Modernes Wohngebäude"
          className="h-full w-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A1B2E] via-[#0A1B2E]/85 to-[#0A1B2E]/30" />
      </div>

      <div className="container relative mx-auto px-4 py-24 md:py-32">
        <div className="max-w-4xl">
          <p className="type-eyebrow mb-5 text-sky-300">
            SMEKT Verwaltungsgesellschaft mbH
          </p>
          <h1 className="type-hero-title text-white">
            Nachhaltige Immobilienverwaltung mit digitaler Präzision.
          </h1>
          <p className="type-hero-lead mt-6 max-w-3xl text-slate-200">
            Ihr bundesweit agierender Partner für treuhänderisches Asset- und Property Management.
          </p>
          <p className="mt-5 max-w-3xl text-base leading-8 text-slate-300 md:text-lg">
            Renditesicherung durch professionelle Bewirtschaftung, rechtssichere Mietverwaltung und maximale Transparenz. Wir maximieren den Werterhalt Ihrer Immobilien und entlasten Eigentümer substanziell.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="border-transparent bg-white text-slate-950 shadow-[0_14px_36px_rgba(2,6,23,0.34)] hover:bg-slate-100 hover:text-slate-950">
              <Link to="/kontakt">
                Interessentenverfahren starten
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white/60 bg-transparent text-white hover:bg-white/10 hover:text-white">
              <Link to="/leistungsübersicht">Leistungsspektrum ansehen</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
