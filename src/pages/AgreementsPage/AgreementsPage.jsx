import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { hideNavbar } from '@/store/navbarSlice';
import { toggleTabs  } from '@/store/tabsSlice';
import { isShowDetails, selectedAgreement, agreementsStoreList, showDetails, hideDetails, setAgreementsList } from '@/store/agreementsSlice';
import useMediaQueries from '@/hooks/useMediaQueries'; 
import styles from './AgreementsPage.module.css';

import Header from '@/components/TheHeader/TheHeader';
import TheNavbar from '@/components/TheNavbar/TheNavbar';
import AgreementItem from '@/components/TheAgreementItem/TheAgreementItem';
import TheTabsComponent from '@/components/TheTabsComponent/TheTabsComponent';
import TheDocsListComponent from '@/components/TheDocsListComponent/TheDocsListComponent'


const AgreementsPage = () => {
  const sprite_path = './src/assets/images/i.svg';
  const showNavbar = useSelector((state) => state.navbar.showNavbar);
  const isDetailsShown = useSelector(isShowDetails);
  const agreementsList = useSelector(agreementsStoreList);
  const currentAgreement = useSelector(selectedAgreement);
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
    dispatch(toggleTabs(isDetailsShown ? 'singleAgrement' : 'agreementsList'));
  }, [dispatch]);
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
    <main className={[styles.mainLogin, sm_breakpoint || md_breakpoint ? 'h-[500px]' : 'min-height'].join(' ')}>
      <Header />
      <div className="xl:p-10 lg:p-5 md:py-5 flex">        
        {
          md_breakpoint && (
            <div className="w-1/7"></div>
          )          
        }
        <TheNavbar />
        
        <section 
          className="
            xl:ml-10 xl:px-10 xl:py-10 xl:rounded-x
            lg:ml-8 lg:px-4 lg:py-5 lg:shadow-none
            md:w-full md:px-6 md:ms-5 md:rounded-xl md:min-h-[1080px] md:shadow-lg
            w-full px-5 ms-0 bg-white min-h-[844px] shadow-none
          "
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
            <TheTabsComponent titles='agreementsList' />
            {
              <div className="md:pt-4 pt-5">
                {
                  !isDetailsShown ?
                    agreementsList.map((agreement) => (
                      <div key={agreement.num} onClick={() => handleAgreementClick(agreement)}>
                        <AgreementItem 
                          key={agreement.num}
                          number={agreement.num}
                          date={agreement.date}
                          address={agreement.address}
                          summ={agreement.summ}
                        />
                      </div>
                    ))
                  :
                    currentAgreement.map((agreement) => (
                      <div key={agreement.num} >
                        <AgreementItem 
                          key={agreement.num}
                          number={agreement.num}
                          date={agreement.date}
                          address={agreement.address}
                          summ={agreement.summ}
                        />
                      </div>
                    ))
                }
              </div>
            }
            
            {
              isDetailsShown ? 
              <div>
                <TheTabsComponent titles='singleAgreement' />
                <TheDocsListComponent />
              </div>
              : ''
            }
          </div>
        </section>
      </div>
    </main>
  )
}
export default AgreementsPage;