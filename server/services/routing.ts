// OpenRouteService - Free routing API
// Sign up for free API key at: https://openrouteservice.org/dev/#/signup
// Free tier: 40 requests/minute, 2000 requests/day

export interface RouteOption {
  name: string;
  distance_km: number;
  duration_min: number;
  co2_kg: number;
  type: "car" | "public_transit" | "bike" | "walk";
  recommended: boolean;
}

interface ORSResponse {
  features: Array<{
    properties: {
      summary: {
        distance: number;  // meters
        duration: number;  // seconds
      };
    };
    geometry: {
      coordinates: number[][];
    };
  }>;
}

// CO2 emission factors (kg CO₂ per km)
const EMISSION_FACTORS = {
  car_gas: 0.192,      // Average gasoline car
  car_diesel: 0.171,   // Average diesel car
  car_ev: 0.053,       // Electric vehicle (grid average)
  public_transit: 0.041, // Bus/train average
  bike: 0,             // Zero emissions
  walk: 0,             // Zero emissions
};

export async function getEcoFriendlyRoutes(
  origin: string,
  destination: string
): Promise<RouteOption[]> {
  // Check for API key first  
  if (!process.env.OPENROUTE_API_KEY) {
    throw new Error("OpenRouteService API key not configured. Please add OPENROUTE_API_KEY to environment secrets or use demo mode.");
  }

  const geocodeOrigin = await geocodeLocation(origin);
  const geocodeDest = await geocodeLocation(destination);

  if (!geocodeOrigin || !geocodeDest) {
    throw new Error("Unable to find the specified locations. Please check the city names and try again.");
  }

  const routes: RouteOption[] = [];
  let hasSuccessfulRoute = false;

    // Try to get driving route
    try {
      const carRoute = await getRoute(geocodeOrigin, geocodeDest, "driving-car");
      if (carRoute) {
        hasSuccessfulRoute = true;
        const distanceKm = carRoute.properties.summary.distance / 1000;
        const durationMin = Math.round(carRoute.properties.summary.duration / 60);
        
        // Add gas car option
        routes.push({
          name: "Drive (Gas Car)",
          distance_km: Math.round(distanceKm * 10) / 10,
          duration_min: durationMin,
          co2_kg: Math.round(distanceKm * EMISSION_FACTORS.car_gas * 10) / 10,
          type: "car",
          recommended: false,
        });

        // Add EV option (same route, different emissions)
        routes.push({
          name: "Drive (Electric Vehicle)",
          distance_km: Math.round(distanceKm * 10) / 10,
          duration_min: durationMin,
          co2_kg: Math.round(distanceKm * EMISSION_FACTORS.car_ev * 10) / 10,
          type: "car",
          recommended: true,
        });
      }
    } catch (error) {
      console.log("Could not get driving route:", error);
    }

    // Try to get cycling route
    try {
      const bikeRoute = await getRoute(geocodeOrigin, geocodeDest, "cycling-regular");
      if (bikeRoute) {
        hasSuccessfulRoute = true;
        const distanceKm = bikeRoute.properties.summary.distance / 1000;
        const durationMin = Math.round(bikeRoute.properties.summary.duration / 60);
        
        routes.push({
          name: "Bicycle",
          distance_km: Math.round(distanceKm * 10) / 10,
          duration_min: durationMin,
          co2_kg: 0,
          type: "bike",
          recommended: distanceKm < 15, // Recommend for < 15km
        });
      }
    } catch (error) {
      console.log("Could not get cycling route:", error);
    }

    // Try to get walking route
    try {
      const walkRoute = await getRoute(geocodeOrigin, geocodeDest, "foot-walking");
      if (walkRoute) {
        const distanceKm = walkRoute.properties.summary.distance / 1000;
        const durationMin = Math.round(walkRoute.properties.summary.duration / 60);
        
        if (distanceKm < 8) { // Only include walk if < 8km
          routes.push({
            name: "Walk",
            distance_km: Math.round(distanceKm * 10) / 10,
            duration_min: durationMin,
            co2_kg: 0,
            type: "walk",
            recommended: distanceKm < 3,
          });
        }
      }
    } catch (error) {
      console.log("Could not get walking route:", error);
    }

    // Add estimated public transit option based on driving route
    if (routes.length > 0) {
      const carRoute = routes.find(r => r.type === "car");
      if (carRoute) {
        routes.push({
          name: "Public Transit",
          distance_km: carRoute.distance_km,
          duration_min: Math.round(carRoute.duration_min * 1.3), // ~30% longer
          co2_kg: Math.round(carRoute.distance_km * EMISSION_FACTORS.public_transit * 10) / 10,
          type: "public_transit",
          recommended: carRoute.distance_km > 5,
        });
      }
    }

  // If no routes were successfully calculated, throw an error
  if (!hasSuccessfulRoute) {
    throw new Error("OpenRouteService API error. Please verify your API key is valid and the service is available.");
  }

  // Mark the lowest CO2 option as recommended if none are marked
  if (routes.length > 0 && !routes.some(r => r.recommended)) {
    const lowestCO2 = routes.reduce((min, r) => r.co2_kg < min.co2_kg ? r : min);
    lowestCO2.recommended = true;
  }

  return routes;
}

// Demo/fallback function for when API is not available
export function getDemoRoutes(origin: string, destination: string): RouteOption[] {
  return getFallbackRoutes(origin, destination, true);
}

async function geocodeLocation(location: string): Promise<[number, number] | null> {
  try {
    // Use free Nominatim geocoding (OpenStreetMap)
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&format=json&limit=1`,
      {
        headers: {
          'User-Agent': 'EcoVisionAI/1.0',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Geocoding failed: ${response.statusText}`);
    }

    const data = await response.json();
    if (data.length === 0) {
      return null;
    }

    // Return [lon, lat] format for OpenRouteService
    return [parseFloat(data[0].lon), parseFloat(data[0].lat)];
  } catch (error) {
    console.error("Geocoding error:", error);
    return null;
  }
}

// Fallback routes when API key is not configured or API fails
function getFallbackRoutes(origin: string, destination: string, isMockData: boolean = false): RouteOption[] {
  // Generate reasonable mock data based on typical city distances
  const estimatedDistanceKm = 25; // Assume ~25km for demonstration
  
  const routeName = isMockData ? (name: string) => `${name} (Demo Data)` : (name: string) => name;
  
  return [
    {
      name: routeName("Drive (Electric Vehicle)"),
      distance_km: estimatedDistanceKm,
      duration_min: 30,
      co2_kg: Math.round(estimatedDistanceKm * EMISSION_FACTORS.car_ev * 10) / 10,
      type: "car",
      recommended: true,
    },
    {
      name: routeName("Drive (Gas Car)"),
      distance_km: estimatedDistanceKm,
      duration_min: 30,
      co2_kg: Math.round(estimatedDistanceKm * EMISSION_FACTORS.car_gas * 10) / 10,
      type: "car",
      recommended: false,
    },
    {
      name: routeName("Public Transit"),
      distance_km: estimatedDistanceKm,
      duration_min: 45,
      co2_kg: Math.round(estimatedDistanceKm * EMISSION_FACTORS.public_transit * 10) / 10,
      type: "public_transit",
      recommended: false,
    },
    {
      name: routeName("Bicycle"),
      distance_km: estimatedDistanceKm,
      duration_min: 90,
      co2_kg: 0,
      type: "bike",
      recommended: false,
    },
  ];
}

async function getRoute(
  start: [number, number],
  end: [number, number],
  profile: string
): Promise<ORSResponse['features'][0] | null> {
  const response = await fetch(
    `https://api.openrouteservice.org/v2/directions/${profile}?start=${start[0]},${start[1]}&end=${end[0]},${end[1]}`,
    {
      headers: {
        'Accept': 'application/json',
        'Authorization': process.env.OPENROUTE_API_KEY || '',
      },
    }
  );

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      throw new Error("OpenRouteService API error");
    }
    // For other errors, log but don't throw (allow other transport modes to be tried)
    console.error(`${profile} route failed with status ${response.status}`);
    return null;
  }

  const data: ORSResponse = await response.json();
  return data.features[0] || null;
}
