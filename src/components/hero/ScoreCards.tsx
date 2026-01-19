import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Sparkles, ArrowRight } from 'lucide-react';
import scoutAvatar from '@/assets/scout-avatar.png';

// Flip card for hero section
interface FlipCardProps {
  label: string;
  placeholder: string;
  exampleValue: string;
  frontSubtext: string;
  backSubtext?: string; // defaults to frontSubtext if not provided
}

function FlipCard({ label, placeholder, exampleValue, frontSubtext, backSubtext }: FlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const resolvedBackSubtext = backSubtext ?? frontSubtext;

  return (
    <div 
      className="w-[180px] sm:w-[220px] h-[200px] sm:h-[240px] cursor-pointer"
      style={{ perspective: '1000px' }}
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
    >
      <div 
        className="relative w-full h-full transition-transform duration-500"
        style={{ 
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
        }}
      >
        {/* FRONT */}
        <div 
          className="absolute w-full h-full rounded-2xl flex flex-col items-center justify-center p-6 bg-gradient-to-br from-secondary/80 to-secondary/50 border border-border"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <p className="text-primary text-xs font-semibold tracking-[3px] mb-4 uppercase">
            {label}
          </p>
          <p className="text-5xl sm:text-6xl font-light text-foreground mb-3 tracking-tight font-mono">
            {placeholder}
          </p>
          <p className="text-muted-foreground text-sm">
            {frontSubtext}
          </p>
        </div>
        
        {/* BACK */}
        <div 
          className="absolute w-full h-full rounded-2xl flex flex-col items-center justify-center p-6 bg-gradient-to-br from-secondary/80 to-secondary/50 border border-primary/50 shadow-[0_0_30px_-5px_hsl(var(--primary)/0.3)]"
          style={{ 
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)'
          }}
        >
          <p className="text-primary text-xs font-semibold tracking-[3px] mb-4 uppercase">
            {label}
          </p>
          <p className="text-5xl sm:text-6xl font-bold text-foreground mb-3 tracking-tight font-mono">
            {exampleValue}
          </p>
          <p className="text-muted-foreground text-sm mb-4">
            {resolvedBackSubtext}
          </p>
          <div className="w-10 h-px bg-border mb-2" />
          <p className="text-muted-foreground text-xs italic">
            (example)
          </p>
        </div>
      </div>
    </div>
  );
}

// Scout Modal for starting assessment
interface ScoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function ScoutModal({ isOpen, onClose }: ScoutModalProps) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    companyName: '',
    industry: '',
    systemName: ''
  });

  const industries = [
    'Healthcare',
    'Finance',
    'Insurance',
    'Technology',
    'Manufacturing',
    'Retail',
    'Government',
    'Education',
    'Other'
  ];

  const handleSubmit = () => {
    // Navigate to assess page with context
    navigate('/assess', { 
      state: { 
        ...formData,
        startConversation: true 
      } 
    });
    onClose();
  };

  const isValid = formData.companyName && formData.industry;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg bg-card border-border p-0 gap-0">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <img src={scoutAvatar} alt="Scout" className="w-8 h-8 rounded-full" />
            <div>
              <h3 className="text-foreground font-medium flex items-center gap-2">
                Scout <Sparkles className="w-4 h-4 text-primary" />
              </h3>
              <p className="text-xs text-muted-foreground">AI Governance Analyst</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="p-6">
          {/* Scout's opening message */}
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-6">
            <p className="text-foreground">
              Let's find your score, your risk, and who's affected. Tell me about your organization.
            </p>
          </div>
          
          {/* Form */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">Organization Name</Label>
              <Input
                id="companyName"
                placeholder="e.g., Acme Corporation"
                value={formData.companyName}
                onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
                className="bg-secondary border-border"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="industry">Industry</Label>
              <Select 
                value={formData.industry} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, industry: value }))}
              >
                <SelectTrigger className="bg-secondary border-border">
                  <SelectValue placeholder="Select your industry" />
                </SelectTrigger>
                <SelectContent>
                  {industries.map((industry) => (
                    <SelectItem key={industry} value={industry}>
                      {industry}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="systemName">AI System Name (optional)</Label>
              <Input
                id="systemName"
                placeholder="e.g., DiagnosticAI Pro"
                value={formData.systemName}
                onChange={(e) => setFormData(prev => ({ ...prev, systemName: e.target.value }))}
                className="bg-secondary border-border"
              />
              <p className="text-xs text-muted-foreground">
                The AI system you want to assess
              </p>
            </div>
          </div>
          
          <Button 
            onClick={handleSubmit}
            disabled={!isValid}
            className="w-full mt-6 bg-primary hover:bg-primary/90"
          >
            Start Assessment
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Main Hero Section Component
export function HeroSection() {
  const [scoutOpen, setScoutOpen] = useState(false);

  return (
    <section className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-16">
      {/* Logo Section */}
      <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground tracking-tight mb-3">
        METRIS<sup className="text-lg sm:text-xl lg:text-2xl align-super">™</sup>
      </h1>
      <p className="text-lg text-muted-foreground tracking-wide mb-12">
        AI trust you can count.
      </p>
      
      {/* Main Tagline / Value Proposition */}
      <p className="text-xl sm:text-2xl text-foreground/90 text-center max-w-2xl mb-12 leading-relaxed">
        Governance in numbers. Risk in dollars.
        <br />
        Traceability to the Human.
      </p>
      
      {/* Three Outcomes Preview - Flip Cards */}
      <div className="flex flex-col sm:flex-row gap-6 mb-8">
        <FlipCard 
          label="SCORE" 
          placeholder="___" 
          exampleValue="743"
          frontSubtext="your AI risk" 
        />
        <FlipCard 
          label="DOLLARS" 
          placeholder="$___" 
          exampleValue="$2.3M"
          frontSubtext="your business at stake" 
        />
        <FlipCard 
          label="TRACEABILITY" 
          placeholder="___" 
          exampleValue="3,247"
          frontSubtext="Who's affected"
          backSubtext="humans" 
        />
      </div>
      
      {/* Footer text */}
      <p className="text-muted-foreground text-base text-center mb-10">
        One assessment. Three answers. In a loop. Continuously.
      </p>
      
      {/* Single CTA */}
      <Button 
        onClick={() => setScoutOpen(true)}
        size="lg"
        className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-xl font-semibold transition-all shadow-[0_0_30px_-5px_hsl(var(--primary)/0.5)] hover:shadow-[0_0_40px_-5px_hsl(var(--primary)/0.6)] hover:-translate-y-1"
      >
        Get Your Score
        <ArrowRight className="ml-2 h-5 w-5" />
      </Button>
      
      {/* Scout Modal */}
      <ScoutModal
        isOpen={scoutOpen}
        onClose={() => setScoutOpen(false)}
      />
    </section>
  );
}

// Legacy export for backwards compatibility
export function ScoreCards() {
  return <HeroSection />;
}
