import { RailSegment, TrafficView } from "./types";

export type TrainSnapshot = {
  lineId: string;
  delayMinutes: number;
  segmentId: string;
  loadFactor: number;
};

export const computeTrafficView = (
  rails: RailSegment[],
  trains: TrainSnapshot[],
): TrafficView => {
  const lines = new Map<string, { trainCount: number; delayTotal: number; loadTotal: number }>();

  trains.forEach((train) => {
    const current = lines.get(train.lineId) ?? {
      trainCount: 0,
      delayTotal: 0,
      loadTotal: 0,
    };

    current.trainCount += 1;
    current.delayTotal += train.delayMinutes;
    current.loadTotal += train.loadFactor;

    lines.set(train.lineId, current);
  });

  const byLine = [...lines.entries()].map(([lineId, data]) => {
    const segmentsOnLine = rails.filter((segment) => segment.lineId === lineId).length || 1;

    return {
      lineId,
      density: data.trainCount / segmentsOnLine,
      averageDelayMinutes: data.delayTotal / data.trainCount,
      saturation: Math.min(1, data.loadTotal / data.trainCount),
    };
  });

  return {
    byLine,
    maxDensity: Math.max(0, ...byLine.map((metric) => metric.density)),
    maxDelay: Math.max(0, ...byLine.map((metric) => metric.averageDelayMinutes)),
    maxSaturation: Math.max(0, ...byLine.map((metric) => metric.saturation)),
  };
};
