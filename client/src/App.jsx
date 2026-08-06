import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/Register';
import Game from './pages/Game';
import Leaderboard from './pages/Leaderboard';
import QRPage from './pages/QRPage';
import ParticleBackground from './components/ParticleBackground';

export default function App() {
  return (
    <BrowserRouter>
      <ParticleBackground />
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/game" element={<Game />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/qr" element={<QRPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
