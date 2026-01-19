import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface RequestBody {
  message: string;
  conversationHistory: Message[];
  context: {
    userName: string;
    companyName: string;
    stage: string;
  };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, conversationHistory, context }: RequestBody = await req.json();
    const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");

    if (!ANTHROPIC_API_KEY) {
      throw new Error("ANTHROPIC_API_KEY is not configured");
    }

    if (!message) {
      throw new Error("Message is required");
    }

    console.log(`Processing message from ${context.userName} at ${context.companyName}`);

    const systemPrompt = `You are Scout, a friendly and knowledgeable AI governance assessment assistant for Metris. You help organizations understand their AI governance maturity and compliance readiness.

Your personality:
- Warm, professional, and encouraging
- Concise but thorough - keep responses conversational (2-3 sentences typically)
- Ask one question at a time to gather information
- Use the person's name occasionally to build rapport

Current context:
- User: ${context.userName}
- Company: ${context.companyName}
- Assessment Stage: ${context.stage}

Your goals for this conversation:
1. Understand their current AI governance practices
2. Identify key risks and compliance gaps
3. Assess their maturity level across governance pillars
4. Provide actionable recommendations

Key areas to explore:
- AI inventory and documentation practices
- Risk assessment processes
- Ethical guidelines and bias monitoring
- Data governance and privacy
- Model monitoring and oversight
- Regulatory compliance (EU AI Act, NIST AI RMF, etc.)

Keep responses short and conversational since this is a voice interface. Avoid bullet points and long lists - speak naturally.`;

    const messages = [
      ...conversationHistory.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
      { role: "user", content: message },
    ];

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 300,
        system: systemPrompt,
        messages,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Anthropic API error:", response.status, errorText);
      throw new Error(`Anthropic API error: ${response.status}`);
    }

    const data = await response.json();
    const assistantMessage = data.content[0]?.text || "I apologize, I didn't catch that. Could you repeat?";

    console.log("Scout response:", assistantMessage.substring(0, 100));

    return new Response(
      JSON.stringify({ response: assistantMessage }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
