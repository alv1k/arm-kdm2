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
          <Route path='/' element={<AgreementsPage/>} />
          <Route path='/agreements' element={<AgreementsPage/>} />
          <Route path='/requests' element={<RequestsPage/>} />
          <Route path='/contacts' element={<ContactsPage/>} />
          <Route path='/settings' element={<SettingsPage/>} />
          <Route path='/user' element={<UserPage/>} />
          <Route path='/logout' element={<LoginPage/>} />
        </Routes>
      </Router>
  )
}

export default App
