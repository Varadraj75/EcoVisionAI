import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Zap, Droplet, TrendingDown } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import type { UserConsumptionProfile } from "@shared/schema";

export default function ConsumptionInput() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const [formData, setFormData] = useState({
    monthlyEnergyKwh: "",
    monthlyWaterLiters: "",
    monthlyCo2Kg: "",
  });

  // Fetch existing profile if available
  const { data: existingProfile } = useQuery<UserConsumptionProfile | null>({
    queryKey: [`/api/consumption/profile/${user?.id}`],
    enabled: !!user?.id,
  });

  // Set form data when existing profile loads
  useEffect(() => {
    if (existingProfile) {
      setFormData({
        monthlyEnergyKwh: existingProfile.monthlyEnergyKwh || "",
        monthlyWaterLiters: existingProfile.monthlyWaterLiters || "",
        monthlyCo2Kg: existingProfile.monthlyCo2Kg || "",
      });
    }
  }, [existingProfile]);

  const saveMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      if (!user?.id) {
        throw new Error("User not authenticated");
      }
      
      const response = await apiRequest("POST", "/api/consumption/profile", {
        userId: user.id,
        monthlyEnergyKwh: data.monthlyEnergyKwh ? parseFloat(data.monthlyEnergyKwh) : undefined,
        monthlyWaterLiters: data.monthlyWaterLiters ? parseFloat(data.monthlyWaterLiters) : undefined,
        monthlyCo2Kg: data.monthlyCo2Kg ? parseFloat(data.monthlyCo2Kg) : undefined,
      });
      
      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/consumption/profile/${user?.id}`] });
      toast({
        title: "Success!",
        description: "Your consumption data has been saved.",
      });
      setLocation("/dashboard");
    },
    onError: (error) => {
      console.error("Error saving consumption profile:", error);
      toast({
        title: "Error",
        description: "Failed to save your consumption data. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate(formData);
  };

  const handleSkip = () => {
    setLocation("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <Card className="backdrop-blur-xl bg-card/80 border-card-border">
          <CardHeader className="text-center space-y-2">
            <div className="flex justify-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <Droplet className="h-6 w-6 text-blue-500" />
              </div>
              <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                <TrendingDown className="h-6 w-6 text-green-500" />
              </div>
            </div>
            <CardTitle className="text-3xl">Welcome to EcoVision AI!</CardTitle>
            <CardDescription className="text-base">
              Help us personalize your experience by sharing your monthly consumption data.
              This will help us provide better insights and recommendations.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Energy Usage */}
              <div className="space-y-2">
                <Label htmlFor="energy" className="flex items-center gap-2 text-base">
                  <Zap className="h-4 w-4 text-primary" />
                  Monthly Energy Usage (kWh)
                </Label>
                <Input
                  id="energy"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="e.g., 450"
                  value={formData.monthlyEnergyKwh}
                  onChange={(e) => setFormData({ ...formData, monthlyEnergyKwh: e.target.value })}
                  data-testid="input-energy"
                />
                <p className="text-sm text-muted-foreground">
                  Check your electricity bill for this information
                </p>
              </div>

              {/* Water Usage */}
              <div className="space-y-2">
                <Label htmlFor="water" className="flex items-center gap-2 text-base">
                  <Droplet className="h-4 w-4 text-blue-500" />
                  Monthly Water Consumption (Liters)
                </Label>
                <Input
                  id="water"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="e.g., 12000"
                  value={formData.monthlyWaterLiters}
                  onChange={(e) => setFormData({ ...formData, monthlyWaterLiters: e.target.value })}
                  data-testid="input-water"
                />
                <p className="text-sm text-muted-foreground">
                  Average household uses 10,000-15,000 liters/month
                </p>
              </div>

              {/* Carbon Footprint */}
              <div className="space-y-2">
                <Label htmlFor="carbon" className="flex items-center gap-2 text-base">
                  <TrendingDown className="h-4 w-4 text-green-500" />
                  Estimated Monthly Carbon Footprint (kg CO₂)
                </Label>
                <Input
                  id="carbon"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="e.g., 300"
                  value={formData.monthlyCo2Kg}
                  onChange={(e) => setFormData({ ...formData, monthlyCo2Kg: e.target.value })}
                  data-testid="input-carbon"
                />
                <p className="text-sm text-muted-foreground">
                  Include transportation, energy, and lifestyle emissions
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={saveMutation.isPending}
                  data-testid="button-save-consumption"
                >
                  {saveMutation.isPending ? "Saving..." : "Save & Continue"}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleSkip}
                  data-testid="button-skip-consumption"
                >
                  Skip for Now
                </Button>
              </div>

              <p className="text-center text-sm text-muted-foreground">
                You can update this information anytime from your dashboard settings
              </p>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
