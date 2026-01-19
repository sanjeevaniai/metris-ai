import React, { useState, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  ColumnDef,
  SortingState,
  ColumnFiltersState,
} from '@tanstack/react-table';
import { SidebarLayout } from '@/components/layout/SidebarLayout';
import { useVisualizationStore } from '@/store/useVisualizationStore';
import { DEMO_CHECKPOINTS, Checkpoint, CHECKPOINT_STATS } from '@/data/demoCheckpoints';
import { DEMO_PILLARS } from '@/data/demoPillars';
import { DEMO_FRAMEWORKS } from '@/data/demoFrameworks';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import {
  ChevronUp,
  ChevronDown,
  Search,
  X,
  Download,
  FileText,
  CheckCircle2,
  XCircle,
  AlertCircle,
  MinusCircle,
  Plus,
  Eye,
} from 'lucide-react';

// Add exposure and ROI to checkpoints for display
interface EnhancedCheckpoint extends Checkpoint {
  exposure: number;
  remediationCost: number;
  roi: number;
  frameworks: string[];
}

// Enhance checkpoints with additional data
const enhanceCheckpoints = (): EnhancedCheckpoint[] => {
  return DEMO_CHECKPOINTS.slice(0, 200).map((cp, index) => {
    const exposure = Math.floor(10000 + Math.random() * 490000);
    const remediationCost = Math.floor(5000 + Math.random() * 95000);
    const roi = exposure / remediationCost;
    
    // Add multiple frameworks
    const frameworkCount = 1 + Math.floor(Math.random() * 3);
    const frameworks = [cp.framework];
    const availableFrameworks = ['EU AI Act', 'NIST AI RMF', 'ISO 42001', 'GDPR', 'SOC 2'];
    for (let i = 1; i < frameworkCount; i++) {
      const randomFw = availableFrameworks[Math.floor(Math.random() * availableFrameworks.length)];
      if (!frameworks.includes(randomFw)) {
        frameworks.push(randomFw);
      }
    }
    
    return {
      ...cp,
      exposure,
      remediationCost,
      roi,
      frameworks,
    };
  });
};

const ENHANCED_CHECKPOINTS = enhanceCheckpoints();

const StatusIcon = ({ status }: { status: string }) => {
  switch (status) {
    case 'passed':
      return <CheckCircle2 className="w-4 h-4 text-status-good" />;
    case 'failed':
      return <XCircle className="w-4 h-4 text-status-critical" />;
    case 'partial':
      return <AlertCircle className="w-4 h-4 text-status-warning" />;
    default:
      return <MinusCircle className="w-4 h-4 text-text-secondary" />;
  }
};

const SeverityBadge = ({ severity }: { severity: string }) => {
  const colors: Record<string, string> = {
    critical: 'bg-status-critical/20 text-status-critical border-status-critical/30',
    high: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    medium: 'bg-status-warning/20 text-status-warning border-status-warning/30',
    low: 'bg-status-good/20 text-status-good border-status-good/30',
    info: 'bg-brand-secondary/20 text-brand-secondary border-brand-secondary/30',
  };
  
  return (
    <Badge variant="outline" className={cn('text-xs', colors[severity] || colors.info)}>
      {severity}
    </Badge>
  );
};

export default function CheckpointBrowser() {
  const {
    selectedPillars,
    selectedFrameworks,
    setSelectedPillars,
    setSelectedFrameworks,
    addSimulatedFix,
    simulatedFixes,
  } = useVisualizationStore();

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [selectedCheckpoint, setSelectedCheckpoint] = useState<EnhancedCheckpoint | null>(null);
  const [pageSize, setPageSize] = useState(25);

  // Apply global state filters
  const filteredData = useMemo(() => {
    let data = ENHANCED_CHECKPOINTS;
    
    if (selectedPillars.length > 0) {
      data = data.filter(cp => {
        const pillarId = cp.pillar.toLowerCase().replace(/[^a-z]/g, '_').replace(/__+/g, '_');
        return selectedPillars.some(sp => 
          pillarId.includes(sp) || sp.includes(pillarId) || cp.pillar.toLowerCase().includes(sp.toLowerCase())
        );
      });
    }
    
    if (selectedFrameworks.length > 0) {
      data = data.filter(cp => 
        cp.frameworks.some(fw => {
          const fwId = fw.toLowerCase().replace(/[^a-z0-9]/g, '_');
          return selectedFrameworks.some(sf => fwId.includes(sf) || sf.includes(fwId));
        })
      );
    }
    
    return data;
  }, [selectedPillars, selectedFrameworks]);

  // Calculate summary stats
  const summaryStats = useMemo(() => {
    const passing = filteredData.filter(cp => cp.status === 'passed').length;
    const failing = filteredData.filter(cp => cp.status === 'failed').length;
    const totalExposure = filteredData.reduce((sum, cp) => sum + cp.exposure, 0);
    
    return { passing, failing, totalExposure };
  }, [filteredData]);

  // Table columns
  const columns: ColumnDef<EnhancedCheckpoint>[] = useMemo(() => [
    {
      accessorKey: 'status',
      header: '',
      cell: ({ row }) => <StatusIcon status={row.original.status} />,
      size: 40,
    },
    {
      accessorKey: 'id',
      header: 'ID',
      cell: ({ row }) => (
        <span className="font-mono text-sm text-text-secondary">{row.original.id}</span>
      ),
      size: 80,
    },
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="h-auto p-0 font-medium hover:bg-transparent"
        >
          Name
          {column.getIsSorted() === 'asc' ? (
            <ChevronUp className="ml-1 h-4 w-4" />
          ) : column.getIsSorted() === 'desc' ? (
            <ChevronDown className="ml-1 h-4 w-4" />
          ) : null}
        </Button>
      ),
      cell: ({ row }) => (
        <span className="text-text-primary">{row.original.name}</span>
      ),
    },
    {
      accessorKey: 'pillar',
      header: 'Pillar',
      cell: ({ row }) => (
        <Badge variant="outline" className="text-xs whitespace-nowrap">
          {row.original.pillar.length > 15 
            ? row.original.pillar.slice(0, 15) + '...' 
            : row.original.pillar}
        </Badge>
      ),
    },
    {
      accessorKey: 'frameworks',
      header: 'Frameworks',
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-1">
          {row.original.frameworks.slice(0, 2).map(fw => (
            <Badge key={fw} variant="secondary" className="text-xs">
              {fw.length > 12 ? fw.slice(0, 10) + '...' : fw}
            </Badge>
          ))}
          {row.original.frameworks.length > 2 && (
            <Badge variant="secondary" className="text-xs">
              +{row.original.frameworks.length - 2}
            </Badge>
          )}
        </div>
      ),
    },
    {
      accessorKey: 'severity',
      header: 'Severity',
      cell: ({ row }) => <SeverityBadge severity={row.original.severity} />,
    },
    {
      accessorKey: 'exposure',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="h-auto p-0 font-medium hover:bg-transparent"
        >
          Exposure
          {column.getIsSorted() === 'asc' ? (
            <ChevronUp className="ml-1 h-4 w-4" />
          ) : column.getIsSorted() === 'desc' ? (
            <ChevronDown className="ml-1 h-4 w-4" />
          ) : null}
        </Button>
      ),
      cell: ({ row }) => (
        <span className="font-mono text-status-warning">
          ${(row.original.exposure / 1000).toFixed(0)}K
        </span>
      ),
    },
    {
      accessorKey: 'remediationCost',
      header: 'Cost',
      cell: ({ row }) => (
        <span className="font-mono text-text-secondary">
          ${(row.original.remediationCost / 1000).toFixed(0)}K
        </span>
      ),
    },
    {
      accessorKey: 'roi',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="h-auto p-0 font-medium hover:bg-transparent"
        >
          ROI
          {column.getIsSorted() === 'asc' ? (
            <ChevronUp className="ml-1 h-4 w-4" />
          ) : column.getIsSorted() === 'desc' ? (
            <ChevronDown className="ml-1 h-4 w-4" />
          ) : null}
        </Button>
      ),
      cell: ({ row }) => (
        <span className={cn(
          "font-mono",
          row.original.roi > 5 ? "text-status-good" : "text-text-primary"
        )}>
          {row.original.roi.toFixed(1)}x
        </span>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const isInRoadmap = simulatedFixes.some(f => f.checkpointId === row.original.id);
        
        return (
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedCheckpoint(row.original)}
              className="h-8 px-2"
            >
              <Eye className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (!isInRoadmap) {
                  addSimulatedFix({
                    checkpointId: row.original.id,
                    status: 'pending',
                    pointsGain: Math.floor(row.original.score / 20),
                    exposureReduction: row.original.exposure,
                  });
                }
              }}
              disabled={isInRoadmap || row.original.status === 'passed'}
              className={cn(
                "h-8 px-2",
                isInRoadmap && "text-status-good"
              )}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        );
      },
    },
  ], [addSimulatedFix, simulatedFixes]);

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: { pageSize },
    },
  });

  // Clear all filters
  const clearFilters = () => {
    setSelectedPillars([]);
    setSelectedFrameworks([]);
    setGlobalFilter('');
    setColumnFilters([]);
  };

  const hasActiveFilters = selectedPillars.length > 0 || selectedFrameworks.length > 0;

  return (
    <SidebarLayout>
    <div className="min-h-screen bg-bg-primary p-6">
      <div className="max-w-[1600px] mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-text-primary">Checkpoint Browser</h1>
            <p className="text-text-secondary">
              Browse and manage all governance checkpoints
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
            <Button variant="outline" size="sm">
              <FileText className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
          </div>
        </div>

        {/* Summary Bar */}
        <Card className="bg-bg-secondary border-white/10">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-8">
                <div>
                  <span className="text-text-secondary text-sm">Showing</span>
                  <span className="font-mono font-bold text-text-primary ml-2">
                    {table.getFilteredRowModel().rows.length}
                  </span>
                  <span className="text-text-secondary text-sm ml-1">
                    of {ENHANCED_CHECKPOINTS.length} checkpoints
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-status-good" />
                    <span className="text-text-primary">{summaryStats.passing}</span>
                    <span className="text-text-secondary">passing</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <XCircle className="w-4 h-4 text-status-critical" />
                    <span className="text-text-primary">{summaryStats.failing}</span>
                    <span className="text-text-secondary">failing</span>
                  </span>
                </div>
                <div>
                  <span className="text-text-secondary text-sm">Total exposure:</span>
                  <span className="font-mono font-bold text-status-warning ml-2">
                    ${(summaryStats.totalExposure / 1000000).toFixed(2)}M
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filter Bar */}
        <Card className="bg-bg-secondary border-white/10">
          <CardContent className="py-4">
            <div className="flex flex-wrap items-center gap-4">
              {/* Search */}
              <div className="relative flex-1 min-w-[200px] max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                <Input
                  placeholder="Search checkpoints..."
                  value={globalFilter}
                  onChange={(e) => setGlobalFilter(e.target.value)}
                  className="pl-10 bg-bg-tertiary border-white/10"
                />
              </div>

              {/* Pillar Filter */}
              <Select
                value={selectedPillars[0] || 'all'}
                onValueChange={(v) => setSelectedPillars(v === 'all' ? [] : [v])}
              >
                <SelectTrigger className="w-48 bg-bg-tertiary border-white/10">
                  <SelectValue placeholder="All Pillars" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Pillars</SelectItem>
                  {DEMO_PILLARS.map(p => (
                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Framework Filter */}
              <Select
                value={selectedFrameworks[0] || 'all'}
                onValueChange={(v) => setSelectedFrameworks(v === 'all' ? [] : [v])}
              >
                <SelectTrigger className="w-48 bg-bg-tertiary border-white/10">
                  <SelectValue placeholder="All Frameworks" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Frameworks</SelectItem>
                  {DEMO_FRAMEWORKS.map(f => (
                    <SelectItem key={f.id} value={f.id}>{f.shortName}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Severity Filter */}
              <Select
                value={(columnFilters.find(f => f.id === 'severity')?.value as string) || 'all'}
                onValueChange={(v) => {
                  if (v === 'all') {
                    setColumnFilters(filters => filters.filter(f => f.id !== 'severity'));
                  } else {
                    setColumnFilters(filters => [
                      ...filters.filter(f => f.id !== 'severity'),
                      { id: 'severity', value: v }
                    ]);
                  }
                }}
              >
                <SelectTrigger className="w-36 bg-bg-tertiary border-white/10">
                  <SelectValue placeholder="Severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severity</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>

              {/* Status Filter */}
              <Select
                value={(columnFilters.find(f => f.id === 'status')?.value as string) || 'all'}
                onValueChange={(v) => {
                  if (v === 'all') {
                    setColumnFilters(filters => filters.filter(f => f.id !== 'status'));
                  } else {
                    setColumnFilters(filters => [
                      ...filters.filter(f => f.id !== 'status'),
                      { id: 'status', value: v }
                    ]);
                  }
                }}
              >
                <SelectTrigger className="w-36 bg-bg-tertiary border-white/10">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="passed">Passed</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="partial">Partial</SelectItem>
                </SelectContent>
              </Select>

              {/* Page Size */}
              <Select
                value={String(pageSize)}
                onValueChange={(v) => {
                  setPageSize(Number(v));
                  table.setPageSize(Number(v));
                }}
              >
                <SelectTrigger className="w-24 bg-bg-tertiary border-white/10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Active Filter Badge */}
            {hasActiveFilters && (
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/10">
                <span className="text-text-secondary text-sm">Filtered by:</span>
                {selectedPillars.map(p => (
                  <Badge key={p} variant="secondary" className="gap-1">
                    {p}
                    <X
                      className="w-3 h-3 cursor-pointer"
                      onClick={() => setSelectedPillars(selectedPillars.filter(x => x !== p))}
                    />
                  </Badge>
                ))}
                {selectedFrameworks.map(f => (
                  <Badge key={f} variant="secondary" className="gap-1">
                    {f}
                    <X
                      className="w-3 h-3 cursor-pointer"
                      onClick={() => setSelectedFrameworks(selectedFrameworks.filter(x => x !== f))}
                    />
                  </Badge>
                ))}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-brand-primary"
                >
                  Clear all
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Table */}
        <Card className="bg-bg-secondary border-white/10 overflow-hidden">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map(headerGroup => (
                <TableRow key={headerGroup.id} className="border-white/10 hover:bg-transparent">
                  {headerGroup.headers.map(header => (
                    <TableHead
                      key={header.id}
                      className="text-text-secondary"
                      style={{ width: header.getSize() }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map(row => (
                  <TableRow
                    key={row.id}
                    className={cn(
                      "border-white/10 hover:bg-bg-tertiary transition-colors",
                      row.original.status === 'failed' && "border-l-2 border-l-status-critical",
                      row.original.severity === 'critical' && row.original.status === 'failed' && "bg-status-critical/5"
                    )}
                  >
                    {row.getVisibleCells().map(cell => (
                      <TableCell key={cell.id} className="py-3">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center text-text-secondary">
                    No checkpoints found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-text-secondary">
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      {/* Detail Sheet */}
      <Sheet open={!!selectedCheckpoint} onOpenChange={() => setSelectedCheckpoint(null)}>
        <SheetContent className="bg-bg-secondary border-white/10 w-[500px]">
          {selectedCheckpoint && (
            <>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <StatusIcon status={selectedCheckpoint.status} />
                  {selectedCheckpoint.id}
                </SheetTitle>
                <SheetDescription>{selectedCheckpoint.name}</SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-bg-tertiary rounded-lg p-3">
                    <p className="text-text-secondary text-xs">Pillar</p>
                    <p className="text-text-primary font-medium">{selectedCheckpoint.pillar}</p>
                  </div>
                  <div className="bg-bg-tertiary rounded-lg p-3">
                    <p className="text-text-secondary text-xs">Severity</p>
                    <SeverityBadge severity={selectedCheckpoint.severity} />
                  </div>
                  <div className="bg-bg-tertiary rounded-lg p-3">
                    <p className="text-text-secondary text-xs">Exposure</p>
                    <p className="font-mono text-status-warning">
                      ${(selectedCheckpoint.exposure / 1000).toFixed(0)}K
                    </p>
                  </div>
                  <div className="bg-bg-tertiary rounded-lg p-3">
                    <p className="text-text-secondary text-xs">ROI</p>
                    <p className="font-mono text-status-good">{selectedCheckpoint.roi.toFixed(1)}x</p>
                  </div>
                </div>
                
                <div className="bg-bg-tertiary rounded-lg p-3">
                  <p className="text-text-secondary text-xs mb-2">Frameworks</p>
                  <div className="flex flex-wrap gap-1">
                    {selectedCheckpoint.frameworks.map(fw => (
                      <Badge key={fw} variant="outline">{fw}</Badge>
                    ))}
                  </div>
                </div>

                <div className="bg-bg-tertiary rounded-lg p-3">
                  <p className="text-text-secondary text-xs mb-1">Agent</p>
                  <p className="text-text-primary">{selectedCheckpoint.agent}</p>
                </div>

                {selectedCheckpoint.remediation && (
                  <div className="bg-bg-tertiary rounded-lg p-3">
                    <p className="text-text-secondary text-xs mb-1">Remediation</p>
                    <p className="text-text-primary">{selectedCheckpoint.remediation}</p>
                  </div>
                )}

                <div className="flex gap-2 mt-6">
                  <Button
                    className="flex-1 bg-brand-primary text-bg-primary hover:bg-brand-primary/90"
                    onClick={() => {
                      addSimulatedFix({
                        checkpointId: selectedCheckpoint.id,
                        status: 'pending',
                        pointsGain: Math.floor(selectedCheckpoint.score / 20),
                        exposureReduction: selectedCheckpoint.exposure,
                      });
                      setSelectedCheckpoint(null);
                    }}
                    disabled={selectedCheckpoint.status === 'passed'}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add to Roadmap
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
    </SidebarLayout>
  );
}
