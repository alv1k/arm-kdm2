import React, { useEffect }  from 'react';
import { useSelector, useDispatch } from 'react-redux'; 
import useMediaQueries from '../../hooks/useMediaQueries'; 
import { setType, selectedType, isShowDetails, showDetails, setTab, selectedTab } from '../../store/agreementsSlice';

const TheTabsComponent = (props) => {
  const { xl_breakpoint, lg_breakpoint, md_breakpoint, sm_breakpoint } = useMediaQueries();
  const showAgreementDetails = useSelector(isShowDetails);  
  const agreementType = useSelector(selectedType);
  const agreementTab = useSelector(selectedTab);  
  
  const setAgreementsType = (type) => {
    dispatch(setType(type));
  } 
  const setAgreementDetailsTab = (tab) => {
    dispatch(setTab(tab));
  }
  let titles = props.titles
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
    (true) &&         
      <div className="
        xl:mt-9
        lg:mt-10 lg:gap-4
        md:mt-7 md:rounded-t-xl md:gap-10
        flex mt-6 bg-[#FAFBFD] border-b-1 border-slate-300 rounded-t-md font-medium
      ">
          {titles.map((tab, index) => (
            <div 
              key={index} 
              className={`
                lg:px-10
                md:px-4
                px-10 py-4 cursor-pointer bg-item-default rounded-t-xl
                ${agreementTab.title_en === tab.title_en ? 'text-[#203887] border-b border-b-[#6374AD]' : ''}
                ${agreementType.title_en === tab.title_en ? 'text-[#203887] border-b border-b-[#6374AD]' : ''}
              `}
              onClick={() => {
                  if (showAgreementDetails) setAgreementDetailsTab(tab) 
                  else setAgreementsType(tab)
              }}
            >
              { tab.title_ru }
            </div>
          ))}
      </div>      
  )
}
export default TheTabsComponent;