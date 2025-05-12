import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import AgreementsPage from './pages/AgreementsPage/AgreementsPage'
import RequestsPage from './pages/RequestsPage/RequestsPage'
import ContactsPage from './pages/ContactsPage/ContactsPage'
import UserPage from './pages/UserPage/UserPage';
import LoginPage from './pages/LoginPage/LoginPage';
import Page404 from './pages/Page404/Page404';
import Header from '@/components/TheHeader/TheHeader';
import Navbar from '@/components/TheNavbar/TheNavbar';
import LoadingPage from '@/pages/LoadingPage/LoadingPage';
import TheModal from '@/components/TheModal/TheModal';
import useMediaQueries from '@/hooks/useMediaQueries';
import { showModal } from '@/store/slices/modalSlice';

const HTTPSRedirect = () => {
  const location = useLocation();
  
  useEffect(() => {
    if (window.location.protocol !== 'https:' && process.env.NODE_ENV === 'production') {
      window.location.href = `https://${window.location.host}${location.pathname}`;
    }
  }, [location]);

  return null;
};

const App = () => {
  const location = useLocation();  
  const { xl_breakpoint, lg_breakpoint, md_breakpoint, sm_breakpoint } = useMediaQueries();
  const isShowModal = useSelector(showModal);

  document.querySelectorAll('*').forEach(el => {
    if (el.scrollWidth > el.clientWidth) {
      console.log('Элемент с переполнением:', el);
    }
  });

  return (
    <div className="min-h-screen flex flex-col w-full">
      <HTTPSRedirect />
      {
        isShowModal && !sm_breakpoint ? 
        <TheModal /> : ''
      }
      {
        location.pathname != '/login' ?
        <Header /> : ''
      }
      <LoadingPage />
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
          <Route path='/' element={<Navigate to='/agreements' replace />} />
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
