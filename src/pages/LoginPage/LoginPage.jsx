import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { hideNavbar } from '@/store/navbarSlice';
import { toggleTabs  } from '@/store/tabsSlice';
import { isNew } from '@/store/requestsSlice';
import useMediaQueries from '@/hooks/useMediaQueries';

import CustomCheckbox from '@/components/CustomCheckbox/CustomCheckbox';

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
        <div className="lg:w-1/2 w-full h-screen bg-[#F6F8FF] flex flex-col justify-end">
          <img className="align-bottom justify-baseline justify-self-end lg:blur-none lg:mt-0 blur-xs h-fit mx-auto" src="/src/assets/images/bg-login.png" alt="" />
        </div>

        <div className="lg:w-1/2 lg:static w-full absolute md:top-16 top-10 left-0 right-0 bottom-0 flex align-middle items-center justify-center">
          <div className="xl:w-3/5 lg:w-3/4 md:w-2/3 md:my-44 w-[90vw] bg-white md:p-10 px-5 py-10 lg:my-auto mx-auto  lg:rounded-none rounded-2xl text-center">
            <div className="flex flex-col justify-center">
              <img className="mx-auto" src="/src/assets/images/logo.png" alt="logo" />
              <img className="mx-auto mt-4 lg:text-2xl my-0 w-3/5" src="/src/assets/images/logo-text.png" alt="" />
            </div>
            
            <p className="font-bold xl:mt-12 md:text-2xl md:mt-10 text-base mt-4">Вход в личный кабинет</p>
            <form action="" method="post">
              <div className="text-left">
                <p className="mb-2 mt-4 md:text-base text-sm">Логин</p>
                <input className=" p-4 bg-item-active w-full rounded-xl" type="text" placeholder="Введите логин" />
                <p className="mb-2 mt-4 md:text-base text-sm">Пароль</p>
                <input 
                  className=" p-4 bg-item-active w-full rounded-xl" type="password" placeholder="Введите пароль"
                  onClick={console.log('ggg')}
                />
              </div>
              <div className="flex justify-between py-5 mt-6">
                <div>
                  <CustomCheckbox label="Запомнить меня" />
                </div>
                <div>
                  <p className="text-[#203887]">Забыли пароль?</p>
                </div>
              </div>
              <button className="mt-5 btn-primary w-full py-2" onClick={handleClick}>
                Войти
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  )
}
export default LoginPage;