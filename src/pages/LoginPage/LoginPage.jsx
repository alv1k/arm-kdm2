import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTabs, selectedTab, setLoginSelectedTab } from '@/store/slices/tabsSlice';
import { togglePasswordChange, setToken, setUserData } from '@/store/slices/userSlice';
import { isRestorePass, toggleRestorePassword, rememberMe, setRememberMe, fetchRestorePassword } from '@/store/slices/authSlice';
import axios from 'axios';
import api from '@/api/api';
import useMediaQueries from '@/hooks/useMediaQueries';
import styles from './LoginPage.module.css'

import CustomCheckbox from '@/components/CustomCheckbox/CustomCheckbox';
import TheTabsComponent from '@/components/TheTabsComponent/TheTabsComponent';
import { ToastContainer, toast } from 'react-toastify';

const LoginPage = () => {
  const sprite_path = '/src/assets/images/i.svg';
  const { xl_breakpoint, lg_breakpoint, md_breakpoint, sm_breakpoint } = useMediaQueries();
  const currentTab = useSelector(selectedTab);
  const isRestorePassword = useSelector(isRestorePass);
  const pressedRememberMe = useSelector(rememberMe);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCorrectLoginData, setIsCorrectLoginData] = useState(true);
  const [isCodeVerification, setCodeVerification] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [inputRestorePassword, setInputRestorePassword] = useState();
  const inputPasswordRef = useRef(null);
  const caretPosRef = useRef(null);
  const notify = (type, message) => {
    switch (type) {
      case true: 
        toast.success('Данные авторизации высланы вам на указанную почту');
        break;
      case false:
        toast.error('Ошибка: ' + message)
        break;
    }
  }
  const handleTogglePassword = () => {
    caretPosRef.current = {
      start: inputPasswordRef.current.selectionStart,
      end: inputPasswordRef.current.selectionEnd
    };
    setShowPassword(!showPassword);
  };
  // https://cloud.aokdm.ru/method/restore?email=atlasov.n.r@gmail.com
  // восстановление пароля

  // baydam
  // 123456

  // tomograf
  // 123456

  const [data, setData] = useState({
    login: '',
    password: ''
  });
  const handleInputChange = (e) => {    
    // e.preventDefault();
    const { name, value } = e.target;
    const trimmedValue = (name === 'login' || name === 'password') 
    ? value.trim() 
    : value;
    setData(prev => ({ ...prev, [name]: trimmedValue }));
  };

  const handleRestoreButton = () => {
    dispatch(toggleRestorePassword())
  }

  const handleRememberMeChange = (e) => {    
    dispatch(setRememberMe(e.target.checked));
  };

  const handleSubmit = async (e) =>  {
    
    e.preventDefault();    
    setIsCorrectLoginData(true);
    const formData = new FormData(e.target);

    const credentials = {
      login: formData.get('login')?.toString() || '',
      password: formData.get('password')?.toString() || ''
    };
    
    if (!credentials.login.includes('@')) {
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
        if (pressedRememberMe) {
          localStorage.setItem('login', credentials.login);
          localStorage.setItem('token', response.data.data.token);
          // Установка cookie с длительным сроком
          document.cookie = `token=${response.data.data.token}; max-age=${30 * 24 * 60 * 60}; path=/; Secure`;
        } else {
          sessionStorage.setItem('token', response.data.data.token);
        }
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
  
  const handleSendPassword = async (e) => {
    e.stopPropagation();
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const credentials = {
      email: formData.get('restorePassword')?.toString() || ''
    };
    
    const response = await dispatch(fetchRestorePassword(credentials));
    
    if (response.payload.success) {      
      dispatch(toggleRestorePassword());
      setIsCorrectLoginData(true);
      notify(response.payload.success, response.payload.message)
    } else {
      if (response.payload.message == 'user not found') {
        notify(response.payload.success, 'Пользователь не найден')
      } else if (response.payload.message == 'email is not specified') {
        notify(response.payload.success, 'Электронная почта не указана')
      } else {
        notify(response.payload.success, response.payload.message)
      }
    }
    // setCodeVerification(true)

  }

  const handleInputRestorePassword = (e) => {
    let value = e.target.value; // Удаляем все не-цифры
    let formattedValue = null;
    let newValue = null;

    if (currentTab && currentTab.title_en == 'phone') {
      value = e.target.value.replace(/\D/g, '');
      if (value.length > 0) {
        formattedValue = '+7 (';
        if (value.length > 1) {
          formattedValue += value.substring(1, 4);
        }
        if (value.length > 4) {
          formattedValue += ') ' + value.substring(4, 7);
        }
        if (value.length > 7) {
          formattedValue += '-' + value.substring(7, 9);
        }
        if (value.length > 9) {
          formattedValue += '-' + value.substring(9, 11);
        }
        if (value.length > 10) {
          formattedValue = formattedValue          
        }
      }
    }
    newValue = formattedValue ?? value
    
    setInputRestorePassword(newValue);
    
    if (currentTab?.title_en === 'phone') {
      setError(/^[+]?[\d\s()-]{10,20}$/.test(value) ? '' : 'Неверный формат телефона');
    } else {
      setError(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? '' : 'Неверный формат email');
    }
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

  useEffect(() => {
    dispatch(setLoginSelectedTab({ 
      title_en: 'email', 
      title_ru: 'Почта' 
    }));
  }, []);

  useEffect(() => {
    if (caretPosRef.current && inputPasswordRef.current) {
      inputPasswordRef.current.setSelectionRange(
        caretPosRef.current.start,
        caretPosRef.current.end
      );
      caretPosRef.current = null;
    }
    // inputPasswordRef.current.focus()
    // console.log('caret staff');
  }, [showPassword]);

  useEffect(() => {
    if (isRestorePassword) { 
      document.getElementById('restorePassword').focus();
    }
  }, [isRestorePassword])

  const RestorePassword = () => {
    return (
      <section>
        {
          !isCodeVerification ?
          <div>
            <p className="font-bold xl:mt-12 md:text-2xl md:mt-10 text-base mt-4">Восстановление пароля</p>
            <form method="GET" onSubmit={(e) => handleSendPassword(e)}>          
              <TheTabsComponent titles='login' />
              <div className="text-left">
                <p className="mb-2 mt-4 md:text-base text-sm">
                  {
                    currentTab && currentTab.title_en == 'phone' ? 'Телефон' :
                    'Эл.почта:'
                  }
                </p>
                <input 
                  id="restorePassword" 
                  name="restorePassword" 
                  className=" p-4 bg-item-active w-full rounded-xl" 
                  type={currentTab && currentTab.title_en == 'phone' ? 'tel' : 'text'} 
                  value={inputRestorePassword} 
                  onChange={(e) => {
                      handleInputRestorePassword(e);
                      setTimeout(() => document.getElementById('restorePassword').focus(), 100)
                    }
                  } 
                  placeholder={`Введите` + [currentTab && currentTab.title_en == 'phone' ?  ' номер телефона' : ' почту']} 
                  required
                  autoComplete={currentTab?.title_en === 'phone' ? 'tel' : 'email'}
                />
                <button 
                  className="mt-5 btn-primary w-full py-2" 
                  type="submit"
                  disabled={!inputRestorePassword} 
                >
                  Отправить пароль
                </button>
              </div>
            </form>
          </div>
          : 
          <CodeVerification />
        }
      </section>
    )
  }

  const CodeVerification = () => {
    return (
      <div>
        CodeVerification
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
                      <input 
                        key="login-input"
                        name="login" 
                        value={data.login} 
                        onChange={handleInputChange} 
                        className="p-4 bg-item-active w-full rounded-xl" 
                        type="text" 
                        placeholder="Введите логин" 
                        required 
                        autoFocus
                      />
                      <div className="relative">
                        <p className="mb-2 mt-4 md:text-base text-sm">Пароль</p>
                        <input 
                          key="password-input"
                          ref={inputPasswordRef}
                          name="password" id="password" 
                          className={`${!isCorrectLoginData ? 'danger_animation' : ''} p-4 bg-item-active w-full rounded-xl`} 
                          placeholder="Введите пароль" 
                          type={showPassword ? 'text' : 'password'} 
                          required minLength={6} 
                          value={data.password}
                          onChange={handleInputChange}
                          onDoubleClick={(e) => e.target.select()}
                          onSelect={(e) => {
                            caretPosRef.current = {
                              start: e.target.selectionStart,
                              end: e.target.selectionEnd
                            };
                          }}
                        />
                        <button
                          type="button"
                          className="absolute right-4 top-15 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-transform active:scale-95 focus:text-blue-900 outline-0"
                          aria-label={showPassword ? "Скрыть пароль" : "Показать пароль"}
                          onClick={(e) => {
                            e.preventDefault();
                            setShowPassword(!showPassword);
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
                      <div onClick={(e) => handleRememberMeChange(e)}>
                        <CustomCheckbox label="Запомнить меня" id="remember_me"  />
                      </div>
                      <div>
                        <p 
                          id="forgotPassword"
                          tabIndex={0} 
                          className="text-[#203887] cursor-pointer focus:bg-[#F6F8FF] outline-0" 
                          onClick={() => handleRestoreButton()}
                          onKeyDown={(e) => {
                            // Добавляем обработку нажатия пробела/Enter
                            if (e.key === ' ' || e.key === 'Enter') {
                              e.preventDefault();
                              document.getElementById('forgotPassword')?.click();
                            }
                          }}
                        >
                          Забыли пароль?
                        </p>
                      </div>
                    </div>
                    <button type="submit" className="mt-5 btn-primary w-full py-2" disabled={isLoading}>
                      {isLoading ? 'Вход...' : 'Войти'}
                    </button>
                  </form>
                </section>
              }
              
            <ToastContainer position="top-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="colored"  
            />
          </div>
        </div>
      </div>
    </main>
  )
}
export default LoginPage;