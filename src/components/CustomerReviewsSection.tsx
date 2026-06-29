import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const CustomerReviewsSection = () => {
  return (
    <section className="bg-white py-14 md:py-20">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-lg text-white shadow-sm ring-1 ring-sky-900/30 md:p-10">
          <div className="absolute inset-0">
            <img
              src="/lovable-uploads/property-cta-pexels-27307397.jpg"
              alt="Modernes Wohnobjekt mit Balkonen"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,6,23,0.88)_0%,rgba(2,6,23,0.72)_40%,rgba(2,6,23,0.45)_68%,rgba(2,6,23,0.7)_100%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(56,189,248,0.12)_0%,rgba(56,189,248,0)_28%)]" />
          </div>

          <div className="relative z-10 max-w-3xl p-8 md:p-0">
            <p className="type-eyebrow mb-4 text-sky-200">
              Digitales Bewerbungsverfahren
            </p>
            <h2 className="type-section-title text-white">
              Rechtssicheres Interessentenverfahren.
            </h2>
            <p className="type-section-lead mt-5 text-slate-200">
              Bewerberdaten und Prüfdokumente werden strukturiert erfasst und direkt dem zuständigen Objektmanagement zugewiesen.
            </p>
            <Button asChild size="lg" className="mt-8 border-transparent bg-white text-slate-950 shadow-[0_14px_36px_rgba(2,6,23,0.34)] hover:bg-slate-100 hover:text-slate-950">
              <Link to="/kontakt">
                Online-Bewerbung öffnen
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
