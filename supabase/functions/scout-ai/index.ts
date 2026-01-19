// SANJEEVANI AI - Scout AI Edge Function
// Deploy to your own Supabase instance at: supabase/functions/scout-ai/index.ts

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

    const { message, context } = await req.json();

    const systemPrompt = `You are Scout, an AI governance assistant for the METRIS™ platform by SANJEEVANI AI. 
You help users understand their AI governance assessments, explain findings, and suggest remediation strategies.
You have deep expertise in:
- EU AI Act compliance requirements
- AI risk quantification and VaR calculations
- Governance frameworks (ISO 42001, NIST AI RMF)
- Bias auditing and fairness testing
- Model lifecycle management

Current context: ${JSON.stringify(context || {})}

Be concise, actionable, and always tie recommendations back to ROI impact.`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1024,
        system: systemPrompt,
        messages: [{ role: 'user', content: message }],
      }),
    });

    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error.message);
    }

    return new Response(JSON.stringify({ 
      message: data.content[0].text 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    console.error('Scout AI Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
