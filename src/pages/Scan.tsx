import { Layout } from '@/components/layout/Layout';
import { LiveScanning } from '@/components/demo/LiveScanning';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Activity } from 'lucide-react';
import { ScanSEO } from '@/components/seo/PageSEO';

const Scan = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const intakeData = location.state?.intakeData;

  const handleComplete = () => {
    // Generate a mock EIN and navigate to system view
    const ein = `EIN-${Date.now().toString(36).toUpperCase()}`;
    navigate(`/system/${ein}`, { state: { scanId: id, intakeData } });
  };

  return (
    <Layout>
      <ScanSEO scanId={id} />
      <section className="relative py-8 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 gradient-primary opacity-5 animate-gradient-shift" />
        
        <div className="container relative">
          <div className="text-center max-w-4xl mx-auto mb-8">
            <Badge className="mb-4 bg-secondary/20 text-secondary border-secondary/30">
              <Activity className="h-3 w-3 mr-1 animate-pulse" />
              Live Scan in Progress
            </Badge>
            <h1 className="text-3xl font-bold mb-2">
              <span className="text-gradient">Scanning AI System</span>
            </h1>
            <p className="text-muted-foreground">
              Scan ID: <code className="text-primary">{id}</code>
            </p>
          </div>
        </div>
      </section>

      <section className="pb-24">
        <div className="container max-w-7xl mx-auto px-4">
          <LiveScanning onComplete={handleComplete} />
        </div>
      </section>
    </Layout>
  );
};

export default Scan;
