import { BrowserRouter, Route, Routes } from 'react-router-dom'
import  Home  from './pages/Home';

function App() {

 return (
  <BrowserRouter>
      <Routes>
        {/* Route accessible par tout le monde */}
        <Route path="/" element={<Home />} />
        
        {/* Prochaines étapes : Login et Register */}
        {/* <Route path="/login" element={<div className="container mt-5">Page Login (Bientôt)</div>} />
        <Route path="/register" element={<div className="container mt-5">Page Register (Bientôt)</div>} /> */}
      </Routes>
  </BrowserRouter>

  );
}

export default App
