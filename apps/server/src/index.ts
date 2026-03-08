import cors from '@fastify/cors';
import websocket from '@fastify/websocket';
import { type ServerEvent } from '@traingame/shared';
import dotenv from 'dotenv';
import Fastify from 'fastify';
import { z } from 'zod';
import { SimulationEngine } from './simulation';

dotenv.config();

const EnvSchema = z.object({
  PORT: z.coerce.number().default(4000),
  CLIENT_ORIGIN: z.string().default('http://localhost:5173'),
  SIM_TICK_MS: z.coerce.number().default(1000),
});

const env = EnvSchema.parse(process.env);

const app = Fastify({ logger: true });
const simulation = new SimulationEngine();

await app.register(cors, {
  origin: env.CLIENT_ORIGIN,
});

await app.register(websocket);

app.get('/health', async () => ({ ok: true }));

app.get('/ws', { websocket: true }, (socket) => {
  const playerId = crypto.randomUUID();
  const player = simulation.addPlayer(playerId, `Player-${playerId.slice(0, 4)}`);

  const joinedEvent: ServerEvent = { type: 'player_joined', player };
  socket.send(JSON.stringify(joinedEvent));

  const interval = setInterval(() => {
    const event: ServerEvent = {
      type: 'tick',
      timestamp: Date.now(),
      players: simulation.tick(),
    };

    socket.send(JSON.stringify(event));
  }, env.SIM_TICK_MS);

  socket.on('close', () => {
    clearInterval(interval);
    simulation.removePlayer(playerId);
  });
});

await app.listen({ port: env.PORT, host: '0.0.0.0' });
