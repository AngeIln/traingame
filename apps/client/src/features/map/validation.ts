import {
  Coord,
  GridCell,
  RailBuildRules,
  RailSegment,
  RailValidation,
  SignalingConflict,
  Station,
} from "./types";

const areCoordsEqual = (a: Coord, b: Coord): boolean => a.x === b.x && a.y === b.y;

const getCellAt = (grid: GridCell[], coord: Coord): GridCell | undefined =>
  grid.find((cell) => areCoordsEqual(cell.coord, coord));

const orientation = (p: Coord, q: Coord, r: Coord): number => {
  const value = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
  if (value === 0) {
    return 0;
  }
  return value > 0 ? 1 : 2;
};

const onSegment = (p: Coord, q: Coord, r: Coord): boolean =>
  q.x <= Math.max(p.x, r.x) &&
  q.x >= Math.min(p.x, r.x) &&
  q.y <= Math.max(p.y, r.y) &&
  q.y >= Math.min(p.y, r.y);

const segmentsIntersect = (a: RailSegment, b: RailSegment): boolean => {
  const o1 = orientation(a.from, a.to, b.from);
  const o2 = orientation(a.from, a.to, b.to);
  const o3 = orientation(b.from, b.to, a.from);
  const o4 = orientation(b.from, b.to, a.to);

  if (o1 !== o2 && o3 !== o4) {
    return true;
  }

  if (o1 === 0 && onSegment(a.from, b.from, a.to)) return true;
  if (o2 === 0 && onSegment(a.from, b.to, a.to)) return true;
  if (o3 === 0 && onSegment(b.from, a.from, b.to)) return true;
  if (o4 === 0 && onSegment(b.from, a.to, b.to)) return true;

  return false;
};

const estimateDistance = (from: Coord, to: Coord): number =>
  Math.hypot(to.x - from.x, to.y - from.y);

const detectSignalConflicts = (candidate: RailSegment, rails: RailSegment[]): SignalingConflict[] => {
  const conflicts: SignalingConflict[] = [];

  rails.forEach((segment) => {
    if (!segment.signaled || !candidate.signaled) {
      return;
    }

    if (segmentsIntersect(candidate, segment) && segment.lineId === candidate.lineId) {
      conflicts.push({
        segmentId: segment.id,
        reason: "Deux segments signalisés de la même ligne se croisent sans nœud explicite.",
      });
    }
  });

  return conflicts;
};

export const validateRailPlacement = (
  candidate: RailSegment,
  rails: RailSegment[],
  grid: GridCell[],
  rules: RailBuildRules,
  budget: number,
): RailValidation => {
  const reasons: string[] = [];

  const fromCell = getCellAt(grid, candidate.from);
  const toCell = getCellAt(grid, candidate.to);

  if (!fromCell || !toCell) {
    reasons.push("Le rail doit être placé à l'intérieur de la grille.");
  }

  if (fromCell?.blocked || toCell?.blocked) {
    reasons.push("Collision détectée: une cellule est déjà occupée/indisponible.");
  }

  const slopeDelta = Math.abs((fromCell?.elevation ?? 0) - (toCell?.elevation ?? 0));
  if (slopeDelta > rules.maxSlopeDelta) {
    reasons.push(`Pente trop importante (${slopeDelta}) > ${rules.maxSlopeDelta}.`);
  }

  const duplicate = rails.some(
    (segment) =>
      (areCoordsEqual(segment.from, candidate.from) && areCoordsEqual(segment.to, candidate.to)) ||
      (areCoordsEqual(segment.from, candidate.to) && areCoordsEqual(segment.to, candidate.from)),
  );
  if (duplicate) {
    reasons.push("Collision: segment déjà existant.");
  }

  const intersections = rails.filter((segment) => segmentsIntersect(candidate, segment));

  const terrainPenalty = [fromCell, toCell].some((cell) => cell?.terrain === "water")
    ? rules.waterPenalty
    : 0;

  const estimatedCost =
    Math.round(estimateDistance(candidate.from, candidate.to) * rules.baseCost) +
    intersections.length * rules.intersectionPenalty +
    terrainPenalty;

  if (estimatedCost > budget) {
    reasons.push(`Coût insuffisant: ${estimatedCost} > budget (${budget}).`);
  }

  const signalingConflicts = detectSignalConflicts(candidate, rails);

  return {
    valid: reasons.length === 0,
    estimatedCost,
    reasons,
    signalingConflicts,
  };
};

export const validateStationPlacement = (
  station: Station,
  grid: GridCell[],
  stations: Station[],
  budget: number,
  baseCost = 300,
): { valid: boolean; estimatedCost: number; reasons: string[] } => {
  const reasons: string[] = [];

  const cell = getCellAt(grid, station.coord);
  if (!cell) {
    reasons.push("La station doit être placée dans la grille.");
  }

  if (cell?.blocked || cell?.terrain === "water") {
    reasons.push("Terrain invalide pour une station (bloqué ou eau).");
  }

  if (stations.some((existing) => areCoordsEqual(existing.coord, station.coord))) {
    reasons.push("Une station existe déjà sur cette cellule.");
  }

  const estimatedCost = station.kind === "depot" ? baseCost * 1.2 : baseCost;

  if (estimatedCost > budget) {
    reasons.push(`Coût insuffisant: ${estimatedCost} > budget (${budget}).`);
  }

  return {
    valid: reasons.length === 0,
    estimatedCost,
    reasons,
  };
};
