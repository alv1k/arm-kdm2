import React, { useEffect }  from 'react';
import { useSelector, useDispatch } from 'react-redux'; 
import useMediaQueries from '@/hooks/useMediaQueries'; 
import { setType, selectedType, isShowDetails, showDetails, setTab, selectedTab } from '@/store/agreementsSlice';

const TheTabsComponent = (props) => {
  const sprite_path = './src/assets/images/i.svg';
  const { xl_breakpoint, lg_breakpoint, md_breakpoint, sm_breakpoint } = useMediaQueries();
  const showAgreementDetails = useSelector(isShowDetails);  
  const agreementType = useSelector(selectedType);
  const agreementTab = useSelector(selectedTab);
  const tabs = useSelector((state) => state.tabs_slice.tabs);
  
  const setAgreementsType = (type) => {
    dispatch(setType(type));
  } 
  const setAgreementDetailsTab = (tab) => {
    dispatch(setTab(tab));
  }
  const dispatch = useDispatch();
  useEffect(() => {
    if (xl_breakpoint) {
      dispatch(setType({title_en: 'all', title_ru: 'Все'}));
    } else if (lg_breakpoint) {
      dispatch(setType({title_en: 'all', title_ru: 'Все'}));
    } else if (md_breakpoint) {
      dispatch(setType({title_en: 'all', title_ru: 'Все'}));
    } else if (sm_breakpoint) {
      dispatch(setType({title_en: 'active', title_ru: 'Действующие'}));
    }
  }, [xl_breakpoint, lg_breakpoint, md_breakpoint, sm_breakpoint, dispatch]);

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
              md:px-4 md:flex
              py-4 cursor-pointer bg-item-default rounded-t-xl
              ${sm_breakpoint ? 'w-1/2' : ''}
              ${agreementTab.title_en === tab.title_en ? 'text-[#203887] border-b border-b-[#6374AD]' : ''}
              ${agreementType.title_en === tab.title_en ? 'text-[#203887] border-b border-b-[#6374AD]' : ''}
            `}
            onClick={() => {
                if (showAgreementDetails) setAgreementDetailsTab(tab) 
                else setAgreementsType(tab)
            }}
          >
            {
              md_breakpoint ? 
              <svg
                className="icon me-2"
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