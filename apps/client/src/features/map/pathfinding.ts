import { Coord, RailSegment } from "./types";

type GraphNodeKey = string;

type GraphEdge = {
  to: GraphNodeKey;
  weight: number;
  segmentId: string;
};

export type PathResult = {
  nodes: Coord[];
  segmentIds: string[];
  distance: number;
};

const toKey = (coord: Coord): GraphNodeKey => `${coord.x}:${coord.y}`;

const fromKey = (key: GraphNodeKey): Coord => {
  const [x, y] = key.split(":").map(Number);
  return { x, y };
};

const edgeWeight = (a: Coord, b: Coord): number => Math.hypot(b.x - a.x, b.y - a.y);

const buildGraph = (rails: RailSegment[]): Map<GraphNodeKey, GraphEdge[]> => {
  const graph = new Map<GraphNodeKey, GraphEdge[]>();

  const addEdge = (from: GraphNodeKey, edge: GraphEdge) => {
    const current = graph.get(from) ?? [];
    current.push(edge);
    graph.set(from, current);
  };

  rails.forEach((segment) => {
    const fromKey = toKey(segment.from);
    const toNodeKey = toKey(segment.to);
    const weight = edgeWeight(segment.from, segment.to);

    addEdge(fromKey, { to: toNodeKey, weight, segmentId: segment.id });
    addEdge(toNodeKey, { to: fromKey, weight, segmentId: segment.id });
  });

  return graph;
};

const heuristic = (a: Coord, b: Coord): number => Math.hypot(b.x - a.x, b.y - a.y);

export const findRailPath = (start: Coord, goal: Coord, rails: RailSegment[]): PathResult | null => {
  const graph = buildGraph(rails);
  const startKey = toKey(start);
  const goalKey = toKey(goal);

  if (!graph.has(startKey) || !graph.has(goalKey)) {
    return null;
  }

  const openSet = new Set<GraphNodeKey>([startKey]);
  const cameFrom = new Map<GraphNodeKey, { node: GraphNodeKey; segmentId: string }>();

  const gScore = new Map<GraphNodeKey, number>();
  const fScore = new Map<GraphNodeKey, number>();

  gScore.set(startKey, 0);
  fScore.set(startKey, heuristic(start, goal));

  while (openSet.size > 0) {
    const current = [...openSet].reduce((best, node) => {
      const bestScore = fScore.get(best) ?? Number.POSITIVE_INFINITY;
      const nodeScore = fScore.get(node) ?? Number.POSITIVE_INFINITY;
      return nodeScore < bestScore ? node : best;
    });

    if (current === goalKey) {
      const nodes: Coord[] = [];
      const segmentIds: string[] = [];

      let walker: GraphNodeKey | undefined = current;
      while (walker) {
        nodes.unshift(fromKey(walker));
        const prev = cameFrom.get(walker);
        if (!prev) {
          break;
        }
        segmentIds.unshift(prev.segmentId);
        walker = prev.node;
      }

      return {
        nodes,
        segmentIds,
        distance: gScore.get(goalKey) ?? 0,
      };
    }

    openSet.delete(current);

    const currentCoord = fromKey(current);
    const neighbors = graph.get(current) ?? [];

    neighbors.forEach((edge) => {
      const neighborCoord = fromKey(edge.to);
      const tentativeGScore =
        (gScore.get(current) ?? Number.POSITIVE_INFINITY) + edge.weight;

      if (tentativeGScore < (gScore.get(edge.to) ?? Number.POSITIVE_INFINITY)) {
        cameFrom.set(edge.to, { node: current, segmentId: edge.segmentId });
        gScore.set(edge.to, tentativeGScore);
        fScore.set(edge.to, tentativeGScore + heuristic(neighborCoord, goal));
        openSet.add(edge.to);
      }
    });

    if (neighbors.length === 0 && current === startKey) {
      break;
    }

    if (!fScore.has(current) && currentCoord.x === goal.x && currentCoord.y === goal.y) {
      break;
    }
  }

  return null;
};
