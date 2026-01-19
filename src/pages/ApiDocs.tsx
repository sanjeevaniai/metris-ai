import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Copy, ExternalLink, Key, Clock, Shield } from 'lucide-react';
import { useState } from 'react';
import { ApiDocsSEO } from '@/components/seo/PageSEO';

const ApiDocs = () => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const endpoints = [
    {
      method: 'POST',
      path: '/v1/scan',
      description: 'Initiate a new AI system scan',
      params: [
        { name: 'system_id', type: 'string', required: true, description: 'Unique identifier for the AI system' },
        { name: 'connection_type', type: 'string', required: true, description: 'github | api | upload' },
        { name: 'options', type: 'object', required: false, description: 'Scan configuration options' },
      ],
    },
    {
      method: 'GET',
      path: '/v1/scan/{scan_id}',
      description: 'Get scan status and results',
      params: [
        { name: 'scan_id', type: 'string', required: true, description: 'Scan identifier from POST /scan response' },
      ],
    },
    {
      method: 'GET',
      path: '/v1/score/{system_id}',
      description: 'Get current governance score for a system',
      params: [
        { name: 'system_id', type: 'string', required: true, description: 'AI system identifier' },
        { name: 'include_breakdown', type: 'boolean', required: false, description: 'Include dimension/pillar breakdown' },
      ],
    },
    {
      method: 'GET',
      path: '/v1/findings/{system_id}',
      description: 'Get all findings for a system',
      params: [
        { name: 'system_id', type: 'string', required: true, description: 'AI system identifier' },
        { name: 'severity', type: 'string', required: false, description: 'Filter by severity level' },
        { name: 'status', type: 'string', required: false, description: 'Filter by resolution status' },
      ],
    },
    {
      method: 'POST',
      path: '/v1/simulate',
      description: 'Run Monte Carlo risk simulation',
      params: [
        { name: 'system_id', type: 'string', required: true, description: 'AI system identifier' },
        { name: 'iterations', type: 'number', required: false, description: 'Number of iterations (default: 10000)' },
        { name: 'risk_appetite', type: 'number', required: false, description: 'Risk appetite percentage (0-100)' },
      ],
    },
    {
      method: 'GET',
      path: '/v1/report/{system_id}',
      description: 'Generate governance report',
      params: [
        { name: 'system_id', type: 'string', required: true, description: 'AI system identifier' },
        { name: 'format', type: 'string', required: false, description: 'json | pdf | html' },
      ],
    },
  ];

  const curlExample = `curl -X POST https://api.metris.sanjeevani.ai/v1/scan \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "system_id": "credit-scorer-v2",
    "connection_type": "github",
    "options": {
      "repository": "org/credit-model",
      "branch": "main"
    }
  }'`;

  const pythonExample = `import requests

API_KEY = "YOUR_API_KEY"
BASE_URL = "https://api.metris.sanjeevani.ai/v1"

headers = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json"
}

# Initiate scan
response = requests.post(
    f"{BASE_URL}/scan",
    headers=headers,
    json={
        "system_id": "credit-scorer-v2",
        "connection_type": "github",
        "options": {
            "repository": "org/credit-model",
            "branch": "main"
        }
    }
)

scan_id = response.json()["scan_id"]

# Check scan status
status = requests.get(
    f"{BASE_URL}/scan/{scan_id}",
    headers=headers
)

print(status.json())`;

  const jsExample = `const API_KEY = 'YOUR_API_KEY';
const BASE_URL = 'https://api.metris.sanjeevani.ai/v1';

const headers = {
  'Authorization': \`Bearer \${API_KEY}\`,
  'Content-Type': 'application/json'
};

// Initiate scan
const response = await fetch(\`\${BASE_URL}/scan\`, {
  method: 'POST',
  headers,
  body: JSON.stringify({
    system_id: 'credit-scorer-v2',
    connection_type: 'github',
    options: {
      repository: 'org/credit-model',
      branch: 'main'
    }
  })
});

const { scan_id } = await response.json();

// Check scan status
const status = await fetch(\`\${BASE_URL}/scan/\${scan_id}\`, {
  headers
});

console.log(await status.json());`;

  return (
    <Layout>
      <ApiDocsSEO />
      <div className="container py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-light tracking-tight">API Documentation</h1>
            <p className="text-muted-foreground font-light">
              Integrate METRIS governance scanning into your systems
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="text-sm font-light">
              v1.0
            </Badge>
            <Button variant="outline" size="sm" className="font-light">
              <ExternalLink className="h-4 w-4 mr-2" />
              OpenAPI Spec
            </Button>
            <Button size="sm" className="gradient-primary text-primary-foreground font-light">
              <Key className="h-4 w-4 mr-2" />
              Get API Key
            </Button>
          </div>
        </div>

        {/* Quick Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Authentication</h3>
                <p className="text-sm text-muted-foreground font-light">Bearer token in header</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center">
                <Clock className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <h3 className="font-medium">Rate Limit</h3>
                <p className="text-sm text-muted-foreground font-light">1000 requests/hour</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-gold/10 flex items-center justify-center">
                <ExternalLink className="h-6 w-6 text-gold" />
              </div>
              <div>
                <h3 className="font-medium">Base URL</h3>
                <p className="text-sm text-muted-foreground font-mono">api.metris.sanjeevani.ai/v1</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Code Examples */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-light">Quick Start</CardTitle>
            <CardDescription className="font-light">
              Example code to initiate your first AI governance scan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="curl">
              <TabsList>
                <TabsTrigger value="curl">cURL</TabsTrigger>
                <TabsTrigger value="python">Python</TabsTrigger>
                <TabsTrigger value="javascript">JavaScript</TabsTrigger>
              </TabsList>
              <TabsContent value="curl" className="mt-4">
                <div className="relative">
                  <pre className="bg-muted/50 rounded-lg p-4 overflow-x-auto text-sm font-mono">
                    {curlExample}
                  </pre>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => copyToClipboard(curlExample, 'curl')}
                  >
                    {copiedCode === 'curl' ? 'Copied!' : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </TabsContent>
              <TabsContent value="python" className="mt-4">
                <div className="relative">
                  <pre className="bg-muted/50 rounded-lg p-4 overflow-x-auto text-sm font-mono">
                    {pythonExample}
                  </pre>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => copyToClipboard(pythonExample, 'python')}
                  >
                    {copiedCode === 'python' ? 'Copied!' : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </TabsContent>
              <TabsContent value="javascript" className="mt-4">
                <div className="relative">
                  <pre className="bg-muted/50 rounded-lg p-4 overflow-x-auto text-sm font-mono">
                    {jsExample}
                  </pre>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => copyToClipboard(jsExample, 'js')}
                  >
                    {copiedCode === 'js' ? 'Copied!' : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Endpoints Reference */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-light">Endpoints</CardTitle>
            <CardDescription className="font-light">
              Complete API reference for METRIS platform
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {endpoints.map((endpoint, idx) => (
              <div key={idx}>
                {idx > 0 && <Separator className="mb-6" />}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Badge
                      className={
                        endpoint.method === 'POST'
                          ? 'bg-primary/20 text-primary border-primary/30'
                          : 'bg-secondary/20 text-secondary border-secondary/30'
                      }
                    >
                      {endpoint.method}
                    </Badge>
                    <code className="text-sm font-mono bg-muted px-2 py-1 rounded">
                      {endpoint.path}
                    </code>
                  </div>
                  <p className="text-muted-foreground">{endpoint.description}</p>
                  
                  <div className="bg-muted/30 rounded-lg p-4">
                    <h4 className="text-sm font-medium mb-3">Parameters</h4>
                    <div className="space-y-2">
                      {endpoint.params.map((param) => (
                        <div
                          key={param.name}
                          className="flex items-start gap-4 text-sm"
                        >
                          <code className="font-mono text-primary min-w-[140px]">
                            {param.name}
                          </code>
                          <span className="text-muted-foreground min-w-[80px]">
                            {param.type}
                          </span>
                          {param.required && (
                            <Badge variant="outline" className="text-xs">
                              required
                            </Badge>
                          )}
                          <span className="text-muted-foreground flex-1">
                            {param.description}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Response Codes */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-light">Response Codes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { code: 200, description: 'Success - Request completed successfully' },
                { code: 201, description: 'Created - Scan initiated successfully' },
                { code: 400, description: 'Bad Request - Invalid parameters' },
                { code: 401, description: 'Unauthorized - Invalid or missing API key' },
                { code: 403, description: 'Forbidden - Insufficient permissions' },
                { code: 404, description: 'Not Found - Resource does not exist' },
                { code: 429, description: 'Too Many Requests - Rate limit exceeded' },
                { code: 500, description: 'Server Error - Internal error occurred' },
              ].map(({ code, description }) => (
                <div
                  key={code}
                  className="flex items-center gap-3 p-3 rounded-lg bg-muted/30"
                >
                  <Badge
                    className={
                      code < 300
                        ? 'bg-primary/20 text-primary'
                        : code < 500
                        ? 'bg-risk-medium/20 text-risk-medium'
                        : 'bg-risk-critical/20 text-risk-critical'
                    }
                  >
                    {code}
                  </Badge>
                  <span className="text-sm">{description}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default ApiDocs;
