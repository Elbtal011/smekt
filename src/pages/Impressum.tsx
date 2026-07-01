import React from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const Impressum = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-primary/10 text-primary">
            Rechtliches
          </Badge>
          <h1 className="type-section-title mb-6">
            Impressum
          </h1>
          <p className="type-section-lead max-w-3xl mx-auto text-muted-foreground">
            Angaben gemäß § 5 DDG
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>
                  Unternehmensdaten
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="type-detail-title mb-2">Firmenname</h3>
                  <p className="text-muted-foreground">
                    SMEKT Verwaltungsgesellschaft mbH
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Vertreten durch den Geschäftsführer</h3>
                  <p className="text-muted-foreground">
                    Theo Houy
                  </p>
                </div>

                <div>
                  <h3 className="type-detail-title mb-2">Registereintrag</h3>
                  <p className="text-muted-foreground">
                    Eintragung im Handelsregister<br />
                    Registergericht: Amtsgericht Gelsenkirchen<br />
                    Registernummer: HRB 18458
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>
                  Anschrift
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="font-medium">SMEKT Verwaltungsgesellschaft mbH</p>
                  <p className="text-muted-foreground">Weseler Weg 5</p>
                  <p className="text-muted-foreground">46244 Bottrop</p>
                  <p className="text-muted-foreground">Deutschland</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>
                  Kontaktdaten
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="font-medium">Telefon</p>
                  <p className="text-muted-foreground">02041 9876543</p>
                </div>

                <div>
                  <p className="font-medium">E-Mail</p>
                  <p className="text-muted-foreground">
                    <a href="mailto:info@smeimmo.com" className="text-primary hover:underline">
                      info@smeimmo.com
                    </a>
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>
                  Zuständige Aufsichtsbehörde gemäß § 34c GewO
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="font-medium">Stadt Bottrop</p>
                  <p className="text-muted-foreground">Straßen- und Verkehrsamt – Abteilung Gewerbeangelegenheiten</p>
                  <p className="text-muted-foreground">Ernst-Wilczok-Platz 1</p>
                  <p className="text-muted-foreground">46236 Bottrop</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>
                  Rechtlicher Hinweis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-muted-foreground">
                    Diese Angaben entsprechen den bereitgestellten Impressumsdaten.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Impressum;
