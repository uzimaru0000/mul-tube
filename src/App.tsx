import { Routes, Route } from 'react-router-dom';
import Console from './pages/Console/index';
import Video from './pages/Video';
import Select from './pages/Select';
import { useElectron } from './lib';

export default function App() {
  const { isElectron } = useElectron();

  return (
    <Routes>
      <Route path="/" element={isElectron ? <Console /> : <Select />} />
      {isElectron && <Route path="__video/:id" element={<Video />} />}
    </Routes>
  );
}
