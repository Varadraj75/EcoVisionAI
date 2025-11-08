// Hardcoded Kaggle-style sustainability datasets
// Based on real patterns from energy consumption, water usage, and carbon emissions data

export const energyConsumptionData = [
  { date: "2024-01-01", energy_kwh: 45.2, water_liters: 250, co2_kg: 18.5 },
  { date: "2024-01-02", energy_kwh: 42.8, water_liters: 235, co2_kg: 17.2 },
  { date: "2024-01-03", energy_kwh: 48.5, water_liters: 270, co2_kg: 19.8 },
  { date: "2024-01-04", energy_kwh: 41.3, water_liters: 220, co2_kg: 16.5 },
  { date: "2024-01-05", energy_kwh: 39.7, water_liters: 215, co2_kg: 15.9 },
  { date: "2024-01-06", energy_kwh: 52.1, water_liters: 290, co2_kg: 21.3 },
  { date: "2024-01-07", energy_kwh: 50.4, water_liters: 280, co2_kg: 20.6 },
  { date: "2024-01-08", energy_kwh: 44.6, water_liters: 245, co2_kg: 18.1 },
  { date: "2024-01-09", energy_kwh: 43.2, water_liters: 240, co2_kg: 17.6 },
  { date: "2024-01-10", energy_kwh: 46.8, water_liters: 255, co2_kg: 19.1 },
  { date: "2024-01-11", energy_kwh: 40.5, water_liters: 225, co2_kg: 16.4 },
  { date: "2024-01-12", energy_kwh: 38.9, water_liters: 210, co2_kg: 15.6 },
  { date: "2024-01-13", energy_kwh: 47.3, water_liters: 260, co2_kg: 19.3 },
  { date: "2024-01-14", energy_kwh: 49.7, water_liters: 275, co2_kg: 20.3 },
  { date: "2024-01-15", energy_kwh: 45.8, water_liters: 250, co2_kg: 18.7 },
  { date: "2024-01-16", energy_kwh: 42.4, water_liters: 230, co2_kg: 17.3 },
  { date: "2024-01-17", energy_kwh: 44.1, water_liters: 242, co2_kg: 18.0 },
  { date: "2024-01-18", energy_kwh: 41.8, water_liters: 228, co2_kg: 17.0 },
  { date: "2024-01-19", energy_kwh: 39.2, water_liters: 212, co2_kg: 15.8 },
  { date: "2024-01-20", energy_kwh: 51.6, water_liters: 285, co2_kg: 21.1 },
  { date: "2024-01-21", energy_kwh: 48.9, water_liters: 268, co2_kg: 20.0 },
  { date: "2024-01-22", energy_kwh: 43.7, water_liters: 238, co2_kg: 17.8 },
  { date: "2024-01-23", energy_kwh: 42.1, water_liters: 232, co2_kg: 17.2 },
  { date: "2024-01-24", energy_kwh: 46.2, water_liters: 252, co2_kg: 18.9 },
  { date: "2024-01-25", energy_kwh: 40.8, water_liters: 223, co2_kg: 16.6 },
  { date: "2024-01-26", energy_kwh: 38.4, water_liters: 208, co2_kg: 15.5 },
  { date: "2024-01-27", energy_kwh: 50.2, water_liters: 278, co2_kg: 20.5 },
  { date: "2024-01-28", energy_kwh: 49.1, water_liters: 272, co2_kg: 20.1 },
  { date: "2024-01-29", energy_kwh: 44.9, water_liters: 246, co2_kg: 18.3 },
  { date: "2024-01-30", energy_kwh: 43.5, water_liters: 240, co2_kg: 17.7 },
];

export const sustainabilityTips = [
  {
    id: "1",
    category: "Energy",
    tip: "Switch to LED bulbs to reduce energy consumption by up to 75% compared to incandescent bulbs.",
    impact: "high" as const,
  },
  {
    id: "2",
    category: "Water",
    tip: "Fix leaky faucets immediately - a dripping faucet can waste up to 3,000 gallons per year.",
    impact: "medium" as const,
  },
  {
    id: "3",
    category: "Transportation",
    tip: "Carpool or use public transit once a week to reduce your carbon footprint by 20%.",
    impact: "high" as const,
  },
  {
    id: "4",
    category: "Energy",
    tip: "Unplug electronics when not in use - phantom power can account for 10% of home energy use.",
    impact: "medium" as const,
  },
  {
    id: "5",
    category: "Water",
    tip: "Take shorter showers - reducing shower time by 2 minutes saves 10 gallons of water.",
    impact: "medium" as const,
  },
  {
    id: "6",
    category: "Recycling",
    tip: "Compost food waste to reduce landfill methane emissions and create nutrient-rich soil.",
    impact: "high" as const,
  },
  {
    id: "7",
    category: "Energy",
    tip: "Use a programmable thermostat to automatically adjust temperature and save 10-30% on heating/cooling.",
    impact: "high" as const,
  },
  {
    id: "8",
    category: "Transportation",
    tip: "Maintain proper tire pressure to improve fuel efficiency by up to 3%.",
    impact: "low" as const,
  },
  {
    id: "9",
    category: "Water",
    tip: "Install low-flow showerheads to reduce water usage by 40% without sacrificing pressure.",
    impact: "high" as const,
  },
  {
    id: "10",
    category: "Energy",
    tip: "Air dry dishes instead of using the dishwasher's drying cycle to save energy.",
    impact: "low" as const,
  },
];

export const routeOptions = {
  "New York to Boston": [
    {
      name: "Electric Train",
      distance_km: 346,
      duration_min: 210,
      co2_kg: 8.5,
      type: "public_transit" as const,
      recommended: true,
    },
    {
      name: "Carpool (EV)",
      distance_km: 346,
      duration_min: 240,
      co2_kg: 12.3,
      type: "car" as const,
      recommended: false,
    },
    {
      name: "Solo Drive (Gas)",
      distance_km: 346,
      duration_min: 240,
      co2_kg: 68.4,
      type: "car" as const,
      recommended: false,
    },
  ],
  "San Francisco to Los Angeles": [
    {
      name: "High-Speed Rail",
      distance_km: 617,
      duration_min: 180,
      co2_kg: 15.2,
      type: "public_transit" as const,
      recommended: true,
    },
    {
      name: "Electric Vehicle",
      distance_km: 617,
      duration_min: 360,
      co2_kg: 22.1,
      type: "car" as const,
      recommended: false,
    },
    {
      name: "Standard Car",
      distance_km: 617,
      duration_min: 360,
      co2_kg: 121.9,
      type: "car" as const,
      recommended: false,
    },
  ],
  default: [
    {
      name: "Public Transit",
      distance_km: 15,
      duration_min: 35,
      co2_kg: 1.2,
      type: "public_transit" as const,
      recommended: true,
    },
    {
      name: "Bike",
      distance_km: 15,
      duration_min: 45,
      co2_kg: 0,
      type: "bike" as const,
      recommended: true,
    },
    {
      name: "Car",
      distance_km: 15,
      duration_min: 20,
      co2_kg: 3.6,
      type: "car" as const,
      recommended: false,
    },
  ],
};

export function getRouteOptions(origin: string, destination: string) {
  const key = `${origin} to ${destination}`;
  return routeOptions[key as keyof typeof routeOptions] || routeOptions.default;
}

// ML prediction helper (fallback heuristic)
export function predictEnergyUsage(temperature: number, day: number, usagePrev: number): number {
  // Simple heuristic formula based on temperature, day patterns, and previous usage
  const tempFactor = temperature < 10 ? 1.3 : temperature > 25 ? 1.2 : 1.0;
  const dayFactor = day % 7 === 0 || day % 7 === 6 ? 0.9 : 1.0; // Weekend adjustment
  const trendFactor = 0.3;
  
  const predicted = (usagePrev * trendFactor + 35) * tempFactor * dayFactor;
  return Math.round(predicted * 10) / 10;
}
