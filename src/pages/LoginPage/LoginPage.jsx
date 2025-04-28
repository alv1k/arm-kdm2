import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTabs, setLoginSelectedTab  } from '@/store/tabsSlice';
import { togglePasswordChange, setToken } from '@/store/userSlice';
import axios from 'axios';
import api from '@/api/api';
import useMediaQueries from '@/hooks/useMediaQueries';

import CustomCheckbox from '@/components/CustomCheckbox/CustomCheckbox';
import TheTabsComponent from '@/components/TheTabsComponent/TheTabsComponent';

const LoginPage = () => {
  const sprite_path = '/src/assets/images/i.svg';
  const showPass = false;
  const { xl_breakpoint, lg_breakpoint, md_breakpoint, sm_breakpoint } = useMediaQueries();
  const dispatch = useDispatch();
  useEffect(() => {
    // Устанавливаем tabs как agreementsList при монтировании компонента
    dispatch(toggleTabs('login'));
    
  }, [dispatch]);

  const navigate = useNavigate();
  const [error, setError] = useState('');

  
  const handleSubmit = async (e) =>  {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const formJson = Object.fromEntries(formData.entries());
    formJson.login = 'test@mail.ru';
    formJson.password = '159753';
    if (formJson.login.length < 3) {
      setError('Пожалуйста, введите корректный логин');
      return;
    } else if(formJson.password < 3) {
      console.log('password');
      return;
    }

    try {
      const response = await api.get(`/authorization?email=${formJson.login}&password=${formJson.password}`);
      if (response && response.data.success) {
        navigate('/agreements');
        dispatch(setToken(response.data.data.token))
      } else {
        // Сервер вернул success: false
        const errorMessage = response.data.message || 'Авторизация не удалась';
        setError(errorMessage); // Показываем пользователю
        
        // Логируем детали для разработчика
        console.error('Auth failed:', {
          status: response.status,
          data: response.data
        });
        
        throw new Error(errorMessage); // Пробрасываем для дальнейшей обработки
      }
      
      return response.data;
  
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Ошибка специфичная для axios
        console.error('Ошибка axios:', {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data
        });
        if (error.response?.status === 401) {
          throw new Error('Неверный логин или пароль');
        }
      } else {
        // Другие ошибки (например, сетевые)
        console.error('Неожиданная ошибка:', error);
      }
  
      throw error; // Пробрасываем ошибку для обработки в компоненте
    }
  };
  const handleSendPassword = () => {
    console.log('send me password');
    
  }

  const LoginSection = () => {
    return (
      <section>
        <p className="font-bold xl:mt-12 md:text-2xl md:mt-10 text-base mt-4">Вход в личный кабинет</p>
        <form method="GET" onSubmit={handleSubmit}>
          <div className="text-left">
            <p className="mb-2 mt-4 md:text-base text-sm">Логин</p>
            <input name="login" className="p-4 bg-item-active w-full rounded-xl" type="text" placeholder="Введите логин" />
            <p className="mb-2 mt-4 md:text-base text-sm">Пароль</p>
            <input name="password"
              className=" p-4 bg-item-active w-full rounded-xl" placeholder="Введите пароль" type={showPass ? 'text' : 'password'} onClick={()=>{showPass != showPass}}
            />
            <div className={`
              text-left text-red-600 mt-4
            `}>
              <p>Введен неверный логин или пароль</p>
            </div>
          </div>
          <div className="flex justify-between py-5 mt-4">
            <div>
              <CustomCheckbox label="Запомнить меня" />
            </div>
            <div>
              <p className="text-[#203887]">Забыли пароль?</p>
            </div>
          </div>
          <button type="submit" className="mt-5 btn-primary w-full py-2">
            Войти
          </button>
        </form>
      </section>
    )
  }

  const RestorePassword = () => {
    return (
      <section>
        <p className="font-bold xl:mt-12 md:text-2xl md:mt-10 text-base mt-4">Восстановление пароля</p>
        <form action="">
          <TheTabsComponent />
          <div className="text-left">
            <p className="mb-2 mt-4 md:text-base text-sm">
              {
                'Эл.почта:'
              }
            </p>
            <input className=" p-4 bg-item-active w-full rounded-xl" type="text" placeholder="Введите почту" />
            <button className="mt-5 btn-primary w-full py-2" onClick={() => handleSendPassword}>
              Отправить пароль
            </button>
          </div>
        </form>
      </section>
    )
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
            <LoginSection />
            {/* <RestorePassword /> */}
          </div>
        </div>
      </div>
    </main>
  )
}
export default LoginPage;