import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTabs, selectedTab } from '@/store/slices/tabsSlice';
import { togglePasswordChange, setToken, setUserData } from '@/store/slices/userSlice';
import { isRestorePass, toggleRestorePassword } from '@/store/slices/loginSlice';
import axios from 'axios';
import api from '@/api/api';
import useMediaQueries from '@/hooks/useMediaQueries';
import styles from './LoginPage.module.css'

import CustomCheckbox from '@/components/CustomCheckbox/CustomCheckbox';
import TheTabsComponent from '@/components/TheTabsComponent/TheTabsComponent';

const LoginPage = () => {
  const sprite_path = '/src/assets/images/i.svg';
  const { xl_breakpoint, lg_breakpoint, md_breakpoint, sm_breakpoint } = useMediaQueries();
  const currentTab = useSelector(selectedTab);
  const isRestorePassword = useSelector(isRestorePass);
  
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCorrectLoginData, setIsCorrectLoginData] = useState(true);
  const [isCodeVerification, setCodeVerification] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [restoreData, setRestoreData] = useState(false);

  // baydam
  // 123456

  // tomograf
  // 123456
  
  const [data, setData] = useState({
    email: '',
    password: ''
  });
  const handleInputChange = (e) => {
    
    e.preventDefault();
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
  };  

  const handleRestoreInputChange = (e) => {
    console.log('restoreeeee');
    const value = e.target;
    setRestoreData(value);
  }

  const handleRestoreButton = () => {    
    dispatch(toggleRestorePassword())
  }

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
      // return;
    }
    if (credentials.password.length < 6) {
      setError('Пароль должен содержать минимум 6 символов');
      return;
    }
    setIsLoading(true);
    try {
      
      const response = await api.post('/authorization', credentials);
      
      if (response.data.success) {
        localStorage.setItem('token', response.data.data.token); // Сохраняем токен
        dispatch(setToken(response.data.data.token)); // Обновляем Redux
        navigate('/agreements'); // Перенаправляем
        dispatch(setUserData(response.data.data))
      } else {
        setIsCorrectLoginData(false);        
        setData(prev => ({ ...prev, password: '' }));
        throw new Error(response.data.message || 'Ошибка авторизации');
      }
        
    } catch (error) {
      setData(prev => ({ ...prev, password: '' }));
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
  
  const handleSendPassword = (e) => {

    setCodeVerification(true)
    
    const formData = new FormData(e.target);

    const credentials = {
      email: formData.get('email')?.toString() || ''
    };
    console.log(credentials, 'send me password');
  }
  
  useEffect(() => {
    dispatch(toggleTabs({
      type: 'login',
      breakpoint: sm_breakpoint ? 'sm-breakpoint' : ''
    }));    
  }, [dispatch]);
  
  useEffect(() => {
    if (!isCorrectLoginData && data.password === '') {
      document.getElementById('password').focus();
    }
  }, [isCorrectLoginData, data.password]); 

  const RestorePassword = () => {
    return (
      <section>
        <p className="font-bold xl:mt-12 md:text-2xl md:mt-10 text-base mt-4">Восстановление пароля</p>
        <form method="GET" onSubmit={(e) => handleSendPassword(e)}>
          {
            true ? 
            <TheTabsComponent titles='login' /> : ''

          }
          <div className="text-left">
            <p className="mb-2 mt-4 md:text-base text-sm">
              {
                currentTab && currentTab.title_en == 'phone' ? 'Телефон' :
                'Эл.почта:'
              }
            </p>
            <input className=" p-4 bg-item-active w-full rounded-xl" type="text" value={currentTab && currentTab.title_en == 'phone' ? data.phone : data.email} readOnly placeholder={`Введите` + [currentTab && currentTab.title_en == 'phone' ?  ' номер телефона' : ' почту']} required />
            <button className="mt-5 btn-primary w-full py-2"  type="submit">
              Отправить пароль
            </button>
          </div>
        </form>
      </section>
    )
  }

  const CodeVerification = () => {
    return (
      <div>
        123
      </div>
    )
  }  

  return (
    <main className="min-h-fit h-screen w-full">
      <div className="lg:flex min-h-fit h-screen relative">
        <div className="lg:w-1/2 w-full h-screen bg-[#F6F8FF] flex flex-col justify-end">
          <img className="align-bottom justify-baseline justify-self-end lg:blur-none lg:mt-0 blur-xs h-fit mx-auto" src="/src/assets/images/bg-login.png" alt="" />
        </div>

        <div className="lg:w-1/2 lg:static w-full absolute md:top-16 top-10 left-0 right-0 bottom-0 flex align-middle items-center justify-center">
          <div className={`xl:w-3/5 lg:w-3/4 md:w-2/3 md:my-44 w-[90vw] bg-white md:p-10 px-5 py-10 lg:my-auto mx-auto  lg:rounded-none rounded-2xl text-center`}>
            <div className="flex flex-col justify-center">
              <img className="mx-auto" src="/src/assets/images/logo.png" alt="logo" />
              <img className="mx-auto mt-4 lg:text-2xl my-0 w-3/5" src="/src/assets/images/logo-text.png" alt="" />
            </div>
              {
                isRestorePassword && <RestorePassword />
              }
              {
                !isRestorePassword && 
                <section>
                  <p className="font-bold xl:mt-12 md:text-2xl md:mt-10 text-base mt-4">Вход в личный кабинет</p>
                  <form method="GET" onSubmit={handleSubmit}>
                    <div className="text-left  transition-all duration-2000 ease-in-out overflow-hidden max-h-[1000px]">
                      <p className="mb-2 mt-4 md:text-base text-sm">Логин</p>
                      <input name="email" value={data.email} onChange={handleInputChange} className="p-4 bg-item-active w-full rounded-xl" type="text" placeholder="Введите логин" required />
                      <div className="relative">
                        <p className="mb-2 mt-4 md:text-base text-sm">Пароль</p>
                        <input name="password" id="password" 
                          className={`${!isCorrectLoginData ? 'danger_animation' : ''} p-4 bg-item-active w-full rounded-xl`} placeholder="Введите пароль" type={showPassword ? 'text' : 'password'} required minLength={6} 
                          value={data.password}
                          onChange={handleInputChange}
                        />
                        <button
                          type="button"
                          className="absolute right-4 top-15 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-transform active:scale-95"
                          aria-label={showPassword ? "Скрыть пароль" : "Показать пароль"}
                          onClick={(e) => {
                            e.preventDefault();
                            setShowPassword(!showPassword); 
                            setTimeout(() => document.getElementById('password').focus(), 100)
                          }}
                        >
                          {
                            showPassword ? 
                              <svg
                                className="icon me-2"
                              >
                                <use href={`${sprite_path}#eye-icon`} />
                              </svg> : 
                              <svg
                                className="icon me-2"
                              >
                                <use href={`${sprite_path}#eyeoff-icon`} />
                              </svg>
                          }
                        </button>
                      </div>
                      <div className={`
                        text-left text-red-600 mt-4
                      `}>
                        {
                          isCorrectLoginData ? '' :
                            <p className="animate-fadeIn">Введен неверный логин или пароль</p>       
                        }
                      </div>
                    </div>
                    <div className="flex justify-between py-5 mt-4">
                      <div>
                        <CustomCheckbox label="Запомнить меня" id="remember_me" />
                      </div>
                      <div>
                        <p className="text-[#203887] cursor-pointer" onClick={handleRestoreButton}>Забыли пароль?</p>
                      </div>
                    </div>
                    <button type="submit" className="mt-5 btn-primary w-full py-2" disabled={isLoading}>
                      {isLoading ? 'Вход...' : 'Войти'}
                    </button>
                  </form>
                </section>
              }
              {
                isRestorePassword && isCodeVerification && <CodeVerification />
              }
          </div>
        </div>
      </div>
    </main>
  )
}
export default LoginPage;