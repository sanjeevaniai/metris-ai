import { useState } from 'react';
import { Globe, Github, FileText, Plug, Upload, CheckCircle, Loader2, AlertCircle, ExternalLink, Key, X, ChevronRight, Folder } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AssessmentData } from '@/pages/Assess';
import { cn } from '@/lib/utils';

interface EvidenceCollectionProps {
  data: AssessmentData;
  updateData: (updates: Partial<AssessmentData>) => void;
  onNext: () => void;
  onSkip: () => void;
}

interface UploadedFile {
  name: string;
  size: number;
  type: string;
}

type ConnectionStatus = 'disconnected' | 'connecting' | 'connected';

export function EvidenceCollection({ data, updateData, onNext, onSkip }: EvidenceCollectionProps) {
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [websiteStatus, setWebsiteStatus] = useState<ConnectionStatus>('disconnected');
  
  const [githubUrl, setGithubUrl] = useState('');
  const [githubStatus, setGithubStatus] = useState<ConnectionStatus>('disconnected');
  
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  
  const [apiStatus, setApiStatus] = useState<ConnectionStatus>('disconnected');
  
  const [googleDriveStatus, setGoogleDriveStatus] = useState<ConnectionStatus>('disconnected');
  const [notionStatus, setNotionStatus] = useState<ConnectionStatus>('disconnected');

  const hasMinimumEvidence = uploadedFiles.length > 0;

  const handleWebsiteConnect = () => {
    if (!websiteUrl) return;
    setWebsiteStatus('connecting');
    setTimeout(() => {
      setWebsiteStatus('connected');
    }, 1500);
  };

  const handleGithubOAuth = () => {
    setGithubStatus('connecting');
    setTimeout(() => {
      setGithubStatus('connected');
    }, 2000);
  };

  const handleGithubUrlConnect = () => {
    if (!githubUrl) return;
    setGithubStatus('connecting');
    setTimeout(() => {
      setGithubStatus('connected');
    }, 1500);
  };

  const handleGoogleDriveConnect = () => {
    setGoogleDriveStatus('connecting');
    setTimeout(() => {
      setGoogleDriveStatus('connected');
    }, 2000);
  };

  const handleNotionConnect = () => {
    setNotionStatus('connecting');
    setTimeout(() => {
      setNotionStatus('connected');
    }, 2000);
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    addFiles(files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    addFiles(files);
  };

  const addFiles = (files: File[]) => {
    const validFiles = files.filter(file => {
      const ext = file.name.split('.').pop()?.toLowerCase();
      return ['pdf', 'docx', 'txt', 'md'].includes(ext || '');
    });
    
    const newFiles: UploadedFile[] = validFiles.map(file => ({
      name: file.name,
      size: file.size,
      type: file.type
    }));
    
    setUploadedFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getStatusIndicator = (status: ConnectionStatus) => {
    switch (status) {
      case 'connected':
        return <span className="flex items-center gap-1.5 text-green-400 text-sm"><CheckCircle className="w-4 h-4" /> Connected</span>;
      case 'connecting':
        return <span className="flex items-center gap-1.5 text-yellow-400 text-sm"><Loader2 className="w-4 h-4 animate-spin" /> Connecting...</span>;
      default:
        return <span className="flex items-center gap-1.5 text-muted-foreground text-sm"><AlertCircle className="w-4 h-4" /> Not connected</span>;
    }
  };

  const totalFileSize = uploadedFiles.reduce((acc, file) => acc + file.size, 0);

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">Connect Your Sources</h1>
        <p className="text-muted-foreground text-lg">
          The more evidence you provide, the more accurate your score
        </p>
        
        {/* Progress Indicator */}
        <div className="flex items-center justify-center gap-2 text-sm">
          <span className="flex items-center gap-1.5 text-green-400">
            <CheckCircle className="w-4 h-4" />
            Intake
          </span>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
          <span className="flex items-center gap-1.5 text-primary font-medium">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Evidence
          </span>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
          <span className="text-muted-foreground">Analysis</span>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
          <span className="text-muted-foreground">Results</span>
        </div>
      </div>

      {/* Evidence Source Cards - 3x2 Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Card 1 - Website URL */}
        <Card className={cn(
          "lcd-display border-border/50",
          websiteStatus === 'connected' && "border-green-500/30"
        )}>
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <Globe className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <CardTitle className="text-base">Website</CardTitle>
                  <CardDescription className="text-sm">Connect your public-facing site</CardDescription>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-xs text-muted-foreground space-y-1 border-t border-border/50 pt-3">
              <p className="font-medium text-foreground/80 mb-2">We'll scan for:</p>
              <p>• Privacy policy</p>
              <p>• AI disclosure statements</p>
              <p>• Terms of service</p>
              <p>• Public AI/ML documentation</p>
            </div>
            
            <div className="space-y-2">
              <Input
                placeholder="Enter website URL"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                disabled={websiteStatus === 'connected'}
                className="bg-background/50"
              />
              <Button 
                onClick={handleWebsiteConnect}
                disabled={!websiteUrl || websiteStatus === 'connecting' || websiteStatus === 'connected'}
                className="w-full"
                variant={websiteStatus === 'connected' ? 'secondary' : 'default'}
              >
                {websiteStatus === 'connecting' && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {websiteStatus === 'connected' ? 'Connected' : 'Connect Website'}
              </Button>
            </div>
            
            <div className="pt-2 border-t border-border/50">
              {getStatusIndicator(websiteStatus)}
            </div>
          </CardContent>
        </Card>

        {/* Card 2 - GitHub Repository */}
        <Card className={cn(
          "lcd-display border-border/50",
          githubStatus === 'connected' && "border-green-500/30"
        )}>
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <Github className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <CardTitle className="text-base">GitHub Repository</CardTitle>
                  <CardDescription className="text-sm">Connect your codebase</CardDescription>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-xs text-muted-foreground space-y-1 border-t border-border/50 pt-3">
              <p className="font-medium text-foreground/80 mb-2">We'll scan for:</p>
              <p>• README and documentation</p>
              <p>• LICENSE file</p>
              <p>• SECURITY.md</p>
              <p>• Model cards & code structure</p>
            </div>
            
            <div className="space-y-2">
              <Button 
                onClick={handleGithubOAuth}
                disabled={githubStatus === 'connecting' || githubStatus === 'connected'}
                className="w-full"
                variant={githubStatus === 'connected' ? 'secondary' : 'default'}
              >
                {githubStatus === 'connecting' && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                <Github className="w-4 h-4 mr-2" />
                {githubStatus === 'connected' ? 'Connected to GitHub' : 'Connect with GitHub'}
              </Button>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border/50" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-card px-2 text-muted-foreground">or</span>
                </div>
              </div>
              
              <Input
                placeholder="Enter repo URL"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                disabled={githubStatus === 'connected'}
                className="bg-background/50"
              />
            </div>
            
            <div className="pt-2 border-t border-border/50">
              {getStatusIndicator(githubStatus)}
            </div>
          </CardContent>
        </Card>

        {/* Card 3 - Document Upload (Required) */}
        <Card className={cn(
          "lcd-display border-border/50",
          uploadedFiles.length > 0 && "border-green-500/30"
        )}>
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <CardTitle className="text-base flex items-center gap-2">
                    Documents
                    <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded">Required</span>
                  </CardTitle>
                  <CardDescription className="text-sm">Upload your governance documents</CardDescription>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-xs text-muted-foreground space-y-1 border-t border-border/50 pt-3">
              <p className="font-medium text-foreground/80 mb-2">Upload any of:</p>
              <p>• AI/ML policies</p>
              <p>• Risk assessments</p>
              <p>• Training records</p>
              <p>• Audit reports & procedures</p>
            </div>
            
            <div
              className={cn(
                "border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer",
                isDragging ? "border-primary bg-primary/5" : "border-border/50 hover:border-border",
              )}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleFileDrop}
              onClick={() => document.getElementById('file-upload')?.click()}
            >
              <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Drag & drop files or click to upload
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                PDF, DOCX, TXT, MD (Max 50MB total)
              </p>
              <input
                id="file-upload"
                type="file"
                multiple
                accept=".pdf,.docx,.txt,.md"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
            
            {uploadedFiles.length > 0 && (
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between text-sm bg-background/50 rounded px-3 py-2">
                    <div className="flex items-center gap-2 truncate">
                      <FileText className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      <span className="truncate">{file.name}</span>
                      <span className="text-xs text-muted-foreground">({formatFileSize(file.size)})</span>
                    </div>
                    <button onClick={() => removeFile(index)} className="text-muted-foreground hover:text-foreground">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            <div className="pt-2 border-t border-border/50 flex items-center justify-between">
              {uploadedFiles.length > 0 ? (
                <span className="flex items-center gap-1.5 text-green-400 text-sm">
                  <CheckCircle className="w-4 h-4" />
                  {uploadedFiles.length} file{uploadedFiles.length !== 1 ? 's' : ''} uploaded ({formatFileSize(totalFileSize)})
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-muted-foreground text-sm">
                  <AlertCircle className="w-4 h-4" />
                  0 files uploaded
                </span>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Card 4 - API Connection (Optional) */}
        <Card className="lcd-display border-border/50 opacity-75">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                  <Plug className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <CardTitle className="text-base flex items-center gap-2">
                    API Connection
                    <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded">Optional</span>
                  </CardTitle>
                  <CardDescription className="text-sm">Connect your AI systems directly</CardDescription>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-xs text-muted-foreground space-y-1 border-t border-border/50 pt-3">
              <p className="font-medium text-foreground/80 mb-2">For continuous monitoring:</p>
              <p>• Model metadata</p>
              <p>• System logs</p>
              <p>• Performance metrics</p>
            </div>
            
            <div className="space-y-2">
              <Button variant="outline" className="w-full" disabled>
                <ExternalLink className="w-4 h-4 mr-2" />
                View API Documentation
              </Button>
              <Button variant="outline" className="w-full" disabled>
                <Key className="w-4 h-4 mr-2" />
                Generate API Key
              </Button>
            </div>
            
            <div className="pt-2 border-t border-border/50">
              <span className="flex items-center gap-1.5 text-muted-foreground text-sm">
                <AlertCircle className="w-4 h-4" />
                Available on Monitoring plan
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Card 5 - Google Drive */}
        <Card className={cn(
          "lcd-display border-border/50",
          googleDriveStatus === 'connected' && "border-green-500/30"
        )}>
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                  <Folder className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <CardTitle className="text-base">Google Drive</CardTitle>
                  <CardDescription className="text-sm">Import governance documents</CardDescription>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-xs text-muted-foreground space-y-1 border-t border-border/50 pt-3">
              <p className="font-medium text-foreground/80 mb-2">We'll scan for:</p>
              <p>• AI/ML policies</p>
              <p>• Risk assessments</p>
              <p>• Training records</p>
              <p>• Audit reports</p>
            </div>
            
            <Button 
              onClick={handleGoogleDriveConnect}
              disabled={googleDriveStatus === 'connecting' || googleDriveStatus === 'connected'}
              className="w-full"
              variant={googleDriveStatus === 'connected' ? 'secondary' : 'default'}
            >
              {googleDriveStatus === 'connecting' && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              <ExternalLink className="w-4 h-4 mr-2" />
              {googleDriveStatus === 'connected' ? 'Connected to Google Drive' : 'Connect Google Drive'}
            </Button>
            
            <div className="pt-2 border-t border-border/50">
              {getStatusIndicator(googleDriveStatus)}
            </div>
          </CardContent>
        </Card>

        {/* Card 6 - Notion */}
        <Card className={cn(
          "lcd-display border-border/50",
          notionStatus === 'connected' && "border-green-500/30"
        )}>
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-slate-500/20 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-slate-400" />
                </div>
                <div>
                  <CardTitle className="text-base">Notion</CardTitle>
                  <CardDescription className="text-sm">Connect your workspace</CardDescription>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-xs text-muted-foreground space-y-1 border-t border-border/50 pt-3">
              <p className="font-medium text-foreground/80 mb-2">We'll scan for:</p>
              <p>• Policy pages</p>
              <p>• Process documentation</p>
              <p>• Team wikis</p>
              <p>• Decision logs</p>
            </div>
            
            <Button 
              onClick={handleNotionConnect}
              disabled={notionStatus === 'connecting' || notionStatus === 'connected'}
              className="w-full"
              variant={notionStatus === 'connected' ? 'secondary' : 'default'}
            >
              {notionStatus === 'connecting' && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              <ExternalLink className="w-4 h-4 mr-2" />
              {notionStatus === 'connected' ? 'Connected to Notion' : 'Connect Notion'}
            </Button>
            
            <div className="pt-2 border-t border-border/50">
              {getStatusIndicator(notionStatus)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Section */}
      <div className="space-y-4 pt-4 border-t border-border/50">
        <p className="text-center text-sm text-muted-foreground">
          <span className="text-red-400">*</span> Minimum: Upload at least one governance document to proceed
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            onClick={onNext}
            disabled={!hasMinimumEvidence}
            size="lg"
            className="min-w-[200px]"
          >
            Start Analysis
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
          
          <Button
            onClick={onSkip}
            variant="ghost"
            size="lg"
            className="text-muted-foreground hover:text-foreground"
          >
            Skip for now → Get estimated score only
          </Button>
        </div>
        
        {!hasMinimumEvidence && (
          <p className="text-center text-xs text-amber-400/80">
            Upload at least one document to enable full analysis
          </p>
        )}
      </div>
    </div>
  );
}
