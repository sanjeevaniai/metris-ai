// METRIS Complete Feature Registry
// This is the single source of truth for all platform capabilities

export interface Feature {
  name: string;
  description: string;
  category: string;
}

export interface FeatureCategory {
  id: string;
  name: string;
  icon: string;
  features: Feature[];
}

export const platformStats = {
  agents: 25,
  checkpoints: 1750,
  frameworks: 9,
  jurisdictions: 50,
  governancePillars: 12,
  forecastingModels: 7,
  monteCarloIterations: 10000,
  productionAssessments: 1500,
  documentsAnalyzed: 43000,
  expertCorrelation: 0.89,
  accuracy: 82.8,
  timeReduction: 73,
};

export const featureCategories: FeatureCategory[] = [
  {
    id: 'governance-engine',
    name: 'AI Governance Engine',
    icon: 'Bot',
    features: [
      { name: '25-Agent Autonomous System', description: 'Five-tier architecture: Foundational, Technical, Compliance, Forecasting, Business Intelligence', category: 'governance-engine' },
      { name: 'METRIS Score (0-1000)', description: 'Proprietary scoring with 95% confidence intervals across 6 tiers', category: 'governance-engine' },
      { name: '1,750+ Checkpoints', description: 'Comprehensive registry across 9 frameworks and 12 governance pillars', category: 'governance-engine' },
      { name: 'Scout AI Assistant', description: 'Context-aware chatbot (⌘K) for guidance and remediation', category: 'governance-engine' },
      { name: 'METRIS.md Configuration', description: 'Company context file for personalized assessments', category: 'governance-engine' },
      { name: 'Real-time Live Scanning', description: 'Animated interface with Scout Detective avatar', category: 'governance-engine' },
    ],
  },
  {
    id: 'risk-analysis',
    name: 'Risk Analysis & Financial Quantification',
    icon: 'TrendingUp',
    features: [
      { name: 'Monte Carlo Simulation', description: '10,000-iteration risk modeling with VaR (95%, 99%) and CVaR', category: 'risk-analysis' },
      { name: 'Financial Exposure in Dollars', description: 'Actual dollar amounts, not just "high/medium/low"', category: 'risk-analysis' },
      { name: 'Enterprise ROI Calculator', description: 'Fines vs. remediation costs with 3-year TCO', category: 'risk-analysis' },
      { name: 'Jurisdiction-Specific Penalties', description: 'EU (€35M), US ($10M), UK (£4M), state-level penalties', category: 'risk-analysis' },
      { name: 'Audit Probability Modeling', description: 'Likelihood of regulatory audit based on score', category: 'risk-analysis' },
      { name: 'Risk Speedometer & Heatmaps', description: 'Visual gauges and pillar breakdowns', category: 'risk-analysis' },
    ],
  },
  {
    id: 'predictive-forecasting',
    name: 'Predictive Forecasting',
    icon: 'LineChart',
    features: [
      { name: '7-Model Ensemble Forecasting', description: 'ARIMA, Prophet, Exponential Smoothing, TFT, N-BEATS, xLSTM, TimeXer', category: 'predictive-forecasting' },
      { name: 'Multi-Horizon Predictions', description: '30-day, 90-day, 6-month, 12-month trajectories', category: 'predictive-forecasting' },
      { name: 'Drift Detection', description: 'Automated alerts when compliance is degrading', category: 'predictive-forecasting' },
      { name: 'Threshold Breach Alerts', description: 'Early warning before crossing 750/600/500', category: 'predictive-forecasting' },
      { name: 'What-If Scenario Modeling', description: '"Fix X → +Y points" impact simulation', category: 'predictive-forecasting' },
      { name: 'Confidence Intervals', description: 'Bootstrap confidence bands on all forecasts', category: 'predictive-forecasting' },
    ],
  },
  {
    id: 'fairness-bias',
    name: 'Fairness, Bias & Explainability',
    icon: 'Scale',
    features: [
      { name: 'Fairness Audit Agent', description: 'AIF360, Fairlearn integration', category: 'fairness-bias' },
      { name: 'Demographic Parity Analysis', description: 'Statistical parity difference measurement', category: 'fairness-bias' },
      { name: 'Disparate Impact Testing', description: '4/5 rule compliance', category: 'fairness-bias' },
      { name: 'SHAP & LIME Explainability', description: 'Model interpretation and feature importance', category: 'fairness-bias' },
      { name: 'Counterfactual Generation', description: '"What would need to change for different outcome"', category: 'fairness-bias' },
      { name: 'Calibration Analysis', description: 'Prediction confidence validation', category: 'fairness-bias' },
    ],
  },
  {
    id: 'security-genai',
    name: 'Security & GenAI Risk',
    icon: 'Shield',
    features: [
      { name: 'MITRE ATLAS Integration', description: '112+ AI security checkpoints', category: 'security-genai' },
      { name: 'GenAI Risk Analyzer', description: 'Hallucination, prompt injection, jailbreak, toxicity detection', category: 'security-genai' },
      { name: 'Shadow AI Detection', description: 'Discover undocumented AI via Chrome extension + code scanning', category: 'security-genai' },
      { name: 'Adversarial Robustness Testing', description: 'FGSM, PGD attack simulations', category: 'security-genai' },
      { name: 'Anomaly Detection on Inputs', description: 'Flag suspicious inference requests', category: 'security-genai' },
      { name: 'Catastrophic Risk Analysis', description: '78 existential/tail-risk checkpoints', category: 'security-genai' },
    ],
  },
  {
    id: 'compliance-regulatory',
    name: 'Compliance & Regulatory',
    icon: 'FileCheck',
    features: [
      { name: '9 Framework Coverage', description: 'EU AI Act, NIST AI RMF, ISO 42001, GDPR, HIPAA, CCPA, NYC LL144, Colorado SB24-205, UK AI Code', category: 'compliance-regulatory' },
      { name: '50+ Jurisdictions', description: '27 EU countries, 50 US states, UK, Canada, Australia, Singapore', category: 'compliance-regulatory' },
      { name: 'Regulatory Mapping Agent', description: 'Auto-maps findings to specific articles/clauses', category: 'compliance-regulatory' },
      { name: 'Audit-Ready PDF Export', description: 'Executive and regulator reports', category: 'compliance-regulatory' },
      { name: 'Governance Trail', description: 'Immutable audit log of all actions', category: 'compliance-regulatory' },
      { name: 'Audit Timeline', description: 'Regulatory deadline tracking', category: 'compliance-regulatory' },
      { name: 'Industry Benchmarking', description: 'Percentile ranking vs. sector peers', category: 'compliance-regulatory' },
    ],
  },
  {
    id: 'evidence-documentation',
    name: 'Evidence & Documentation',
    icon: 'FileText',
    features: [
      { name: 'Evidence Collection Agent', description: 'GitHub, GitLab, Datadog, Google Drive scanning', category: 'evidence-documentation' },
      { name: 'Semantic Evidence Matching', description: '≥0.7 cosine similarity linking docs to checkpoints', category: 'evidence-documentation' },
      { name: 'Documentation Gap Analysis', description: 'Missing policies, model cards, procedures identified', category: 'evidence-documentation' },
      { name: 'Model Card Validation', description: 'Completeness scoring for ML model documentation', category: 'evidence-documentation' },
      { name: 'Verification URL', description: 'Public metris.ai/verify/{id}', category: 'evidence-documentation' },
      { name: 'Embeddable Badge', description: 'Display METRIS Score on website', category: 'evidence-documentation' },
    ],
  },
  {
    id: 'integrations-mlops',
    name: 'Integrations & MLOps/AIOps',
    icon: 'Plug',
    features: [
      { name: 'Multi-Method Intake', description: 'URL, file upload, API, repository connection', category: 'integrations-mlops' },
      { name: 'ML Registry Connector (Agent 22)', description: 'MLflow, Hugging Face Hub, Weights & Biases', category: 'integrations-mlops' },
      { name: 'MLOps Pipeline Analyzer (Agent 23)', description: 'Kubeflow, Airflow, SageMaker assessment', category: 'integrations-mlops' },
      { name: 'AIOps Observability (Agent 24)', description: 'Datadog, Prometheus, Grafana, Arize AI, WhyLabs', category: 'integrations-mlops' },
      { name: 'Digital Maturity Assessment (Agent 25)', description: 'Infrastructure, data, automation, workforce readiness', category: 'integrations-mlops' },
      { name: 'CI/CD Integration', description: 'GitHub Actions, GitLab CI pipeline gates', category: 'integrations-mlops' },
      { name: 'API & Webhooks', description: 'REST API, Python SDK, JS SDK, CLI, event notifications', category: 'integrations-mlops' },
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise & Business Intelligence',
    icon: 'Building2',
    features: [
      { name: 'Portfolio Dashboard', description: 'Monitor multiple AI systems with filters', category: 'enterprise' },
      { name: 'Multi-Entity Support', description: 'Parent/subsidiary governance', category: 'enterprise' },
      { name: 'Role-Based Access Control', description: 'Admin, Analyst, Viewer permissions', category: 'enterprise' },
      { name: 'Active Alerts & Notifications', description: 'Real-time severity notifications', category: 'enterprise' },
      { name: '3-Year TCO Analysis', description: 'Total cost of ownership comparison', category: 'enterprise' },
      { name: 'White-Label Capability', description: 'Partner branding options', category: 'enterprise' },
      { name: 'JSON Export', description: 'Data export for external systems', category: 'enterprise' },
    ],
  },
  {
    id: 'user-experience',
    name: 'User Experience',
    icon: 'Palette',
    features: [
      { name: 'Premium Dark Theme', description: 'Apple-inspired design system', category: 'user-experience' },
      { name: 'Animated Scanning UI', description: 'Scout Detective patrol/alert animations', category: 'user-experience' },
      { name: 'Responsive Design', description: 'Desktop, tablet, mobile', category: 'user-experience' },
      { name: '⌘K Quick Access', description: 'Keyboard shortcut for Scout anywhere', category: 'user-experience' },
    ],
  },
  {
    id: 'environmental',
    name: 'Environmental & Supply Chain',
    icon: 'Leaf',
    features: [
      { name: 'Carbon Footprint Analysis', description: 'CodeCarbon integration', category: 'environmental' },
      { name: 'Energy Efficiency Scoring', description: 'Green AI metrics', category: 'environmental' },
      { name: 'Third-Party/Vendor Risk', description: 'Supply chain AI governance', category: 'environmental' },
      { name: 'Model Lineage Tracking', description: 'Data → training → deployment traceability', category: 'environmental' },
    ],
  },
];

// Flatten all features for easy access
export const allFeatures = featureCategories.flatMap(cat => cat.features);

// Get total feature count
export const totalFeatures = allFeatures.length;
