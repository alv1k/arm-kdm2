import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { hideNavbar } from '@/store/slices/navbarSlice';
import { fetchAuth } from '@/store/slices/authSlice';
import { toggleTabs  } from '@/store/slices/tabsSlice';
import { isNew } from '@/store/slices/requestsSlice';
import { userData } from '@/store/slices/userSlice';
import { isPasswordModification, togglePasswordChange, fetchProfileData } from '@/store/slices/userSlice';
import useMediaQueries from '@/hooks/useMediaQueries';

const UserPage = () => {
  const sprite_path = './src/assets/images/i.svg';
  const showNavbar = useSelector((state) => state.navbar.showNavbar);
  const profileFetchedData = useSelector((state) => state.user_slice.profileData);  
  const isNewRequest = useSelector(isNew);
  const isPasswordChange = useSelector(isPasswordModification);
  const userAuthData = useSelector(userData);  

  // https://cloud.aokdm.ru/method/profile?token=
  // можно редактировать email, login, phone и password
  
  const { xl_breakpoint, lg_breakpoint, md_breakpoint, sm_breakpoint } = useMediaQueries();
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const sideClick = (event) => {
    event.stopPropagation();
    if (showNavbar) {
      dispatch(hideNavbar());
    }
  };
  useEffect(() => {
    dispatch(fetchAuth())
    dispatch(fetchProfileData())
  }, [dispatch]);
  const handlePasswordChangeBtn = (status) => {
    dispatch(togglePasswordChange(status));
  }
  const handleSendNewPassword = (e) => {
    e.stopPropagation();
    
    let formData = new FormData(e.currentTarget)
    let oldPassword = formData.get('oldPassword');
    let newPassword = formData.get('newPassword');
    let newPasswordDoubled = formData.get('newPasswordDoubled');
    // Валидация паролей
    if (newPassword !== newPasswordDoubled) {
      alert('Пароли не совпадают!');
      handlePasswordChangeBtn(true);
    }
    let credentials = {
      "oldPassword" : oldPassword,
      "newPassword" : newPassword
    }
    dispatch(fetchProfileData(credentials))
    handlePasswordChangeBtn(false); // Закрываем форму
    
  }
  const formatPhoneSpecial = (phone) => {
    const cleaned = ('' + phone).replace(/\D/g, '');
    
    // Проверяем, содержит ли номер 4112 именно как код (позиции 1-4)
    if (cleaned.length === 11 && cleaned.substring(1, 5) === '4112') {
      return `8 (4112) ${cleaned.substring(5, 8)}-${cleaned.substring(8, 10)}-${cleaned.substring(10)}`;
    }
    
    // Стандартное форматирование
    if (cleaned.length === 11 && (cleaned.startsWith('7') || cleaned.startsWith('8'))) {
      return `+7 (${cleaned.substring(1, 4)}) ${cleaned.substring(4, 7)}-${cleaned.substring(7, 9)}-${cleaned.substring(9)}`;
    }
    
    return phone;
  };

  const profileData = () => (
    <div className="md:flex block gap-5">
      {/* <img className="mt-4 w-25 h-25 md:mx-0 mx-auto" src="/src/assets/images/user.png" alt="profile" /> */}
      
      <div className="lg:mt-3 md:mt-4 mt-5">
        <p className="text-[#203887] font-extrabold md:text-xl text-base md:text-left text-center">
          {profileFetchedData && profileFetchedData?.kontragent?.name}
        </p>
        <p className={`
          md:mt-4 mt-4 md:p-0 px-5 py-2 rounded-xl text-sm
          ${sm_breakpoint ? 'bg-item-default' : ''}
        `}>
          <span className="text-[#787C82]">Телефон:</span> &nbsp;
          {
            sm_breakpoint ? <br /> : ''
          }
          {
            profileFetchedData ? formatPhoneSpecial(profileFetchedData.phone) : ''
          }
        </p>
        <p className={`
          md:mt-6 md:p-0 px-5 py-4 mt-4 rounded-xl text-sm md:bg-none
          ${sm_breakpoint ? 'bg-item-default' : ''}
        `}>
          <span className="text-[#787C82]">Эл. почта:</span> &nbsp;
          {
            sm_breakpoint ? <br /> : ''
          }
          {
            profileFetchedData ? profileFetchedData.email : ''
          }
        </p>
      </div>
    </div>
  )
  const profileLoginData = () => (
    <div>
      <div className="xl:mt-8 lg:mt-10 lg:flex block gap-5 w-full md:mt-4 mt-3 text-sm">
        <div className="lg:w-1/2 w-full">
          <p className="text-[#787C82]">Логин</p>
          <input className="mt-2 p-5 bg-item-active w-full rounded-xl" type="text" placeholder={profileFetchedData ? profileFetchedData.login : ''} />
        </div>
        <div className="lg:w-1/2 lg:mt-0 w-full mt-4 relative">
          <p className="text-[#787C82]">Пароль</p>
          <input id="password" className="mt-2 p-5 bg-item-active w-full rounded-xl" type={showPassword ? "text" : "password"} placeholder='******'/>
          <button
            type="button"
            className="absolute right-4 top-15 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-transform active:scale-95"
            aria-label={showPassword ? "Скрыть пароль" : "Показать пароль"}
            onClick={() => {
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
      </div>
      <button className="btn-default py-2 flex md:mt-9 mt-9 md:w-auto md:px-6 w-full justify-center" onClick={() => handlePasswordChangeBtn(true)}>
        <svg
          className="icon me-2"
        >
          <use href={`${sprite_path}#pen-icon`} />
        </svg>
        Изменить пароль
      </button>
    </div>
  )
  const profilePasswordChange = () => (
    <form className="flex flex-col gap-5 mt-8" onSubmit={(e) => handleSendNewPassword(e)} method="POST">
      <div className="lg:w-1/2 w-full">
        <p className="text-[#787C82]">Введите текущий пароль</p>
        <input name="oldPassword" className="mt-2 p-5 bg-item-active w-full rounded-xl" type="text" placeholder='Текущий пароль' required minLength={6} />
      </div>
      <div className="lg:w-1/2 w-full">
        <p className="text-[#787C82]">Укажите новый пароль</p>
        <input name="newPassword" className="mt-2 p-5 bg-item-active w-full rounded-xl" type="text" placeholder='Новый пароль' required minLength={6} />
      </div>
      <div className="lg:w-1/2 w-full">
        <p className="text-[#787C82]">Повторите новый пароль</p>
        <input name="newPasswordDoubled" className="mt-2 p-5 bg-item-active w-full rounded-xl" type="text" placeholder='Новый пароль' required minLength={6} />
      </div>
      <div className="md:flex block gap-5">
        <button className="btn-default py-2 md:mt-9 mt-3 md:w-auto md:px-6 w-full" type="button" onClick={() => handlePasswordChangeBtn(false)}>
          Отменить
        </button>
        <button className="btn-primary py-2 md:mt-9 mt-3 md:w-auto md:px-6 w-full" type="submit">
          Сохранить
        </button>
      </div>
    </form>
  )

  return (
    <section 
      className="
        xl:ml-10 xl:px-10 xl:py-10 xl:rounded-x
        lg:ml-8 lg:px-4 lg:py-5 lg:shadow-none
        md:w-full md:px-6 md:ms-8 md:rounded-xl md:shadow-lg
        w-full px-5 ms-0 bg-white shadow-none
      "
      onClick={sideClick}
    >
      <div className={`lg:text-base md:text-base text-sm w-full h-[110%] ${isPasswordChange ? '' : ' xl:w-4/5'}`}>
        <div className="flex items-center md:justify-start justify-center md:pt-6">
          <p className="
            xl:mt-0 
            lg:px-6 lg:text-[26px] lg:mt-4
            md:px-2 md:mt-0 md:text-left
            text-xl font-bold mt-5 text-center
          ">
            {
              isPasswordChange ? 'Изменить пароль' : 'Профиль'
            }
          </p>
          {
            isPasswordChange && !sm_breakpoint ? 
            <button 
              className="btn-text ms-auto me-4 lg:mt-0 md:mt-0 flex"
              onClick={() => handlePasswordChangeBtn(false)}
            >
              <svg
                className="icon"
              >
                <use href={`${sprite_path}#back-icon`} />
              </svg>              
              Назад
            </button> : ''
          }
        </div>
        <div className="lg:mt-6 md:mt-2 mt-4">
          {
            isPasswordChange && xl_breakpoint ? 
            profileData() : !isPasswordChange ? profileData() : ''
          }
          {
            isPasswordChange ? 
            profilePasswordChange() : profileLoginData()
          }
        </div>
      </div>
    </section>
  )
}
export default UserPage;