import OpenAI from "openai";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
// This is using OpenAI's API, which points to OpenAI's API servers and requires your own API key.

function getOpenAIClient(): OpenAI {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OpenAI API key not configured");
  }
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export async function getSustainabilityAdvice(
  messages: ChatMessage[],
  userContext?: { energyUsage?: number; waterUsage?: number; co2Emissions?: number }
): Promise<string> {
  try {
    const openai = getOpenAIClient();
    
    // Build system message with user context if available
    let systemMessage = `You are EcoVision AI, a friendly and knowledgeable sustainability assistant. 
Your goal is to help users reduce their environmental impact through practical, actionable advice.

Key responsibilities:
- Provide personalized sustainability tips based on user data
- Explain complex environmental concepts in simple terms
- Encourage positive environmental actions without being preachy
- Be supportive and celebrate progress
- Offer specific, measurable suggestions when possible

Guidelines:
- Keep responses concise (2-3 paragraphs max)
- Use encouraging, positive language
- Reference specific numbers when relevant
- Suggest concrete next steps`;

    if (userContext) {
      systemMessage += `\n\nUser's Current Metrics:`;
      if (userContext.energyUsage) {
        systemMessage += `\n- Energy usage: ${userContext.energyUsage.toFixed(1)} kWh/day`;
      }
      if (userContext.waterUsage) {
        systemMessage += `\n- Water usage: ${userContext.waterUsage.toFixed(0)} liters/day`;
      }
      if (userContext.co2Emissions) {
        systemMessage += `\n- CO₂ emissions: ${userContext.co2Emissions.toFixed(1)} kg/day`;
      }
    }

    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        { role: "system", content: systemMessage },
        ...messages,
      ],
      max_completion_tokens: 500, // Keep responses concise
    });

    return response.choices[0].message.content || "I apologize, but I couldn't generate a response. Please try again.";
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw new Error("Failed to get AI response. Please check your API key and try again.");
  }
}

export async function analyzeSustainabilityAction(
  action: string
): Promise<{ impact: string; recommendation: string; estimatedSavings: string }> {
  try {
    const openai = getOpenAIClient();
    
    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: `You are a sustainability analysis expert. Analyze user actions and provide impact assessment. 
Respond with JSON in this format: 
{
  "impact": "high|medium|low",
  "recommendation": "Brief specific advice",
  "estimatedSavings": "Quantified savings (e.g., '15% energy reduction' or '50 kg CO₂/year')"
}`,
        },
        {
          role: "user",
          content: `Analyze this sustainability action: ${action}`,
        },
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return {
      impact: result.impact || "medium",
      recommendation: result.recommendation || "Continue your sustainability efforts!",
      estimatedSavings: result.estimatedSavings || "Positive environmental impact",
    };
  } catch (error) {
    console.error("OpenAI analysis error:", error);
    throw new Error("Failed to analyze sustainability action");
  }
}
