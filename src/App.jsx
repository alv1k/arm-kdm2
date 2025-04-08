import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import LoginPage from './pages/LoginPage/LoginPage'
import SettingsPage from './pages/SettingsPage/SettingsPage'

function App() {
  // const [count, setCount] = useState(0)

  return (
    <Router>
      <Routes>
        <Route path='/' element={<LoginPage/>} />
        <Route path='/settings' element={<SettingsPage/>} />
      </Routes>
    </Router>
  )
}

export default App
