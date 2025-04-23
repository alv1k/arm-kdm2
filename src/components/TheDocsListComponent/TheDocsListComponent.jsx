import React, { useEffect }  from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import useMediaQueries from '@/hooks/useMediaQueries';
import { selectedType, isShowDetails } from '@/store/agreementsSlice';
import { selectedTab } from '@/store/tabsSlice';
import PriceFormatter from '@/components/PriceFormatter/PriceFormatter'; 
import styles from './TheDocsListComponent.module.css'

const TheDocsListComponent = () => {
  const sprite_path = './src/assets/images/i.svg';
  const { xl_breakpoint, lg_breakpoint, md_breakpoint, sm_breakpoint } = useMediaQueries();
  const showAgreementDetails = useSelector(isShowDetails);  
  const agreementType = useSelector(selectedType);
  const currentTab = useSelector(selectedTab);
  const tabs = useSelector((state) => state.tabs_slice.tabs);
  
  const location = useLocation();
  const currentRoute = location.pathname;

  return (
    <div className={`
      flex bg-[#FAFBFD] rounded-lg mt-5
      ${sm_breakpoint || md_breakpoint ? 'p-5' : 'p-0'}
    `}>
      {
        sm_breakpoint || md_breakpoint  ? 
        <div className="w-full">
          {
            currentTab && currentTab.title_en == 'counters' ? 
            <p className="mb-2"><span className="text-[#787C82]">Дата: </span>02.02.2026</p> : ''
          }
          {
            currentTab && (currentTab.title_en == 'acts' || currentTab.title_en == 'my_requests' || currentTab.title_en == 'all_requests') ? 
            <div className="md:flex block">
              <div>
                <p className="mb-1">
                  {
                    currentTab.title_en == 'acts' ? '№001. Акт об оплате аренды' : '№001. Название помещения'
                  }                  
                </p>
                {
                  currentTab.title_en == 'acts' ? '' :
                  <p className="mb-1">
                    <span className="text-[#787C82]">
                      Тема:&nbsp;
                    </span>
                    Авария
                  </p>
                }
                <div className="flex">
                  <p>
                    <span className="text-[#787C82]">
                      Дата:&nbsp;
                    </span>
                    02.02.2025
                  </p>
                  <div>
                    {
                      currentTab.title_en == 'acts' ? '' :
                      <div className="ms-4">
                        <span className="text-[#787C82]">
                          Статус:
                        </span>
                        <span className="text-green-700"> 
                          Завершен
                        </span>
                      </div>
                    }
                  </div>
                </div>
              </div>
              <button className={`
                md:px-6 md:py-2 md:w-auto md:mt-0 md:h-fit md:ms-auto
                w-full mt-5 flex text-center justify-center  py-1 
                ${currentTab.title_en == 'acts' ? 'btn-default' : 'btn-success'}
              `}>
                {
                  currentTab.title_en == 'acts' ? 
                  <div>
                    <svg
                      className="icon me-3"
                    >
                      <use href={`${sprite_path}#doc-icon`} />
                    </svg> 
                    <span>Скачать</span>
                  </div>
                   : 'Открыть'
                }
                
              </button>
            </div>
            : 
            <div className="flex">
            <div className={`
              
              ${sm_breakpoint || md_breakpoint ? '' : 'flex'} 
              ${currentTab && currentTab.title_en == 'bills' ? 'text-left w-1/2' : 'md:w-2/5'}
            `}>
              {
                currentTab && currentTab.title_en == 'bills' ? 
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
                <div className={`${currentTab == 'counters' ? 'md:ps-3' : ''} `}>
                  <div><span className="text-[#787C82]">№ пр. учета:</span> 0000001</div>
                  <div className="my-1"><span className="text-[#787C82]">№ пр. учета:</span> 0000001</div>
                  <div><span className="text-[#787C82]">№ пр. учета:</span> 0000001</div>
                </div>
              }            
            </div>
            <div className={`
              w-1/2
              ${sm_breakpoint || md_breakpoint ? '' : 'flex'}
              ${currentTab && currentTab.title_en == 'bills' ? 'text-center' : 'text-left'}
            `}>
            {
              currentTab && currentTab.title_en == 'bills' ? 
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
        : 
        <table className="rounded-lg border-separate border-spacing-0 overflow-hidden w-full">
          <thead className="bg-item-active bg-red-900 px-5">
            <tr align="center" className="text-center justify-center">
              <th>
                <div className="flex items-center">
                  <span className="inline">№</span>
                  <svg
                    className={`${styles.icon} ms-2`}
                  >
                    <use href={`${sprite_path}#chevron-down`} />
                  </svg>
                </div>
              </th>
              <th>
                <div className="flex items-center">
                  <span className="text-nowrap">
                    Название
                    {
                      currentTab.title_en == 'acts' ?
                      ' счета' : ' помещения'
                    }
                  </span>
                  <svg
                    className={`${styles.icon} ms-2`}
                    >
                    <use href={`${sprite_path}#chevron-down`} />
                  </svg>
                </div>
              </th>
              {
                currentTab.title_en == 'acts' ? '' :
                <th>
                  <div className="flex items-center">
                    <span className="text-nowrap">Тема обращения</span>
                    <svg
                      className={`${styles.icon} ms-2`}
                      >
                      <use href={`${sprite_path}#chevron-down`} />
                    </svg>
                  </div>
                </th>
              }
              <th>
                <div className="flex items-center">
                  <span>Дата</span>
                  <svg
                    className={`${styles.icon} ms-2`}
                    >
                    <use href={`${sprite_path}#chevron-down`} />
                  </svg>
                </div>
              </th>
              <th align="center">
                <div className="flex items-center">
                  <span>
                    {
                      currentTab.title_en == 'acts' ?
                      'Сумма' : 'Статус'
                    }
                  </span>
                  <svg
                    className={`${styles.icon} ms-2`}
                    >
                    <use href={`${sprite_path}#chevron-down`} />
                  </svg>
                </div>
              </th>
              {
                currentTab.title_en == 'acts' ?
                <th></th> : ''
              }
              <th></th>
            </tr>
          </thead>
          <tbody className="bg-item-default ">
            <tr>
              <td>001</td>
              <td>
                {
                  currentTab.title_en == 'acts' ?
                  'Счет за аренду' : 'Название помещения'
                }
              </td>
              {
                currentTab.title_en == 'acts' ?
                '' : 
                <td>
                  Авария
                </td>
              }
              <td>01.01.2025</td>
              <td>
                {
                  currentTab.title_en == 'acts' ?
                  <PriceFormatter amount="100000" /> : <span className="text-green-600">Завершен</span>
                }
              </td>
              {
                currentTab.title_en == 'acts' ?
                <td className="ms-auto">                
                  <button className="btn-default px-6 py-2 flex mt-5 md:w-full md:justify-center">
                      <svg
                        className="icon me-3"
                      >
                        <use href={`${sprite_path}#doc-icon`} />
                      </svg>
                      Скачать
                    </button>
                </td> : ''
              }
              <td>
                <button className="btn-success px-6 py-2 mt-5 w-full">Оплатить</button>
              </td>
            </tr>
          </tbody>
        </table>
      }
      
    </div>
  )
}
export default TheDocsListComponent;