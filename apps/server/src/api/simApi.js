const { URL } = require('url');

function sendJson(res, statusCode, body) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(body));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', (chunk) => {
      raw += chunk;
    });
    req.on('end', () => {
      if (!raw) return resolve({});
      try {
        resolve(JSON.parse(raw));
      } catch (error) {
        reject(error);
      }
    });
    req.on('error', reject);
  });
}

function createSimApi(engine) {
  return async function handle(req, res) {
    const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);

    try {
      if (req.method === 'GET' && url.pathname === '/api/sim/state') {
        return sendJson(res, 200, engine.getState());
      }

      if (req.method === 'POST' && url.pathname === '/api/sim/lines') {
        const body = await readBody(req);
        const line = engine.createLine(body);
        return sendJson(res, 201, line);
      }

      if (req.method === 'POST' && url.pathname === '/api/sim/trains/purchase') {
        const body = await readBody(req);
        const train = engine.buyTrain(body);
        return sendJson(res, 201, train);
      }

      if (req.method === 'PATCH' && /^\/api\/sim\/lines\/[^/]+\/tariffs$/.test(url.pathname)) {
        const body = await readBody(req);
        const lineId = url.pathname.split('/')[4];
        const updated = engine.updateLinePricing(lineId, body);
        return sendJson(res, 200, updated);
      }

      if (req.method === 'POST' && url.pathname === '/api/sim/pause') {
        engine.pause();
        return sendJson(res, 200, { running: false });
      }

      if (req.method === 'POST' && url.pathname === '/api/sim/resume') {
        engine.resume();
        return sendJson(res, 200, { running: true });
      }

      if (req.method === 'POST' && url.pathname === '/api/sim/incidents/probabilities') {
        const body = await readBody(req);
        engine.setIncidentProbabilities(body);
        return sendJson(res, 200, engine.getState().meta.incidentProbabilities);
      }

      return sendJson(res, 404, { error: 'Not found' });
    } catch (error) {
      return sendJson(res, 400, { error: error.message });
    }
  };
}

module.exports = {
  createSimApi,
};
