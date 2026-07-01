import React from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const Datenschutz = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-primary/10 text-primary">
            Datenschutz
          </Badge>
          <h1 className="type-section-title mb-6">
            Datenschutzerklärung
          </h1>
          <p className="type-section-lead max-w-3xl mx-auto text-muted-foreground">
            Informationen zur Verarbeitung Ihrer personenbezogenen Daten gemäß DSGVO
          </p>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>
                1. Datenschutz auf einen Blick
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="type-detail-title mb-3">Allgemeine Hinweise</h3>
                <p className="text-muted-foreground">
                  Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren
                  personenbezogenen Daten passiert, wenn Sie diese Website besuchen.
                  Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert
                  werden können. Ausführliche Informationen zum Thema Datenschutz entnehmen Sie
                  unserer unter diesem Text aufgeführten Datenschutzerklärung.
                </p>
              </div>

              <div>
                <h3 className="type-detail-title mb-3">Datenerfassung auf dieser Website</h3>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    <strong className="text-foreground">
                      Wer ist verantwortlich für die Datenerfassung auf dieser Website?
                    </strong>{' '}
                    Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber.
                    Dessen Kontaktdaten können Sie dem Abschnitt „Hinweis zur verantwortlichen
                    Stelle“ in dieser Datenschutzerklärung entnehmen.
                  </p>
                  <p>
                    <strong className="text-foreground">Wie erfassen wir Ihre Daten?</strong>{' '}
                    Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese mitteilen.
                    Hierbei kann es sich z. B. um Daten handeln, die Sie in ein Kontaktformular
                    eingeben oder uns per E-Mail senden. Andere Daten werden automatisch oder nach
                    Ihrer Einwilligung beim Besuch der Website durch unsere IT-Systeme erfasst. Das
                    sind vor allem technische Daten (z. B. Internetbrowser, Betriebssystem oder
                    Uhrzeit des Seitenaufrufs). Die Erfassung dieser Daten erfolgt automatisch,
                    sobald Sie diese Website betreten.
                  </p>
                  <p>
                    <strong className="text-foreground">Wofür nutzen wir Ihre Daten?</strong> Ein
                    Teil der Daten wird erhoben, um eine fehlerfreie Bereitstellung der Website zu
                    gewährleisten. Andere Daten können zur Analyse Ihres Nutzerverhaltens verwendet
                    werden.
                  </p>
                  <p>
                    <strong className="text-foreground">
                      Welche Rechte haben Sie bezüglich Ihrer Daten?
                    </strong>{' '}
                    Sie haben jederzeit das Recht, unentgeltlich Auskunft über Herkunft,
                    Empfänger und Zweck Ihrer gespeicherten personenbezogenen Daten zu erhalten.
                    Sie haben außerdem ein Recht, die Berichtigung oder Löschung dieser Daten zu
                    verlangen. Wenn Sie eine Einwilligung zur Datenverarbeitung erteilt haben,
                    können Sie diese Einwilligung jederzeit für die Zukunft widerrufen. Zudem haben
                    Sie das Recht, unter bestimmten Umständen die Einschränkung der Verarbeitung
                    Ihrer personenbezogenen Daten zu verlangen. Des Weiteren steht Ihnen ein
                    Beschwerderecht bei der zuständigen Aufsichtsbehörde zu.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                2. Allgemeine Hinweise und Pflichtinformationen
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="type-detail-title mb-3">Datenschutz</h3>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    Die Betreiber dieser Seiten nehmen den Schutz Ihrer persönlichen Daten sehr
                    ernst. Wir behandeln Ihre personenbezogenen Daten vertraulich und entsprechend
                    den gesetzlichen Datenschutzvorschriften sowie dieser Datenschutzerklärung.
                  </p>
                  <p>
                    Wenn Sie diese Website benutzen, werden verschiedene personenbezogene Daten
                    erhoben. Diese Datenschutzerklärung erläutert, welche Daten wir erheben und
                    wofür wir sie nutzen. Sie erläutert auch, wie und zu welchem Zweck das
                    geschieht.
                  </p>
                  <p>
                    Wir weisen darauf hin, dass die Datenübertragung im Internet (z. B. bei der
                    Kommunikation per E-Mail) Sicherheitslücken aufweisen kann. Ein lückenloser
                    Schutz der Daten vor dem Zugriff durch Dritte ist nicht möglich.
                  </p>
                </div>
              </div>

              <div>
                <h3 className="type-detail-title mb-3">Hinweis zur verantwortlichen Stelle</h3>
                <div className="bg-muted/50 p-4 rounded-lg space-y-1 text-muted-foreground">
                  <p className="font-medium text-foreground">SMEKT Verwaltungsgesellschaft mbH</p>
                  <p>Weseler Weg 5</p>
                  <p>46244 Bottrop</p>
                  <p>Vertreten durch: Theo Houy</p>
                  <p>Telefon: 02041 9876543</p>
                  <p>
                    E-Mail:{' '}
                    <a href="mailto:info@smekt-immo.com" className="text-primary hover:underline">
                      info@smekt-immo.com
                    </a>
                  </p>
                </div>
                <p className="text-muted-foreground mt-4">
                  Verantwortliche Stelle ist die natürliche oder juristische Person, die allein
                  oder gemeinsam mit anderen über die Zwecke und Mittel der Verarbeitung von
                  personenbezogenen Daten (z. B. Namen, E-Mail-Adressen o. Ä.) entscheidet.
                </p>
              </div>

              <div>
                <h3 className="type-detail-title mb-3">Speicherdauer</h3>
                <p className="text-muted-foreground">
                  Soweit innerhalb dieser Datenschutzerklärung keine speziellere Speicherdauer
                  genannt wurde, verbleiben Ihre personenbezogenen Daten bei uns, bis der Zweck für
                  die Datenverarbeitung entfällt. Wenn Sie ein berechtigtes Löschbegehren geltend
                  machen oder eine Einwilligung zur Datenverarbeitung widerrufen, werden Ihre Daten
                  gelöscht, sofern wir keine anderen rechtlich zulässigen Gründe für die
                  Speicherung Ihrer personenbezogenen Daten haben (z. B. steuer- oder
                  handelsrechtliche Aufbewahrungsfristen); im letztgenannten Fall erfolgt die
                  Löschung nach Fortfall dieser Gründe.
                </p>
              </div>

              <div>
                <h3 className="type-detail-title mb-3">
                  Allgemeine Hinweise zu den Rechtsgrundlagen der Datenverarbeitung auf dieser
                  Website
                </h3>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    Sofern Sie in die Datenverarbeitung eingewilligt haben, verarbeiten wir Ihre
                    personenbezogenen Daten auf Grundlage von Art. 6 Abs. 1 lit. a DSGVO bzw.
                    Art. 9 Abs. 2 lit. a DSGVO, sofern besondere Datenkategorien nach Art. 9 Abs.
                    1 DSGVO verarbeitet werden. Im Falle einer ausdrücklichen Einwilligung in die
                    Übertragung personenbezogener Daten in Drittstaaten erfolgt die
                    Datenverarbeitung zudem auf Grundlage von Art. 49 Abs. 1 lit. a DSGVO. Sie
                    können die Einwilligung jederzeit widerrufen.
                  </p>
                  <p>
                    Sind Ihre Daten zur Vertragserfüllung oder zur Durchführung vorvertraglicher
                    Maßnahmen erforderlich, verarbeiten wir Ihre Daten auf Grundlage des Art. 6
                    Abs. 1 lit. b DSGVO. Des Weiteren verarbeiten wir Ihre Daten, sofern diese zur
                    Erfüllung einer rechtlichen Verpflichtung erforderlich sind auf Grundlage von
                    Art. 6 Abs. 1 lit. c DSGVO. Die Datenverarbeitung kann ferner auf Grundlage
                    unseres berechtigten Interesses nach Art. 6 Abs. 1 lit. f DSGVO erfolgen. Über
                    die jeweils im Einzelfall einschlägigen Rechtsgrundlagen wird in den folgenden
                    Absätzen dieser Datenschutzerklärung informiert.
                  </p>
                </div>
              </div>

              <div>
                <h3 className="type-detail-title mb-3">
                  Beschwerderecht bei der zuständigen Aufsichtsbehörde
                </h3>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    Im Falle von Verstößen gegen die DSGVO steht den Betroffenen ein
                    Beschwerderecht bei einer Aufsichtsbehörde, insbesondere in dem Mitgliedstaat
                    ihres gewöhnlichen Aufenthalts, ihres Arbeitsplatzes oder des Orts des
                    mutmaßlichen Verstoßes zu. Das Beschwerderecht besteht unbeschadet
                    anderweitiger verwaltungsrechtlicher oder gerichtlicher Rechtsbehelfe.
                  </p>
                  <p>
                    Die für uns zuständige Aufsichtsbehörde ist: Landesbeauftragte für Datenschutz
                    und Informationsfreiheit Nordrhein-Westfalen, Kavalleriestr. 2-4, 40213
                    Düsseldorf.
                  </p>
                </div>
              </div>

              <div>
                <h3 className="type-detail-title mb-3">Recht auf Datenübertragbarkeit</h3>
                <p className="text-muted-foreground">
                  Sie haben das Recht, Daten, die wir auf Grundlage Ihrer Einwilligung oder in
                  Erfüllung eines Vertrags automatisiert verarbeiten, an sich oder an einen Dritten
                  in einem gängigen, maschinenlesbaren Format aushändigen zu lassen. Sofern Sie die
                  direkte Übertragung der Daten an einen anderen Verantwortlichen verlangen, erfolgt
                  dies nur, soweit es technisch machbar ist.
                </p>
              </div>

              <div>
                <h3 className="type-detail-title mb-3">Auskunft, Berichtigung und Löschung</h3>
                <p className="text-muted-foreground">
                  Sie haben im Rahmen der geltenden gesetzlichen Bestimmungen jederzeit das Recht
                  auf unentgeltliche Auskunft über Ihre gespeicherten personenbezogenen Daten,
                  deren Herkunft und Empfänger und den Zweck der Datenverarbeitung und ggf. ein
                  Recht auf Berichtigung oder Löschung dieser Daten. Hierzu sowie zu weiteren
                  Fragen zum Thema personenbezogene Daten können Sie sich jederzeit unter der im
                  Impressum angegebenen Adresse an uns wenden.
                </p>
              </div>

              <div>
                <h3 className="type-detail-title mb-3">
                  Recht auf Einschränkung der Verarbeitung
                </h3>
                <p className="text-muted-foreground">
                  Sie haben das Recht, die Einschränkung der Verarbeitung Ihrer personenbezogenen
                  Daten zu verlangen. Hierzu können Sie sich jederzeit unter der im Impressum
                  angegebenen Adresse an uns wenden.
                </p>
              </div>

              <div>
                <h3 className="type-detail-title mb-3">SSL- bzw. TLS-Verschlüsselung</h3>
                <p className="text-muted-foreground">
                  Diese Seite nutzt aus Sicherheitsgründen und zum Schutz der Übertragung
                  vertraulicher Inhalte, wie zum Beispiel Bestellungen oder Anfragen, die Sie an
                  uns als Seitenbetreiber senden, eine SSL- bzw. TLS-Verschlüsselung. Eine
                  verschlüsselte Verbindung erkennen Sie daran, dass die Adresszeile des Browsers
                  von „http://“ auf „https://“ wechselt und an dem Schloss-Symbol in Ihrer
                  Browserzeile.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                3. Datenerfassung auf dieser Website
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="type-detail-title mb-3">Server-Log-Dateien</h3>
                <p className="text-muted-foreground mb-3">
                  Der Provider der Seiten erhebt und speichert automatisch Informationen in
                  sogenannten Server-Log-Dateien, die Ihr Browser automatisch an uns übermittelt.
                  Dies sind:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>Browsertyp und Browserversion</li>
                  <li>verwendetes Betriebssystem</li>
                  <li>Referrer URL (die zuvor besuchte Seite)</li>
                  <li>Hostname des zugreifenden Rechners</li>
                  <li>Uhrzeit der Serveranfrage</li>
                  <li>IP-Adresse</li>
                </ul>
                <div className="space-y-4 text-muted-foreground mt-4">
                  <p>Eine Zusammenführung dieser Daten mit anderen Datenquellen wird nicht vorgenommen.</p>
                  <p>
                    Die Erfassung dieser Daten erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f
                    DSGVO. Der Websitebetreiber hat ein berechtigtes Interesse an der technisch
                    fehlerfreien Darstellung und der Optimierung seiner Website – hierzu müssen die
                    Server-Logfiles erfasst werden.
                  </p>
                </div>
              </div>

              <div>
                <h3 className="type-detail-title mb-3">Kontakt per E-Mail oder Telefon</h3>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    Wenn Sie uns per E-Mail oder Telefon kontaktieren, wird Ihre Anfrage inklusive
                    aller daraus hervorgehenden personenbezogenen Daten (Name, Anfrage) zum Zwecke
                    der Bearbeitung Ihres Anliegens bei uns gespeichert und verarbeitet. Diese
                    Daten geben wir nicht ohne Ihre Einwilligung weiter.
                  </p>
                  <p>
                    Die Verarbeitung dieser Daten erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b
                    DSGVO, sofern Ihre Anfrage mit der Erfüllung eines Vertrags zusammenhängt oder
                    zur Durchführung vorvertraglicher Maßnahmen erforderlich ist. In allen übrigen
                    Fällen beruht die Verarbeitung auf unserem berechtigten Interesse an der
                    effektiven Bearbeitung der an uns gerichteten Anfragen (Art. 6 Abs. 1 lit. f
                    DSGVO) oder auf Ihrer Einwilligung (Art. 6 Abs. 1 lit. a DSGVO), falls diese
                    abgefragt wurde.
                  </p>
                  <p>
                    Die von Ihnen an uns per Kontaktanfragen übersandten Daten verbleiben bei uns,
                    bis Sie uns zur Löschung auffordern, Ihre Einwilligung zur Speicherung
                    widerrufen oder der Zweck für die Datenspeicherung entfällt (z. B. nach
                    abgeschlossener Bearbeitung Ihres Anliegens). Zwingende gesetzliche
                    Bestimmungen – insbesondere gesetzliche Aufbewahrungsfristen – bleiben
                    unberührt.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Datenschutz;
