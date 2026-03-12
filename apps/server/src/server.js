const http = require('http');
const { SimulationEngine } = require('./sim/engine');
const { createSimApi } = require('./api/simApi');
const { seedWorldIfEmpty } = require('./sim/bootstrap');

const engine = new SimulationEngine();
seedWorldIfEmpty(engine);

const handler = createSimApi(engine);
const port = Number(process.env.PORT || 3000);

const server = http.createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: true }));
    return;
  }

  handler(req, res);
});

server.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Simulation API listening on :${port}`);
});
