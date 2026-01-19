import { Layout } from '@/components/layout/Layout';
import { ReportView } from '@/components/demo/ReportView';
import { useParams, useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { FileText, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ReportSEO } from '@/components/seo/PageSEO';

const Report = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <Layout>
      <ReportSEO reportId={id} />
      <section className="relative py-8 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 gradient-primary opacity-5 animate-gradient-shift" />
        
        <div className="container relative">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <Badge className="mb-2 gradient-primary text-primary-foreground">
                <FileText className="h-3 w-3 mr-1" />
                Governance Report
              </Badge>
              <h1 className="text-3xl font-bold">
                <span className="text-gradient">METRIS<sup className="text-lg">™</sup> Assessment Report</span>
              </h1>
              <p className="text-muted-foreground mt-1">
                Report ID: <code className="text-primary">{id}</code>
              </p>
            </div>
            <Button 
              onClick={() => navigate('/dashboard')}
              className="gradient-primary text-primary-foreground gap-2"
            >
              View Dashboard
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      <section className="pb-24">
        <ReportView />
      </section>
    </Layout>
  );
};

export default Report;
