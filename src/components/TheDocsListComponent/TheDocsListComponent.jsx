import React, { useEffect }  from 'react';
import { useSelector, useDispatch } from 'react-redux'; 
import useMediaQueries from '@/hooks/useMediaQueries';
import { selectedType, isShowDetails, selectedTab } from '@/store/agreementsSlice';
import PriceFormatter from '@/components/PriceFormatter/PriceFormatter'; 

const TheDocsListComponent = () => {
  const sprite_path = './src/assets/images/i.svg';
  const { xl_breakpoint, lg_breakpoint, md_breakpoint, sm_breakpoint } = useMediaQueries();
  const showAgreementDetails = useSelector(isShowDetails);  
  const agreementType = useSelector(selectedType);
  const agreementTab = useSelector(selectedTab);
  const tabs = useSelector((state) => state.tabs_slice.tabs);
  return (
    <div className={`
      lg:grid lg:grid-cols-6
      flex p-5 bg-item-default rounded-lg mt-5
    `}>
      {
        sm_breakpoint || md_breakpoint  ? '' : 
        <div>
          <p>№ up</p>
          <p>Название счета up</p>
          <p>Дата up</p>
          <p>Сумма up</p>
        </div>
      }
      <div className="w-full">
        {
          agreementTab.title_en == 'counters' ? 
          <p className="mb-2"><span className="text-[#787C82]">Дата: </span>02.02.2026</p> : ''
        }
        {
          agreementTab.title_en == 'acts' ? 
          <div className="md:flex block">
            <div>
              <p className="mb-1">№001. Акт об оплате аренды</p>
              <p><span className="text-[#787C82]">Дата: </span>02.02.2025</p>
            </div>
            <button className="
              md:px-6 md:py-2 md:w-auto md:mt-0 md:h-fit md:ms-auto
              w-full mt-5 flex text-center justify-center btn-default py-1 
            ">
              <svg
                className="icon me-3"
              >
                <use href={`${sprite_path}#doc-icon`} />
              </svg>
              Скачать
            </button>
          </div>
          : 
          <div className="flex">
          <div className={`
            
            ${sm_breakpoint || md_breakpoint ? '' : 'flex'} 
            ${agreementTab.title_en == 'bills' ? 'text-left w-1/2' : 'md:w-2/5'}
          `}>
            {
              agreementTab.title_en == 'bills' ? 
              <div className="md:pe-3">
                <div className="mb-1">№001. Счет за аренду</div>
                <div><span className="text-[#787C82]">Дата:</span> 01.01.2025</div>
                <button className="btn-default px-6 py-2 flex mt-5 md:w-full md:justify-center">
                  <svg
                    className="icon me-3"
                  >
                    <use href={`${sprite_path}#doc-icon`} />
                  </svg>
                  Скачать
                </button>
              </div>
              :
              <div className={`${agreementTab == 'counters' ? 'md:ps-3' : ''} `}>
                <div><span className="text-[#787C82]">№ пр. учета:</span> 0000001</div>
                <div className="my-1"><span className="text-[#787C82]">№ пр. учета:</span> 0000001</div>
                <div><span className="text-[#787C82]">№ пр. учета:</span> 0000001</div>
              </div>
            }            
          </div>
          <div className={`
            w-1/2
            ${sm_breakpoint || md_breakpoint ? '' : 'flex'}
            ${agreementTab.title_en == 'bills' ? 'text-center' : 'text-left'}
          `}>
          {
            agreementTab.title_en == 'bills' ? 
            <div>
              <div className="mb-1 text-[#787C82]">Сумма:</div>
              <div className="text-red-600"><PriceFormatter amount="100000" /></div>
              <button className="btn-success px-6 py-2 mt-5 w-full">Оплатить</button>
            </div>
            :
            <div className="ms-3">
              <div>ГВС: 123.45 м3</div>
              <div className="my-1">ХВС: 123.45 м3</div>
              <div>ЭЭ: 123.45 м3</div>
            </div>
          }
          </div>
        </div>
        }
      </div>
    </div>
  )
}
export default TheDocsListComponent;