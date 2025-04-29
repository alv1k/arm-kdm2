import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTabs, setLoginSelectedTab  } from '@/store/slices/tabsSlice';
import { togglePasswordChange, setToken } from '@/store/slices/userSlice';
import axios from 'axios';
import api from '@/api/api';
import useMediaQueries from '@/hooks/useMediaQueries';

import CustomCheckbox from '@/components/CustomCheckbox/CustomCheckbox';
import TheTabsComponent from '@/components/TheTabsComponent/TheTabsComponent';

const LoginPage = () => {
  const sprite_path = '/src/assets/images/i.svg';
  const { xl_breakpoint, lg_breakpoint, md_breakpoint, sm_breakpoint } = useMediaQueries();
  const dispatch = useDispatch();
  useEffect(() => {
    // Устанавливаем tabs как agreementsList при монтировании компонента
    dispatch(toggleTabs('login'));
    
  }, [dispatch]);

  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [passwordVisible, setPasswordVisibility] = useState(false);
  const [isCorrectLoginData, setIsCorrectLoginData] = useState(true);

    // test@mail.ru
    // 159753
  
  const handleSubmit = async (e) =>  {    
    e.preventDefault();    
    setIsCorrectLoginData(true);
    const formData = new FormData(e.target);

    const credentials = {
      email: formData.get('email')?.toString() || '',
      password: formData.get('password')?.toString() || ''
    };

    if (!credentials.email.includes('@')) {
      setError('Введите корректный email');
      return;
    }    
    if (credentials.password.length < 6) {
      setError('Пароль должен содержать минимум 6 символов');
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await api.get(`/authorization?email=${credentials.email}&password=${credentials.password}`);
      
      // 3. Отправка POST-запроса (безопаснее чем GET)
      // const response = await api.post('/auth/login', credentials);
      if (response.data.success) {
        localStorage.setItem('token', response.data.data.token); // Сохраняем токен
        dispatch(setToken(response.data.data.token)); // Обновляем Redux
        navigate('/agreements'); // Перенаправляем
      } else {
        setIsCorrectLoginData(false);
        throw new Error(response.data.message || 'Ошибка авторизации');
      }
        
    } catch (error) {

      setIsCorrectLoginData(false);
      setIsLoading(false);
      // 5. Обработка ошибок
      let errorMessage = 'Ошибка при авторизации';
      
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || 
          error.message || 
          'Серверная ошибка';
      }
      
      setError(errorMessage);
      console.error('Auth error:', error);

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
            <input name="email" className="p-4 bg-item-active w-full rounded-xl" type="email" placeholder="Введите логин" required />
            <p className="mb-2 mt-4 md:text-base text-sm">Пароль</p>
            <input name="password"
              className=" p-4 bg-item-active w-full rounded-xl" placeholder="Введите пароль" type={passwordVisible ? 'text' : 'password'} onClick={()=>{passwordVisible != passwordVisible}}  required minLength={6} 
            />
            <div className={`
              text-left text-red-600 mt-4
            `}>
              {
                isCorrectLoginData ? '' :
                  <p className="appearance">Введен неверный логин или пароль</p>       
              }
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
          <button type="submit" className="mt-5 btn-primary w-full py-2" disabled={isLoading}>
            {isLoading ? 'Вход...' : 'Войти'}
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