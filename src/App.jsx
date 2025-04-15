import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AgreementsPage from './pages/AgreementsPage/AgreementsPage'
import SettingsPage from './pages/SettingsPage/SettingsPage'

function App() {
  // const [count, setCount] = useState(0)

  return (
      <Router>
        <Routes>
          <Route path='/' element={<AgreementsPage/>} />
          <Route path='/agreements' element={<AgreementsPage/>} />
          <Route path='/settings' element={<SettingsPage/>} />
          <Route path='/user' element={<AgreementsPage/>} />
          <Route path='/logout' element={<SettingsPage/>} />
        </Routes>
      </Router>
  )
}

export default App
