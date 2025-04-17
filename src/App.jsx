import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AgreementsPage from './pages/AgreementsPage/AgreementsPage'
import RequestsPage from './pages/RequestsPage/RequestsPage'
import SettingsPage from './pages/SettingsPage/SettingsPage'
import ContactsPage from './pages/ContactsPage/ContactsPage'
import UserPage from './pages/UserPage/UserPage';
import LoginPage from './pages/LoginPage/LoginPage';

function App() {
  // const [count, setCount] = useState(0)

  return (
      <Router>
        <Routes>
          <Route path='/arm-kdm2/' element={<AgreementsPage/>} />
          <Route path='/arm-kdm2/agreements' element={<AgreementsPage/>} />
          <Route path='/arm-kdm2/requests' element={<RequestsPage/>} />
          <Route path='/arm-kdm2/contacts' element={<ContactsPage/>} />
          <Route path='/arm-kdm2/settings' element={<SettingsPage/>} />
          <Route path='/arm-kdm2/user' element={<UserPage/>} />
          <Route path='/arm-kdm2/logout' element={<LoginPage/>} />
        </Routes>
      </Router>
  )
}

export default App
