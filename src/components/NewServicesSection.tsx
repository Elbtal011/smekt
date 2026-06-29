const pillars = [
  {
    title: "Kompromisslose Unabhängigkeit",
    description:
      "Da wir kein eigenes Immobilienportfolio bewirtschaften, genießen Optimierung, Vermietung und Werterhalt Ihrer Liegenschaften unsere ungeteilte Aufmerksamkeit.",
  },
  {
    title: "Skalierbare Infrastruktur",
    description:
      "Cloudbasierte Prozesse und regionale Partner sichern kaufmännische Steuerung, technische Betreuung und Objektüberwachung auf Bundesebene.",
  },
  {
    title: "Zukunftsorientierte Digitalisierung",
    description:
      "Automatisierte Mieteingangskontrollen, digitale Belegprüfung und transparentes Schadens-Tracking reduzieren administrative Liegezeiten.",
  },
];

export const NewServicesSection = () => {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <h2 className="type-section-title">
              Die tragenden Säulen unserer Kernkompetenz.
            </h2>
            <p className="type-section-lead mt-5">
              SMEKT handelt treuhänderisch, digital gestützt und konsequent im Interesse der Auftraggeber.
            </p>
          </div>

          <div className="grid gap-4">
            {pillars.map((pillar, index) => (
              <article key={pillar.title} className="rounded-lg border border-slate-200 bg-slate-50 p-6">
                <div className="mb-4 text-sm font-bold text-sky-700">
                  0{index + 1}
                </div>
                <h3 className="type-card-title">{pillar.title}</h3>
                <p className="type-card-body mt-3">{pillar.description}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
