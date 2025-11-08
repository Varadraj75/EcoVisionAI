import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, Droplet, Cloud, TrendingDown, Calendar } from "lucide-react";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import type { UsageRecord } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const { user } = useAuth();

  // Fetch real consumption data from backend
  const { data: usageRecords, isLoading, error } = useQuery<UsageRecord[]>({
    queryKey: ["/api/usage/history", user?.uid],
    enabled: !!user?.uid,
  });

  if (isLoading) {
    return (
      <div className="p-8 space-y-8">
        <Skeleton className="h-32 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (error || !usageRecords) {
    return (
      <div className="p-8">
        <Card className="p-8 border-destructive">
          <p className="text-destructive">Failed to load usage data. Please try again.</p>
        </Card>
      </div>
    );
  }

  // Calculate metrics from real data
  const totalEnergy = usageRecords.reduce((sum, d) => sum + d.energy_kwh, 0);
  const avgEnergy = totalEnergy / usageRecords.length;
  const totalWater = usageRecords.reduce((sum, d) => sum + (d.water_liters || 0), 0);
  const totalCO2 = usageRecords.reduce((sum, d) => sum + (d.co2_kg || 0), 0);
  const avgCO2 = totalCO2 / usageRecords.length;

  // Calculate trends (comparing last 7 days vs previous 7 days)
  const recentData = usageRecords.slice(-7);
  const previousData = usageRecords.slice(-14, -7);
  const recentAvgEnergy = recentData.reduce((sum, d) => sum + d.energy_kwh, 0) / 7;
  const previousAvgEnergy = previousData.reduce((sum, d) => sum + d.energy_kwh, 0) / 7;
  const energyTrend = ((recentAvgEnergy - previousAvgEnergy) / previousAvgEnergy) * 100;

  const metrics = [
    {
      title: "Energy Usage",
      value: avgEnergy.toFixed(1),
      unit: "kWh/day",
      icon: Zap,
      trend: energyTrend,
      color: "text-chart-1",
      bgColor: "bg-chart-1/10",
    },
    {
      title: "Water Consumption",
      value: (totalWater / usageRecords.length).toFixed(0),
      unit: "L/day",
      icon: Droplet,
      trend: -2.3,
      color: "text-chart-2",
      bgColor: "bg-chart-2/10",
    },
    {
      title: "Carbon Footprint",
      value: avgCO2.toFixed(1),
      unit: "kg CO₂/day",
      icon: Cloud,
      trend: -5.8,
      color: "text-chart-3",
      bgColor: "bg-chart-3/10",
    },
    {
      title: "Total Savings",
      value: "247",
      unit: "kg CO₂ saved",
      icon: TrendingDown,
      trend: 12.4,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
  ];

  const chartData = usageRecords.slice(-14).map(d => ({
    date: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    energy: d.energy_kwh,
    water: (d.water_liters || 0) / 10, // Scale for visibility
    co2: d.co2_kg || 0,
  }));

  return (
    <div className="p-8 space-y-8">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="p-8 bg-gradient-to-br from-primary/10 via-card to-chart-2/10 border-card-border">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2" data-testid="text-welcome">
                Welcome back, {user?.name || "User"}!
              </h1>
              <p className="text-muted-foreground text-lg">
                Here's your sustainability overview for the past 30 days
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">
                {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
          >
            <Card className="hover-elevate" data-testid={`metric-${metric.title.toLowerCase().replace(/\s+/g, '-')}`}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {metric.title}
                </CardTitle>
                <div className={`w-10 h-10 rounded-lg ${metric.bgColor} flex items-center justify-center`}>
                  <metric.icon className={`h-5 w-5 ${metric.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-baseline gap-2">
                    <div className="text-3xl font-bold font-mono" data-testid={`value-${metric.title.toLowerCase().replace(/\s+/g, '-')}`}>
                      {metric.value}
                    </div>
                    <div className="text-sm text-muted-foreground">{metric.unit}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    {metric.trend < 0 ? (
                      <Badge variant="default" className="bg-primary/10 text-primary hover:bg-primary/20">
                        <TrendingDown className="h-3 w-3 mr-1" />
                        {Math.abs(metric.trend).toFixed(1)}%
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="text-xs">
                        +{metric.trend.toFixed(1)}%
                      </Badge>
                    )}
                    <span className="text-xs text-muted-foreground">vs last week</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Consumption Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="lg:col-span-2"
        >
          <Card className="p-6">
            <CardHeader className="px-0 pt-0">
              <CardTitle>Consumption Trends</CardTitle>
              <p className="text-sm text-muted-foreground">
                Energy, water, and CO₂ patterns over the last 2 weeks
              </p>
            </CardHeader>
            <CardContent className="px-0 pb-0">
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorEnergy" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorCO2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--chart-3))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--chart-3))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="date"
                    className="text-xs"
                    tick={{ fill: "hsl(var(--muted-foreground))" }}
                  />
                  <YAxis className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--popover-border))",
                      borderRadius: "0.5rem",
                    }}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="energy"
                    stroke="hsl(var(--chart-1))"
                    fill="url(#colorEnergy)"
                    strokeWidth={2}
                    name="Energy (kWh)"
                  />
                  <Area
                    type="monotone"
                    dataKey="co2"
                    stroke="hsl(var(--chart-3))"
                    fill="url(#colorCO2)"
                    strokeWidth={2}
                    name="CO₂ (kg)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Insights Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="space-y-6"
        >
          <Card className="p-6">
            <CardHeader className="px-0 pt-0">
              <CardTitle>Weekly Insights</CardTitle>
            </CardHeader>
            <CardContent className="px-0 pb-0 space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-primary/5">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <TrendingDown className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium text-sm mb-1">Great Progress!</div>
                    <div className="text-xs text-muted-foreground">
                      Your CO₂ emissions decreased by 5.8% this week. Keep it up!
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-chart-2/5">
                  <div className="w-8 h-8 rounded-full bg-chart-2/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Droplet className="h-4 w-4 text-chart-2" />
                  </div>
                  <div>
                    <div className="font-medium text-sm mb-1">Water Savings</div>
                    <div className="text-xs text-muted-foreground">
                      You've saved 160L of water compared to last week's average.
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-chart-1/5">
                  <div className="w-8 h-8 rounded-full bg-chart-1/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Zap className="h-4 w-4 text-chart-1" />
                  </div>
                  <div>
                    <div className="font-medium text-sm mb-1">Peak Usage</div>
                    <div className="text-xs text-muted-foreground">
                      Your highest energy day was Jan 6 with 52.1 kWh.
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-primary/10 via-card to-chart-2/10 border-card-border">
            <div className="text-center space-y-2">
              <div className="text-4xl font-bold font-mono text-primary">87</div>
              <div className="text-sm font-medium">Sustainability Score</div>
              <div className="text-xs text-muted-foreground">
                You're in the top 15% of users!
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
