export type Coord = {
  x: number;
  y: number;
  z?: number;
};

export type TerrainType = "plain" | "hill" | "mountain" | "water";

export type GridCell = {
  coord: Coord;
  terrain: TerrainType;
  elevation: number;
  cityId?: string;
  stationId?: string;
  blocked?: boolean;
};

export type City = {
  id: string;
  name: string;
  coord: Coord;
  population: number;
};

export type StationKind = "passenger" | "freight" | "depot";

export type Station = {
  id: string;
  name: string;
  kind: StationKind;
  coord: Coord;
  capacity: number;
};

export type RailSegment = {
  id: string;
  from: Coord;
  to: Coord;
  signaled?: boolean;
  lineId?: string;
};

export type SignalingConflict = {
  segmentId: string;
  reason: string;
};

export type RailValidation = {
  valid: boolean;
  estimatedCost: number;
  reasons: string[];
  signalingConflicts: SignalingConflict[];
};

export type BuildActionType = "rail" | "station" | "depot";

export type PlannedAction = {
  id: string;
  type: BuildActionType;
  payload: RailSegment | Station;
  estimatedCost: number;
};

export type LineTrafficMetric = {
  lineId: string;
  density: number;
  averageDelayMinutes: number;
  saturation: number;
};

export type TrafficView = {
  byLine: LineTrafficMetric[];
  maxDensity: number;
  maxDelay: number;
  maxSaturation: number;
};

export type MapState = {
  grid: GridCell[];
  cities: City[];
  stations: Station[];
  rails: RailSegment[];
  paused: boolean;
  budget: number;
  pendingActions: PlannedAction[];
};

export type RailBuildRules = {
  baseCost: number;
  maxSlopeDelta: number;
  intersectionPenalty: number;
  waterPenalty: number;
};
