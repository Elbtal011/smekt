import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const filterCellClass = "rounded-md px-4 py-2.5 transition-colors hover:bg-slate-50";
const labelClass = "mb-1 block text-[10px] font-semibold uppercase tracking-wide text-slate-500";
const controlClass = "h-7 border-0 bg-transparent px-0 py-0 text-sm font-medium text-slate-900 shadow-none ring-0 placeholder:text-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0";
const selectClass = "h-7 border-0 bg-transparent px-0 py-0 text-sm font-medium text-slate-900 shadow-none ring-0 focus:ring-0 focus:ring-offset-0 [&>span]:line-clamp-1";

export const PropertySearchFilter = () => {
  const navigate = useNavigate();
  const [searchData, setSearchData] = useState({
    location: "",
    propertyType: "",
    maxPrice: "",
    rooms: "",
  });

  const { data: cities = [] } = useQuery({
    queryKey: ["cities"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cities")
        .select("id, name, slug")
        .eq("is_active", true)
        .order("display_order");

      if (error) throw error;
      return (data || []).filter((city) => city.slug && city.slug.trim() !== "" && city.name && city.name.trim() !== "");
    },
  });

  const { data: propertyTypes = [] } = useQuery({
    queryKey: ["property-types"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("property_types")
        .select("id, name, slug")
        .eq("is_active", true)
        .order("display_order");

      if (error) throw error;
      return (data || []).filter((type) => type.slug && type.slug.trim() !== "" && type.name && type.name.trim() !== "");
    },
  });

  const handleSearch = () => {
    const params = new URLSearchParams();

    if (searchData.location) params.append("location", searchData.location);
    if (searchData.propertyType) params.append("propertyType", searchData.propertyType);
    if (searchData.maxPrice) params.append("maxPrice", searchData.maxPrice);
    if (searchData.rooms) params.append("rooms", searchData.rooms);

    navigate(`/mietangebote?${params.toString()}`);
  };

  return (
    <div className="mx-auto w-full max-w-[1250px] rounded-md border border-slate-100 bg-white p-1.5 shadow-xl shadow-slate-900/10">
      <div className="grid grid-cols-1 gap-1 sm:grid-cols-2 lg:grid-cols-[1.35fr_1.2fr_1fr_0.85fr_112px] lg:divide-x lg:divide-slate-200">
        <div className={filterCellClass}>
          <Label htmlFor="location" className={labelClass}>
            Standort
          </Label>
          <Select value={searchData.location} onValueChange={(value) => setSearchData({ ...searchData, location: value })}>
            <SelectTrigger className={selectClass}>
              <SelectValue placeholder="Stadt wählen" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle Städte</SelectItem>
              {cities.map((city) => (
                <SelectItem key={city.id} value={city.slug}>
                  {city.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className={filterCellClass}>
          <Label htmlFor="propertyType" className={labelClass}>
            Objektart
          </Label>
          <Select value={searchData.propertyType} onValueChange={(value) => setSearchData({ ...searchData, propertyType: value })}>
            <SelectTrigger className={selectClass}>
              <SelectValue placeholder="Typ wählen" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle Typen</SelectItem>
              {propertyTypes.map((type) => (
                <SelectItem key={type.id} value={type.slug}>
                  {type.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className={filterCellClass}>
          <Label htmlFor="maxPrice" className={labelClass}>
            Budget
          </Label>
          <Input
            id="maxPrice"
            type="number"
            placeholder="bis 2000"
            className={controlClass}
            value={searchData.maxPrice}
            onChange={(e) => setSearchData({ ...searchData, maxPrice: e.target.value })}
          />
        </div>

        <div className={filterCellClass}>
          <Label htmlFor="rooms" className={labelClass}>
            Zimmer
          </Label>
          <Select value={searchData.rooms} onValueChange={(value) => setSearchData({ ...searchData, rooms: value })}>
            <SelectTrigger className={selectClass}>
              <SelectValue placeholder="Anzahl" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle Zimmer</SelectItem>
              <SelectItem value="1">1 Zimmer</SelectItem>
              <SelectItem value="2">2 Zimmer</SelectItem>
              <SelectItem value="3">3 Zimmer</SelectItem>
              <SelectItem value="4">4 Zimmer</SelectItem>
              <SelectItem value="5+">5+ Zimmer</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-stretch p-1 lg:pl-2.5">
          <Button onClick={handleSearch} className="h-full min-h-[52px] w-full rounded-md px-4 text-sm font-semibold">
            Suchen
          </Button>
        </div>
      </div>
    </div>
  );
};
