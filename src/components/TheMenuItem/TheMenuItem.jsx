import React from 'react';
import { useSelector, useDispatch } from 'react-redux'; 
import { NavLink } from 'react-router-dom';
import useMediaQueries from '../../hooks/useMediaQueries'; 
import { hideNavbar } from '../../store/navbarSlice';
import { hideDetails } from '../../store/agreementsSlice';
import styles from './TheMenuItem.module.css';

const TheMenuItem = ({ icon, text, to }) => {
  const { xl_breakpoint, lg_breakpoint, md_breakpoint, sm_breakpoint } = useMediaQueries();
  const showNavbar = useSelector(state => state.navbar.showNavbar);
  const dispatch = useDispatch();
  const sprite_path = './src/assets/images/i.svg';
  
  const navbarRemoteIcon = [
    md_breakpoint && showNavbar && !sm_breakpoint ? 'md:mx-auto' : '',
    md_breakpoint && !showNavbar && !sm_breakpoint ? 'md:mx-auto' : ''
  ].filter(Boolean).join(' ');
  const navbarRemoteText = [
    md_breakpoint && showNavbar && !sm_breakpoint ? styles.text_visible : '',
    md_breakpoint && !showNavbar && !sm_breakpoint ? styles.text_hidden : '',
    sm_breakpoint && showNavbar && !md_breakpoint ? 'md:block' : '',
    sm_breakpoint && !showNavbar && !md_breakpoint ? 'md:hidden' : ''
  ].filter(Boolean).join(' ');
  const closeNavbar = () => {
    dispatch(hideNavbar());
  }
  
  return (
      <NavLink 
        to={to}
        className={({ isActive }) => 
          `
            ${isActive ? `item-selected` : `bg-item-default`} 
            lg:mt-5 lg:mb-0 lg:p-5 lg:rounded-xl lg:w-full 
            md:mt-[-8px] md:mb-7 md:p-5 md:w-full
            mt-0 mb-6 py-2 px-5 rounded-md flex 
          `
        }
        onClick={closeNavbar}
      >
        {({ isActive }) => (
        <>
          <div className={
            ``
          }>
            {/* ${!showNavbar && (sm_breakpoint || md_breakpoint) ? 'ps-2' : ''} */}
            <svg
              className={`
                icon lg:mx-0
                ${isActive ? 'item-selected' : 'bg-item-default'}
                ${navbarRemoteIcon}
              `}
              fill={`${isActive ? '#FFFFFF' : '#0B1930'}`}
            >
              <use href={`${sprite_path}#${icon}`} />
            </svg>
            
          </div>
          <div className={
            `${showNavbar ? '' : ''}`
          }>
            <span className={`
              lg:block lg:font-medium 
              md:block md:text-left md:text-base
              font-normal ms-5 whitespace-nowrap text-sm
              ${styles.text_animation} 
              ${navbarRemoteText}
              ${showNavbar && (sm_breakpoint || md_breakpoint) ? 'visible' : lg_breakpoint || xl_breakpoint ? 'visible' : 'invisible'}
            `}
            >
              {text}
            </span>
          </div>
        </>
        )}
      </NavLink>
  )
}
export default TheMenuItem;