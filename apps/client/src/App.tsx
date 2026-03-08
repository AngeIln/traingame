import { useEffect } from 'react';
import { useGameStore } from './store';

const wsUrl = 'ws://localhost:4000/ws';

export default function App() {
  const { connect, players, status } = useGameStore();

  useEffect(() => {
    connect(wsUrl);
  }, [connect]);

  return (
    <main style={{ fontFamily: 'sans-serif', margin: '2rem' }}>
      <h1>TrainGame - Client</h1>
      <p>Statut: {status}</p>
      <h2>Players</h2>
      <ul>
        {players.map((player) => (
          <li key={player.id}>
            {player.name} - score: {player.score} - pos({player.position.x}, {player.position.y})
          </li>
        ))}
      </ul>
    </main>
  );
}
