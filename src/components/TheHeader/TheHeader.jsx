import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toggleNavbar } from '@/store/navbarSlice';
import useMediaQueries from '@/hooks/useMediaQueries'; 
import { isShowDetails, hideDetails, agreementsStoreList } from '@/store/agreementsSlice';
import { isNew, toggleStatus, requestStatusFalse } from '@/store/requestsSlice';
import { isPasswordModification, togglePasswordChange } from '@/store/userSlice';
import styles from './TheHeader.module.css'

const sprite_path = './src/assets/images/i.svg';
const TheHeader = () => {
  const { xl_breakpoint, lg_breakpoint, md_breakpoint, sm_breakpoint } = useMediaQueries();
  const dispatch = useDispatch();
  const showAgreementDetails = useSelector(isShowDetails);
  const agreementsList = useSelector(agreementsStoreList);
  const isNewRequest = useSelector(isNew);
  const isPasswordChange = useSelector(isPasswordModification);
  const navigate = useNavigate();

  const handleClick = () => {
    dispatch(toggleNavbar());
  };
  const handleLogoClick = () => {
    navigate('/'); // Изменяем маршрут на '/agreements'
  }
  const handleBackwards = () => {
    if (showAgreementDetails) {
      dispatch(hideDetails());
    } else if (isNewRequest) {
      dispatch(toggleStatus());
    } else if(isPasswordChange) {
      dispatch(togglePasswordChange());
    }
  }
  return (
    <header className="xl:px-10 lg:px-10 md:px-6 px-0 text-[#203887] bg-white py-5 flex relative">
      {
        ((isNewRequest || showAgreementDetails || isPasswordChange) && sm_breakpoint) ?
        <button 
          className="md:text-base text-sm btn-text flex items-center ms-3 "
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
        <svg
          className={`icon md:my-auto md:ms-0 ms-5 ${md_breakpoint ? styles.icon_md : ''}`}
          onClick={handleClick}
        >
          <use href={`${sprite_path}#menu-icon`} />
        </svg>        
        : ''
      }
      <div className="xl:ms-0 lg:ms-0 md:justify-normal md:mt-1 absolute justify-center items-center flex w-full">
        <img 
          className="lg:w-[240px] md:w-[220px] md:ms-15 w-[200px] ms-2" src="/src/assets/images/logo-main.png" alt=""
          onClick={handleLogoClick}
        />
        {/* <p className=" lg:text-2xl md:text-xl text-sm uppercase font-bold lg:ms-5 md:ms-5 ms-2 my-auto" style={{fontFamily: 'PT Sans'}}>комдрагметалл рс(я)</p> */}
      </div>
      <div className="lg:flex md:flex lg:ms-auto md:ms-auto hidden" >
        <span className="lg:mr-10 md:mr-4 font-semibold text-xl mt-[0.35rem] ">
          ООО «Название»
        </span>
        <img src="./src/assets/images/Ellipse.png" alt=""  />
      </div>
    </header>
  )
}
export default TheHeader;