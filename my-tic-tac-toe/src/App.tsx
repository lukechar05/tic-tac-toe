import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Setup from './Setup.tsx';
import Game from './Game.tsx';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path ="/" element={<Setup />} />
        <Route path ="/game" element={<Game />} />
      </Routes>

    </BrowserRouter>
  );
}

export default App;
