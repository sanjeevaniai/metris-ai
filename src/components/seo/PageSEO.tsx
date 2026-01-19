import SEO from './SEO';

// Pre-configured SEO for each page
export const HomeSEO = () => (
  <SEO
    title="AI Governance Platform"
    description="Scan AI systems, get quantified governance scores, and calculate financial risk exposure with METRIS by SANJEEVANI AI."
    keywords="AI governance platform, AI risk assessment, EU AI Act compliance, AI audit tool"
    url="https://metris.sanjeevani.ai/"
  />
);

export const IntakeSEO = () => (
  <SEO
    title="System Intake"
    description="Connect your AI system for governance assessment. Support for GitHub repos, API endpoints, and file uploads."
    keywords="AI system intake, AI assessment, connect AI system"
    url="https://metris.sanjeevani.ai/intake"
  />
);

export const ScanSEO = ({ scanId }: { scanId?: string }) => (
  <SEO
    title="Live Scanning"
    description="Watch 25 METRIS Detectives analyze your AI system in real-time. Get instant insights into governance gaps."
    keywords="AI scanning, AI analysis, governance detection"
    url={`https://metris.sanjeevani.ai/scan/${scanId || ''}`}
    noindex
  />
);

export const SystemSEO = ({ ein }: { ein?: string }) => (
  <SEO
    title="System Assessment"
    description="View your AI system's governance score, risk dimensions, and compliance alignment."
    keywords="AI score, governance assessment, AI risk score"
    url={`https://metris.sanjeevani.ai/system/${ein || ''}`}
    noindex
  />
);

export const ReportSEO = ({ reportId }: { reportId?: string }) => (
  <SEO
    title="Governance Report"
    description="Comprehensive AI governance report with findings, regulatory mapping, and remediation roadmap."
    keywords="AI governance report, compliance report, AI audit report"
    url={`https://metris.sanjeevani.ai/report/${reportId || ''}`}
    noindex
    structuredData={{
      '@context': 'https://schema.org',
      '@type': 'Report',
      name: 'AI Governance Assessment Report',
      description: 'Comprehensive governance and compliance assessment for AI systems',
      author: {
        '@type': 'Organization',
        name: 'SANJEEVANI AI',
      },
    }}
  />
);

export const DashboardSEO = () => (
  <SEO
    title="Risk Dashboard"
    description="Monitor all your AI systems in one place. Track scores, trends, and manage governance across your organization."
    keywords="AI dashboard, risk monitoring, AI portfolio management"
    url="https://metris.sanjeevani.ai/dashboard"
    noindex
  />
);

export const ApiDocsSEO = () => (
  <SEO
    title="API Documentation"
    description="Integrate METRIS into your workflow with our REST API. Endpoints for assessment, scoring, and reporting."
    keywords="METRIS API, AI governance API, risk assessment API"
    url="https://metris.sanjeevani.ai/api"
    structuredData={{
      '@context': 'https://schema.org',
      '@type': 'TechArticle',
      headline: 'METRIS API Documentation',
      description: 'Complete API reference for integrating METRIS AI governance platform',
      author: {
        '@type': 'Organization',
        name: 'SANJEEVANI AI',
      },
    }}
  />
);

export const NavigationDocsSEO = () => (
  <SEO
    title="Navigation & Docs"
    description="Learn how to use METRIS platform. Keyboard shortcuts, features guide, and getting started documentation."
    keywords="METRIS docs, platform guide, keyboard shortcuts"
    url="https://metris.sanjeevani.ai/docs"
  />
);
