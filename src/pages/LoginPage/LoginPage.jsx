import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { hideNavbar } from '@/store/navbarSlice';
import { toggleTabs  } from '@/store/tabsSlice';
import { isNew } from '@/store/requestsSlice';
import useMediaQueries from '@/hooks/useMediaQueries';

import Header from '@/components/TheHeader/TheHeader';
import TheNavbar from '@/components/TheNavbar/TheNavbar';
import TheTabsComponent from '@/components/TheTabsComponent/TheTabsComponent';
import TheDocsListComponent from '@/components/TheDocsListComponent/TheDocsListComponent'

const LoginPage = () => {
  const sprite_path = '/src/assets/images/i.svg';
  const showNavbar = useSelector((state) => state.navbar.showNavbar);
  const isNewRequest = useSelector(isNew);
  // const tabs = useSelector((state) => state.tabs_slice.tabs);
  // useEffect(() => {
  //   dispatch(fetchAgreementsList()); // Загружаем список договоров при монтировании компонента
  // }, [dispatch]);  
  
  const { xl_breakpoint, lg_breakpoint, md_breakpoint, sm_breakpoint } = useMediaQueries();
  const dispatch = useDispatch();
  const sideClick = (event) => {
    event.stopPropagation();
    if (showNavbar) {
      dispatch(hideNavbar());
    }
  };
  useEffect(() => {
    // Устанавливаем tabs как agreementsList при монтировании компонента
    dispatch(toggleTabs(isNewRequest ? 'singleAgrement' : 'agreementsList'));
    
  }, [dispatch]);

  const navigate = useNavigate();
  const handleClick = () => {
    navigate('/agreements'); // Изменяем маршрут на '/agreements'
  }

  return (
    <main className="min-h-fit h-screen w-full">
      <div className="lg:flex min-h-fit h-screen relative">
        <div className="lg:w-1/2 w-full h-screen bg-[#F6F8FF] flex  flex-col justify-end">
          <img className="align-bottom justify-baseline justify-self-end lg:blur-none lg:mt-0 blur-xs h-fit mx-auto" src="/src/assets/images/bg-login.png" alt="" />
        </div>


        <div className="lg:w-1/2 lg:static w-full absolute top-20 flex align-middle items-center justify-center">
          <div className="bg-white p-8 lg:my-auto my-auto mx-auto lg:w-2/3 lg:rounded-none w-[90vw] rounded-2xl text-center">
            <img className="mx-auto" src="/src/assets/images/logo.png" alt="logo" />
            <p className="mt-4 text-[#4B5E9D] lg:text-2xl md:text-2xl text-sm uppercase font-bold lg:ms-5 md:ms-5 ms-2 my-auto" style={{fontFamily: 'PT Sans'}}>комдрагметалл рс(я)</p>
            <p className="font-bold xl:text-2xl text-base mt-12">Вход в личный кабинет</p>
            <div className="text-left">
              <p className="mb-2 mt-8 md:text-base text-sm">Логин</p>
              <input className=" p-3 bg-item-active w-full rounded-xl" type="text" placeholder="Введите логин" />
              <p className="mb-2 mt-2 md:text-base text-sm">Пароль</p>
              <input className=" p-3 bg-item-active w-full rounded-xl" type="text" placeholder="Введите пароль" />
            </div>
            <div className="flex justify-between py-5">
              <div className="">
                <input className="input-checkbox p-8 bg-red-900" type="checkbox" id="forgot_pass" />
                <label className="" htmlFor="forgot_pass">Запомнить меня</label>
              </div>
              <div>
                <p className="text-[#203887]">Забыли пароль?</p>
              </div>
            </div>
            <button className="mt-8 btn-primary w-full py-2" onClick={handleClick}>
              Войти
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
export default LoginPage;