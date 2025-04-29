import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { hideNavbar } from '@/store/slices/navbarSlice';
import { useLocation } from 'react-router-dom';
import { toggleTabs  } from '@/store/slices/tabsSlice';
import { isNew, requestStatusFalse } from '@/store/slices/requestsSlice';
import useMediaQueries from '@/hooks/useMediaQueries'; 

import NewRequestPage from '@/pages/NewRequestPage/NewRequestPage';
import TheTabsComponent from '@/components/TheTabsComponent/TheTabsComponent';
import TheDocsListComponent from '@/components/TheDocsListComponent/TheDocsListComponent';

const RequestsPage = () => {
  const sprite_path = './src/assets/images/i.svg';
  const showNavbar = useSelector((state) => state.navbar.showNavbar);
  const isNewRequest = useSelector(isNew);
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
    dispatch(toggleTabs({
      type: isNewRequest ? 'newRequest' : 'requests', 
      breakpoint: sm_breakpoint ? 'sm-breakpoint' : ''
    } ));
  }, [dispatch]);
  const location = useLocation();
  useEffect(() => {
    dispatch(requestStatusFalse());
  }, [location]);

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
      {
        isNewRequest ? 
          <NewRequestPage />
          : 
          <div className="lg:text-base md:text-base text-sm">
            <div className="flex md:justify-start justify-center">
              {
                isNewRequest && sm_breakpoint ? '' :
                <p className="
                  xl:mt-0 
                  lg:px-6 lg:text-[26px] lg:mt-4
                  md:px-2 md:mt-9
                  text-xl font-bold mt-5
                ">
                  Заявки
                </p>
              }
              {
                isNewRequest && !sm_breakpoint ? 
                <button 
                  className="btn-text ms-auto me-4 lg:mt-0 md:mt-9 flex"
                >
                  <svg
                    className="icon"
                  >
                    <use href={`${sprite_path}#back-icon`} />
                  </svg>
                  
                  Назад
                </button>
                : ''
              }
            </div>
            <TheTabsComponent />
            <TheDocsListComponent titles="requests" breakpoint={sm_breakpoint ? 'sm-breakpoint' : ''} />
          </div>
      }
    </section>
  )
}
export default RequestsPage;