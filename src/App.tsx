import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home.tsx'; // Ensure correct path if Home.tsx is not directly in pages/

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
    </Routes>
  );
}

export default App;