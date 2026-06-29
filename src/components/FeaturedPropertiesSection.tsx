import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface FeaturedProperty {
  id: string;
  title: string;
  price_monthly: number;
  area_sqm: number;
  rooms: string;
  images: string[] | null;
  is_featured: boolean;
  city: { name: string } | null;
  property_type: { name: string } | null;
}

const formatPrice = (price: number) =>
  new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
  }).format(price);

export const FeaturedPropertiesSection = () => {
  const { data: properties = [], isLoading } = useQuery({
    queryKey: ["featured-home-properties"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("properties")
        .select(
          `
          id,
          title,
          price_monthly,
          area_sqm,
          rooms,
          images,
          is_featured,
          city:cities(name),
          property_type:property_types(name)
        `,
        )
        .eq("is_active", true)
        .order("is_featured", { ascending: false })
        .order("created_at", { ascending: false })
        .limit(3);

      if (error) throw error;
      return (data || []) as FeaturedProperty[];
    },
  });

  return (
    <section className="bg-background py-16 md:py-20">
      <div className="container mx-auto px-4">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
              Aktuelle Mietangebote
            </h2>
            <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">
              Ausgewählte Wohn- und Gewerbeflächen in gepflegten Lagen.
            </p>
          </div>
          <Button asChild variant="outline" className="w-fit">
            <Link to="/mietangebote">
              Alle Angebote ansehen
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <Card key={index} className="overflow-hidden border-border/60">
                <Skeleton className="aspect-[4/3] w-full" />
                <CardContent className="space-y-4 p-5">
                  <Skeleton className="h-5 w-2/3" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-9 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : properties.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {properties.map((property) => (
              <Card key={property.id} className="group overflow-hidden border-border/60 transition-shadow hover:shadow-lg">
                <Link to={`/immobilie/${property.id}`} className="block">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={property.images?.[0] || "/placeholder.svg"}
                      alt={property.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    {property.is_featured && (
                      <Badge className="absolute left-3 top-3 bg-primary text-primary-foreground">
                        Empfohlen
                      </Badge>
                    )}
                  </div>
                </Link>

                <CardContent className="p-5">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <Badge variant="secondary" className="truncate">
                      {property.property_type?.name || "Immobilie"}
                    </Badge>
                    <div className="flex min-w-0 items-center text-sm text-muted-foreground">
                      <MapPin className="mr-1 h-3.5 w-3.5 flex-shrink-0" />
                      <span className="truncate">{property.city?.name || "Standort"}</span>
                    </div>
                  </div>

                  <Link to={`/immobilie/${property.id}`} className="block">
                    <h3 className="mb-3 line-clamp-2 text-xl font-semibold text-foreground transition-colors group-hover:text-primary">
                      {property.title}
                    </h3>
                  </Link>

                  <div className="mb-5 grid grid-cols-3 gap-3 text-sm">
                    <div>
                      <div className="font-semibold text-foreground">{formatPrice(property.price_monthly)}</div>
                      <div className="text-muted-foreground">Monat</div>
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">{property.area_sqm} m²</div>
                      <div className="text-muted-foreground">Fläche</div>
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">{property.rooms}</div>
                      <div className="text-muted-foreground">Zimmer</div>
                    </div>
                  </div>

                  <Button asChild variant="outline" className="w-full">
                    <Link to={`/immobilie/${property.id}`}>Details ansehen</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="rounded-md border border-border/60 bg-muted/20 p-8 text-center">
            <h3 className="mb-2 text-xl font-semibold text-foreground">Derzeit keine Angebote verfügbar</h3>
            <p className="mx-auto mb-5 max-w-xl text-muted-foreground">
              Sobald neue Wohn- oder Gewerbeflächen verfügbar sind, erscheinen sie hier.
            </p>
            <Button asChild>
              <Link to="/mietangebote">Zu den Mietangeboten</Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};
