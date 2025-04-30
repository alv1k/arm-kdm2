import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { hideNavbar } from '@/store/slices/navbarSlice';
import { toggleTabs  } from '@/store/slices/tabsSlice';
import { isShowDetails, selectedAgreement, agreementsStoreList, showDetails, hideDetails, setAgreementsList, fetchAgreementsList, isShowCountersModal, selectAgreementsLoading } from '@/store/slices/agreementsSlice';
import useMediaQueries from '@/hooks/useMediaQueries'; 
import styles from './AgreementsPage.module.css';

import AgreementItem from '@/components/TheAgreementItem/TheAgreementItem';
import TheTabsComponent from '@/components/TheTabsComponent/TheTabsComponent';
import TheDocsListComponent from '@/components/TheDocsListComponent/TheDocsListComponent'

const AgreementsPage = () => {
  const sprite_path = './src/assets/images/i.svg';
  const showNavbar = useSelector((state) => state.navbar.showNavbar);
  const isDetailsShown = useSelector(isShowDetails);
  const showCountersModal = useSelector(isShowCountersModal);
  const agreementsList = useSelector(agreementsStoreList);
  const currentAgreement = useSelector(selectedAgreement);
  const loading = useSelector(selectAgreementsLoading);
  

  const { xl_breakpoint, lg_breakpoint, md_breakpoint, sm_breakpoint } = useMediaQueries();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAgreementsList());
    dispatch(toggleTabs({
      type: isDetailsShown ? 'singleAgrement' : 'agreementsList', 
      breakpoint: sm_breakpoint ? 'sm-breakpoint' : ''
    } ));
  }, [dispatch]);

  const prevLoading = useRef(loading);
  useEffect(() => {
    if (prevLoading.current && !loading) {
      console.log('Загрузка ТОЛЬКО ЧТО завершилась');
      // Действия после завершения загрузки
    }
    prevLoading.current = loading;
  }, [loading]);
  
  
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
        md:w-full md:px-6 md:ms-8 md:rounded-xl md:shadow-lg
        w-full px-5 ms-0 bg-white shadow-none
        ${isDetailsShown ? 'h-fit' : ''}
      `}
      onClick={sideClick}
    >
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
              className="btn-text ms-auto me-4 lg:mt-0 md:mt-9 flex"
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
        {
          isDetailsShown ? '' :
          <TheTabsComponent titles='agreementsList' breakpoint={sm_breakpoint ? 'sm-breakpoint' : ''}/>
        }
        {
          <div className="md:pt-4 pt-5">
            {
              !isDetailsShown && !loading ?
                agreementsList.map((agreement) => (
                  <div key={agreement.Код} onClick={() => handleAgreementClick(agreement)}>
                    <AgreementItem 
                      key={agreement.Код}
                      number={agreement.Договор}
                      date={agreement.date}
                      address={agreement.Договор}
                      summ={agreement.Сумма}
                      data={agreement.ОбъектыАренды}
                    />
                  </div>
                ))
              : loading ? 
              <div className="p-14">
                Загрузка...
              </div>
              :
                currentAgreement.map((agreement) => (
                  <div key={agreement.Код} >
                    <AgreementItem 
                      key={agreement.Код}
                      number={agreement.Договор}
                      date={agreement.date}
                      address={agreement.Договор}
                      summ={agreement.Сумма}
                    />
                  </div>
                ))
            }
          </div>
        }
        
        {
          isDetailsShown && !showCountersModal ? 
          <div>
            <TheTabsComponent titles='singleAgreement' />
            <TheDocsListComponent />
          </div>
          : ''
        }
      </div>
    </section>
  )
}
export default AgreementsPage;