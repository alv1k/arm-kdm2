import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { hideNavbar } from '@/store/slices/navbarSlice';
import { useLocation } from 'react-router-dom';
import { toggleTabs, setRequestsSelectedTab } from '@/store/slices/tabsSlice';
import { isNew, requestStatusFalse, fetchRequestsList, requestEditFalse } from '@/store/slices/requestsSlice';
import { fetchAgreementsList } from '@/store/slices/agreementsSlice';
import useMediaQueries from '@/hooks/useMediaQueries'; 

import NewRequestPage from '@/pages/NewRequestPage/NewRequestPage';
import TheTabsComponent from '@/components/TheTabsComponent/TheTabsComponent';
import TheDocsListComponent from '@/components/TheDocsListComponent/TheDocsListComponent';
import Page404 from '@/pages/Page404/Page404';
import TheSkeleton from '@/components/TheSkeleton/TheSkeleton';
import { downloadBase64PDF } from '@/utils/fileDownload';

const RequestsPage = () => {
  const sprite_path = './src/assets/images/i.svg';
  const showNavbar = useSelector((state) => state.navbar.showNavbar);
  const page404 = useSelector((state) => state.requests_slice.page404);
  const isEditRequest = useSelector((state) => state.requests_slice.isEditRequest);
  const isLoading = useSelector((state) => state.loading_slice.isLoading);
  const isNewRequest = useSelector(isNew);
  
  const { xl_breakpoint, lg_breakpoint, md_breakpoint, sm_breakpoint } = useMediaQueries();
  const dispatch = useDispatch();
  const sideClick = (event) => {
    event.stopPropagation();
    if (showNavbar) {
      dispatch(hideNavbar());
    }
  };
    
  useEffect(() => {
    dispatch(toggleTabs({
      type: isNewRequest ? 'newRequest' : 'requests', 
      breakpoint: sm_breakpoint ? 'sm-breakpoint' : ''
    } ));
    dispatch(fetchAgreementsList());
    dispatch(fetchRequestsList());
  }, [dispatch]);
  const location = useLocation();
  useEffect(() => {
    dispatch(requestEditFalse());    
    dispatch(requestStatusFalse());  
  }, [location]);  
  
  return (
    <section 
      className={`
        xl:ml-10 xl:px-10 xl:py-10 xl:rounded-x
        lg:ml-8 lg:px-4 lg:py-5 lg:shadow-none
        md:px-6 md:ms-5 md:rounded-xl md:shadow-sm
        w-full px-5 ms-0 bg-white shadow-none overflow-auto
        ${md_breakpoint ? 'md:ms-30 md:me-4' : ''}
      `}
      onClick={sideClick}
    >
      {
        page404 ?                    
        <Page404 /> 
        : isLoading ? 
        <div className="md:pt-4 pt-5">
          <TheSkeleton width="auto" height="80px" className="mb-6" />
          <TheSkeleton width="90%" height="80px" className="mb-6" />
          <TheSkeleton width="auto" height="80px" className="mb-6" />
          <TheSkeleton width="90%" height="80px" className="mb-6" />
          <TheSkeleton width="auto" height="80px" className="mb-6" />
        </div>
        :            
        isNewRequest || isEditRequest  ? 
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
                  className="btn-text ms-auto me-4 lg:mt-0 md:mt-9 flex cursor-pointer"
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
            <TheTabsComponent titles='requests' breakpoint={sm_breakpoint ? 'sm-breakpoint' : ''}/>
            <TheDocsListComponent />
          </div>
      }
    </section>
  )
}
export default RequestsPage;