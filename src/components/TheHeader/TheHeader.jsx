import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toggleNavbar } from '@/store/slices/navbarSlice';
import useMediaQueries from '@/hooks/useMediaQueries'; 
import { isShowDetails, hideDetails, agreementsStoreList, isShowCountersModal, setHideCountersModal, isShowPaymentModal, setHidePaymentModal } from '@/store/slices/agreementsSlice';
import { isNew, requestStatusTrue, requestStatusFalse } from '@/store/slices/requestsSlice';
import { isPasswordModification, togglePasswordChange, fetchProfileData } from '@/store/slices/userSlice';
import styles from './TheHeader.module.css'

const sprite_path = './src/assets/images/i.svg';
const TheHeader = () => {
  const { xl_breakpoint, lg_breakpoint, md_breakpoint, sm_breakpoint } = useMediaQueries();
  const dispatch = useDispatch();
  const showAgreementDetails = useSelector(isShowDetails);
  const agreementsList = useSelector(agreementsStoreList);
  const isVisibleCountersModal = useSelector(isShowCountersModal);
  const isVisiblePaymentModal = useSelector(isShowPaymentModal);
  const isNewRequest = useSelector(isNew);
  const isPasswordChange = useSelector(isPasswordModification);
  const profileFetchedData = useSelector((state) => state.user_slice.profileData);
  const showNavbar = useSelector(state => state.navbar.showNavbar);
  const navigate = useNavigate();

  const handleClick = () => {    
    dispatch(toggleNavbar());
  };
  const handleLogoClick = () => {
    navigate('/'); // Изменяем маршрут на '/agreements'
  }
  const handleBackwards = () => {
    if(isVisibleCountersModal) {
      dispatch(setHideCountersModal())
    } else if (isVisiblePaymentModal) {
      dispatch(setHidePaymentModal());
    } else if (isNewRequest) {
      dispatch(requestStatusFalse());
    } else if(isPasswordChange) {
      dispatch(togglePasswordChange());
    } else if (showAgreementDetails) {
      dispatch(hideDetails());
    }
  }
  useEffect(() => {
    dispatch(fetchProfileData())
  }, [dispatch])

  return (
    <header className="xl:px-10 lg:px-10 md:px-6 md:pb-5 md:h-auto px-0 text-[#203887] bg-white py-5 flex sticky top-0 shadow-sm h-16">
      {
        ((isNewRequest || showAgreementDetails || isPasswordChange) && sm_breakpoint) ?
        <button 
          className="md:text-base text-sm btn-text flex items-center ms-3 z-20 md:static absolute"
          onClick={handleBackwards}
        >
          <svg
            className="icon"
          >
            <use href={`${sprite_path}#back-icon`} />
          </svg>
          Назад
        </button>
        : (sm_breakpoint || md_breakpoint) ? 
        // <svg
        //   className={`icon md:my-auto md:ms-0 ms-5 z-20 md:static absolute ${md_breakpoint ? styles.icon_md : ''}`}
        //   onClick={handleClick}
        // >
        //   <use href={`${sprite_path}#menu-icon`} />
        // </svg>
        <button 
          className="relative w-8 h-8 focus:outline-none md:my-auto md:ms-0 ms-5 z-20"
          onClick={() => handleClick()}
        >
          <span className={`absolute md:top-2/6 top-4/12 block h-0.5 w-6 bg-current transform transition duration-300 ease-in-out origin-right 
            ${showNavbar ? 'rotate-45 md:translate-y-2.5 translate-y-2.5' : '-translate-y-1.5'}`} />
          <span className={`absolute md:top-3/6 top-5/12 block h-0.5 w-5 bg-current transform transition duration-300 ease-in-out 
            ${showNavbar ? 'opacity-0' : 'opacity-100'}`} />
          <span className={`absolute md:top-4/6 top-6/12 block h-0.5 w-6 bg-current transform transition duration-300 ease-in-out origin-right
            ${showNavbar ? '-rotate-45 md:-translate-y-4.5 -translate-y-3' : 'translate-y-1.5'}`} />
        </button>
        : ''
      }
      <div className="xl:ms-0 lg:ms-0 md:justify-normal md:mt-1 items-center flex md:w-fit w-full md:static absolute">
        <img 
          className="lg:ms-2 md:w-[300px] md:ms-10 w-[200px] mx-auto" src="/src/assets/images/logo-main.png" alt=""
          onClick={handleLogoClick}
        />
        {/* <p className=" lg:text-2xl md:text-xl text-sm uppercase font-bold lg:ms-5 md:ms-5 ms-2 my-auto" style={{fontFamily: 'PT Sans'}}>комдрагметалл рс(я)</p> */}
      </div>
      <div className="lg:flex md:flex lg:ms-auto md:ms-auto hidden items-center" >
        <span className="font-semibold text-xl mt-[0.35rem] truncate text-nowrap lg:max-w-2xl max-w-[350px]">
          {profileFetchedData?.kontragent?.name}
        </span>
        {/* <img src="./src/assets/images/Ellipse.png" alt=""  /> */}
      </div>
    </header>
  )
}
export default TheHeader;