import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { ScoringView } from '@/components/demo/ScoringView';
import { SimulationView } from '@/components/demo/SimulationView';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, Activity, TrendingUp } from 'lucide-react';
import { SystemSEO } from '@/components/seo/PageSEO';

const System = () => {
  const navigate = useNavigate();
  const { ein } = useParams();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('scoring');
  
  const isSimulateRoute = location.pathname.includes('/simulate');

  const handleScoringContinue = () => {
    navigate(`/system/${ein}/simulate`);
    setActiveTab('simulation');
  };

  const handleSimulationContinue = () => {
    const reportId = `RPT-${Date.now().toString(36).toUpperCase()}`;
    navigate(`/report/${reportId}`, { state: { ein } });
  };

  return (
    <Layout>
      <SystemSEO ein={ein} />
      <section className="relative py-8 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 gradient-primary opacity-5 animate-gradient-shift" />
        
        <div className="container relative">
          <div className="text-center max-w-4xl mx-auto mb-8">
            <Badge className="mb-4 gradient-primary text-primary-foreground">
              <BarChart3 className="h-3 w-3 mr-1" />
              AI System Analysis
            </Badge>
            <h1 className="text-3xl font-bold mb-2">
              <span className="text-gradient">Governance Assessment</span>
            </h1>
            <p className="text-muted-foreground">
              System EIN: <code className="text-primary">{ein}</code>
            </p>
          </div>

          {/* Tab Navigation */}
          <Tabs value={isSimulateRoute ? 'simulation' : activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
              <TabsTrigger value="scoring" className="gap-2">
                <Activity className="h-4 w-4" />
                Scoring
              </TabsTrigger>
              <TabsTrigger value="simulation" className="gap-2">
                <TrendingUp className="h-4 w-4" />
                Simulation
              </TabsTrigger>
            </TabsList>

            <TabsContent value="scoring">
              <ScoringView onContinue={handleScoringContinue} />
            </TabsContent>

            <TabsContent value="simulation">
              <SimulationView onContinue={handleSimulationContinue} />
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </Layout>
  );
};

export default System;
