# Simulation module

## Features

- Tick scheduler (`1 tick = 1s` by default).
- Domain entities: `City`, `Station`, `TrackSegment`, `Train`, `Line`, `CargoContract`.
- Passenger/cargo demand generated from city population and demand multipliers.
- Economy accounting:
  - Revenues: ticket sales + cargo transport.
  - Expenses: salaries, fuel/electricity, maintenance, debt repayment.
- Incidents with configurable probabilities: train breakdown, congestion, weather.
- Persistent state in DB file (`apps/server/data/sim-state.json`) + periodic snapshots in `apps/server/data/snapshots/`.

## API endpoints

- `GET /api/sim/state`
- `POST /api/sim/lines` (create line)
- `POST /api/sim/trains/purchase` (buy train)
- `PATCH /api/sim/lines/:lineId/tariffs` (modify fares/tariffs)
- `POST /api/sim/pause`
- `POST /api/sim/resume`
- `POST /api/sim/incidents/probabilities`
