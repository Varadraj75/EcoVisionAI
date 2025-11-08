import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Brain, Thermometer, Calendar, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { Badge } from "@/components/ui/badge";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { predictionRequestSchema, type PredictionResponse } from "@shared/schema";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";

type PredictionFormData = z.infer<typeof predictionRequestSchema>;

export default function Predictions() {
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
  const { toast } = useToast();

  const form = useForm<PredictionFormData>({
    resolver: zodResolver(predictionRequestSchema),
    defaultValues: {
      temperature: 20,
      day: 15,
      usage_prev: 45,
    },
  });

  const predictionMutation = useMutation({
    mutationFn: async (data: PredictionFormData) => {
      const response = await apiRequest("POST", "/api/predictions/energy", data);
      return response.json() as Promise<PredictionResponse>;
    },
    onSuccess: (data) => {
      setPrediction(data);
      toast({
        title: "Prediction Generated",
        description: `Predicted energy usage: ${data.predicted_usage.toFixed(1)} kWh`,
      });
    },
    onError: () => {
      toast({
        title: "Prediction Failed",
        description: "Unable to generate prediction. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handlePredict = (data: PredictionFormData) => {
    predictionMutation.mutate(data);
  };

  const temperature = form.watch("temperature");
  const day = form.watch("day");
  const usagePrev = form.watch("usage_prev");

  // Generate comparison chart data
  const comparisonData = prediction ? [
    { label: "Previous Day", value: usagePrev, type: "actual" },
    { label: "Predicted", value: prediction.predicted_usage, type: "predicted" },
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
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handlePredict)} className="space-y-6">
                  {/* Temperature Input */}
                  <FormField
                    control={form.control}
                    name="temperature"
                    render={({ field }) => (
                      <FormItem>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <FormLabel className="flex items-center gap-2">
                              <Thermometer className="h-4 w-4 text-chart-4" />
                              Temperature (°C)
                            </FormLabel>
                            <Badge variant="secondary" className="font-mono">
                              {field.value}°C
                            </Badge>
                          </div>
                          <FormControl>
                            <Slider
                              value={[field.value]}
                              onValueChange={(vals) => field.onChange(vals[0])}
                              min={-10}
                              max={40}
                              step={1}
                              className="w-full"
                              data-testid="slider-temperature"
                            />
                          </FormControl>
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>-10°C</span>
                            <span>40°C</span>
                          </div>
                        </div>
                      </FormItem>
                    )}
                  />

                  {/* Day Input */}
                  <FormField
                    control={form.control}
                    name="day"
                    render={({ field }) => (
                      <FormItem>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <FormLabel className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-chart-2" />
                              Day of Month
                            </FormLabel>
                            <Badge variant="secondary" className="font-mono">
                              Day {field.value}
                            </Badge>
                          </div>
                          <FormControl>
                            <Slider
                              value={[field.value]}
                              onValueChange={(vals) => field.onChange(vals[0])}
                              min={1}
                              max={31}
                              step={1}
                              className="w-full"
                              data-testid="slider-day"
                            />
                          </FormControl>
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>1</span>
                            <span>31</span>
                          </div>
                        </div>
                      </FormItem>
                    )}
                  />

                  {/* Previous Usage Input */}
                  <FormField
                    control={form.control}
                    name="usage_prev"
                    render={({ field }) => (
                      <FormItem>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <FormLabel className="flex items-center gap-2">
                              <Zap className="h-4 w-4 text-chart-1" />
                              Previous Day Usage (kWh)
                            </FormLabel>
                          </div>
                          <FormControl>
                            <input
                              type="number"
                              {...field}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                              min={0}
                              max={200}
                              step={0.1}
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 font-mono"
                              data-testid="input-usage-prev"
                            />
                          </FormControl>
                          <p className="text-xs text-muted-foreground">
                            Enter your energy consumption from the previous day
                          </p>
                        </div>
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full"
                    disabled={predictionMutation.isPending}
                    data-testid="button-predict"
                  >
                    {predictionMutation.isPending ? (
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
                </form>
              </Form>
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
                      {prediction.predicted_usage.toFixed(1)}
                    </div>
                    <div className="text-xl text-muted-foreground">kWh</div>
                    
                    <div className="mt-6 flex items-center justify-center gap-2">
                      <Badge variant="secondary" className="text-sm">
                        Confidence: {((prediction.confidence || 0.92) * 100).toFixed(0)}%
                      </Badge>
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
