import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CharacterList from './pages/CharacterList';
import CharacterDetail from './pages/CharacterDetail';
import Combat from './pages/Combat';
import './App.css';

function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
      <Routes>
        <Route path="/characters" element={<CharacterList />} />
        <Route path="/characters/:id" element={<CharacterDetail />} />
        <Route path="/combat" element={<Combat />} />
        <Route path="/" element={<CharacterList />} />
      </Routes>
    </Router>
  );
}

export default App
