import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import AgreementsPage from './pages/AgreementsPage/AgreementsPage'
import RequestsPage from './pages/RequestsPage/RequestsPage'
import ContactsPage from './pages/ContactsPage/ContactsPage'
import UserPage from './pages/UserPage/UserPage';
import LoginPage from './pages/LoginPage/LoginPage';
import Header from '@/components/TheHeader/TheHeader';
import Navbar from '@/components/TheNavbar/TheNavbar';
import useMediaQueries from '@/hooks/useMediaQueries';



const App = () => {
  const location = useLocation();  
  const { xl_breakpoint, lg_breakpoint, md_breakpoint, sm_breakpoint } = useMediaQueries();
  
  return (
    <div className="min-h-screen flex flex-col w-full">
      {
        location.pathname != '/login' ?
        <Header /> : ''
      }
      <div className={`
        w-full md:py-5 flex h-fit min-h-[90vh]
        ${location.pathname == '/login' ? 'xl:p-0 lg:p-0' : 'xl:p-10 lg:p-5'}        
      `}>
        {
          md_breakpoint && location.pathname != '/login' ? 
            <div className="w-[100px]"></div> : ''
        }
        {
          location.pathname != '/login' ?
          <Navbar /> : ''
        }
        <Routes>
          <Route path='/' element={<AgreementsPage/>} />
          <Route path='/agreements' element={<AgreementsPage/>} />
          <Route path='/requests' element={<RequestsPage/>} />
          <Route path='/contacts' element={<ContactsPage/>} />
          <Route path='/user' element={<UserPage/>} />
          <Route path='/login' element={<LoginPage/>} />
        </Routes>
      </div>
    </div>
  )
};
const Root = () => {
  return (
    <Router>
      <App />
    </Router>
  );
};

export default Root
