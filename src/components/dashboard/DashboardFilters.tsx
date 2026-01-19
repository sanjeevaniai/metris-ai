import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter, X } from 'lucide-react';

interface DashboardFiltersProps {
  scoreRange: string;
  department: string;
  lastScan: string;
  searchQuery: string;
  onScoreRangeChange: (value: string) => void;
  onDepartmentChange: (value: string) => void;
  onLastScanChange: (value: string) => void;
  onSearchChange: (value: string) => void;
  onReset: () => void;
}

export function DashboardFilters({
  scoreRange,
  department,
  lastScan,
  searchQuery,
  onScoreRangeChange,
  onDepartmentChange,
  onLastScanChange,
  onSearchChange,
  onReset,
}: DashboardFiltersProps) {
  const hasFilters = scoreRange !== 'all' || department !== 'all' || lastScan !== 'all' || searchQuery;

  return (
    <div className="flex flex-wrap items-center gap-3 p-4 bg-muted/30 rounded-lg border border-border/50">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Filter className="h-4 w-4" />
        <span className="font-light">Filters:</span>
      </div>

      {/* Search */}
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search systems..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 h-9 font-light"
        />
      </div>

      {/* Score Range */}
      <Select value={scoreRange} onValueChange={onScoreRangeChange}>
        <SelectTrigger className="w-[140px] h-9 font-light">
          <SelectValue placeholder="Score Range" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Scores</SelectItem>
          <SelectItem value="0-400">0-400 (Critical)</SelectItem>
          <SelectItem value="400-600">400-600 (At Risk)</SelectItem>
          <SelectItem value="600-800">600-800 (Good)</SelectItem>
          <SelectItem value="800-1000">800-1000 (Excellent)</SelectItem>
        </SelectContent>
      </Select>

      {/* Department */}
      <Select value={department} onValueChange={onDepartmentChange}>
        <SelectTrigger className="w-[140px] h-9 font-light">
          <SelectValue placeholder="Department" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Depts</SelectItem>
          <SelectItem value="engineering">Engineering</SelectItem>
          <SelectItem value="finance">Finance</SelectItem>
          <SelectItem value="hr">Human Resources</SelectItem>
          <SelectItem value="marketing">Marketing</SelectItem>
          <SelectItem value="operations">Operations</SelectItem>
        </SelectContent>
      </Select>

      {/* Last Scan */}
      <Select value={lastScan} onValueChange={onLastScanChange}>
        <SelectTrigger className="w-[140px] h-9 font-light">
          <SelectValue placeholder="Last Scan" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Any Time</SelectItem>
          <SelectItem value="24h">Last 24 hours</SelectItem>
          <SelectItem value="7d">Last 7 days</SelectItem>
          <SelectItem value="30d">Last 30 days</SelectItem>
          <SelectItem value="90d">Last 90 days</SelectItem>
        </SelectContent>
      </Select>

      {/* Reset */}
      {hasFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          className="h-9 gap-1 text-muted-foreground hover:text-foreground"
        >
          <X className="h-3 w-3" />
          Reset
        </Button>
      )}
    </div>
  );
}
