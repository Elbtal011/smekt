import { Mail, MapPin, Phone } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ApplicationContactForm } from "@/components/ApplicationContactForm";

const contactDetails = [
  { icon: Phone, label: "Telefon", value: "+49 089 244 108 610" },
  { icon: Mail, label: "E-Mail", value: "info@smeimmo.com" },
  { icon: MapPin, label: "Sitz", value: "Balantstraße 55-5, 81541 München" },
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
                Kontakt & digitales Bewerbungsverfahren
              </p>
              <h1 className="type-hero-title">
                Interessenten-Verfahren für Miet- und Verwaltungsobjekte.
              </h1>
              <p className="type-hero-lead mt-6 max-w-3xl text-slate-300">
                Strukturierte Datenerfassung für eine beschleunigte Zuteilung und Bearbeitung.
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
                    Vorprüfung und Zuweisung
                  </h2>
                  <p className="type-card-body mt-4">
                    Nach erfolgreicher Übermittlung wird Ihre Anfrage validiert und dem zuständigen Objektmanager zugewiesen.
                  </p>
                </div>

                <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="type-card-title">
                    Datenschutzrechtlicher Compliance-Hinweis
                  </h3>
                  <p className="type-card-body mt-4">
                    Die Erhebung Ihrer Daten erfolgt zweckgebunden im Rahmen vorvertraglicher Maßnahmen gemäß Art. 6 Abs. 1 lit. b DSGVO. Sensible Dokumente werden ausschließlich durch autorisiertes Personal gesichtet.
                  </p>
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
