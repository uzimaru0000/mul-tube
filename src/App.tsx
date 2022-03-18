import { Routes, Route } from 'react-router-dom';
import Console from './pages/Console/index';
import Video from './pages/Video';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Console />} />
      <Route path="__video/:id" element={<Video />} />
    </Routes>
  );
}
