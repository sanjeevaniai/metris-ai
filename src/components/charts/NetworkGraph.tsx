import React, { useCallback, useRef, useState, useEffect } from 'react';
import ForceGraph2D, { ForceGraphMethods } from 'react-force-graph-2d';
import { useVisualizationStore } from '@/store/useVisualizationStore';
import {
  DEMO_NETWORK_NODES,
  DEMO_NETWORK_EDGES,
  KEYSTONE_CHECKPOINTS,
  PILLAR_COLORS,
  STATUS_COLORS,
  calculateCascadeEffect,
} from '@/data/demoNetwork';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ZoomIn, ZoomOut, RotateCcw, Tag, AlertTriangle } from 'lucide-react';

interface NetworkGraphProps {
  className?: string;
  width?: number;
  height?: number;
}

interface GraphNode {
  id: string;
  label: string;
  pillar: string;
  importance: number;
  exposure: number;
  status: 'pass' | 'fail' | 'partial';
  x?: number;
  y?: number;
  fx?: number;
  fy?: number;
}

interface GraphLink {
  source: string | GraphNode;
  target: string | GraphNode;
  weight?: number;
}

export function NetworkGraph({ className, width = 800, height = 500 }: NetworkGraphProps) {
  const graphRef = useRef<ForceGraphMethods>();
  const containerRef = useRef<HTMLDivElement>(null);
  const [graphDimensions, setGraphDimensions] = useState({ width, height });
  const [showLabels, setShowLabels] = useState(true);
  const [showOnlyFailing, setShowOnlyFailing] = useState(false);
  const [selectedPillarFilter, setSelectedPillarFilter] = useState<string>('all');
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);

  const { selectedCheckpoints, setSelectedCheckpoints } = useVisualizationStore();

  // Handle resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setGraphDimensions({
          width: rect.width || width,
          height: Math.max(400, rect.height || height),
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [width, height]);

  // Filter nodes based on settings
  const filteredNodes = DEMO_NETWORK_NODES.filter(node => {
    if (showOnlyFailing && node.status === 'pass') return false;
    if (selectedPillarFilter !== 'all' && node.pillar !== selectedPillarFilter) return false;
    return true;
  });

  const filteredNodeIds = new Set(filteredNodes.map(n => n.id));

  // Filter edges to only include those between visible nodes
  const filteredEdges = DEMO_NETWORK_EDGES.filter(
    edge => filteredNodeIds.has(edge.source) && filteredNodeIds.has(edge.target)
  );

  // Prepare graph data
  const graphData = {
    nodes: filteredNodes.map(node => ({
      ...node,
      id: node.id,
    })) as GraphNode[],
    links: filteredEdges.map(edge => ({
      source: edge.source,
      target: edge.target,
      weight: edge.weight || 0.5,
    })) as GraphLink[],
  };

  // Node size based on exposure
  const getNodeSize = (node: GraphNode) => {
    const minSize = 6;
    const maxSize = 20;
    const maxExposure = 2100000;
    const scale = Math.min(node.exposure / maxExposure, 1);
    return minSize + scale * (maxSize - minSize);
  };

  // Node color based on status
  const getNodeColor = (node: GraphNode) => {
    if (selectedCheckpoints.includes(node.id)) return '#00d4aa';
    return STATUS_COLORS[node.status];
  };

  // Node border based on pillar
  const getNodeBorder = (node: GraphNode) => {
    return PILLAR_COLORS[node.pillar] || '#6b7280';
  };

  // Link color
  const getLinkColor = (link: GraphLink) => {
    const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
    const targetId = typeof link.target === 'object' ? link.target.id : link.target;
    
    // Highlight if connected to selected node
    if (selectedNode && (sourceId === selectedNode.id || targetId === selectedNode.id)) {
      return 'rgba(0, 212, 170, 0.8)';
    }
    
    // Keystone connections are thicker
    const isKeystoneConnection = KEYSTONE_CHECKPOINTS.some(
      k => k.id === sourceId || k.id === targetId
    );
    
    return isKeystoneConnection ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.1)';
  };

  // Node click handler
  const handleNodeClick = useCallback((node: GraphNode) => {
    setSelectedNode(node);
    const newSelection = selectedCheckpoints.includes(node.id)
      ? selectedCheckpoints.filter(id => id !== node.id)
      : [...selectedCheckpoints, node.id];
    setSelectedCheckpoints(newSelection);
  }, [selectedCheckpoints, setSelectedCheckpoints]);

  // Node hover handler
  const handleNodeHover = useCallback((node: GraphNode | null) => {
    setHoveredNode(node);
  }, []);

  // Canvas render for custom nodes
  const nodeCanvasObject = useCallback(
    (node: GraphNode, ctx: CanvasRenderingContext2D, globalScale: number) => {
      const size = getNodeSize(node);
      const x = node.x || 0;
      const y = node.y || 0;
      const isSelected = selectedCheckpoints.includes(node.id);
      const isHovered = hoveredNode?.id === node.id;

      // Draw border (pillar color)
      ctx.beginPath();
      ctx.arc(x, y, size + 2, 0, 2 * Math.PI);
      ctx.fillStyle = getNodeBorder(node);
      ctx.fill();

      // Draw main circle (status color)
      ctx.beginPath();
      ctx.arc(x, y, size, 0, 2 * Math.PI);
      ctx.fillStyle = getNodeColor(node);
      ctx.fill();

      // Draw selection ring
      if (isSelected || isHovered) {
        ctx.beginPath();
        ctx.arc(x, y, size + 5, 0, 2 * Math.PI);
        ctx.strokeStyle = isSelected ? '#00d4aa' : 'rgba(255, 255, 255, 0.5)';
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // Draw label
      if (showLabels && globalScale > 0.8) {
        ctx.font = `${10 / globalScale}px Inter`;
        ctx.fillStyle = '#f7fafc';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText(node.label.slice(0, 20), x, y + size + 4);
      }
    },
    [showLabels, hoveredNode, selectedCheckpoints]
  );

  // Controls
  const handleZoomIn = () => graphRef.current?.zoom(1.5, 400);
  const handleZoomOut = () => graphRef.current?.zoom(0.66, 400);
  const handleReset = () => {
    graphRef.current?.zoomToFit(400);
    setSelectedNode(null);
  };

  // Get cascade effect for selected node
  const cascadeEffect = selectedNode ? calculateCascadeEffect(selectedNode.id) : null;

  // Get unique pillars for filter dropdown
  const uniquePillars = [...new Set(DEMO_NETWORK_NODES.map(n => n.pillar))].sort();

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-bg-secondary rounded-lg p-3 border border-white/10">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={handleZoomIn}>
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleZoomOut}>
            <ZoomOut className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleReset}>
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Switch
              id="show-labels"
              checked={showLabels}
              onCheckedChange={setShowLabels}
            />
            <Label htmlFor="show-labels" className="text-sm text-text-secondary">
              <Tag className="w-4 h-4 inline mr-1" />
              Labels
            </Label>
          </div>

          <div className="flex items-center gap-2">
            <Switch
              id="show-failing"
              checked={showOnlyFailing}
              onCheckedChange={setShowOnlyFailing}
            />
            <Label htmlFor="show-failing" className="text-sm text-text-secondary">
              <AlertTriangle className="w-4 h-4 inline mr-1" />
              Failing only
            </Label>
          </div>

          <Select value={selectedPillarFilter} onValueChange={setSelectedPillarFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by pillar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Pillars</SelectItem>
              {uniquePillars.map(pillar => (
                <SelectItem key={pillar} value={pillar}>
                  {pillar.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex gap-4">
        {/* Graph container */}
        <div
          ref={containerRef}
          className="flex-1 bg-bg-secondary rounded-lg border border-white/10 overflow-hidden"
          style={{ minHeight: graphDimensions.height }}
        >
          <ForceGraph2D
            ref={graphRef}
            graphData={graphData}
            width={graphDimensions.width - 320} // Account for sidebar
            height={graphDimensions.height}
            backgroundColor="#1a1f2e"
            nodeRelSize={6}
            nodeCanvasObject={nodeCanvasObject}
            nodePointerAreaPaint={(node, color, ctx) => {
              const size = getNodeSize(node as GraphNode);
              ctx.fillStyle = color;
              ctx.beginPath();
              ctx.arc(node.x || 0, node.y || 0, size + 5, 0, 2 * Math.PI);
              ctx.fill();
            }}
            linkColor={getLinkColor}
            linkWidth={(link) => {
              const l = link as GraphLink;
              const sourceId = typeof l.source === 'object' ? l.source.id : l.source;
              const targetId = typeof l.target === 'object' ? l.target.id : l.target;
              const isKeystoneConnection = KEYSTONE_CHECKPOINTS.some(
                k => k.id === sourceId || k.id === targetId
              );
              return isKeystoneConnection ? 2 : 1;
            }}
            linkDirectionalArrowLength={4}
            linkDirectionalArrowRelPos={1}
            onNodeClick={handleNodeClick}
            onNodeHover={handleNodeHover}
            cooldownTicks={100}
            d3AlphaDecay={0.02}
            d3VelocityDecay={0.3}
          />

          {/* Hover tooltip */}
          {hoveredNode && !selectedNode && (
            <div className="absolute bottom-4 left-4 bg-bg-secondary border border-white/10 rounded-lg p-3 shadow-xl max-w-xs">
              <p className="font-semibold text-text-primary">{hoveredNode.label}</p>
              <p className="text-text-secondary text-sm capitalize">{hoveredNode.pillar.replace('_', ' ')}</p>
              <div className="mt-2 space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-text-secondary">Status:</span>
                  <Badge
                    variant={hoveredNode.status === 'pass' ? 'default' : hoveredNode.status === 'fail' ? 'destructive' : 'secondary'}
                  >
                    {hoveredNode.status}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Exposure:</span>
                  <span className="font-mono text-status-warning">
                    ${(hoveredNode.exposure / 1000).toFixed(0)}K
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Keystone Panel */}
        <Card className="w-80 bg-bg-secondary border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Keystone Checkpoints</CardTitle>
            <p className="text-text-secondary text-sm">
              High-impact fixes that unlock multiple dependencies
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            {KEYSTONE_CHECKPOINTS.slice(0, 5).map((checkpoint, index) => {
              const cascade = calculateCascadeEffect(checkpoint.id);
              return (
                <div
                  key={checkpoint.id}
                  className={cn(
                    "p-3 rounded-lg border cursor-pointer transition-all",
                    selectedNode?.id === checkpoint.id
                      ? "border-brand-primary bg-brand-primary/10"
                      : "border-white/10 hover:border-white/20 hover:bg-bg-tertiary"
                  )}
                  onClick={() => handleNodeClick(checkpoint as GraphNode)}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="font-medium text-sm text-text-primary">
                        {index + 1}. {checkpoint.label}
                      </p>
                      <p className="text-xs text-text-secondary capitalize">
                        {checkpoint.pillar.replace('_', ' ')}
                      </p>
                    </div>
                    <Badge
                      variant={checkpoint.status === 'pass' ? 'default' : checkpoint.status === 'fail' ? 'destructive' : 'secondary'}
                      className="text-xs"
                    >
                      {checkpoint.status}
                    </Badge>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-xs">
                    <span className="text-text-secondary">
                      Unlocks {cascade.unlockedCount} checkpoints
                    </span>
                    <span className="text-status-good font-mono">
                      ${(cascade.totalExposure / 1000000).toFixed(1)}M
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Selected node cascade info */}
            {selectedNode && cascadeEffect && (
              <div className="mt-4 p-3 bg-brand-primary/10 border border-brand-primary/30 rounded-lg">
                <p className="font-medium text-brand-primary text-sm">
                  Cascade Effect
                </p>
                <p className="text-text-secondary text-xs mt-1">
                  Fixing "{selectedNode.label}" unlocks{' '}
                  <span className="text-text-primary font-semibold">
                    {cascadeEffect.unlockedCount} checkpoints
                  </span>{' '}
                  worth{' '}
                  <span className="text-status-good font-semibold">
                    ${(cascadeEffect.totalExposure / 1000000).toFixed(2)}M
                  </span>
                </p>
                <Button
                  size="sm"
                  className="w-full mt-3 bg-brand-primary text-bg-primary hover:bg-brand-primary/90"
                >
                  Fix First
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default NetworkGraph;
