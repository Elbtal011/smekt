import { Link } from "react-router-dom";
import {
  ArrowRight,
  ClipboardCheck,
  FileSearch,
  HandCoins,
  ReceiptText,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";

const services = [
  {
    icon: ClipboardCheck,
    title: "Rechtssicheres Mietflächen- & Vermietungsmanagement",
    text: "Marktgerechte Platzierung von Leerständen, strukturierte Bonitätsvorprüfung und rechtssichere Mietverträge nach aktueller Rechtsprechung.",
  },
  {
    icon: Wrench,
    title: "Proaktives technisches Gebäudemanagement",
    text: "Turnusgemäße Objektbegehungen, Verkehrssicherungspflichten und fachgerechte Behebung von Gewährleistungs- und Bestandsschäden.",
  },
  {
    icon: HandCoins,
    title: "Transparente kaufmännische Abwicklung",
    text: "Forderungsmanagement, treuhänderische Kautionsverwaltung und nachvollziehbare Betriebskostenabrechnungen für Mieter.",
  },
];

const capabilities = [
  { icon: ReceiptText, title: "Mieteingangskontrolle" },
  { icon: FileSearch, title: "Belegprüfung" },
  { icon: ShieldCheck, title: "Schadens-Tracking" },
  { icon: Wrench, title: "Dienstleistersteuerung" },
  { icon: ClipboardCheck, title: "Objektüberwachung" },
  { icon: HandCoins, title: "Abrechnungsmanagement" },
];

const Leistungsübersicht = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main>
        <section className="property-hero-surface py-20 text-white md:py-28">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl">
              <p className="type-eyebrow mb-5 text-sky-300">
                Wohnen & Service
              </p>
              <h1 className="type-hero-title">
                Ganzheitliche Objektbetreuung & Mieterservice.
              </h1>
              <p className="type-hero-lead mt-6 max-w-3xl text-slate-300">
                Strategische Mietverwaltung und technisches Property Management aus einer Hand.
              </p>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="grid gap-10 lg:grid-cols-[0.9fr_1fr] lg:items-center">
              <div>
                <h2 className="type-section-title">
                  Operative Steuerung Ihrer Liegenschaften.
                </h2>
                <p className="type-section-lead mt-5">
                  Ein nachhaltiges Immobilieninvestment braucht die Balance aus kaufmännischer Effizienz, technischer Funktionalität und sauberer Kommunikation im laufenden Betrieb.
                </p>
                <div className="mt-8 grid gap-5 sm:grid-cols-3">
                  <div>
                    <div className="text-2xl font-semibold text-slate-950">100%</div>
                    <div className="mt-1 text-sm text-slate-600">Fokus auf Fremdverwaltung</div>
                  </div>
                  <div>
                    <div className="text-2xl font-semibold text-slate-950">24/7</div>
                    <div className="mt-1 text-sm text-slate-600">Digitale Prozesssicht</div>
                  </div>
                  <div>
                    <div className="text-2xl font-semibold text-slate-950">DE</div>
                    <div className="mt-1 text-sm text-slate-600">Bundesweite Struktur</div>
                  </div>
                </div>
              </div>

              <img
                src="/lovable-uploads/smekt-managed-residential.png"
                alt="Modernes Mehrfamilienhaus im verwalteten Bestand"
                className="h-[340px] w-full rounded-lg object-cover shadow-sm md:h-[460px]"
              />
            </div>
          </div>
        </section>

        <section className="bg-slate-50 py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="mb-10 max-w-3xl">
              <h2 className="type-section-title">
                Unser operatives Leistungsspektrum.
              </h2>
              <p className="type-section-lead mt-5">
                Schlank gegliedert, damit Eigentümer und Objektmanagement schnell erkennen, wer welche Verantwortung trägt.
              </p>
            </div>

            <div className="grid gap-5 lg:grid-cols-3">
              {services.map((service) => {
                const Icon = service.icon;

                return (
                  <article key={service.title} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-md bg-slate-950 text-white">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="type-card-title">{service.title}</h3>
                    <p className="type-card-body mt-4">{service.text}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
              <div>
                <h2 className="type-section-title">
                  Digital gestützt, regional wirksam.
                </h2>
                <p className="type-section-lead mt-5">
                  Standardisierte Workflows und ein regionales Partnernetzwerk verbinden zentrale Steuerung mit verlässlicher Betreuung vor Ort.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {capabilities.map((capability) => {
                  const Icon = capability.icon;

                  return (
                    <div key={capability.title} className="flex items-center gap-4 rounded-lg border border-slate-200 bg-white p-5">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-950">
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="font-medium text-slate-900">{capability.title}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-slate-50 py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="rounded-lg border border-slate-200 bg-white p-8 shadow-sm md:p-12">
              <h2 className="type-section-title">
                Interesse an betreuten Miet- oder Verwaltungsobjekten?
              </h2>
              <p className="type-section-lead mt-4 max-w-3xl">
                Nutzen Sie das digitale Interessentenverfahren, damit Ihre Daten strukturiert geprüft und dem zuständigen Objektmanagement zugewiesen werden können.
              </p>
              <Button asChild size="lg" className="mt-8">
                <Link to="/kontakt">
                  Bewerbungsformular öffnen
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Leistungsübersicht;
