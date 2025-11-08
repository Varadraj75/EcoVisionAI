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
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hello! I'm your EcoVision AI sustainability assistant powered by advanced AI. I'm here to help you reduce your environmental impact with personalized tips and guidance based on your actual usage data. How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");

  const chatMutation = useMutation({
    mutationFn: async (userMessage: string) => {
      const chatHistory = messages.map(msg => ({
        role: msg.role as "user" | "assistant",
        content: msg.content,
      }));
      
      chatHistory.push({
        role: "user" as const,
        content: userMessage,
      });

      const response = await apiRequest("POST", "/api/chat", {
        messages: chatHistory,
        userId: user?.id,
      });
      
      return response.json() as Promise<{ message: string }>;
    },
    onSuccess: (data, userMessage) => {
      const assistantMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: data.message,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    },
    onError: (error) => {
      console.error("Chat error:", error);
      toast({
        title: "Chat Error",
        description: error instanceof Error && error.message.includes("API key") 
          ? "AI service not configured. Please add your OpenAI API key." 
          : "Unable to get AI response. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSend = async (text: string = input) => {
    if (!text.trim() || chatMutation.isPending) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    
    chatMutation.mutate(text);
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
              {chatMutation.isPending && (
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
                disabled={chatMutation.isPending}
                data-testid="input-message"
              />
              <Button
                type="submit"
                size="icon"
                disabled={!input.trim() || chatMutation.isPending}
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
