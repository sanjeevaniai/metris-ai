import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY');
    if (!ANTHROPIC_API_KEY) {
      throw new Error('ANTHROPIC_API_KEY is not configured');
    }

    const { industry, companyName, stage } = await req.json();

    const systemPrompt = `You are an AI governance assessment expert. Generate exactly 6 contextual assessment questions for evaluating an organization's AI/ML maturity and compliance readiness.

The organization details:
- Company: ${companyName || 'Unknown'}
- Industry: ${industry}
- Stage: ${stage || 'exploring'}

Generate questions that are highly specific to their industry context. For example:
- Healthcare: Focus on patient data, clinical decision support, HIPAA implications
- Finance: Focus on algorithmic trading, credit scoring, fraud detection, regulatory requirements
- Insurance: Focus on underwriting models, claims processing, actuarial fairness
- Retail: Focus on recommendation engines, dynamic pricing, customer profiling
- Manufacturing: Focus on predictive maintenance, quality control, supply chain AI

Each question must have 4-5 answer options with varying maturity levels. Return ONLY valid JSON in this exact format:
{
  "questions": [
    {
      "id": 1,
      "text": "Question text here?",
      "options": [
        { "label": "Answer option", "points": 3 },
        { "label": "Another option", "points": 2 },
        { "label": "Lower maturity option", "points": 1 },
        { "label": "I don't know", "points": 0 }
      ]
    }
  ]
}

Points should range from 0-3 where:
- 3 = Best practice / highest maturity
- 2 = Moderate / developing
- 1 = Basic / minimal
- 0 = Unknown or no practice

Make questions conversational but professional. Reference specific ${industry} scenarios and regulations where relevant.`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2048,
        system: systemPrompt,
        messages: [{ 
          role: 'user', 
          content: `Generate 6 AI governance assessment questions specifically for a ${industry} company called ${companyName || 'the organization'}. Make them highly contextual to common AI use cases in ${industry}.` 
        }],
      }),
    });

    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error.message);
    }

    // Parse the JSON from Claude's response
    const responseText = data.content[0].text;
    
    // Extract JSON from the response (handle potential markdown code blocks)
    let jsonStr = responseText;
    const jsonMatch = responseText.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      jsonStr = jsonMatch[1].trim();
    }
    
    const questions = JSON.parse(jsonStr);

    return new Response(JSON.stringify(questions), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    console.error('Generate Questions Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
