import { MapState, PlannedAction, RailSegment, Station } from "./types";

const createId = () => `${Date.now()}-${Math.round(Math.random() * 100000)}`;

export const enqueueRailAction = (
  state: MapState,
  segment: RailSegment,
  estimatedCost: number,
): MapState => ({
  ...state,
  pendingActions: [
    ...state.pendingActions,
    { id: createId(), type: "rail", payload: segment, estimatedCost },
  ],
});

export const enqueueStationAction = (
  state: MapState,
  station: Station,
  estimatedCost: number,
): MapState => ({
  ...state,
  pendingActions: [
    ...state.pendingActions,
    {
      id: createId(),
      type: station.kind === "depot" ? "depot" : "station",
      payload: station,
      estimatedCost,
    },
  ],
});

const applyAction = (state: MapState, action: PlannedAction): MapState => {
  if (action.type === "rail") {
    return {
      ...state,
      rails: [...state.rails, action.payload as RailSegment],
      budget: state.budget - action.estimatedCost,
    };
  }

  return {
    ...state,
    stations: [...state.stations, action.payload as Station],
    budget: state.budget - action.estimatedCost,
  };
};

export const applyPendingActions = (state: MapState): MapState => {
  if (state.paused) {
    return state;
  }

  return state.pendingActions.reduce(
    (nextState, action) => applyAction(nextState, action),
    { ...state, pendingActions: [] },
  );
};

export const setPauseMode = (state: MapState, paused: boolean): MapState => ({
  ...state,
  paused,
});
