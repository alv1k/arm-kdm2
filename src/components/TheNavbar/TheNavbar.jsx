import React from 'react';
import { useSelector } from 'react-redux';
import useMediaQueries from '@/hooks/useMediaQueries'; 
import TheMenuItem from '@/components/TheMenuItem/TheMenuItem';
import styles from './TheNavbar.module.css'

const TheNavbar = () => {
  const { xl_breakpoint, lg_breakpoint, md_breakpoint, sm_breakpoint } = useMediaQueries();
  const showNavbar = useSelector(state => state.navbar.showNavbar);
  // const [animationTriggered, setAnimationTriggered] = useState(false);

  const navbarRemote = [
    md_breakpoint && showNavbar && !sm_breakpoint ? styles.larger_md : '',
    md_breakpoint && !showNavbar && !sm_breakpoint ? styles.smaller_md : '',
    sm_breakpoint && showNavbar && !md_breakpoint ? styles.visible_sm : '',
    sm_breakpoint && !showNavbar && !md_breakpoint ? styles.hidden_sm : ''
  ].filter(Boolean).join(' ');
    
  console.log(showNavbar);
  return (      
    <aside 
      className={`
        xl:p-10 xl:static xl:w-6/20
        lg:w-7/23 lg:static lg:p-5 lg:py-9 lg:rounded-xl lg:shadow-none
        md:w-1/7 md:absolute md:z-10 md:rounded-none md:rounded-e-xl md:min-h-[1080px] md:shadow-md
        py-3 px-5 w-full rounded-2xl absolute bg-white min-h-[844px] shadow-none
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
      <div className="md:mt-9 mt-3">
        <div>
          <TheMenuItem icon="docs-icon" text="Мои договоры" to="/agreements" />
          <TheMenuItem icon="requests-icon" text="Заявки" to="/requests" />
          <TheMenuItem icon="contacts-icon" text="Контакты" to="/contacts" />
        </div>
        
        <div className="xl:mt-96 lg:mt-64 md:mt-132">
          <TheMenuItem  icon="user-icon" text="Профиль" to="/user" />
          <TheMenuItem icon="logout-icon" text="Выйти" to="/logout" />
        </div>
      </div>
    </aside>
  )
}
export default TheNavbar;