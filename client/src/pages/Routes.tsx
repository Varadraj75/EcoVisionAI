import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Route as RouteIcon, MapPin, Clock, TrendingDown, Car, Bus, Bike, Leaf } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import type { RouteOption } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const routeIcons = {
  car: Car,
  public_transit: Bus,
  bike: Bike,
  walk: Leaf,
};

export default function Routes() {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [routes, setRoutes] = useState<RouteOption[]>([]);
  const { toast } = useToast();

  const routesMutation = useMutation({
    mutationFn: async ({ origin, destination }: { origin: string; destination: string }) => {
      const response = await apiRequest("POST", "/api/eco/route", {
        origin,
        destination,
      });
      return response.json() as Promise<{ routes: RouteOption[]; origin: string; destination: string }>;
    },
    onSuccess: (data) => {
      setRoutes(data.routes);
      toast({
        title: "Routes Found",
        description: `Found ${data.routes.length} eco-friendly route options`,
      });
    },
    onError: (error) => {
      console.error("Routes error:", error);
      // Clear stale route data on error
      setRoutes([]);
      
      // Extract error message from response if available
      let errorMessage = "Unable to calculate routes. Please check the locations and try again.";
      if (error instanceof Error) {
        // Parse backend error if it contains JSON
        try {
          const match = error.message.match(/\{.*\}/);
          if (match) {
            const errData = JSON.parse(match[0]);
            errorMessage = errData.error || errorMessage;
          } else {
            errorMessage = error.message;
          }
        } catch {
          errorMessage = error.message;
        }
      }
      
      toast({
        title: "Route Calculation Failed",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  const handleFindRoutes = () => {
    if (!origin || !destination) return;
    routesMutation.mutate({ origin, destination });
  };

  const calculateSavings = () => {
    if (routes.length === 0) return 0;
    const maxCO2 = Math.max(...routes.map(r => r.co2_kg));
    const minCO2 = Math.min(...routes.map(r => r.co2_kg));
    return maxCO2 - minCO2;
  };

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <RouteIcon className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Eco-Route Optimizer</h1>
            <p className="text-muted-foreground">
              Find the most sustainable routes and reduce your carbon footprint
            </p>
          </div>
        </div>
      </motion.div>

      {/* Search Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Plan Your Journey</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="origin" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-chart-1" />
                  Origin
                </Label>
                <Input
                  id="origin"
                  placeholder="e.g., New York"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  data-testid="input-origin"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="destination" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-chart-4" />
                  Destination
                </Label>
                <Input
                  id="destination"
                  placeholder="e.g., Boston"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  data-testid="input-destination"
                />
              </div>
            </div>
            <Button
              size="lg"
              className="w-full mt-6"
              onClick={handleFindRoutes}
              disabled={routesMutation.isPending || !origin || !destination}
              data-testid="button-find-routes"
            >
              {routesMutation.isPending ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Calculating Routes...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <RouteIcon className="h-5 w-5" />
                  <span>Find Eco-Friendly Routes</span>
                </div>
              )}
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Results */}
      {routes.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="space-y-6"
        >
          {/* Savings Summary */}
          <Card className="bg-gradient-to-br from-primary/10 via-card to-chart-2/10 border-card-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">
                    Potential CO₂ Savings
                  </div>
                  <div className="text-4xl font-bold font-mono text-primary">
                    {calculateSavings().toFixed(1)} kg
                  </div>
                </div>
                <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center">
                  <TrendingDown className="h-8 w-8 text-primary" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-3">
                By choosing the most eco-friendly option instead of the most polluting one
              </p>
            </CardContent>
          </Card>

          {/* Route Options */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Available Routes</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {routes.map((route, index) => {
                const Icon = routeIcons[route.type];
                return (
                  <motion.div
                    key={route.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index, duration: 0.5 }}
                  >
                    <Card
                      className={`h-full ${route.recommended ? "border-primary border-2 bg-gradient-to-br from-primary/5 via-card to-transparent" : "hover-elevate"}`}
                      data-testid={`route-${route.name.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-lg ${route.recommended ? "bg-primary/10" : "bg-muted"} flex items-center justify-center`}>
                              <Icon className={`h-5 w-5 ${route.recommended ? "text-primary" : "text-muted-foreground"}`} />
                            </div>
                            <div>
                              <CardTitle className="text-lg">{route.name}</CardTitle>
                              {route.recommended && (
                                <Badge className="mt-1">Recommended</Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-xs text-muted-foreground mb-1">Distance</div>
                            <div className="font-mono font-bold">{route.distance_km} km</div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground mb-1">Duration</div>
                            <div className="font-mono font-bold">{route.duration_min} min</div>
                          </div>
                        </div>

                        <div className="p-4 rounded-lg bg-muted/50">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">CO₂ Emissions</span>
                            <Leaf className="h-4 w-4 text-primary" />
                          </div>
                          <div className="text-2xl font-bold font-mono text-primary">
                            {route.co2_kg} kg
                          </div>
                          {route.co2_kg === 0 && (
                            <Badge variant="default" className="mt-2 bg-primary/10 text-primary hover:bg-primary/20">
                              Zero Emissions
                            </Badge>
                          )}
                        </div>

                        {route.recommended && (
                          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                            <div className="flex items-start gap-2">
                              <TrendingDown className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                              <p className="text-xs text-muted-foreground">
                                This route offers the best balance of environmental impact, time, and convenience.
                              </p>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Environmental Impact */}
          <Card>
            <CardHeader>
              <CardTitle>Environmental Impact Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {routes.map((route) => (
                  <div key={route.name}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">{route.name}</span>
                      <span className="text-sm font-mono">{route.co2_kg} kg CO₂</span>
                    </div>
                    <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full ${route.recommended ? "bg-primary" : "bg-chart-3"} rounded-full transition-all duration-500`}
                        style={{
                          width: `${(route.co2_kg / Math.max(...routes.map(r => r.co2_kg))) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Empty State */}
      {routes.length === 0 && !routesMutation.isPending && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <Card className="p-12">
            <div className="text-center text-muted-foreground">
              <RouteIcon className="h-20 w-20 mx-auto mb-4 opacity-20" />
              <p className="text-lg">Enter your origin and destination to find eco-friendly routes</p>
              <p className="text-sm mt-2">Get real routing data with actual CO₂ emissions for different transport modes</p>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
