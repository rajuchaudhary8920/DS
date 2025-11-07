import { useState, useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapPin, AlertCircle, CheckCircle, Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface SafetyZone {
  id: string;
  name: string;
  lat: number;
  lng: number;
  safetyRating: "safe" | "moderate" | "caution";
  incidents: number;
}

const mockSafetyZones: SafetyZone[] = [
  { id: "1", name: "Downtown Area", lat: 40.7128, lng: -74.006, safetyRating: "safe", incidents: 2 },
  { id: "2", name: "Park District", lat: 40.7489, lng: -73.9681, safetyRating: "safe", incidents: 1 },
  { id: "3", name: "Shopping Center", lat: 40.7614, lng: -73.9776, safetyRating: "moderate", incidents: 5 },
  { id: "4", name: "Industrial Zone", lat: 40.6782, lng: -73.9442, safetyRating: "caution", incidents: 8 },
  { id: "5", name: "Residential Area", lat: 40.7282, lng: -73.9942, safetyRating: "safe", incidents: 0 },
];

export default function SafetyMap() {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedZone, setSelectedZone] = useState<SafetyZone | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {
          // Default to NYC if geolocation fails
          setUserLocation({ lat: 40.7128, lng: -74.006 });
        }
      );
    } else {
      setUserLocation({ lat: 40.7128, lng: -74.006 });
    }
  }, []);

  useEffect(() => {
    if (!mapRef.current || !userLocation || mapInstanceRef.current) return;

    // Initialize map
    const map = L.map(mapRef.current).setView([userLocation.lat, userLocation.lng], 12);
    mapInstanceRef.current = map;

    // Add OpenStreetMap tiles
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    // Add user location marker
    const userIcon = L.divIcon({
      html: `<div style="background-color: #3b82f6; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
      className: "",
      iconSize: [16, 16],
      iconAnchor: [8, 8],
    });

    L.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
      .addTo(map)
      .bindPopup("Your Location")
      .openPopup();

    // Add safety zone circles and markers
    mockSafetyZones.forEach((zone) => {
      const color =
        zone.safetyRating === "safe"
          ? "#22c55e"
          : zone.safetyRating === "moderate"
          ? "#eab308"
          : "#ef4444";

      // Add circle overlay
      L.circle([zone.lat, zone.lng], {
        color: color,
        fillColor: color,
        fillOpacity: 0.2,
        radius: 800,
        weight: 2,
      }).addTo(map);

      // Add zone marker
      const zoneIcon = L.divIcon({
        html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 12px;">${zone.incidents}</div>`,
        className: "",
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      L.marker([zone.lat, zone.lng], { icon: zoneIcon })
        .addTo(map)
        .bindPopup(
          `<div style="min-width: 150px;">
            <h3 style="font-weight: 600; margin-bottom: 4px;">${zone.name}</h3>
            <p style="font-size: 13px; color: #666; margin-bottom: 4px;">Safety: <span style="color: ${color}; font-weight: 600; text-transform: capitalize;">${zone.safetyRating}</span></p>
            <p style="font-size: 13px; color: #666;">${zone.incidents} incident${zone.incidents === 1 ? "" : "s"}</p>
          </div>`
        )
        .on("click", () => {
          setSelectedZone(zone);
        });
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [userLocation]);

  const getSafetyColor = (rating: string) => {
    switch (rating) {
      case "safe":
        return "bg-green-500";
      case "moderate":
        return "bg-yellow-500";
      case "caution":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getSafetyIcon = (rating: string) => {
    switch (rating) {
      case "safe":
        return <CheckCircle className="h-5 w-5" />;
      case "moderate":
        return <AlertCircle className="h-5 w-5" />;
      case "caution":
        return <AlertCircle className="h-5 w-5" />;
      default:
        return <Shield className="h-5 w-5" />;
    }
  };

  const handleZoneClick = (zone: SafetyZone) => {
    setSelectedZone(zone);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([zone.lat, zone.lng], 14);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="font-serif text-3xl lg:text-4xl font-bold mb-2">Safety Heat Map</h1>
        <p className="text-muted-foreground">
          View safety ratings and incident reports for nearby areas
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Interactive Map
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative w-full h-[500px] rounded-lg overflow-hidden border border-border">
                <div ref={mapRef} className="w-full h-full" data-testid="safety-map" />
                
                <div className="absolute top-4 right-4 bg-background/95 backdrop-blur p-3 rounded-lg shadow-lg border space-y-2 z-[1000]">
                  <p className="font-semibold text-sm">Legend</p>
                  <div className="space-y-1.5 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-green-500" />
                      <span>Safe</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-yellow-500" />
                      <span>Moderate</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-red-500" />
                      <span>Caution</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-blue-500" />
                      <span>You</span>
                    </div>
                  </div>
                </div>
              </div>
              {userLocation && (
                <p className="text-xs text-muted-foreground mt-2">
                  Your location: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Nearby Areas</CardTitle>
              <CardDescription>Safety ratings for your vicinity</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {mockSafetyZones.map((zone) => (
                <Card
                  key={zone.id}
                  className="hover-elevate active-elevate-2 cursor-pointer transition-all"
                  onClick={() => handleZoneClick(zone)}
                  data-testid={`zone-card-${zone.id}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-full ${getSafetyColor(zone.safetyRating)} flex items-center justify-center text-white flex-shrink-0`}>
                        {getSafetyIcon(zone.safetyRating)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold truncate">{zone.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="capitalize text-xs">
                            {zone.safetyRating}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {zone.incidents} {zone.incidents === 1 ? "incident" : "incidents"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>

          {selectedZone && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-lg">Zone Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-semibold">{selectedZone.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Safety Rating</p>
                  <Badge className="capitalize">{selectedZone.safetyRating}</Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Recent Incidents</p>
                  <p className="font-semibold">{selectedZone.incidents}</p>
                </div>
                <div className="pt-2 border-t">
                  <p className="text-xs text-muted-foreground">
                    Safety data is based on recent incident reports and community feedback. 
                    Always stay alert and trust your instincts.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <Card className="mt-6 bg-accent/5 border-accent/20">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-2">About Safety Data</h3>
              <p className="text-muted-foreground mb-3">
                This safety heat map shows areas based on reported incidents and community safety ratings. 
                The data is updated regularly to help you make informed decisions about your routes and destinations.
              </p>
              <p className="text-sm text-muted-foreground">
                Click on any zone marker or area card to view detailed safety information. The map displays 
                color-coded zones with incident counts to help you assess safety levels at a glance.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
