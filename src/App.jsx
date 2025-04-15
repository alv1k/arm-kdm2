import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AgreementsPage from './pages/AgreementsPage/AgreementsPage'
import SettingsPage from './pages/SettingsPage/SettingsPage'

function App() {
  // const [count, setCount] = useState(0)

  return (
      <Router>
        <Routes>
          <Route path='/arm-kdm2/' element={<AgreementsPage/>} />
          <Route path='/arm-kdm2/agreements' element={<AgreementsPage/>} />
          <Route path='/arm-kdm2/settings' element={<SettingsPage/>} />
          <Route path='/arm-kdm2/user' element={<AgreementsPage/>} />
          <Route path='/arm-kdm2/logout' element={<SettingsPage/>} />
        </Routes>
      </Router>
  )
}

export default App
