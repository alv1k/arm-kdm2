import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { hideNavbar } from '@/store/navbarSlice';
import { toggleTabs  } from '@/store/tabsSlice';
import { isNew } from '@/store/requestsSlice';
import { isPasswordModification, togglePasswordChange } from '@/store/userSlice';
import useMediaQueries from '@/hooks/useMediaQueries';

const UserPage = () => {
  const sprite_path = './src/assets/images/i.svg';
  const showNavbar = useSelector((state) => state.navbar.showNavbar);
  const isNewRequest = useSelector(isNew);
  const isPasswordChange = useSelector(isPasswordModification);
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
  const handlePasswordChangeBtn = () => {
    dispatch(togglePasswordChange());
  }

  const profileData = () => (
    <div className="md:flex block gap-5">
      <img className="mt-4 w-25 h-25 md:mx-0 mx-auto" src="/src/assets/images/user.png" alt="profile" />
      <div className="lg:mt-3 md:mt-4 md:ms-5 mt-5">
        <p className="text-[#203887] font-extrabold md:text-xl text-base md:text-left text-center">
          ООО “Название организации”
        </p>
        <p className={`
          md:mt-4 mt-4 md:p-0 px-5 py-2 rounded-xl text-sm
          ${sm_breakpoint ? 'bg-item-default' : ''}
        `}>
          <span className="text-[#787C82]">Телефон:</span> &nbsp;
          {
            sm_breakpoint ? <br /> : ''
          }
          +7 (4112) 482-504
        </p>
        <p className={`
          md:mt-6 md:p-0 px-5 py-4 mt-4 rounded-xl text-sm md:bg-none
          ${sm_breakpoint ? 'bg-item-default' : ''}
        `}>
          <span className="text-[#787C82]">Эл. почта:</span> &nbsp;
          {
            sm_breakpoint ? <br /> : ''
          }
          info@aokdm.ru
        </p>
      </div>
    </div>
  )
  const profileLoginData = () => (
    <div>
      <div className="xl:mt-8 lg:mt-10 lg:flex block gap-5 w-full md:mt-4 mt-3 text-sm">
        <div className="lg:w-1/2 w-full">
          <p className="text-[#787C82]">Логин</p>
          <input className="mt-2 p-5 bg-item-active w-full rounded-xl" type="text" placeholder='User001' />
        </div>
        <div className="lg:w-1/2 lg:mt-0 w-full mt-4">
          <p className="text-[#787C82]">Пароль</p>
          <input className="mt-2 p-5 bg-item-active w-full rounded-xl" type="text" placeholder='******'/>
            {/* <svg
              className="icon"
            >
              <use href={`${sprite_path}#eye-icon`} />
            </svg> */}
        </div>
      </div>
      <button className="btn-default py-2 flex md:mt-9 mt-9 md:w-auto md:px-6 w-full justify-center" onClick={handlePasswordChangeBtn}>
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
    <div className="flex flex-col gap-5 mt-8">
      <div className="lg:w-1/2 w-full">
        <p className="text-[#787C82]">Введите текущий пароль</p>
        <input className="mt-2 p-5 bg-item-active w-full rounded-xl" type="text" placeholder='Текущий пароль' />
      </div>
      <div className="lg:w-1/2 w-full">
        <p className="text-[#787C82]">Укажите новый пароль</p>
        <input className="mt-2 p-5 bg-item-active w-full rounded-xl" type="text" placeholder='Новый пароль' />
      </div>
      <div className="lg:w-1/2 w-full">
        <p className="text-[#787C82]">Повторите новый пароль</p>
        <input className="mt-2 p-5 bg-item-active w-full rounded-xl" type="text" placeholder='Новый пароль' />
      </div>
      <div className="flex gap-5">
        <button className="btn-default py-2 md:mt-9 mt-9 md:w-auto md:px-6 w-full" onClick={handlePasswordChangeBtn}>
          Отменить
        </button>
        <button className="btn-primary py-2 md:mt-9 mt-9 md:w-auto md:px-6 w-full" onClick={handlePasswordChangeBtn}>
          Сохранить
        </button>
      </div>
    </div>
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
      <div className="lg:text-base md:text-base text-sm xl:w-4/5 w-full h-[110%]">
        <div className="flex items-center md:justify-start justify-center md:pt-6">
          {
            sm_breakpoint ? '' :
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
          }
          {
            isPasswordChange && !sm_breakpoint ? 
            <button 
              className="btn-text ms-auto me-4 lg:mt-0 md:mt-0 flex"
              onClick={handlePasswordChangeBtn}
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