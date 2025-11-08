import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, Send, Sparkles, Leaf, Droplet, Zap, Recycle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { sustainabilityTips } from "@/data/kaggleData";
import { Badge } from "@/components/ui/badge";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const suggestedPrompts = [
  "How can I reduce my energy consumption?",
  "What are the best ways to save water?",
  "Tips for sustainable transportation",
  "How to reduce my carbon footprint?",
];

const categoryIcons = {
  Energy: Zap,
  Water: Droplet,
  Transportation: MessageCircle,
  Recycling: Recycle,
};

export default function Assistant() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hello! I'm your EcoVision AI sustainability assistant. I'm here to help you reduce your environmental impact with personalized tips and guidance. How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async (text: string = input) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response delay
    await new Promise((resolve) => setTimeout(resolve, 1200));

    // Generate response based on keywords
    let response = generateResponse(text);

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: response,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, assistantMessage]);
    setIsTyping(false);
  };

  const generateResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase();

    if (lowerQuery.includes("energy") || lowerQuery.includes("electricity")) {
      const energyTips = sustainabilityTips.filter((t) => t.category === "Energy");
      const tip = energyTips[Math.floor(Math.random() * energyTips.length)];
      return `Great question about energy! Here's a tip: ${tip.tip}\n\nAdditionally, consider using energy-efficient appliances and unplugging devices when not in use. Your current energy usage trends show you could save up to 15% by optimizing your consumption patterns.`;
    }

    if (lowerQuery.includes("water")) {
      const waterTips = sustainabilityTips.filter((t) => t.category === "Water");
      const tip = waterTips[Math.floor(Math.random() * waterTips.length)];
      return `Water conservation is crucial! ${tip.tip}\n\nBased on your dashboard data, you're already doing well with water usage. Keep up the good work and consider rainwater harvesting for outdoor use.`;
    }

    if (lowerQuery.includes("transport") || lowerQuery.includes("car") || lowerQuery.includes("commute")) {
      const transportTips = sustainabilityTips.filter((t) => t.category === "Transportation");
      const tip = transportTips[Math.floor(Math.random() * transportTips.length)];
      return `Transportation is a major source of emissions. ${tip.tip}\n\nCheck out our Eco-Route Optimizer to find sustainable alternatives for your daily commute. Even small changes like carpooling can make a big difference!`;
    }

    if (lowerQuery.includes("carbon") || lowerQuery.includes("footprint") || lowerQuery.includes("co2")) {
      return `Reducing your carbon footprint involves multiple areas:\n\n• Energy: Use renewable sources and LED lighting\n• Transportation: Choose public transit, carpool, or bike\n• Diet: Reduce meat consumption and food waste\n• Home: Improve insulation and use smart thermostats\n\nYour current CO₂ emissions are trending down by 5.8% - that's excellent progress! Keep up these sustainable habits.`;
    }

    if (lowerQuery.includes("recycle") || lowerQuery.includes("waste")) {
      return `Recycling and waste reduction are essential for sustainability:\n\n• Separate recyclables properly (paper, plastic, glass, metal)\n• Compost organic waste to reduce landfill methane\n• Avoid single-use plastics\n• Buy products with minimal packaging\n• Donate or repurpose items instead of throwing them away\n\nConsider setting up a composting system if you haven't already!`;
    }

    // Default response with random tip
    const randomTip = sustainabilityTips[Math.floor(Math.random() * sustainabilityTips.length)];
    return `That's a great question! Here's a sustainability tip: ${randomTip.tip}\n\nFor more specific guidance, feel free to ask about energy, water, transportation, or any other aspect of sustainable living. I'm here to help you reduce your environmental impact!`;
  };

  return (
    <div className="p-8 h-[calc(100vh-4rem)] flex flex-col">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <MessageCircle className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">AI Sustainability Assistant</h1>
            <p className="text-muted-foreground">
              Get personalized eco-friendly tips and guidance
            </p>
          </div>
        </div>
      </motion.div>

      {/* Chat Container */}
      <div className="flex-1 flex flex-col min-h-0">
        <Card className="flex-1 flex flex-col min-h-0">
          {/* Messages Area */}
          <CardContent className="flex-1 p-6 overflow-y-auto space-y-6">
            <AnimatePresence>
              {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex gap-4 ${message.role === "user" ? "flex-row-reverse" : ""}`}
                >
                  {/* Avatar */}
                  <Avatar className="flex-shrink-0">
                    {message.role === "assistant" ? (
                      <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                        <Sparkles className="h-5 w-5 text-primary" />
                      </div>
                    ) : (
                      <AvatarFallback>
                        {user?.name?.charAt(0) || "U"}
                      </AvatarFallback>
                    )}
                  </Avatar>

                  {/* Message Bubble */}
                  <div className={`flex-1 max-w-2xl ${message.role === "user" ? "items-end" : ""}`}>
                    <div
                      className={`p-4 rounded-xl ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground ml-auto"
                          : "bg-muted"
                      }`}
                      data-testid={`message-${message.role}`}
                    >
                      <p className="whitespace-pre-line">{message.content}</p>
                    </div>
                    <div className={`text-xs text-muted-foreground mt-1 ${message.role === "user" ? "text-right" : ""}`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex gap-4"
                >
                  <Avatar className="flex-shrink-0">
                    <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                      <Sparkles className="h-5 w-5 text-primary" />
                    </div>
                  </Avatar>
                  <div className="p-4 rounded-xl bg-muted">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "0ms" }} />
                      <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "150ms" }} />
                      <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>

          {/* Suggested Prompts */}
          {messages.length === 1 && (
            <div className="px-6 pb-4">
              <div className="text-sm font-medium mb-3 text-muted-foreground">Suggested topics:</div>
              <div className="flex flex-wrap gap-2">
                {suggestedPrompts.map((prompt) => (
                  <Button
                    key={prompt}
                    variant="outline"
                    size="sm"
                    onClick={() => handleSend(prompt)}
                    className="text-sm"
                    data-testid={`prompt-${prompt.toLowerCase().slice(0, 20).replace(/\s+/g, '-')}`}
                  >
                    {prompt}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="p-6 border-t">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex gap-3"
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me about energy, water, transportation, or any sustainability topic..."
                className="flex-1"
                disabled={isTyping}
                data-testid="input-message"
              />
              <Button
                type="submit"
                size="icon"
                disabled={!input.trim() || isTyping}
                data-testid="button-send"
              >
                <Send className="h-5 w-5" />
              </Button>
            </form>
          </div>
        </Card>
      </div>

      {/* Quick Tips Sidebar */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="mt-6"
      >
        <Card className="p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Leaf className="h-5 w-5 text-primary" />
            Quick Sustainability Tips
          </h3>
          <div className="grid md:grid-cols-2 gap-3">
            {sustainabilityTips.slice(0, 4).map((tip) => {
              const Icon = categoryIcons[tip.category as keyof typeof categoryIcons] || Leaf;
              return (
                <div
                  key={tip.id}
                  className="p-3 rounded-lg bg-muted/50 hover-elevate cursor-pointer"
                  onClick={() => handleSend(`Tell me more about: ${tip.tip}`)}
                >
                  <div className="flex items-start gap-2 mb-2">
                    <Icon className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <Badge variant="secondary" className="text-xs">{tip.category}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">{tip.tip}</p>
                </div>
              );
            })}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
