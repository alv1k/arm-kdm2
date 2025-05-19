import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { hideNavbar } from '@/store/slices/navbarSlice';
import { toggleTabs  } from '@/store/slices/tabsSlice';
import { isShowDetails, selectedAgreement, agreementsStoreList, showDetails, hideDetails, setAgreementsList, fetchAgreementsList, isShowCountersModal, isShowPaymentModal } from '@/store/slices/agreementsSlice';
import useMediaQueries from '@/hooks/useMediaQueries'; 
import TheSkeleton from '@/components/TheSkeleton/TheSkeleton';
import styles from './AgreementsPage.module.css';
import LoadingPage from '@/pages/LoadingPage/LoadingPage';
import Page404 from '@/pages/Page404/Page404';
import { showToast } from '@/utils/notify';

import AgreementItem from '@/components/TheAgreementItem/TheAgreementItem';
import TheTabsComponent from '@/components/TheTabsComponent/TheTabsComponent';
import TheDocsListComponent from '@/components/TheDocsListComponent/TheDocsListComponent'

const AgreementsPage = () => {
  const sprite_path = './src/assets/images/i.svg';
  const showNavbar = useSelector((state) => state.navbar.showNavbar);
  const isLoading = useSelector((state) => state.loading_slice.isLoading);
  const page404 = useSelector((state) => state.agreements_slice.page404);
  const isDetailsShown = useSelector(isShowDetails);
  const showCountersModal = useSelector(isShowCountersModal);
  const showPaymentModal = useSelector(isShowPaymentModal);
  const agreementsList = useSelector(agreementsStoreList);
  const currentAgreement = useSelector(selectedAgreement);

  const { xl_breakpoint, lg_breakpoint, md_breakpoint, sm_breakpoint } = useMediaQueries();
  
  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(fetchAgreementsList());
    dispatch(toggleTabs({
      type: isDetailsShown ? 'singleAgrement' : 'agreementsList', 
      breakpoint: sm_breakpoint ? 'sm-breakpoint' : ''
    } ));
  }, [dispatch]);
  useEffect(() => {
    if (isDetailsShown == true) {
      window.scrollTo(0,0);
    }
  }, [isDetailsShown])
  
  const sideClick = (event) => {
    event.stopPropagation();
    if (showNavbar) {
      dispatch(hideNavbar());
    }
  };
  const backToAgreements = () => {
    dispatch(hideDetails());
  }
  const handleAgreementClick = (data) => {
    dispatch(showDetails(data));
    dispatch(setAgreementsList(data));
  };
  const location = useLocation();
  useEffect(() => {
    dispatch(hideDetails());
  }, [location]);

  return (
    <section 
      className={`
        xl:ml-10 xl:px-10 xl:py-10 xl:rounded-x
        lg:ml-8 lg:px-4 lg:py-5 lg:shadow-none
        md:px-6 md:ms-5 md:rounded-xl md:shadow-sm
        w-full px-5 ms-0 bg-white shadow-none min-h-screen
        ${isDetailsShown ? 'h-fit' : ''}
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
      <div className="lg:text-base md:text-base text-sm">
        <div className="flex md:justify-start justify-center">
          {
            isDetailsShown && sm_breakpoint ? '' :
            <p className="
              xl:mt-0 
              lg:px-6 lg:text-[26px] lg:mt-4
              md:px-2 md:mt-9
              text-xl font-bold mt-5
            ">
              Мои договоры
            </p>
          }
          {
            isDetailsShown && !sm_breakpoint ? 
            <button 
              className="btn-text ms-auto me-4 lg:mt-0 md:mt-9 flex cursor-pointer"
              onClick={backToAgreements}
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
        {/* {
          isDetailsShown ? '' :
          <TheTabsComponent titles='agreementsList' breakpoint={sm_breakpoint ? 'sm-breakpoint' : ''}/>
        } */}
        
        <div className="md:pt-4 pt-5">
          {
            !isDetailsShown && !isLoading ?
              agreementsList.map((agreement, index) => (
                <div key={index} onClick={() => handleAgreementClick(agreement)}>
                  <AgreementItem
                    id={agreement.id}
                    number={agreement.number}
                    date={agreement.date}
                    debt={agreement.debts}
                    objects={agreement.objects}
                    name={agreement.name}
                    monthly={agreement.monthly}
                  />
                </div>
              ))              
              :
              currentAgreement.map((agreement, index) => (
                <div key={index} >
                  <AgreementItem
                    id={agreement.id}
                    number={agreement.number}
                    date={agreement.date}
                    debt={agreement.debts}
                    objects={agreement.objects}
                    name={agreement.name}
                    monthly={agreement.monthly}
                  />
                </div>
              ))
          }
        </div>        
        
        {
          isDetailsShown && !showCountersModal && !showPaymentModal ? 
          <div>
            <TheTabsComponent titles='singleAgreement' />
            <TheDocsListComponent />
          </div>
          : ''
        }
      </div>
    }
    </section>
  )
}
export default AgreementsPage;