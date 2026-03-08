import React from "react";
import { useMapEditor } from "./useMapEditor";
import { MapState, RailSegment, Station } from "./types";
import { TrainSnapshot } from "./traffic";

type MapPanelProps = {
  initialState: MapState;
  trains?: TrainSnapshot[];
};

const cellColor: Record<string, string> = {
  plain: "#9dd18e",
  hill: "#7db968",
  mountain: "#888888",
  water: "#5ca7d8",
};

export const MapPanel: React.FC<MapPanelProps> = ({ initialState, trains = [] }) => {
  const {
    state,
    tool,
    setTool,
    costPreview,
    lastValidation,
    trafficView,
    togglePause,
    flushPlanning,
  } = useMapEditor(initialState, trains);

  const maxX = Math.max(...state.grid.map((c) => c.coord.x), 0);
  const maxY = Math.max(...state.grid.map((c) => c.coord.y), 0);

  const gridTemplateColumns = `repeat(${maxX + 1}, 26px)`;

  return (
    <section style={{ display: "grid", gap: 16 }}>
      <header style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button onClick={() => setTool("rail")}>Pose rail</button>
        <button onClick={() => setTool("station")}>Créer gare</button>
        <button onClick={() => setTool("depot")}>Créer dépôt</button>
        <button onClick={togglePause}>{state.paused ? "Reprendre" : "Pause"}</button>
        <button onClick={flushPlanning} disabled={state.paused}>
          Appliquer planification
        </button>
        <span>Outil actif: {tool}</span>
        <span>Budget: {state.budget}</span>
        <strong>Prévisualisation coût: {costPreview}</strong>
      </header>

      <div
        aria-label="map-grid"
        style={{
          display: "grid",
          gridTemplateColumns,
          gridAutoRows: "26px",
          width: "max-content",
          border: "1px solid #ccc",
        }}
      >
        {Array.from({ length: (maxX + 1) * (maxY + 1) }).map((_, index) => {
          const x = index % (maxX + 1);
          const y = Math.floor(index / (maxX + 1));
          const cell = state.grid.find((c) => c.coord.x === x && c.coord.y === y);
          const city = state.cities.find((c) => c.coord.x === x && c.coord.y === y);
          const station = state.stations.find((s) => s.coord.x === x && s.coord.y === y);

          return (
            <div
              key={`${x}-${y}`}
              title={cell ? `${cell.terrain} @(${x},${y})` : `(${x},${y})`}
              style={{
                width: 26,
                height: 26,
                boxSizing: "border-box",
                border: "1px solid #e7e7e7",
                background: cell ? cellColor[cell.terrain] : "#fff",
                fontSize: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {city ? "🏙️" : station ? "🚉" : ""}
            </div>
          );
        })}
      </div>

      <TrafficSummary density={trafficView.maxDensity} delay={trafficView.maxDelay} saturation={trafficView.maxSaturation} />

      {lastValidation && lastValidation.signalingConflicts.length > 0 ? (
        <div role="alert" style={{ color: "#8a4d00" }}>
          Avertissements de signalisation:
          <ul>
            {lastValidation.signalingConflicts.map((conflict) => (
              <li key={conflict.segmentId}>
                {conflict.segmentId}: {conflict.reason}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
};

const TrafficSummary: React.FC<{ density: number; delay: number; saturation: number }> = ({
  density,
  delay,
  saturation,
}) => (
  <aside style={{ display: "grid", gap: 4, maxWidth: 320 }}>
    <h3>Vue trafic</h3>
    <span>Densité max ligne: {density.toFixed(2)}</span>
    <span>Retard moyen max (min): {delay.toFixed(1)}</span>
    <span>Saturation max: {(saturation * 100).toFixed(0)}%</span>
  </aside>
);

export const createRailFromCells = (
  from: { x: number; y: number },
  to: { x: number; y: number },
  lineId = "line-1",
): RailSegment => ({
  id: `rail-${from.x}-${from.y}-${to.x}-${to.y}`,
  from,
  to,
  lineId,
  signaled: true,
});

export const createStationAtCell = (
  coord: { x: number; y: number },
  kind: Station["kind"] = "passenger",
): Station => ({
  id: `station-${coord.x}-${coord.y}-${kind}`,
  name: kind === "depot" ? "Dépôt" : "Gare",
  kind,
  coord,
  capacity: kind === "depot" ? 10 : 20,
});
