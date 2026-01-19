import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Github, Globe, Upload, ArrowRight, DollarSign, Link2, CheckCircle2, AlertCircle, FileText, X, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { microsoftRaiDemo } from '@/data/microsoftRaiData';

interface IntakeFormProps {
  onSubmit: (data: IntakeData) => void;
}

export interface IntakeData {
  connectionType: 'github' | 'api' | 'upload' | 'url';
  organizationName: string;
  ein: string;
  industry: string;
  jurisdictions: string[];
  aiSystems: string[];
  systemUrl?: string;
  githubUrl?: string;
  apiEndpoint?: string;
  uploadedFiles?: UploadedFile[];
  useDemoData?: boolean;
}

interface UploadedFile {
  name: string;
  type: string;
  size: number;
}

const industries = [
  'Financial Services',
  'Healthcare',
  'Insurance',
  'Retail & E-commerce',
  'Technology',
  'Manufacturing',
  'Government',
  'Other',
];

const jurisdictions = [
  { id: 'eu', label: 'European Union', regulation: 'EU AI Act' },
  { id: 'uk', label: 'United Kingdom', regulation: 'UK AI Framework' },
  { id: 'us', label: 'United States', regulation: 'NIST AI RMF' },
  { id: 'apac', label: 'Asia-Pacific', regulation: 'Various' },
];

// URL validation helper
const isValidUrl = (url: string): boolean => {
  try {
    const parsed = new URL(url.startsWith('http') ? url : `https://${url}`);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
};

export function IntakeForm({ onSubmit }: IntakeFormProps) {
  const [connectionType, setConnectionType] = useState<'github' | 'api' | 'upload' | 'url' | null>(null);
  const [formData, setFormData] = useState<Partial<IntakeData>>({
    jurisdictions: ['eu'],
    aiSystems: [],
    uploadedFiles: [],
  });
  const [urlValidation, setUrlValidation] = useState<'idle' | 'valid' | 'invalid'>('idle');
  const [githubValidation, setGithubValidation] = useState<'idle' | 'valid' | 'invalid'>('idle');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUrlChange = (url: string) => {
    setFormData({ ...formData, systemUrl: url });
    if (url.length > 5) {
      setUrlValidation(isValidUrl(url) ? 'valid' : 'invalid');
    } else {
      setUrlValidation('idle');
    }
  };

  const handleGithubChange = (url: string) => {
    setFormData({ ...formData, githubUrl: url });
    if (url.length > 5) {
      const isGithubUrl = url.includes('github.com');
      setGithubValidation(isGithubUrl ? 'valid' : 'invalid');
    } else {
      setGithubValidation('idle');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles: UploadedFile[] = Array.from(files).map(f => ({
        name: f.name,
        type: f.type || f.name.split('.').pop() || 'unknown',
        size: f.size,
      }));
      setFormData({
        ...formData,
        uploadedFiles: [...(formData.uploadedFiles || []), ...newFiles],
      });
    }
  };

  const removeFile = (index: number) => {
    const newFiles = [...(formData.uploadedFiles || [])];
    newFiles.splice(index, 1);
    setFormData({ ...formData, uploadedFiles: newFiles });
  };

  const loadDemoData = () => {
    setConnectionType('github');
    setFormData({
      ...formData,
      organizationName: microsoftRaiDemo.organization.name,
      ein: '123-456789',
      industry: microsoftRaiDemo.organization.industry,
      githubUrl: microsoftRaiDemo.organization.url,
      jurisdictions: ['eu', 'us'],
      useDemoData: true,
      uploadedFiles: microsoftRaiDemo.sampleDocuments.map(doc => ({
        name: doc.name,
        type: doc.type,
        size: 0,
      })),
    });
    setGithubValidation('valid');
  };

  const handleSubmit = () => {
    if (!connectionType || !formData.organizationName || !formData.industry || !formData.ein) return;
    
    onSubmit({
      connectionType,
      organizationName: formData.organizationName,
      ein: formData.ein,
      industry: formData.industry,
      jurisdictions: formData.jurisdictions || ['eu'],
      aiSystems: formData.aiSystems || [],
      systemUrl: formData.systemUrl,
      githubUrl: formData.githubUrl,
      apiEndpoint: formData.apiEndpoint,
      uploadedFiles: formData.uploadedFiles,
      useDemoData: formData.useDemoData,
    });
  };

  const estimatedROI = formData.industry === 'Financial Services' ? 8500000 :
    formData.industry === 'Healthcare' ? 6200000 :
    formData.industry === 'Technology' ? 8600000 :
    formData.industry === 'Insurance' ? 5800000 : 4200000;

  const hasConnection = connectionType === 'url' ? (formData.systemUrl && urlValidation === 'valid') :
    connectionType === 'github' ? (formData.githubUrl && githubValidation === 'valid') :
    connectionType === 'api' ? formData.apiEndpoint :
    connectionType === 'upload' ? (formData.uploadedFiles && formData.uploadedFiles.length > 0) : false;

  const isFormValid = connectionType && formData.organizationName && formData.industry && formData.ein && hasConnection;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Demo Button */}
      <div className="flex justify-center">
        <Button 
          variant="outline" 
          onClick={loadDemoData}
          className="border-primary/50 hover:bg-primary/10"
        >
          <Sparkles className="h-4 w-4 mr-2 text-primary" />
          Load Microsoft RAI Demo
        </Button>
      </div>

      {/* Connection Type Selection */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* URL Connect - Primary Option */}
        <Card
          className={cn(
            'cursor-pointer transition-all hover:border-primary/50 relative',
            connectionType === 'url' && 'border-primary shadow-glow-sm'
          )}
          onClick={() => setConnectionType('url')}
        >
          <div className="absolute -top-2 -right-2 px-2 py-0.5 text-xs font-medium rounded-full gradient-primary text-primary-foreground">
            Recommended
          </div>
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
              <Link2 className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-1">URL Connect</h3>
            <p className="text-sm text-muted-foreground">
              Enter your AI system's URL for automatic scanning
            </p>
          </CardContent>
        </Card>

        <Card
          className={cn(
            'cursor-pointer transition-all hover:border-primary/50',
            connectionType === 'github' && 'border-primary shadow-glow-sm'
          )}
          onClick={() => setConnectionType('github')}
        >
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <Github className="h-6 w-6" />
            </div>
            <h3 className="font-semibold mb-1">GitHub Connect</h3>
            <p className="text-sm text-muted-foreground">
              Scan repositories for ML models and configs
            </p>
          </CardContent>
        </Card>

        <Card
          className={cn(
            'cursor-pointer transition-all hover:border-primary/50',
            connectionType === 'api' && 'border-primary shadow-glow-sm'
          )}
          onClick={() => setConnectionType('api')}
        >
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <Globe className="h-6 w-6" />
            </div>
            <h3 className="font-semibold mb-1">API Connect</h3>
            <p className="text-sm text-muted-foreground">
              Connect via REST API for automated scanning
            </p>
          </CardContent>
        </Card>

        <Card
          className={cn(
            'cursor-pointer transition-all hover:border-primary/50',
            connectionType === 'upload' && 'border-primary shadow-glow-sm'
          )}
          onClick={() => setConnectionType('upload')}
        >
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <Upload className="h-6 w-6" />
            </div>
            <h3 className="font-semibold mb-1">Document Upload</h3>
            <p className="text-sm text-muted-foreground">
              Upload YAML, JSON, or PDF documentation
            </p>
          </CardContent>
        </Card>
      </div>

      {connectionType && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
          {/* Organization Details */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg">Organization Details</CardTitle>
              <CardDescription>
                Provide information about your organization and AI systems
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* URL Input - Show prominently for URL connection type */}
              {connectionType === 'url' && (
                <div className="p-4 bg-primary/5 rounded-lg border border-primary/20 mb-4">
                  <Label htmlFor="system-url" className="text-primary font-medium">
                    AI System URL
                  </Label>
                  <p className="text-xs text-muted-foreground mb-2">
                    Enter the URL of your AI system, API documentation, or product page
                  </p>
                  <div className="relative">
                    <Input
                      id="system-url"
                      placeholder="https://api.yourcompany.com/docs or https://yourproduct.com"
                      value={formData.systemUrl || ''}
                      onChange={(e) => handleUrlChange(e.target.value)}
                      className={cn(
                        'pr-10',
                        urlValidation === 'valid' && 'border-primary focus-visible:ring-primary',
                        urlValidation === 'invalid' && 'border-destructive focus-visible:ring-destructive'
                      )}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      {urlValidation === 'valid' && (
                        <CheckCircle2 className="h-5 w-5 text-primary" />
                      )}
                      {urlValidation === 'invalid' && (
                        <AlertCircle className="h-5 w-5 text-destructive" />
                      )}
                    </div>
                  </div>
                  {urlValidation === 'valid' && (
                    <p className="text-xs text-primary mt-1">
                      ✓ Valid URL — METRIS will scan this endpoint for governance analysis
                    </p>
                  )}
                  {urlValidation === 'invalid' && (
                    <p className="text-xs text-destructive mt-1">
                      Please enter a valid URL (e.g., https://example.com)
                    </p>
                  )}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="org-name">Organization Name</Label>
                  <Input
                    id="org-name"
                    placeholder="Acme Financial Corp"
                    value={formData.organizationName || ''}
                    onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ein">
                    System EIN <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="ein"
                    placeholder="123-456789"
                    value={formData.ein || ''}
                    onChange={(e) => setFormData({ ...formData, ein: e.target.value })}
                    required
                  />
                  {!formData.ein && (
                    <p className="text-xs text-muted-foreground">Required field</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="industry">Industry</Label>
                  <Select
                    value={formData.industry}
                    onValueChange={(value) => setFormData({ ...formData, industry: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select industry" />
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
              </div>

              <div className="space-y-2">
                <Label>Jurisdictions</Label>
                <div className="grid grid-cols-2 gap-3">
                  {jurisdictions.map((j) => (
                    <div
                      key={j.id}
                      className="flex items-center space-x-2 p-3 rounded-lg border border-border hover:border-primary/30 transition-colors"
                    >
                      <Checkbox
                        id={j.id}
                        checked={formData.jurisdictions?.includes(j.id)}
                        onCheckedChange={(checked) => {
                          const current = formData.jurisdictions || [];
                          setFormData({
                            ...formData,
                            jurisdictions: checked
                              ? [...current, j.id]
                              : current.filter((id) => id !== j.id),
                          });
                        }}
                      />
                      <div className="flex-1">
                        <label htmlFor={j.id} className="text-sm font-medium cursor-pointer">
                          {j.label}
                        </label>
                        <p className="text-xs text-muted-foreground">{j.regulation}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {connectionType === 'github' && (
                <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <Label htmlFor="github-url" className="text-primary font-medium">
                    GitHub Repository URL
                  </Label>
                  <p className="text-xs text-muted-foreground mb-2">
                    Enter the GitHub repository URL of your AI/ML system
                  </p>
                  <div className="relative">
                    <Input
                      id="github-url"
                      placeholder="https://github.com/microsoft/responsible-ai-toolbox"
                      value={formData.githubUrl || ''}
                      onChange={(e) => handleGithubChange(e.target.value)}
                      className={cn(
                        'pr-10',
                        githubValidation === 'valid' && 'border-primary focus-visible:ring-primary',
                        githubValidation === 'invalid' && 'border-destructive focus-visible:ring-destructive'
                      )}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      {githubValidation === 'valid' && (
                        <CheckCircle2 className="h-5 w-5 text-primary" />
                      )}
                      {githubValidation === 'invalid' && (
                        <AlertCircle className="h-5 w-5 text-destructive" />
                      )}
                    </div>
                  </div>
                  {githubValidation === 'valid' && (
                    <p className="text-xs text-primary mt-1">
                      ✓ Valid GitHub URL — METRIS will scan this repository
                    </p>
                  )}
                </div>
              )}

              {connectionType === 'api' && (
                <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <Label htmlFor="api-endpoint" className="text-primary font-medium">
                    API Endpoint
                  </Label>
                  <p className="text-xs text-muted-foreground mb-2">
                    Enter your AI system's API documentation or endpoint URL
                  </p>
                  <Input
                    id="api-endpoint"
                    placeholder="https://api.yourcompany.com/v1/docs"
                    value={formData.apiEndpoint || ''}
                    onChange={(e) => setFormData({ ...formData, apiEndpoint: e.target.value })}
                  />
                </div>
              )}

              {connectionType === 'upload' && (
                <div 
                  className="p-8 bg-muted/30 rounded-lg border-2 border-dashed border-border hover:border-primary/30 transition-colors cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".yaml,.yml,.json,.pdf,.md,.txt"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                  <div className="text-center">
                    <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                    <p className="text-sm font-medium mb-1">
                      Drop files here or click to upload
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Supports YAML, JSON, PDF, Markdown (model cards, configs, documentation)
                    </p>
                  </div>
                </div>
              )}

              {/* Document Upload Section - Always visible for all connection types */}
              {connectionType && connectionType !== 'upload' && (
                <div className="p-4 bg-muted/30 rounded-lg border border-dashed border-border">
                  <div className="flex items-center gap-3 mb-3">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Additional Documents (Optional)</p>
                      <p className="text-xs text-muted-foreground">
                        Upload model cards, fairness reports, or documentation
                      </p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="h-4 w-4 mr-1" />
                      Upload
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept=".yaml,.yml,.json,.pdf,.md,.txt"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                  </div>
                </div>
              )}

              {/* Show uploaded files */}
              {formData.uploadedFiles && formData.uploadedFiles.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-sm">Uploaded Documents</Label>
                  <div className="flex flex-wrap gap-2">
                    {formData.uploadedFiles.map((file, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="flex items-center gap-2 py-1.5 px-3"
                      >
                        <FileText className="h-3 w-3" />
                        {file.name}
                        <button
                          onClick={() => removeFile(index)}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* ROI Preview */}
          <Card className="border-primary/30 shadow-glow-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-primary" />
                ROI Preview
              </CardTitle>
              <CardDescription>
                Early detection value based on your industry
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-gradient mb-1">
                  €{(estimatedROI / 1000000).toFixed(1)}M
                </div>
                <p className="text-sm text-muted-foreground">
                  Estimated risk exposure
                </p>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Regulatory fines avoided</span>
                  <span className="font-medium text-primary">
                    €{((estimatedROI * 0.4) / 1000000).toFixed(1)}M
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Reputational protection</span>
                  <span className="font-medium text-primary">
                    €{((estimatedROI * 0.35) / 1000000).toFixed(1)}M
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Operational savings</span>
                  <span className="font-medium text-primary">
                    €{((estimatedROI * 0.25) / 1000000).toFixed(1)}M
                  </span>
                </div>
              </div>

              {/* Show connection target */}
              {connectionType === 'url' && formData.systemUrl && urlValidation === 'valid' && (
                <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
                  <p className="text-xs text-primary font-medium mb-1">Target URL</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {formData.systemUrl}
                  </p>
                </div>
              )}

              {connectionType === 'github' && formData.githubUrl && githubValidation === 'valid' && (
                <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
                  <p className="text-xs text-primary font-medium mb-1">GitHub Repository</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {formData.githubUrl}
                  </p>
                </div>
              )}

              {formData.uploadedFiles && formData.uploadedFiles.length > 0 && (
                <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
                  <p className="text-xs text-primary font-medium mb-1">Documents Ready</p>
                  <p className="text-xs text-muted-foreground">
                    {formData.uploadedFiles.length} file(s) will be analyzed
                  </p>
                </div>
              )}

              <Button
                className="w-full gradient-primary text-primary-foreground shadow-glow-sm"
                onClick={handleSubmit}
                disabled={!isFormValid}
              >
                {formData.useDemoData ? 'Run Demo Scan' : 
                  connectionType === 'url' ? 'Scan AI System' : 'Start Risk Scan'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}