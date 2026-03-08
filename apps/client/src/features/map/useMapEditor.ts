import { useMemo, useState } from "react";
import { findRailPath } from "./pathfinding";
import { applyPendingActions, enqueueRailAction, enqueueStationAction, setPauseMode } from "./planning";
import { computeTrafficView, TrainSnapshot } from "./traffic";
import {
  MapState,
  RailBuildRules,
  RailSegment,
  RailValidation,
  Station,
  TrafficView,
} from "./types";
import { validateRailPlacement, validateStationPlacement } from "./validation";

export type EditorTool = "none" | "rail" | "station" | "depot";

const DEFAULT_RULES: RailBuildRules = {
  baseCost: 80,
  maxSlopeDelta: 3,
  intersectionPenalty: 25,
  waterPenalty: 40,
};

export const useMapEditor = (initialState: MapState, trains: TrainSnapshot[] = []) => {
  const [state, setState] = useState<MapState>(initialState);
  const [tool, setTool] = useState<EditorTool>("none");
  const [costPreview, setCostPreview] = useState<number>(0);
  const [lastValidation, setLastValidation] = useState<RailValidation | null>(null);

  const trafficView: TrafficView = useMemo(
    () => computeTrafficView(state.rails, trains),
    [state.rails, trains],
  );

  const previewRail = (candidate: RailSegment, rules: RailBuildRules = DEFAULT_RULES) => {
    const validation = validateRailPlacement(
      candidate,
      state.rails,
      state.grid,
      rules,
      state.budget,
    );

    setCostPreview(validation.estimatedCost);
    setLastValidation(validation);
    return validation;
  };

  const queueRail = (candidate: RailSegment, rules: RailBuildRules = DEFAULT_RULES) => {
    const validation = previewRail(candidate, rules);
    if (!validation.valid) {
      return validation;
    }

    setState((current) => enqueueRailAction(current, candidate, validation.estimatedCost));
    return validation;
  };

  const queueStation = (candidate: Station) => {
    const validation = validateStationPlacement(
      candidate,
      state.grid,
      state.stations,
      state.budget,
    );

    setCostPreview(validation.estimatedCost);

    if (!validation.valid) {
      return validation;
    }

    setState((current) => enqueueStationAction(current, candidate, validation.estimatedCost));
    return validation;
  };

  const flushPlanning = () => {
    setState((current) => applyPendingActions(current));
  };

  const togglePause = () => {
    setState((current) => setPauseMode(current, !current.paused));
  };

  const findPath = (start: { x: number; y: number }, goal: { x: number; y: number }) =>
    findRailPath(start, goal, state.rails);

  return {
    state,
    tool,
    setTool,
    costPreview,
    lastValidation,
    trafficView,
    previewRail,
    queueRail,
    queueStation,
    flushPlanning,
    togglePause,
    findPath,
  };
};
