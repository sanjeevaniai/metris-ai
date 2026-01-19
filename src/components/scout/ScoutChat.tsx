import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { MessageSquare, X, Send, Bot, User, Loader2, Sparkles } from 'lucide-react';
import { invokeScoutAI } from '@/lib/supabase';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export type ScoutStage = 'initial' | 'monitoring' | 'readiness';

interface ScoutChatProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  stageContext?: ScoutStage;
  context?: {
    currentView?: string;
    scores?: Record<string, number>;
    findings?: unknown[];
  };
}

const stageGreetings: Record<ScoutStage, string> = {
  initial: "Let's discover your risk exposure. Which AI system are you assessing?",
  monitoring: "Let's track your progress. Which assessment would you like to update?",
  readiness: "Let's verify your audit readiness. Which framework are you preparing for?",
};

const defaultGreeting = "I'm Scout, your AI governance assistant. I can help you understand your METRIS™ assessment, explain findings, and suggest remediation strategies. What would you like to know?";

const suggestedQuestions = [
  "Why is my EU AI Act compliance score low?",
  "What's the quickest way to improve my score?",
  "Explain the Monte Carlo simulation results",
  "How can I reduce my VaR exposure?",
];

export function ScoutChat({ open, onOpenChange, stageContext, context }: ScoutChatProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = open !== undefined ? open : internalOpen;
  const setIsOpen = onOpenChange || setInternalOpen;

  const getInitialMessage = (): Message => ({
    id: '1',
    role: 'assistant',
    content: stageContext ? stageGreetings[stageContext] : defaultGreeting,
    timestamp: new Date(),
  });

  const [messages, setMessages] = useState<Message[]>([getInitialMessage()]);

  // Reset messages when stageContext changes or chat opens with new context
  useEffect(() => {
    if (isOpen) {
      setMessages([getInitialMessage()]);
    }
  }, [stageContext, isOpen]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (message?: string) => {
    const text = message || input.trim();
    if (!text || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Try to call the edge function
      const response = await invokeScoutAI(text, context);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.message || response.content || "I'm here to help with your AI governance questions.",
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      // Fallback response for demo when edge function isn't available
      const fallbackResponses: Record<string, string> = {
        'compliance': `Based on your assessment, your EU AI Act compliance score is 48%. The main gaps are:

1. **AI System Registration** - Your high-risk AI systems haven't been registered in the EU database (Article 51)
2. **Human Oversight** - Missing mandatory human-in-the-loop controls for automated decisions
3. **Transparency Requirements** - End-users aren't being informed they're interacting with AI

**Quick Win**: Start with the registration process - it's required before February 2025 and can be completed in 2-3 weeks.`,
        
        'score': `To quickly improve your METRIS score, focus on these high-impact, low-effort actions:

1. **Document your model cards** (+15 points) - 2 days effort
2. **Implement bias audit logging** (+20 points) - 1 week effort  
3. **Add human review thresholds** (+12 points) - 3 days effort

These three actions alone could move your score from 648 to ~695, reducing your exposure by approximately €1.8M.`,
        
        'monte carlo': `The Monte Carlo simulation ran 10,000 iterations to model your potential risk outcomes:

- **5th Percentile (Best Case)**: €3.4M - Assumes quick remediation and no adverse events
- **50th Percentile (Expected)**: €5.1M - Most likely outcome based on current trajectory
- **95th Percentile (VaR)**: €6.2M - Worst case before tail risks

The wide distribution (€2.8M spread) indicates high uncertainty - this typically means governance controls are inconsistent across your AI portfolio.`,
        
        'var': `Your Value at Risk (VaR) at 95% confidence is €6.2M. Here's how to reduce it:

1. **Standardize governance** across all AI systems - reduces variance
2. **Implement monitoring** for model drift - catches issues early
3. **Document decision logic** - reduces regulatory penalty risk
4. **Add kill switches** - limits maximum impact of failures

Implementing these controls typically reduces VaR by 25-40%.`,

        'default': `I can help you understand your AI governance assessment. You might want to ask about:

• Why specific scores are low
• How to prioritize remediation efforts  
• What regulations apply to your systems
• How to interpret the risk simulations
• ROI of different governance investments

What aspect would you like to explore?`
      };

      let responseKey = 'default';
      const lowerText = text.toLowerCase();
      if (lowerText.includes('compliance') || lowerText.includes('eu ai act')) responseKey = 'compliance';
      else if (lowerText.includes('score') || lowerText.includes('improve') || lowerText.includes('quick')) responseKey = 'score';
      else if (lowerText.includes('monte') || lowerText.includes('simulation')) responseKey = 'monte carlo';
      else if (lowerText.includes('var') || lowerText.includes('exposure') || lowerText.includes('risk')) responseKey = 'var';

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: fallbackResponses[responseKey],
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, assistantMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <Button
        onClick={() => setIsOpen(true)}
        className={cn(
          'fixed bottom-6 right-6 h-14 w-14 rounded-full gradient-primary shadow-glow animate-pulse-glow z-50',
          isOpen && 'hidden'
        )}
      >
        <MessageSquare className="h-6 w-6" />
      </Button>

      {/* Chat Panel */}
      <div
        className={cn(
          'fixed bottom-6 right-6 w-96 z-50 transition-all duration-300',
          isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        )}
      >
        <Card className="shadow-2xl border-primary/30">
          <CardHeader className="pb-3 flex flex-row items-center justify-between gradient-primary rounded-t-lg">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                <Bot className="h-4 w-4 text-primary-foreground" />
              </div>
              <div>
                <CardTitle className="text-sm text-primary-foreground">Scout AI</CardTitle>
                <p className="text-xs text-primary-foreground/70">Governance Assistant</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="text-primary-foreground hover:bg-primary-foreground/20"
            >
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>

          <CardContent className="p-0">
            {/* Messages */}
            <ScrollArea className="h-80 p-4" ref={scrollRef}>
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      'flex gap-2',
                      message.role === 'user' && 'flex-row-reverse'
                    )}
                  >
                    <div className={cn(
                      'w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0',
                      message.role === 'assistant' ? 'bg-primary/20' : 'bg-muted'
                    )}>
                      {message.role === 'assistant' ? (
                        <Sparkles className="h-3 w-3 text-primary" />
                      ) : (
                        <User className="h-3 w-3 text-muted-foreground" />
                      )}
                    </div>
                    <div className={cn(
                      'max-w-[80%] p-3 rounded-lg text-sm',
                      message.role === 'assistant' 
                        ? 'bg-muted/50' 
                        : 'bg-primary text-primary-foreground'
                    )}>
                      <div 
                        className="whitespace-pre-wrap"
                        dangerouslySetInnerHTML={{
                          __html: message.content
                            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                            .replace(/\n/g, '<br />')
                        }}
                      />
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex gap-2">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                      <Sparkles className="h-3 w-3 text-primary" />
                    </div>
                    <div className="bg-muted/50 p-3 rounded-lg">
                      <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Suggested Questions */}
            {messages.length <= 2 && (
              <div className="px-4 pb-2">
                <p className="text-xs text-muted-foreground mb-2">Suggested questions:</p>
                <div className="flex flex-wrap gap-1">
                  {suggestedQuestions.map((q) => (
                    <Button
                      key={q}
                      variant="outline"
                      size="sm"
                      className="text-xs h-auto py-1"
                      onClick={() => handleSend(q)}
                    >
                      {q}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-border">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex gap-2"
              >
                <Input
                  placeholder="Ask about your assessment..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={!input.trim() || isLoading}
                  className="gradient-primary"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
