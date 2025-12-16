import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import QRGeneratorPage from './pages/QRGeneratorPage'
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/qr-generator" element={<QRGeneratorPage />} />
      </Routes>
    </Router>
  )
}

export default App

