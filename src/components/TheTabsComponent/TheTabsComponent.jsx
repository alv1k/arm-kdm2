import React, { useEffect, useRef }  from 'react';
import { BrowserRouter as Router, Route, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'; 
import useMediaQueries from '@/hooks/useMediaQueries'; 
import { isShowDetails } from '@/store/slices/agreementsSlice';
import { toggleStatus } from '@/store/slices/requestsSlice';
import { isRestorePass, toggleRestorePassword } from '@/store/slices/authSlice';
import { requestsSelectedTab, setAgreementsSelectedTab, setAgreementSelectedTab, setRequestsSelectedTab, setLoginSelectedTab } from '@/store/slices/tabsSlice';

const TheTabsComponent = (props) => {
  const sprite_path = './src/assets/images/i.svg';
  const { xl_breakpoint, lg_breakpoint, md_breakpoint, sm_breakpoint } = useMediaQueries();
  const showAgreementDetails = useSelector(isShowDetails);
  const selectedRequest = useSelector(requestsSelectedTab);
  // const tabs = useSelector((state) => state.tabs_slice.tabs);

  const agreementsTabs = useSelector((state) => state.tabs_slice.agreementsTabs);
  const agreementTabs = useSelector((state) => state.tabs_slice.agreementTabs);
  const requestsTabs = useSelector((state) => state.tabs_slice.requestsTabs);
  const loginTabs = useSelector((state) => state.tabs_slice.loginTabs);
  const isRestorePassword = useSelector(isRestorePass);
 
  
  let calculateTabs = () => {
    return props.titles == 'agreementsList' ? agreementsTabs : props.titles == 'singleAgreement' ? agreementTabs : props.titles == 'requests' ? requestsTabs : loginTabs
  }
  let tabs = calculateTabs();
  
  const location = useLocation();
  const currentRoute = location.pathname;  

  const dispatch = useDispatch();
  const handleTabAction = (tab) => {
    if (currentRoute == '/agreements' && showAgreementDetails) {
      dispatch(setAgreementsSelectedTab(tab))
    } else if (currentRoute == '/agreements') {
      dispatch(setAgreementSelectedTab(tab))
    } else if (currentRoute == '/requests') {
      dispatch(setRequestsSelectedTab(tab))
    } else if (currentRoute == '/login') {
      dispatch(setLoginSelectedTab(tab))
    }
  }
  
  const currentTab = useSelector((state) => state.tabs_slice.selectedTab);
  
  // useEffect(() => {    
  //   if (currentRoute === '/agreements' && showAgreementDetails) {
  //     console.log('Agreements details view');
  //     dispatch(setAgreementSelectedTab({title_en: 'bills', title_ru: 'Счета'}));
  //   }
  // }, [currentRoute, showAgreementDetails, dispatch]);

  // useEffect(() => {
  //   if (currentRoute === '/requests') {
  //     console.log('Requests route');
  //     const tab = sm_breakpoint 
  //       ? { title_en: 'my_requests', title_ru: 'Мои заявки' }
  //       : { title_en: 'all_requests', title_ru: 'Все' };
  //     dispatch(setRequestsSelectedTab(tab));
  //   }
  // }, [currentRoute, sm_breakpoint, dispatch]);

  // useEffect(() => {
  //   if (!['/login', '/agreements', '/requests'].includes(currentRoute)) {
  //     console.log('Default case');
  //     const agreementTab = (xl_breakpoint || lg_breakpoint || md_breakpoint)
  //       ? { title_en: 'all', title_ru: 'Все' }
  //       : { title_en: 'active', title_ru: 'Действующие' };
  //     dispatch(setAgreementsSelectedTab(agreementTab));
  //   }
  // }, [xl_breakpoint, lg_breakpoint, md_breakpoint, dispatch]);



  useEffect(() => {
        
    if (currentRoute === '/requests') {
      const tab = sm_breakpoint 
       ? { title_en: 'my_requests', title_ru: 'Мои заявки' }
       : { title_en: 'all_requests', title_ru: 'Все' };
      dispatch(setRequestsSelectedTab(tab));
      return;
    }
    
    if (currentRoute === '/agreements' && showAgreementDetails) {
      dispatch(setAgreementSelectedTab({title_en: 'bills', title_ru: 'Счета'}));
      return;
    } 
    
    if (currentRoute === '/agreements') {
      const agreementTab = (xl_breakpoint || lg_breakpoint || md_breakpoint)
        ? { title_en: 'all', title_ru: 'Все' }
        : { title_en: 'active', title_ru: 'Действующие' };
  
      dispatch(setAgreementsSelectedTab(agreementTab));    
    }

  }, [dispatch, currentRoute, showAgreementDetails, sm_breakpoint, xl_breakpoint, lg_breakpoint, md_breakpoint]);
  

  const handleNewRequestBtn = () => {    
    dispatch(toggleStatus())
  }
  const handleNewRequestBitrix = () => {
    let a= document.createElement('a');
    a.target= '_blank';
    a.href= 'https://b24-0l7xxi.bitrix24.site/crm_form_oa47x/';
    a.click();
  }
  
  return (
    <div className={`
      xl:mt-9 
      lg:mt-10 lg:gap-4
      md:mt-7 md:rounded-t-xl md:justify-start
      flex justify-between mt-11 bg-[#FAFBFD] border-b-1 border-slate-300 rounded-t-md font-medium overflow-auto no-scrollbar
    `}>
        {tabs.map((tab, index) => (
          <div 
            key={index} 
            className={`
              text-center
              lg:px-10 lg:block
              md:px-6 md:flex md:items-center
              py-4 px-6 cursor-pointer bg-item-default rounded-t-xl text-nowrap
              ${currentRoute == '/login' ? 'w-full justify-center' : ''}
              ${sm_breakpoint ? 'w-1/2' : ''}
              ${currentTab && currentTab.title_en === tab.title_en ? 'text-[#203887] border-b border-b-[#6374AD]' : ''}
              ${currentTab && currentTab.title_en === tab.title_en ? 'text-[#203887] border-b border-b-[#6374AD]' : ''}
            `}
            onClick={() => {handleTabAction(tab)}}
          >
            { tab.title_ru }
          </div>
        ))}
        {
          currentRoute == '/requests' ? 
          <div className="flex ms-auto">
            <div 
              className="flex items-center cursor-pointer lg:px-8 px-4 text-nowrap"
              onClick={handleNewRequestBtn}
            >
              <svg
                className="w-[10px] h-[10px] stroke-[#232323] me-2"
              >
                <use href={`${sprite_path}#plus-icon`} />
              </svg>
              Новая заявка
            </div>
            <div
              className="flex items-center cursor-pointer lg:px-8  px-4 text-nowrap"
              onClick={handleNewRequestBitrix}
            >
              <svg
                className="icon stroke-[#232323] me-2"
              >
                <use href={`${sprite_path}#bitrix-icon`} />
              </svg>
              Заявка в Битрикс24
            </div>

          </div> : ''
        }
    </div>
  )
}
export default TheTabsComponent;

