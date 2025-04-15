import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import useMediaQueries from '../../hooks/useMediaQueries'; 
import TheMenuItem from '@/components/TheMenuItem/TheMenuItem';
import styles from './TheNavbar.module.css'

const TheNavbar = () => {
  const { xl_breakpoint, lg_breakpoint, md_breakpoint, sm_breakpoint } = useMediaQueries();
  const showNavbar = useSelector(state => state.navbar.showNavbar);
  const navbarRemote = [
    md_breakpoint && showNavbar && !sm_breakpoint ? styles.larger_md : '',
    md_breakpoint && !showNavbar && !sm_breakpoint ? styles.smaller_md : '',
    sm_breakpoint && showNavbar && !md_breakpoint ? `${styles.visible_sm}` : '',
    sm_breakpoint && !showNavbar && !md_breakpoint ? `${styles.hidden_sm}` : ''
  ].filter(Boolean).join(' ');
    
  return (      
    <aside 
      className={`
        lg:p-10 lg:w-6/20 lg:static
        md:w-1/7 md:absolute md:z-10 md:rounded-none md:rounded-e-xl md:min-h-[1080px]
        py-3 px-5 w-full rounded-2xl absolute bg-white min-h-[844px]
        ${sm_breakpoint || md_breakpoint ? styles.navbar : ''}
        ${navbarRemote}
        ${showNavbar ? 'shadow-xl' : ''}
      `}
    >
      
      {
        
        ( (!sm_breakpoint && !md_breakpoint) || lg_breakpoint ) ? (
          <p className="text-xl font-bold">
            Основное меню
          </p>
        ) : null
        
      }
      <div className="lg:mt-9 md:mt-9 mt-0">
        <div>
          <TheMenuItem icon="docs-icon" text="Мои договоры" to="/arm-kdm2/agreements" />
          <TheMenuItem icon="requests-icon" text="Заявки" to="/arm-kdm2/requests" />
          <TheMenuItem icon="contacts-icon" text="Контакты" to="/arm-kdm2/contacts" />
        </div>
        
        <div className="lg:mt-96 md:mt-132">
          <TheMenuItem  icon="user-icon" text="Профиль" to="/arm-kdm2/user" />
          <TheMenuItem icon="logout-icon" text="Выйти" to="/arm-kdm2/logout" />
        </div>
      </div>
    </aside>
  )
}
export default TheNavbar;