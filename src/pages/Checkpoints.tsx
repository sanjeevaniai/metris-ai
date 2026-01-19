import { useState, useMemo } from 'react';
import { SidebarLayout } from '@/components/layout/SidebarLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DEMO_CHECKPOINTS, CHECKPOINT_STATS, Checkpoint } from '@/data/demoCheckpoints';
import { Search, Filter, Download, CheckCircle2, XCircle, AlertTriangle, MinusCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const ITEMS_PER_PAGE = 50;

const severityConfig = {
  critical: { color: 'bg-[hsl(var(--risk-critical))]', label: 'Critical' },
  high: { color: 'bg-[hsl(var(--risk-high))]', label: 'High' },
  medium: { color: 'bg-[hsl(var(--risk-medium))]', label: 'Medium' },
  low: { color: 'bg-[hsl(var(--risk-low))]', label: 'Low' },
  info: { color: 'bg-[hsl(var(--risk-info))]', label: 'Info' },
};

const statusConfig = {
  passed: { icon: CheckCircle2, color: 'text-[hsl(var(--status-success))]', label: 'Passed' },
  failed: { icon: XCircle, color: 'text-[hsl(var(--status-error))]', label: 'Failed' },
  partial: { icon: AlertTriangle, color: 'text-[hsl(var(--status-warning))]', label: 'Partial' },
  not_applicable: { icon: MinusCircle, color: 'text-[hsl(var(--status-inactive))]', label: 'N/A' },
};

export default function Checkpoints() {
  const [search, setSearch] = useState('');
  const [pillarFilter, setPillarFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [page, setPage] = useState(1);

  const filteredCheckpoints = useMemo(() => {
    return DEMO_CHECKPOINTS.filter(cp => {
      const matchesSearch = search === '' || 
        cp.name.toLowerCase().includes(search.toLowerCase()) ||
        cp.id.toLowerCase().includes(search.toLowerCase()) ||
        cp.framework.toLowerCase().includes(search.toLowerCase());
      const matchesPillar = pillarFilter === 'all' || cp.pillar === pillarFilter;
      const matchesStatus = statusFilter === 'all' || cp.status === statusFilter;
      const matchesSeverity = severityFilter === 'all' || cp.severity === severityFilter;
      return matchesSearch && matchesPillar && matchesStatus && matchesSeverity;
    });
  }, [search, pillarFilter, statusFilter, severityFilter]);

  const totalPages = Math.ceil(filteredCheckpoints.length / ITEMS_PER_PAGE);
  const paginatedCheckpoints = filteredCheckpoints.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const pillars = [...new Set(DEMO_CHECKPOINTS.map(c => c.pillar))];

  const resetFilters = () => {
    setSearch('');
    setPillarFilter('all');
    setStatusFilter('all');
    setSeverityFilter('all');
    setPage(1);
  };

  return (
    <SidebarLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Checkpoint Browser</h1>
            <p className="text-sm text-muted-foreground mt-1">
              <span className="font-mono">{CHECKPOINT_STATS.total.toLocaleString()}</span> compliance checkpoints across 12 governance pillars
            </p>
          </div>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="border-border/50 bg-card/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-[hsl(var(--status-success))]" />
                <div>
                  <p className="text-2xl font-mono font-semibold">{CHECKPOINT_STATS.passed.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Passed</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50 bg-card/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <XCircle className="h-5 w-5 text-[hsl(var(--status-error))]" />
                <div>
                  <p className="text-2xl font-mono font-semibold">{CHECKPOINT_STATS.failed.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Failed</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50 bg-card/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-[hsl(var(--status-warning))]" />
                <div>
                  <p className="text-2xl font-mono font-semibold">{CHECKPOINT_STATS.partial.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Partial</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50 bg-card/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <MinusCircle className="h-5 w-5 text-[hsl(var(--status-inactive))]" />
                <div>
                  <p className="text-2xl font-mono font-semibold">{CHECKPOINT_STATS.notApplicable.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">N/A</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="border-border/50 bg-card/50">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search checkpoints..."
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                    className="pl-9 bg-background/50"
                  />
                </div>
              </div>
              <Select value={pillarFilter} onValueChange={(v) => { setPillarFilter(v); setPage(1); }}>
                <SelectTrigger className="w-[180px] bg-background/50">
                  <SelectValue placeholder="All Pillars" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Pillars</SelectItem>
                  {pillars.map(p => (
                    <SelectItem key={p} value={p}>{p}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
                <SelectTrigger className="w-[140px] bg-background/50">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="passed">Passed</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="partial">Partial</SelectItem>
                  <SelectItem value="not_applicable">N/A</SelectItem>
                </SelectContent>
              </Select>
              <Select value={severityFilter} onValueChange={(v) => { setSeverityFilter(v); setPage(1); }}>
                <SelectTrigger className="w-[140px] bg-background/50">
                  <SelectValue placeholder="All Severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severity</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="ghost" size="sm" onClick={resetFilters} className="text-muted-foreground">
                <Filter className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Count */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Showing <span className="font-mono text-foreground">{paginatedCheckpoints.length}</span> of{' '}
            <span className="font-mono text-foreground">{filteredCheckpoints.length.toLocaleString()}</span> checkpoints
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="font-mono text-xs">
              {page} / {totalPages}
            </span>
            <Button
              variant="ghost"
              size="icon"
              disabled={page === totalPages}
              onClick={() => setPage(p => p + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Table */}
        <Card className="border-border/50 bg-card/50 overflow-hidden">
          <ScrollArea className="h-[calc(100vh-440px)]">
            <Table>
              <TableHeader className="sticky top-0 bg-card z-10">
                <TableRow className="border-border/50 hover:bg-transparent">
                  <TableHead className="w-[100px] font-mono text-xs">ID</TableHead>
                  <TableHead className="text-xs">Checkpoint</TableHead>
                  <TableHead className="text-xs">Pillar</TableHead>
                  <TableHead className="text-xs">Framework</TableHead>
                  <TableHead className="text-xs text-center">Severity</TableHead>
                  <TableHead className="text-xs text-center">Status</TableHead>
                  <TableHead className="text-xs text-right font-mono">Score</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedCheckpoints.map((cp) => {
                  const StatusIcon = statusConfig[cp.status].icon;
                  return (
                    <TableRow key={cp.id} className="border-border/30 hover:bg-muted/30 cursor-pointer">
                      <TableCell className="font-mono text-xs text-muted-foreground">{cp.id}</TableCell>
                      <TableCell className="text-sm max-w-[300px] truncate">{cp.name}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{cp.pillar}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{cp.framework}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className="text-[10px] uppercase tracking-wider">
                          <span className={cn("w-1.5 h-1.5 rounded-full mr-1.5", severityConfig[cp.severity].color)} />
                          {cp.severity}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <StatusIcon className={cn("h-4 w-4 mx-auto", statusConfig[cp.status].color)} />
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm tabular-nums">
                        {cp.status === 'not_applicable' ? '—' : cp.score}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </ScrollArea>
        </Card>
      </div>
    </SidebarLayout>
  );
}
