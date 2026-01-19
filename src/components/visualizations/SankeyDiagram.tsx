import { useMemo, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SankeyNode {
  id: string;
  name: string;
  value?: number;
  color: string;
  x?: number;
  y?: number;
  height?: number;
}

interface SankeyLink {
  source: string;
  target: string;
  value: number;
  color?: string;
}

interface SankeyDiagramProps {
  nodes: SankeyNode[];
  links: SankeyLink[];
  width?: number;
  height?: number;
  nodeWidth?: number;
  nodePadding?: number;
  title?: string;
  subtitle?: string;
}

export function SankeyDiagram({
  nodes: inputNodes,
  links: inputLinks,
  width = 800,
  height = 400,
  nodeWidth = 20,
  nodePadding = 15,
  title,
  subtitle,
}: SankeyDiagramProps) {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [hoveredLink, setHoveredLink] = useState<number | null>(null);
  const [tooltipData, setTooltipData] = useState<{ x: number; y: number; content: string } | null>(null);

  // Calculate node positions and link paths
  const { nodes, links } = useMemo(() => {
    // Group nodes by column (based on link structure)
    const nodeMap = new Map<string, SankeyNode>();
    inputNodes.forEach(n => nodeMap.set(n.id, { ...n }));

    // Determine columns
    const sourceNodes = new Set(inputLinks.map(l => l.source));
    const targetNodes = new Set(inputLinks.map(l => l.target));
    const leftNodes = [...sourceNodes].filter(n => !targetNodes.has(n));
    const rightNodes = [...targetNodes].filter(n => !sourceNodes.has(n));
    const middleNodes = [...sourceNodes].filter(n => targetNodes.has(n));

    // Assign columns
    const columns: string[][] = [];
    if (leftNodes.length > 0) columns.push(leftNodes);
    if (middleNodes.length > 0) columns.push(middleNodes);
    if (rightNodes.length > 0) columns.push(rightNodes);

    // Calculate positions
    const padding = { left: 40, right: 40, top: 40, bottom: 40 };
    const plotWidth = width - padding.left - padding.right;
    const plotHeight = height - padding.top - padding.bottom;
    const columnWidth = plotWidth / (columns.length - 1 || 1);

    // Calculate node values (sum of incoming or outgoing links)
    const nodeValues = new Map<string, number>();
    inputLinks.forEach(link => {
      const sourceVal = nodeValues.get(link.source) || 0;
      const targetVal = nodeValues.get(link.target) || 0;
      nodeValues.set(link.source, sourceVal + link.value);
      nodeValues.set(link.target, targetVal + link.value);
    });

    // Position nodes
    const positionedNodes: SankeyNode[] = [];
    columns.forEach((col, colIndex) => {
      const x = padding.left + colIndex * columnWidth;
      const totalValue = col.reduce((sum, id) => sum + (nodeValues.get(id) || 1), 0);
      const availableHeight = plotHeight - (col.length - 1) * nodePadding;
      
      let currentY = padding.top;
      col.forEach(nodeId => {
        const node = nodeMap.get(nodeId);
        if (!node) return;
        
        const value = nodeValues.get(nodeId) || 1;
        const nodeHeight = Math.max(20, (value / totalValue) * availableHeight);
        
        positionedNodes.push({
          ...node,
          x,
          y: currentY,
          height: nodeHeight,
          value,
        });
        
        currentY += nodeHeight + nodePadding;
      });
    });

    // Create link paths
    const getNodeById = (id: string) => positionedNodes.find(n => n.id === id);
    
    // Track cumulative positions for stacking links
    const sourceOffsets = new Map<string, number>();
    const targetOffsets = new Map<string, number>();
    positionedNodes.forEach(n => {
      sourceOffsets.set(n.id, 0);
      targetOffsets.set(n.id, 0);
    });

    const calculatedLinks = inputLinks.map((link, index) => {
      const sourceNode = getNodeById(link.source);
      const targetNode = getNodeById(link.target);
      
      if (!sourceNode || !targetNode) return null;

      const sourceValue = nodeValues.get(link.source) || 1;
      const targetValue = nodeValues.get(link.target) || 1;
      
      const linkHeightAtSource = (link.value / sourceValue) * (sourceNode.height || 20);
      const linkHeightAtTarget = (link.value / targetValue) * (targetNode.height || 20);
      
      const sourceOffset = sourceOffsets.get(link.source) || 0;
      const targetOffset = targetOffsets.get(link.target) || 0;
      
      sourceOffsets.set(link.source, sourceOffset + linkHeightAtSource);
      targetOffsets.set(link.target, targetOffset + linkHeightAtTarget);

      const x0 = (sourceNode.x || 0) + nodeWidth;
      const y0 = (sourceNode.y || 0) + sourceOffset + linkHeightAtSource / 2;
      const x1 = targetNode.x || 0;
      const y1 = (targetNode.y || 0) + targetOffset + linkHeightAtTarget / 2;

      // Bezier curve
      const curvature = 0.5;
      const xi = (x0 + x1) / 2;
      const path = `M${x0},${y0} C${x0 + (x1 - x0) * curvature},${y0} ${x1 - (x1 - x0) * curvature},${y1} ${x1},${y1}`;

      return {
        ...link,
        index,
        path,
        strokeWidth: Math.max(2, (linkHeightAtSource + linkHeightAtTarget) / 2),
        color: link.color || sourceNode.color,
        x0,
        y0,
        x1,
        y1,
      };
    }).filter(Boolean);

    return { nodes: positionedNodes, links: calculatedLinks };
  }, [inputNodes, inputLinks, width, height, nodeWidth, nodePadding]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipData(prev => prev ? { ...prev, x: e.clientX - rect.left, y: e.clientY - rect.top } : null);
  }, []);

  const formatValue = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    return value.toString();
  };

  return (
    <div className="w-full">
      {title && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold">{title}</h3>
          {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
        </div>
      )}
      
      <div className="relative" onMouseMove={handleMouseMove}>
        <svg 
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto"
          style={{ maxHeight: `${height}px` }}
        >
          {/* Links */}
          <g>
            {links.map((link: any, i) => (
              <motion.path
                key={i}
                d={link.path}
                fill="none"
                stroke={link.color}
                strokeWidth={link.strokeWidth}
                opacity={hoveredLink === i ? 0.9 : hoveredNode && (link.source === hoveredNode || link.target === hoveredNode) ? 0.8 : hoveredLink !== null || hoveredNode ? 0.2 : 0.5}
                className="transition-opacity duration-200 cursor-pointer"
                onMouseEnter={() => {
                  setHoveredLink(i);
                  setTooltipData({
                    x: (link.x0 + link.x1) / 2,
                    y: (link.y0 + link.y1) / 2,
                    content: `${nodes.find(n => n.id === link.source)?.name} → ${nodes.find(n => n.id === link.target)?.name}: ${formatValue(link.value)}`,
                  });
                }}
                onMouseLeave={() => {
                  setHoveredLink(null);
                  setTooltipData(null);
                }}
              />
            ))}
          </g>

          {/* Nodes */}
          <g>
            {nodes.map((node) => (
              <g 
                key={node.id}
                onMouseEnter={() => {
                  setHoveredNode(node.id);
                  setTooltipData({
                    x: (node.x || 0) + nodeWidth / 2,
                    y: (node.y || 0) + (node.height || 20) / 2,
                    content: `${node.name}: ${formatValue(node.value || 0)}`,
                  });
                }}
                onMouseLeave={() => {
                  setHoveredNode(null);
                  setTooltipData(null);
                }}
                className="cursor-pointer"
              >
                <motion.rect
                  x={node.x}
                  y={node.y}
                  width={nodeWidth}
                  height={node.height}
                  fill={node.color}
                  rx={3}
                  opacity={hoveredNode === node.id ? 1 : hoveredNode ? 0.5 : 0.9}
                  className="transition-opacity duration-200"
                  whileHover={{ scale: 1.02 }}
                />
                <text
                  x={(node.x || 0) + nodeWidth + 8}
                  y={(node.y || 0) + (node.height || 20) / 2}
                  dy="0.35em"
                  className="fill-foreground text-xs"
                  textAnchor="start"
                >
                  {node.name}
                </text>
              </g>
            ))}
          </g>
        </svg>

        {/* Tooltip */}
        <AnimatePresence>
          {tooltipData && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute z-10 px-3 py-2 bg-popover border border-border rounded-lg shadow-lg text-sm pointer-events-none"
              style={{
                left: tooltipData.x + 15,
                top: tooltipData.y - 10,
              }}
            >
              {tooltipData.content}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-center gap-4 mt-4 text-xs text-muted-foreground">
        <span>Flow width proportional to value</span>
        <span>•</span>
        <span>Hover for details</span>
      </div>
    </div>
  );
}
