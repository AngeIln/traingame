const fs = require('fs');
const path = require('path');

class StateRepository {
  constructor({
    dbFilePath = path.join(process.cwd(), 'apps/server/data/sim-state.json'),
    snapshotsDir = path.join(process.cwd(), 'apps/server/data/snapshots'),
  } = {}) {
    this.dbFilePath = dbFilePath;
    this.snapshotsDir = snapshotsDir;
    fs.mkdirSync(path.dirname(this.dbFilePath), { recursive: true });
    fs.mkdirSync(this.snapshotsDir, { recursive: true });
  }

  load(defaultState) {
    if (!fs.existsSync(this.dbFilePath)) {
      this.save(defaultState);
      return defaultState;
    }

    const content = fs.readFileSync(this.dbFilePath, 'utf8');
    return JSON.parse(content);
  }

  save(state) {
    fs.writeFileSync(this.dbFilePath, JSON.stringify(state, null, 2));
  }

  createSnapshot(state, tick) {
    const snapshotFile = path.join(this.snapshotsDir, `snapshot-tick-${tick}.json`);
    fs.writeFileSync(snapshotFile, JSON.stringify(state, null, 2));
    return snapshotFile;
  }
}

module.exports = {
  StateRepository,
};
