import { Layout } from '@/components/layout/Layout';
import { IntakeForm, IntakeData } from '@/components/demo/IntakeForm';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Sparkles } from 'lucide-react';
import { IntakeSEO } from '@/components/seo/PageSEO';

const Intake = () => {
  const navigate = useNavigate();

  const handleSubmit = (data: IntakeData) => {
    // Generate a mock scan ID and navigate to scan view
    const scanId = `scan-${Date.now()}`;
    navigate(`/scan/${scanId}`, { state: { intakeData: data } });
  };

  return (
    <Layout>
      <IntakeSEO />
      <section className="relative py-16 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 gradient-primary opacity-5 animate-gradient-shift" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '-3s' }} />
        
        <div className="container relative">
          <div className="text-center max-w-4xl mx-auto mb-12">
            <Badge className="mb-4 gradient-primary text-primary-foreground">
              <Sparkles className="h-3 w-3 mr-1" />
              Step 1: System Intake
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-gradient">Connect Your AI System</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose how to connect your AI system for governance analysis.
              Our 25 agents will scan and quantify your risk exposure.
            </p>
          </div>
        </div>
      </section>

      <section className="pb-24">
        <IntakeForm onSubmit={handleSubmit} />
      </section>
    </Layout>
  );
};

export default Intake;
