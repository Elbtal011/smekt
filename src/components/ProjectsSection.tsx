import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const scopes = [
  "Mietverwaltung",
  "Technische Betreuung",
  "Kaufmännische Abwicklung",
];

export const ProjectsSection = () => {
  return (
    <section className="bg-slate-50 py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1fr] lg:items-center">
          <div>
            <h2 className="type-section-title">
              Ganzheitliche Objektbetreuung & Mieterservice.
            </h2>
            <p className="type-section-lead mt-6 max-w-2xl">
              SMEKT übernimmt die operative Steuerung Ihrer Liegenschaften: kaufmännisch präzise, technisch koordiniert und mit klaren Abläufen für Eigentümer, Mieter und Dienstleister.
            </p>

            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 border-y border-slate-200 py-5">
              {scopes.map((scope) => (
                <span key={scope} className="text-sm font-semibold text-slate-900">
                  {scope}
                </span>
              ))}
            </div>

            <Button asChild size="lg" className="mt-8">
              <Link to="/leistungsübersicht">
                Details ansehen
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <img
            src="/lovable-uploads/smekt-apartment-building.png"
            alt="Verwaltetes Wohnobjekt"
            className="h-[360px] w-full rounded-lg object-cover shadow-sm md:h-[460px]"
          />
        </div>
      </div>
    </section>
  );
};
