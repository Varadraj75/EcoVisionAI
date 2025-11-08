import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Brain, TrendingUp, Thermometer, Calendar, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { predictEnergyUsage } from "@/data/kaggleData";
import { Badge } from "@/components/ui/badge";

export default function Predictions() {
  const [temperature, setTemperature] = useState(20);
  const [day, setDay] = useState(15);
  const [usagePrev, setUsagePrev] = useState(45);
  const [prediction, setPrediction] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const handlePredict = async () => {
    setLoading(true);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const predicted = predictEnergyUsage(temperature, day, usagePrev);
    setPrediction(predicted);
    setLoading(false);
  };

  // Generate comparison chart data
  const comparisonData = prediction ? [
    { label: "Previous Day", value: usagePrev, type: "actual" },
    { label: "Predicted", value: prediction, type: "predicted" },
  ] : [];

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
            <Brain className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">AI Energy Predictions</h1>
            <p className="text-muted-foreground">
              Forecast your energy consumption using machine learning
            </p>
          </div>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Input Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Prediction Parameters</CardTitle>
              <p className="text-sm text-muted-foreground">
                Adjust the inputs to generate your energy usage forecast
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Temperature Input */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-2">
                    <Thermometer className="h-4 w-4 text-chart-4" />
                    Temperature (°C)
                  </Label>
                  <Badge variant="secondary" className="font-mono">
                    {temperature}°C
                  </Badge>
                </div>
                <Slider
                  value={[temperature]}
                  onValueChange={(vals) => setTemperature(vals[0])}
                  min={-10}
                  max={40}
                  step={1}
                  className="w-full"
                  data-testid="slider-temperature"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>-10°C</span>
                  <span>40°C</span>
                </div>
              </div>

              {/* Day Input */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-chart-2" />
                    Day of Month
                  </Label>
                  <Badge variant="secondary" className="font-mono">
                    Day {day}
                  </Badge>
                </div>
                <Slider
                  value={[day]}
                  onValueChange={(vals) => setDay(vals[0])}
                  min={1}
                  max={31}
                  step={1}
                  className="w-full"
                  data-testid="slider-day"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>1</span>
                  <span>31</span>
                </div>
              </div>

              {/* Previous Usage Input */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="usage-prev" className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-chart-1" />
                    Previous Day Usage (kWh)
                  </Label>
                </div>
                <Input
                  id="usage-prev"
                  type="number"
                  value={usagePrev}
                  onChange={(e) => setUsagePrev(Number(e.target.value))}
                  min={0}
                  max={200}
                  step={0.1}
                  className="font-mono"
                  data-testid="input-usage-prev"
                />
                <p className="text-xs text-muted-foreground">
                  Enter your energy consumption from the previous day
                </p>
              </div>

              <Button
                size="lg"
                className="w-full"
                onClick={handlePredict}
                disabled={loading}
                data-testid="button-predict"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Generating Prediction...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    <span>Generate Prediction</span>
                  </div>
                )}
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Results Panel */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="space-y-6"
        >
          {/* Prediction Result */}
          <Card className={prediction ? "bg-gradient-to-br from-primary/10 via-card to-chart-2/10 border-card-border" : ""}>
            <CardHeader>
              <CardTitle>Prediction Result</CardTitle>
            </CardHeader>
            <CardContent>
              {prediction ? (
                <div className="space-y-6">
                  <div className="text-center p-8 rounded-xl bg-card/50 backdrop-blur-sm">
                    <div className="text-sm text-muted-foreground mb-2">
                      Predicted Energy Usage
                    </div>
                    <div className="text-6xl font-bold font-mono text-primary mb-2" data-testid="text-prediction-result">
                      {prediction}
                    </div>
                    <div className="text-xl text-muted-foreground">kWh</div>
                    
                    <div className="mt-6 flex items-center justify-center gap-2">
                      <TrendingUp className="h-5 w-5 text-primary" />
                      <span className="text-sm">
                        {prediction > usagePrev ? "Higher" : "Lower"} than previous day by{" "}
                        <span className="font-bold">
                          {Math.abs(((prediction - usagePrev) / usagePrev) * 100).toFixed(1)}%
                        </span>
                      </span>
                    </div>
                  </div>

                  {/* Comparison Chart */}
                  <div>
                    <div className="text-sm font-medium mb-4">Usage Comparison</div>
                    <ResponsiveContainer width="100%" height={200}>
                      <LineChart data={comparisonData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="label" className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                        <YAxis className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--popover))",
                            border: "1px solid hsl(var(--popover-border))",
                            borderRadius: "0.5rem",
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="value"
                          stroke="hsl(var(--primary))"
                          strokeWidth={3}
                          dot={{ fill: "hsl(var(--primary))", r: 6 }}
                        />
                        <ReferenceLine y={usagePrev} stroke="hsl(var(--muted-foreground))" strokeDasharray="3 3" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Insights */}
                  <div className="space-y-3">
                    <div className="text-sm font-medium">AI Insights</div>
                    <div className="space-y-2">
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-card/50">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Thermometer className="h-3 w-3 text-primary" />
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Temperature of {temperature}°C suggests {temperature < 10 ? "increased heating" : temperature > 25 ? "higher cooling" : "moderate"} energy needs
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-card/50">
                        <div className="w-6 h-6 rounded-full bg-chart-2/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Calendar className="h-3 w-3 text-chart-2" />
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Day {day} falls on a {day % 7 === 0 || day % 7 === 6 ? "weekend" : "weekday"}, affecting usage patterns
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Brain className="h-16 w-16 mx-auto mb-4 opacity-20" />
                  <p>Adjust the parameters and click "Generate Prediction"</p>
                  <p className="text-sm mt-2">Our AI model will forecast your energy usage</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Model Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">About the Model</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p>
                Our prediction model uses advanced regression analysis trained on thousands of 
                real-world energy consumption patterns from Kaggle datasets.
              </p>
              <p className="font-medium text-foreground mt-4">Key Factors:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Temperature and weather conditions</li>
                <li>Day-of-week patterns and seasonality</li>
                <li>Historical usage trends</li>
                <li>Time-series analysis</li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
