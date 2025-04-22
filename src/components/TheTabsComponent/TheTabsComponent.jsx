import React, { useEffect }  from 'react';
import { useSelector, useDispatch } from 'react-redux'; 
import useMediaQueries from '@/hooks/useMediaQueries'; 
import { isShowDetails } from '@/store/agreementsSlice';
import { toggleTabs, setSelectedTab, selectedTab, agreementsSelectedTab, agreementSelectedTab, requestsSelectedTab, setAgreementsSelectedTab, setAgreementSelectedTab, setRequestsSelectedTab } from '@/store/tabsSlice';

const TheTabsComponent = (props) => {
  const sprite_path = './src/assets/images/i.svg';
  const { xl_breakpoint, lg_breakpoint, md_breakpoint, sm_breakpoint } = useMediaQueries();
  const showAgreementDetails = useSelector(isShowDetails);
  const tabs = useSelector((state) => state.tabs_slice.tabs);

  const dispatch = useDispatch();
  const setTab = (tab) => {
    dispatch(setSelectedTab(tab))
  }
  const currentRoute = window.location.pathname;
  
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
      md:mt-7 md:rounded-t-xl md:gap-10 md:justify-start
      flex justify-between w-full gap-0 mt-11 bg-[#FAFBFD] border-b-1 border-slate-300 rounded-t-md font-medium
    ">
        {tabs.map((tab, index) => (
          <div 
            key={index} 
            className={`
              text-center
              lg:px-10 lg:block
              md:px-4 md:flex md:items-center
              py-4 cursor-pointer bg-item-default rounded-t-xl 
              ${sm_breakpoint ? 'w-1/2' : ''}
              ${currentTab && currentTab.title_en === tab.title_en ? 'text-[#203887] border-b border-b-[#6374AD]' : ''}
              ${currentTab && currentTab.title_en === tab.title_en ? 'text-[#203887] border-b border-b-[#6374AD]' : ''}
            `}
            onClick={() => {setTab(tab)}}
          >
            {
              md_breakpoint ? 
              <svg
                className="w-[10px] h-[10px] stroke-[#232323] me-2"
              >
                <use href={`${sprite_path}#plus-icon`} />
              </svg> : ''
            }
            { tab.title_ru }
          </div>
        ))}
    </div>
  )
}
export default TheTabsComponent;

