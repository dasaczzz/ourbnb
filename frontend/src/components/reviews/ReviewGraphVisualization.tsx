import React, { useRef, useEffect, useState } from 'react';
import ForceGraph2D, { NodeObject, LinkObject } from 'react-force-graph-2d';

interface GraphNode {
  id: string;
  type: string;
  data: any;
}

interface GraphEdge {
  from: string;
  to: string;
  relation: string;
}

interface ReviewGraph {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

interface ReviewGraphVisualizationProps {
  graph: ReviewGraph | null;
}

const ReviewGraphVisualization: React.FC<ReviewGraphVisualizationProps> = ({ graph }) => {
  const fgRef = useRef<any>(null);
  const [imageLoadTrigger, setImageLoadTrigger] = useState(0);

  // Cache for loaded images keyed by profilepic URL
  const imageCache = useRef<Map<string, HTMLImageElement>>(new Map());

  // Transform graph data to format expected by react-force-graph
  const data = graph
    ? {
        nodes: graph.nodes.map((node: GraphNode) => ({
          id: node.id,
          type: node.type,
          name: node.type === 'review' ? `Review: ${node.id}` : node.type,
          val: node.type === 'review' ? 2 : 1,
          color: node.type === 'review' ? '#2c6d67' : '#888',
          profilepic:
            node.type === 'user'
              ? node.data.profilepic
              : node.type === 'review' && node.data.user
              ? node.data.user.profilepic
              : undefined,
        })),
        links: graph.edges.map((edge: GraphEdge) => ({
          source: edge.from,
          target: edge.to,
          label: edge.relation,
          color: edge.relation === 'same_qualification' ? '#2c6d67' : '#999',
          width: edge.relation === 'same_qualification' ? 2 : 1,
        })),
      }
    : null;

  // Load images for nodes with profilepic
  useEffect(() => {
    if (!data) return;

    data.nodes.forEach((node) => {
      if (node.profilepic && !imageCache.current.has(node.profilepic)) {
        const img = new Image();
        img.src = node.profilepic;
        img.onload = () => {
          imageCache.current.set(node.profilepic!, img);
          // Trigger re-render by updating state
          setImageLoadTrigger((prev) => prev + 1);
        };
      }
    });
  }, [data]);

  // Optional: zoom to fit on graph load
  useEffect(() => {
    // zoomToFit is not available on ForceGraph2D instance, so we skip this
  }, [graph]);

  if (!graph) {
    return <div>No graph data available.</div>;
  }

  // Custom node rendering to show profile pictures for nodes with profilepic
  const nodeCanvasObject = (node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
    const img = imageCache.current.get(node.profilepic);
    const size = 12 / globalScale;

    if (node.profilepic && img) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(node.x, node.y, size, 0, 2 * Math.PI, false);
      ctx.clip();
      ctx.drawImage(img, node.x - size, node.y - size, size * 2, size * 2);
      ctx.restore();
    } else {
      // Draw default circle for other nodes
      ctx.fillStyle = node.color || '#888';
      ctx.beginPath();
      ctx.arc(node.x, node.y, size, 0, 2 * Math.PI, false);
      ctx.fill();
    }
  };

  return (
    <div style={{ height: '400px', border: '1px solid #ccc', borderRadius: '8px', marginTop: '1rem' }}>
      <h3 className="text-2xl font-bold mb-4 p-2">Conexiones de Reseñas con la Misma Calificación (Visual)</h3>
      <ForceGraph2D
        ref={fgRef}
        graphData={data!}
        nodeLabel={(node: NodeObject) => `${(node as any).name}`}
        linkDirectionalArrowLength={4}
        linkDirectionalArrowRelPos={1}
        linkLabel={(link: LinkObject) => (link as any).label}
        nodeAutoColorBy="color"
        linkColor={(link: LinkObject) => (link as any).color}
        linkWidth={(link: LinkObject) => (link as any).width}
        // @ts-ignore
        nodeCanvasObject={nodeCanvasObject}
      key={imageLoadTrigger}
      />
    </div>
  );
};

export default ReviewGraphVisualization;
