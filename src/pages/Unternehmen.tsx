import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";

const values = [
  {
    title: "Treuhänderische Mandatspflicht",
    text: "Wir handeln ausschließlich im wirtschaftlichen Interesse unserer Auftraggeber und schützen Kapital durch Kosten-Controlling, Instandhaltungsplanung und Durchsetzung von Eigentümerrechten.",
  },
  {
    title: "Höchste juristische Compliance",
    text: "Kontinuierliche juristische Weiterbildung sichert Rechtssicherheit von Vertragsgestaltung bis Abrechnungserstellung.",
  },
  {
    title: "Gelebte Dienstleistungsqualität",
    text: "Erreichbarkeit, schlanke Kommunikation und professionelles Konfliktmanagement sichern stabile Mietverhältnisse.",
  },
];

const Unternehmen = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main>
        <section className="property-hero-surface py-20 text-white md:py-28">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl">
              <p className="type-eyebrow mb-5 text-sky-300">
                Unternehmen
              </p>
              <h1 className="type-hero-title">
                SMEKT Verwaltungsgesellschaft mbH - Über uns.
              </h1>
              <p className="type-hero-lead mt-6 max-w-3xl text-slate-300">
                Absolute Unabhängigkeit. Fachliche Expertise. Werterhaltende Substanzstrategie.
              </p>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
              <div>
                <h2 className="type-section-title">
                  100 % treuhänderische Fremdverwaltung.
                </h2>
              </div>
              <div className="space-y-6 type-section-lead">
                <p>
                  Die SMEKT Verwaltungsgesellschaft mbH versteht sich als moderner, hochspezialisierter Dienstleister in der deutschen Immobilienwirtschaft. Wir betreiben kein Asset-Management für einen eigenen Immobilienbestand.
                </p>
                <p>
                  Unsere operativen und personellen Ressourcen konzentrieren sich vollständig auf die treuhänderische Fremdverwaltung. Diese Marktpositionierung schützt Eigentümer vor verdeckten Interessenkonflikten und garantiert eine objektive, rendite- und substanzorientierte Bewirtschaftung.
                </p>
                <p>
                  Unser interdisziplinäres Team verbindet kaufmännische Präzision mit technischem Fachwissen. Immobilien verstehen wir als dynamische Vermögenswerte, deren Ertragskraft und Substanz nachhaltig gesichert werden müssen.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-slate-50 py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="mb-10 max-w-3xl">
              <h2 className="type-section-title">
                Unsere Unternehmensphilosophie basiert auf drei Kernwerten.
              </h2>
            </div>
            <div className="grid gap-5 lg:grid-cols-3">
              {values.map((value) => (
                <article key={value.title} className="rounded-lg border border-slate-200 bg-white p-6">
                  <h3 className="type-card-title">{value.title}</h3>
                  <p className="type-card-body mt-4">{value.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="grid gap-10 rounded-lg border border-slate-200 p-8 md:grid-cols-[1fr_0.8fr] md:p-12">
              <div>
                <h2 className="type-section-title">
                  Verwaltung ohne Interessenkonflikt.
                </h2>
                <p className="type-section-lead mt-5">
                  Sprechen Sie mit uns über Eigentümerziele, Verwaltungsstruktur und die operative Entlastung Ihres Immobilienbestands.
                </p>
              </div>
              <div className="flex items-center md:justify-end">
                <Button asChild size="lg">
                  <Link to="/kontakt">
                    Kontakt aufnehmen
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Unternehmen;
