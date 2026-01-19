import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Globe, MapPin, DollarSign, AlertTriangle } from 'lucide-react';

const jurisdictions = {
  eu: {
    name: 'European Union',
    countries: 27,
    maxPenalty: '€35M or 7% global revenue',
    framework: 'EU AI Act',
    articles: ['Art. 9', 'Art. 10', 'Art. 13', 'Art. 14', 'Art. 52'],
    color: 'hsl(220, 70%, 50%)',
  },
  us: {
    name: 'United States',
    states: 50,
    maxPenalty: '$10M federal + state penalties',
    frameworks: ['NIST AI RMF', 'NYC LL144', 'Colorado SB24-205', 'CCPA/CPRA', 'Illinois BIPA'],
    color: 'hsl(0, 70%, 50%)',
  },
  uk: {
    name: 'United Kingdom',
    maxPenalty: '£4M or 4% global revenue',
    framework: 'UK AI Code of Practice',
    color: 'hsl(280, 60%, 50%)',
  },
  apac: {
    name: 'Asia-Pacific',
    countries: ['Singapore', 'Australia', 'Japan', 'South Korea'],
    frameworks: ['Singapore PDPA', 'Australia AI Ethics', 'Japan AI Guidelines'],
    color: 'hsl(45, 70%, 50%)',
  },
  canada: {
    name: 'Canada',
    maxPenalty: 'CAD $25M',
    framework: 'AIDA (Artificial Intelligence and Data Act)',
    color: 'hsl(0, 70%, 45%)',
  },
};

const usStates = [
  { state: 'California', law: 'CCPA/CPRA', penalty: '$7,500/violation', status: 'active' },
  { state: 'New York City', law: 'Local Law 144', penalty: '$1,500/day', status: 'active' },
  { state: 'Colorado', law: 'SB24-205', penalty: '$20,000/violation', status: 'active' },
  { state: 'Illinois', law: 'BIPA', penalty: '$5,000/violation', status: 'active' },
  { state: 'Virginia', law: 'VCDPA', penalty: '$7,500/violation', status: 'active' },
  { state: 'Connecticut', law: 'CTDPA', penalty: '$5,000/violation', status: 'active' },
  { state: 'Texas', law: 'TDPSA', penalty: '$7,500/violation', status: 'pending' },
  { state: 'Oregon', law: 'OCPA', penalty: '$7,500/violation', status: 'pending' },
];

export function JurisdictionDemo() {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <Badge className="mb-4 bg-blue-500/10 text-blue-500 border-blue-500/20">
          <Globe className="h-3 w-3 mr-1" />
          Global Jurisdiction Coverage
        </Badge>
        <h3 className="text-2xl font-semibold mb-2">50+ Jurisdictions Covered</h3>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          27 EU countries, 50 US states, UK, Canada, Australia, Singapore with jurisdiction-specific penalty calculations
        </p>
      </div>

      {/* Major Regions */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="border-blue-500/30">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                🇪🇺
              </div>
              <div>
                <div className="font-semibold">European Union</div>
                <div className="text-xs text-muted-foreground">27 Member States</div>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Max Penalty</span>
                <span className="font-medium text-red-500">€35M / 7%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Framework</span>
                <span className="font-medium">EU AI Act</span>
              </div>
              <div className="flex flex-wrap gap-1 mt-3">
                {['Art.9', 'Art.10', 'Art.13', 'Art.14', 'Art.52'].map(a => (
                  <Badge key={a} variant="outline" className="text-xs">{a}</Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-red-500/30">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                🇺🇸
              </div>
              <div>
                <div className="font-semibold">United States</div>
                <div className="text-xs text-muted-foreground">50 States + Federal</div>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Max Penalty</span>
                <span className="font-medium text-red-500">$10M+</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Frameworks</span>
                <span className="font-medium">5 Active</span>
              </div>
              <div className="flex flex-wrap gap-1 mt-3">
                {['NIST', 'NYC LL144', 'CO SB24', 'CCPA', 'BIPA'].map(a => (
                  <Badge key={a} variant="outline" className="text-xs">{a}</Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-500/30">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                🇬🇧
              </div>
              <div>
                <div className="font-semibold">United Kingdom</div>
                <div className="text-xs text-muted-foreground">Post-Brexit Framework</div>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Max Penalty</span>
                <span className="font-medium text-red-500">£4M / 4%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Framework</span>
                <span className="font-medium">UK AI Code</span>
              </div>
              <div className="flex flex-wrap gap-1 mt-3">
                {['Safety', 'Transparency', 'Fairness', 'Accountability'].map(a => (
                  <Badge key={a} variant="outline" className="text-xs">{a}</Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* US State Laws */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <MapPin className="h-4 w-4 text-red-500" />
            US State-Level AI Laws
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {usStates.map((s) => (
              <div 
                key={s.state} 
                className={`p-3 rounded-lg border ${
                  s.status === 'active' ? 'bg-red-500/5 border-red-500/20' : 'bg-muted/30 border-border/50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-sm">{s.state}</span>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${s.status === 'active' ? 'text-green-500 border-green-500/30' : 'text-yellow-500 border-yellow-500/30'}`}
                  >
                    {s.status}
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground">{s.law}</div>
                <div className="text-xs font-medium text-red-500 mt-1">{s.penalty}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Penalty Calculator Preview */}
      <Card className="border-yellow-500/30 bg-yellow-500/5">
        <CardContent className="p-4 flex items-start gap-3">
          <DollarSign className="h-5 w-5 text-yellow-500 mt-0.5" />
          <div>
            <div className="font-medium">Jurisdiction-Specific Penalty Modeling</div>
            <div className="text-sm text-muted-foreground mt-1">
              Monte Carlo simulations use actual penalty ranges by geography. For a multinational company 
              operating in EU + US + UK, the combined maximum exposure is calculated at <span className="text-red-500 font-semibold">€35M + $10M + £4M = ~$52M</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* APAC & Other */}
      <div className="grid md:grid-cols-4 gap-3">
        {[
          { flag: '🇸🇬', name: 'Singapore', law: 'PDPA + AI Verify' },
          { flag: '🇦🇺', name: 'Australia', law: 'AI Ethics Framework' },
          { flag: '🇨🇦', name: 'Canada', law: 'AIDA' },
          { flag: '🇯🇵', name: 'Japan', law: 'AI Guidelines' },
        ].map((c) => (
          <Card key={c.name} className="p-4 text-center">
            <div className="text-2xl mb-2">{c.flag}</div>
            <div className="font-medium text-sm">{c.name}</div>
            <div className="text-xs text-muted-foreground">{c.law}</div>
          </Card>
        ))}
      </div>
    </div>
  );
}
