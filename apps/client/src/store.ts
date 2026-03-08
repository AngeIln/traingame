import type { PlayerState, ServerEvent } from '@traingame/shared';
import { create } from 'zustand';

type GameStore = {
  status: 'idle' | 'connecting' | 'connected';
  players: PlayerState[];
  connect: (url: string) => void;
};

export const useGameStore = create<GameStore>((set) => ({
  status: 'idle',
  players: [],
  connect: (url) => {
    set({ status: 'connecting' });
    const socket = new WebSocket(url);

    socket.addEventListener('open', () => {
      set({ status: 'connected' });
    });

    socket.addEventListener('message', (event) => {
      const payload = JSON.parse(event.data) as ServerEvent;

      if (payload.type === 'tick') {
        set({ players: payload.players });
      }

      if (payload.type === 'player_joined') {
        set((state) => ({ players: [...state.players, payload.player] }));
      }
    });

    socket.addEventListener('close', () => {
      set({ status: 'idle' });
    });
  },
}));
