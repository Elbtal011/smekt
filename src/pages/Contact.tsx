import { Building2, Mail, MapPin, Phone, Scale } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ApplicationContactForm } from "@/components/ApplicationContactForm";

const contactDetails = [
  { icon: Phone, label: "Telefon", value: "02041 9876543" },
  { icon: Mail, label: "E-Mail", value: "info@smeimmo.com" },
  { icon: MapPin, label: "Anschrift", value: "Weseler Weg 5, 46244 Bottrop" },
  { icon: Building2, label: "Unternehmen", value: "SMEKT Verwaltungsgesellschaft mbH" },
  { icon: Scale, label: "Geschäftsführer", value: "Theo Houy" },
];

const Contact = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main>
        <section className="property-hero-surface py-20 text-white md:py-28">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl">
              <p className="type-eyebrow mb-5 text-sky-300">
                IHR DIGITALES BEWERBUNGSVERFAHREN
              </p>
              <h1 className="type-hero-title">
                Bewerbungsportal für Mietobjekte
              </h1>
              <p className="type-hero-lead mt-6 max-w-3xl text-slate-300">
                Bitte halten Sie Ihre Daten und Dokumente bereit. Eine präzise Eingabe sichert Ihnen eine bevorzugte und beschleunigte Bearbeitung.
              </p>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
              <ApplicationContactForm />

              <aside className="space-y-6 lg:sticky lg:top-28">
                <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                  <h2 className="type-card-title">
                    Unternehmensdaten
                  </h2>
                  <div className="type-card-body mt-4 space-y-3">
                    <p>
                      <span className="font-semibold text-slate-950">Firmenname:</span>{" "}
                      SMEKT Verwaltungsgesellschaft mbH
                    </p>
                    <p>
                      <span className="font-semibold text-slate-950">
                        Vertreten durch den Geschäftsführer:
                      </span>{" "}
                      Theo Houy
                    </p>
                    <p>
                      <span className="font-semibold text-slate-950">Registereintrag:</span>{" "}
                      Eintragung im Handelsregister, Registergericht Amtsgericht
                      Gelsenkirchen, Registernummer HRB 18458
                    </p>
                  </div>
                </div>

                <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="type-card-title">
                    Zuständige Aufsichtsbehörde gemäß § 34c GewO
                  </h3>
                  <div className="type-card-body mt-4 space-y-2">
                    <p className="font-semibold text-slate-950">Stadt Bottrop</p>
                    <p>Straßen- und Verkehrsamt - Abteilung Gewerbeangelegenheiten</p>
                    <p>Ernst-Wilczok-Platz 1</p>
                    <p>46236 Bottrop</p>
                  </div>
                </div>

                <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="type-card-title">Direkter Kontakt</h3>
                  <div className="mt-5 space-y-4">
                    {contactDetails.map((detail) => (
                      <div key={detail.label} className="flex gap-3 text-sm">
                        <detail.icon className="mt-0.5 h-4 w-4 shrink-0 text-sky-700" />
                        <div>
                          <div className="font-semibold text-slate-950">{detail.label}</div>
                          <div className="text-slate-600">{detail.value}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
