import { useEffect, useState } from "react";
import { CheckCircle2, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_FILE_TYPES = ["application/pdf", "image/jpeg", "image/jpg"];
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^\+?[0-9\s()./-]{7,}$/;

type FileGroup = "income" | "identity" | "credit";

type FormState = {
  city: string;
  reference: string;
  classification: string;
  moveInDate: string;
  salutation: string;
  firstName: string;
  lastName: string;
  middleName: string;
  birthDate: string;
  birthPlace: string;
  nationality: string;
  occupants: string;
  address: string;
  postalCity: string;
  phone: string;
  email: string;
  message: string;
};

const initialForm: FormState = {
  city: "",
  reference: "",
  classification: "Wohnraum",
  moveInDate: "",
  salutation: "",
  firstName: "",
  lastName: "",
  middleName: "",
  birthDate: "",
  birthPlace: "",
  nationality: "Deutschland",
  occupants: "1",
  address: "",
  postalCity: "",
  phone: "",
  email: "",
  message: "",
};

const fileGroupLabels: Record<FileGroup, string> = {
  income: "Einkommensnachweise der letzten 3 Monate",
  identity: "Gültiges Ausweisdokument (Lichtbildausweis / Reisepass – Vorder- und Rückseite)",
  credit: "Freiwillige Bonitätsunterlagen",
};

const documentTypes: Record<FileGroup, string> = {
  income: "gehaltsnachweis",
  identity: "personalausweis",
  credit: "bonitaetsunterlagen",
};

const formatFiles = (files: File[]) =>
  files.length ? files.map((file) => file.name).join(", ") : "PDF oder JPEG, maximal 10 MB je Datei";

const stepLabels = [
  "1. Wunschimmobilie & Stammdaten",
  "2. Residenz & Kommunikation",
  "3. Nachweise & Dokumente",
];

export const ApplicationContactForm = () => {
  const { toast } = useToast();
  const [form, setForm] = useState<FormState>(initialForm);
  const [currentStep, setCurrentStep] = useState(1);
  const [cities, setCities] = useState<string[]>(["Sonstige (Manuelle Erfassung)"]);
  const [files, setFiles] = useState<Record<FileGroup, File[]>>({
    income: [],
    identity: [],
    credit: [],
  });
  const [consentData, setConsentData] = useState(false);
  const [consentTruth, setConsentTruth] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let active = true;

    fetch("/data/german-cities.json")
      .then((response) => response.json())
      .then((items: string[]) => {
        if (active && Array.isArray(items)) setCities(items);
      })
      .catch(() => {
        if (active) setCities(["Berlin", "Hamburg", "München", "Sonstige (Manuelle Erfassung)"]);
      });

    return () => {
      active = false;
    };
  }, []);

  const update = (key: keyof FormState, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const validateStep = (step: number) => {
    if (step === 1) {
      if (!form.city.trim()) return "Bitte geben Sie den gewünschten Standort an.";
      if (!form.reference.trim()) return "Bitte geben Sie die Objekt-Referenz oder Straße an.";
      if (!form.moveInDate) return "Bitte geben Sie den angestrebten Mietbeginn an.";
      if (!form.salutation) return "Bitte wählen Sie eine Anredeform.";
      if (!form.firstName.trim()) return "Bitte geben Sie den Vornamen an.";
      if (!form.lastName.trim()) return "Bitte geben Sie den Nachnamen an.";
      if (!form.birthDate) return "Bitte geben Sie das Geburtsdatum an.";
      if (!form.birthPlace.trim()) return "Bitte geben Sie den Geburtsort an.";
      if (!form.nationality.trim()) return "Bitte geben Sie die Staatsangehörigkeit an.";
      if (!form.occupants.trim()) return "Bitte geben Sie die Anzahl einziehender Personen an.";
    }

    if (step === 2) {
      if (!form.address.trim()) return "Bitte geben Sie die aktuelle Wohnanschrift an.";
      if (!form.postalCity.trim()) return "Bitte geben Sie PLZ und Ort an.";
      if (!PHONE_PATTERN.test(form.phone)) return "Bitte geben Sie eine gültige Telefonnummer ein.";
      if (!EMAIL_PATTERN.test(form.email)) return "Bitte geben Sie eine gültige E-Mail-Adresse ein.";
    }

    if (step === 3) {
      if (!files.income.length) return "Bitte laden Sie Einkommensnachweise hoch.";
      if (!files.identity.length) return "Bitte laden Sie ein gültiges Ausweisdokument hoch.";
      if (!consentData || !consentTruth) return "Bitte bestätigen Sie beide Pflicht-Erklärungen.";
    }

    return null;
  };

  const validateAll = () => {
    return validateStep(1) || validateStep(2) || validateStep(3);
  };

  const goToNextStep = () => {
    const error = validateStep(currentStep);
    if (error) {
      toast({ title: "Angaben prüfen", description: error, variant: "destructive" });
      return;
    }

    setCurrentStep((step) => Math.min(step + 1, 3));
  };

  const goToPreviousStep = () => {
    setCurrentStep((step) => Math.max(step - 1, 1));
  };

  const handleFiles = (group: FileGroup, selectedFiles: FileList | null) => {
    const nextFiles = Array.from(selectedFiles || []);
    const invalidFile = nextFiles.find(
      (file) => file.size > MAX_FILE_SIZE || !ALLOWED_FILE_TYPES.includes(file.type),
    );

    if (invalidFile) {
      toast({
        title: "Datei nicht zulässig",
        description: "Bitte laden Sie ausschließlich PDF- oder JPEG-Dateien mit maximal 10 MB je Datei hoch.",
        variant: "destructive",
      });
      return;
    }

    setFiles((current) => ({ ...current, [group]: nextFiles }));
  };

  const buildMessage = () =>
    [
      "Offizielles Bewerbungsdatenblatt",
      `Objektstandort / Stadt: ${form.city}`,
      `Objekt-Referenznummer / Straße: ${form.reference}`,
      `Klassifikation: ${form.classification}`,
      `Einzugsdatum: ${form.moveInDate}`,
      `Geburtsdatum: ${form.birthDate}`,
      `Geburtsort: ${form.birthPlace}`,
      `Zweitname / Weitere Vornamen: ${form.middleName || "-"}`,
      `Staatsangehörigkeit: ${form.nationality}`,
      `Einziehende Personen: ${form.occupants}`,
      `Aktuelle Meldeanschrift laut Ausweis: ${form.address}`,
      `PLZ & Ort: ${form.postalCity}`,
      `Nachricht: ${form.message || "-"}`,
    ].join("\n");

  const uploadDocuments = async (requestId: string) => {
    const entries = Object.entries(files) as [FileGroup, File[]][];

    for (const [group, groupFiles] of entries) {
      for (const file of groupFiles) {
        const storagePath = `${requestId}/${group}/${Date.now()}-${file.name}`;
        const upload = await supabase.storage.from("lead-documents").upload(storagePath, file);
        if (upload.error) throw new Error(upload.error.message || `Upload fehlgeschlagen: ${file.name}`);

        const publicUrl =
          upload.data?.publicUrl ||
          supabase.storage.from("lead-documents").getPublicUrl(storagePath).data.publicUrl;

        const { error } = await supabase.from("lead_documents").insert({
          contact_request_id: requestId,
          file_name: file.name,
          file_path: publicUrl,
          file_size: file.size,
          document_type: documentTypes[group],
          uploaded_by: "applicant",
        });

        if (error) throw new Error(error.message || `Dokument konnte nicht gespeichert werden: ${file.name}`);
      }
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const validationError = validateAll();

    if (validationError) {
      toast({ title: "Angaben prüfen", description: validationError, variant: "destructive" });
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        anrede: form.salutation,
        vorname: form.firstName,
        nachname: form.lastName,
        email: form.email,
        telefon: form.phone,
        strasse: form.address,
        plz: form.postalCity.slice(0, 5),
        ort: form.postalCity,
        nachricht: buildMessage(),
        lead_label: "Property Application",
        lead_stage: "lead",
      };

      const { data, error } = await supabase.functions.invoke("contact-submit", { body: payload });
      if (error || !data?.request?.id) throw new Error(error?.message || "Lead konnte nicht erstellt werden.");

      await uploadDocuments(data.request.id);

      toast({
        title: "Bewerbung eingereicht",
        description: "Ihre Daten und Dokumente wurden dem Objektmanagement übermittelt.",
      });

      setForm(initialForm);
      setFiles({ income: [], identity: [], credit: [] });
      setConsentData(false);
      setConsentTruth(false);
      setCurrentStep(1);
    } catch (error: any) {
      toast({
        title: "Übermittlung fehlgeschlagen",
        description: error?.message || "Bitte versuchen Sie es erneut.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm md:p-8">
      <div className="border-b border-slate-200 pb-6">
        <h2 className="type-card-title">
          Offizielles Bewerbungsdatenblatt
        </h2>
        <p className="type-detail-body mt-3">
          Alle Pflichtfelder und Dokumente werden zur Validierung Ihrer Anfrage benötigt.
        </p>
        <div className="mt-4 rounded-md border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-950">
          <p className="font-semibold">Rechtlicher Hinweis zur Antragstellung:</p>
          <p className="mt-1">
            Die Identitäts- und Bonitätsprüfung erfordert eine vollständige Übereinstimmung Ihrer Daten mit den Melderegister- und Ausweisdaten. Bitte tragen Sie alle persönlichen Daten identisch zu Ihrem gültigen Ausweisdokument ein. Unvollständige Angaben oder Abweichungen (z. B. fehlende Zweitnamen oder abweichende Schreibweisen bei Geburtsorten) können im System nicht verarbeitet werden.
          </p>
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          {stepLabels.map((label, index) => {
            const step = index + 1;
            const isActive = currentStep === step;
            const isCompleted = currentStep > step;

            return (
              <div
                key={label}
                className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                  isActive
                    ? "bg-slate-950 text-white"
                    : isCompleted
                      ? "bg-sky-100 text-sky-800"
                      : "bg-slate-100 text-slate-500"
                }`}
              >
                {label}
              </div>
            );
          })}
        </div>
      </div>

      <div className="space-y-10 py-8">
        {currentStep === 1 && (
          <>
            <fieldset className="space-y-5">
              <legend className="type-detail-title mb-5">
                1. Wunschimmobilie
              </legend>
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <Label htmlFor="city">Objektstandort / Stadt *</Label>
                  <Input
                    id="city"
                    list="city-options"
                    value={form.city}
                    onChange={(event) => update("city", event.target.value)}
                    required
                    className="mt-2"
                  />
                  <datalist id="city-options">
                    {cities.map((city) => (
                      <option key={city} value={city} />
                    ))}
                  </datalist>
                </div>
                <div>
                  <Label htmlFor="reference">Objekt-Referenznummer / Straße *</Label>
                  <Input
                    id="reference"
                    value={form.reference}
                    onChange={(event) => update("reference", event.target.value)}
                    required
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="classification">Klassifikation der Immobilie *</Label>
                  <select
                    id="classification"
                    value={form.classification}
                    onChange={(event) => update("classification", event.target.value)}
                    className="mt-2 h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                  >
                    <option>Wohnraum</option>
                    <option>Gewerbeobjekt</option>
                    <option>Stellplatz / Garage</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="moveInDate">Angestrebter Mietbeginn *</Label>
                  <Input
                    id="moveInDate"
                    type="date"
                    value={form.moveInDate}
                    onChange={(event) => update("moveInDate", event.target.value)}
                    required
                    className="mt-2"
                  />
                </div>
              </div>
            </fieldset>

            <fieldset className="space-y-5">
              <legend className="type-detail-title mb-5">
                2. Stammdaten des Hauptmieters
              </legend>
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <Label htmlFor="salutation">Rechtliche Anredeform *</Label>
                  <select
                    id="salutation"
                    value={form.salutation}
                    onChange={(event) => update("salutation", event.target.value)}
                    required
                    className="mt-2 h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                  >
                    <option value="">Bitte wählen</option>
                    <option>Herr</option>
                    <option>Frau</option>
                    <option>Divers</option>
                    <option>Keine Angabe</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="occupants">Einziehende Personen *</Label>
                  <Input
                    id="occupants"
                    type="number"
                    min="1"
                    value={form.occupants}
                    onChange={(event) => update("occupants", event.target.value)}
                    required
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="firstName">Vollständiger Vorname *</Label>
                  <Input
                    id="firstName"
                    value={form.firstName}
                    onChange={(event) => update("firstName", event.target.value)}
                    required
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Nachname / Familienname *</Label>
                  <Input
                    id="lastName"
                    value={form.lastName}
                    onChange={(event) => update("lastName", event.target.value)}
                    required
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="middleName">Zweitname / Weitere Vornamen (Optional)</Label>
                  <Input
                    id="middleName"
                    value={form.middleName}
                    onChange={(event) => update("middleName", event.target.value)}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="birthDate">Geburtsdatum *</Label>
                  <Input
                    id="birthDate"
                    type="date"
                    value={form.birthDate}
                    onChange={(event) => update("birthDate", event.target.value)}
                    required
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="birthPlace">Geburtsort *</Label>
                  <Input
                    id="birthPlace"
                    value={form.birthPlace}
                    onChange={(event) => update("birthPlace", event.target.value)}
                    required
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="nationality">Staatsangehörigkeit *</Label>
                  <Input
                    id="nationality"
                    value={form.nationality}
                    onChange={(event) => update("nationality", event.target.value)}
                    required
                    className="mt-2"
                  />
                </div>
              </div>
            </fieldset>
          </>
        )}

        {currentStep === 2 && (
          <fieldset className="space-y-5">
            <legend className="type-detail-title mb-5">
              3. Aktuelle Residenz & Kommunikation
            </legend>
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <Label htmlFor="address">Aktuelle Meldeanschrift (laut Ausweis) *</Label>
                <Input
                  id="address"
                  value={form.address}
                  onChange={(event) => update("address", event.target.value)}
                  required
                  className="mt-2"
                  placeholder="Hauptstraße 12 / 4"
                />
              </div>
              <div>
                <Label htmlFor="postalCity">Postleitzahl (PLZ) & Ort *</Label>
                <Input
                  id="postalCity"
                  value={form.postalCity}
                  onChange={(event) => update("postalCity", event.target.value)}
                  required
                  className="mt-2"
                  placeholder="80331 München"
                />
              </div>
              <div>
                <Label htmlFor="phone">Primäre Telefonnummer *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={form.phone}
                  onChange={(event) => update("phone", event.target.value)}
                  required
                  className="mt-2"
                  placeholder="+49 ..."
                />
              </div>
              <div>
                <Label htmlFor="email">E-Mail-Adresse *</Label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(event) => update("email", event.target.value)}
                  required
                  className="mt-2"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="message">Ergänzende Angaben</Label>
              <Textarea
                id="message"
                value={form.message}
                onChange={(event) => update("message", event.target.value)}
                className="mt-2"
                rows={4}
              />
            </div>
          </fieldset>
        )}

        {currentStep === 3 && (
          <fieldset>
            <legend className="type-detail-title mb-5">
              4. Wirtschaftliche Nachweise & Verifikationsdokumente
            </legend>
            <div className="grid gap-4">
              {(Object.keys(fileGroupLabels) as FileGroup[]).map((group) => (
                <label
                  key={group}
                  className="flex cursor-pointer flex-col gap-3 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-5 transition-colors hover:border-sky-500 hover:bg-sky-50 md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <div className="font-semibold text-slate-950">
                      {fileGroupLabels[group]}
                      {group !== "credit" ? " *" : ""}
                    </div>
                    <div className="mt-1 text-sm text-slate-600">{formatFiles(files[group])}</div>
                  </div>
                  <div className="inline-flex items-center gap-2 text-sm font-semibold text-sky-700">
                    <UploadCloud className="h-4 w-4" />
                    Datei auswählen
                  </div>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,application/pdf,image/jpeg"
                    multiple
                    className="hidden"
                    onChange={(event) => handleFiles(group, event.target.files)}
                  />
                </label>
              ))}
            </div>
          </fieldset>
        )}
      </div>

      {currentStep === 3 && (
        <div className="space-y-4 border-t border-slate-200 pt-6">
          <label className="flex gap-3 text-sm leading-6 text-slate-700">
            <Checkbox checked={consentData} onCheckedChange={(checked) => setConsentData(checked === true)} required />
            <span>
              Ich willige ein, dass die SMEKT Verwaltungsgesellschaft mbH meine personenbezogenen Daten und Dokumente zum Zweck der Bonitätsprüfung und Mietobjektvergabe verarbeitet.
            </span>
          </label>
          <label className="flex gap-3 text-sm leading-6 text-slate-700">
            <Checkbox checked={consentTruth} onCheckedChange={(checked) => setConsentTruth(checked === true)} required />
            <span>
              Ich versichere, dass sämtliche Angaben in diesem Online-Datenblatt wahrheitsgemäß und vollständig sind.
            </span>
          </label>
        </div>
      )}

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-between">
        <Button type="button" variant="outline" onClick={goToPreviousStep} disabled={currentStep === 1}>
          Zurück
        </Button>

        {currentStep < 3 ? (
          <Button type="button" size="lg" onClick={goToNextStep}>
            Nächster Schritt
          </Button>
        ) : (
          <Button type="submit" size="lg" className="sm:min-w-[320px]" disabled={isSubmitting}>
            {isSubmitting ? "Daten werden übermittelt..." : "Anfrage einreichen"}
            {!isSubmitting && <CheckCircle2 className="h-4 w-4" />}
          </Button>
        )}
      </div>
    </form>
  );
};
