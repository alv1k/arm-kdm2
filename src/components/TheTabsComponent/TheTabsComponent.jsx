import React, { useEffect }  from 'react';
import { BrowserRouter as Router, Route, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'; 
import useMediaQueries from '@/hooks/useMediaQueries'; 
import { isShowDetails } from '@/store/agreementsSlice';
import { toggleTabs, setSelectedTab, selectedTab, agreementsSelectedTab, agreementSelectedTab, requestsSelectedTab, setAgreementsSelectedTab, setAgreementSelectedTab, setRequestsSelectedTab } from '@/store/tabsSlice';

const TheTabsComponent = (props) => {
  const sprite_path = './src/assets/images/i.svg';
  const { xl_breakpoint, lg_breakpoint, md_breakpoint, sm_breakpoint } = useMediaQueries();
  const showAgreementDetails = useSelector(isShowDetails);
  // const tabs = useSelector((state) => state.tabs_slice.tabs);

  const agreementsTabs = useSelector((state) => state.tabs_slice.agreementsTabs);
  const agreementTabs = useSelector((state) => state.tabs_slice.agreementTabs);
  const requestsTabs = useSelector((state) => state.tabs_slice.requestsTabs);

  let calculateTabs = () => {
    return props.titles == 'agreementsList' ? agreementsTabs : props.titles == 'singleAgreement' ? agreementTabs : requestsTabs
  }
  let tabs = calculateTabs();

  const dispatch = useDispatch();
  const setTab = (tab) => {
    dispatch(setSelectedTab(tab))
  }
  const location = useLocation();
  const currentRoute = location.pathname;
  
  useEffect(() => {
    if (currentRoute == '/agreements' && showAgreementDetails) {
      dispatch(setSelectedTab({title_en: 'bills', title_ru: 'Счета'}));
    } else if (currentRoute == '/requests') {
      dispatch(setSelectedTab({ title_en: 'all', title_ru: 'Все' }));
    } else {
      if (xl_breakpoint || lg_breakpoint || md_breakpoint) {
        dispatch(setSelectedTab({ title_en: 'all', title_ru: 'Все' }));
      } else if (sm_breakpoint) {
        dispatch(setSelectedTab({ title_en: 'active', title_ru: 'Действующие' }));
      }
    }
    
  }, [showAgreementDetails, xl_breakpoint, lg_breakpoint, md_breakpoint, sm_breakpoint, dispatch]);

  const currentTab = useSelector((state) => state.tabs_slice.selectedTab);
  
  return (
    <div className="
      xl:mt-9
      lg:mt-10 lg:gap-4
      md:mt-7 md:rounded-t-xl md:justify-start
      flex justify-between mt-11 b bg-[#FAFBFD] border-b-1 border-slate-300 rounded-t-md font-medium overflow-auto no-scrollbar
    ">
        {tabs.map((tab, index) => (
          <div 
            key={index} 
            className={`
              text-center
              lg:px-10 lg:block
              md:px-6 md:flex md:items-center
              py-4 px-6 cursor-pointer bg-item-default rounded-t-xl 
              ${sm_breakpoint ? 'w-1/2' : ''}
              ${currentTab && currentTab.title_en === tab.title_en ? 'text-[#203887] border-b border-b-[#6374AD]' : ''}
              ${currentTab && currentTab.title_en === tab.title_en ? 'text-[#203887] border-b border-b-[#6374AD]' : ''}
            `}
            onClick={() => {setTab(tab)}}
          >
            { tab.title_ru }
          </div>
        ))}
        {
          currentRoute == '/requests' ? 
          <div 
            className="flex items-center cursor-pointer ms-auto px-8"
            onClick={() => {console.log('new request btn')}}
          >
            <svg
              className="w-[10px] h-[10px] stroke-[#232323] me-2"
            >
              <use href={`${sprite_path}#plus-icon`} />
            </svg>
            Новая заявка
          </div> : ''
        }
    </div>
  )
}
export default TheTabsComponent;

