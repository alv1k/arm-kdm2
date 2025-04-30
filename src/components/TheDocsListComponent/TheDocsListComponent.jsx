import React from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import useMediaQueries from '@/hooks/useMediaQueries';
import { selectedTab } from '@/store/slices/tabsSlice';
import PriceFormatter from '@/components/PriceFormatter/PriceFormatter'; 
import styles from './TheDocsListComponent.module.css'

const TheDocsListComponent = () => {
  const sprite_path = './src/assets/images/i.svg';
  const { xl_breakpoint, lg_breakpoint, md_breakpoint, sm_breakpoint } = useMediaQueries();
  const currentTab = useSelector(selectedTab);
    
  const location = useLocation();
  const currentRoute = location.pathname;

  return (
    <div className={`
      flex bg-[#FAFBFD] rounded-lg my-5
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
                    currentTab && currentTab.title_en == 'acts' ? '№001. Акт об оплате аренды' : '№001. Название помещения'
                  }                  
                </p>
                {
                  currentTab && currentTab.title_en == 'acts' ? '' :
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
                      currentTab && currentTab.title_en == 'acts' ? '' :
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
                w-full mt-5 flex text-center justify-center py-1
                ${currentTab && currentTab.title_en == 'acts' ? 'btn-default' : 'btn-success'}
              `}>
                {
                  currentTab && currentTab.title_en == 'acts' ? 
                  <div className="flex">
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
            <div className="grid grid-cols-2 gap-3">
            <div className={`
              
              ${sm_breakpoint || md_breakpoint ? '' : 'flex'} 
              ${currentTab && currentTab.title_en == 'bills' ? 'text-left' : 'md:w-2/5'}
            `}>
              {
                currentTab && currentTab.title_en == 'bills' ? 
                <div className="md:pe-3">
                  <div className="mb-1">№001. Счет за аренду</div>
                  <div><span className="text-[#787C82]">Дата:</span> 01.01.2025</div>
                  <button className="btn-default px-6 py-2 flex mt-5 w-full justify-center">
                    <svg
                      className={`icon me-3`}
                    >
                      <use href={`${sprite_path}#doc-icon`} />
                    </svg>
                    Скачать
                  </button>
                </div>
                :
                <div className={`${currentTab && currentTab == 'counters' ? 'md:ps-3' : ''} `}>
                  <div className="text-nowrap"><span className="text-[#787C82]">№ пр. учета:</span> 0000001</div>
                  <div className="text-nowrap my-1"><span className="text-[#787C82]">№ пр. учета:</span> 0000001</div>
                  <div className="text-nowrap"><span className="text-[#787C82]">№ пр. учета:</span> 0000001</div>
                </div>
              }            
            </div>
            <div className={`
              
              ${sm_breakpoint || md_breakpoint ? '' : 'flex'}
              ${currentTab && currentTab.title_en == 'bills' ? 'text-center' : 'text-left'}
            `}>
            {
              currentTab && currentTab.title_en == 'bills' ? 
              <div className="h-full justify-baseline flex flex-col">
                <div className="mb-1 text-[#787C82]">Сумма:</div>
                <div className="text-red-600"><PriceFormatter amount="100000" /></div>
                <button className="btn-success px-6 py-2 mt-auto w-full">Оплатить</button>
              </div>
              :
              <div className="ms-3">
                <div>ГВС: 123.45 м3</div>
                <div className="my-1">ХВС: 123.45 м3</div>
                <div>{sm_breakpoint ? 'ЭЭ' : 'Электроэнегрия'}: 123.45 м3</div>
              </div>
            }
            </div>
          </div>
          }
        </div>
        : 
        // <div className="grid grid-cols-[100px_minmax(230px,_1fr)_minmax(210px,_1fr)_minmax(100px,_1fr)_minmax(100px,_1fr)_minmax(100px,_1fr)]">
        //   <div>
        //     <div className="flex items-center ps-8">
        //       <span className="inline">№</span>
        //       <svg
        //         className={`${styles.icon} ms-2`}
        //       >
        //         <use href={`${sprite_path}#chevron-down`} />
        //       </svg>
        //     </div>
        //     <div className="flex items-center">
        //       <span className="text-nowrap">
        //         Название
        //         {/* currentTab && (currentTab.title_en == 'acts' || currentTab.title_en == 'my_requests' || currentTab.title_en == 'all_requests') ?  */}
        //         {
        //           currentTab && currentTab.title_en == 'acts' ?
        //           ' счета' : ' помещения'
        //         }
        //       </span>
        //       <svg
        //         className={`${styles.icon} ms-2`}
        //         >
        //         <use href={`${sprite_path}#chevron-down`} />
        //       </svg>
        //     </div>
        //     <div className="flex items-center">
        //       <span className="text-nowrap">Тема обращения</span>
        //       <svg
        //       className={`${styles.icon} ms-2`}
        //       >
        //         <use href={`${sprite_path}#chevron-down`} />
        //       </svg>
        //     </div>
        //     <div className="flex items-center">
        //       <span>Дата</span>
        //       <svg
        //         className={`${styles.icon} ms-2`}
        //         >
        //         <use href={`${sprite_path}#chevron-down`} />
        //       </svg>
        //     </div>
        //     <div className="flex items-center">
        //       <span>
        //         {
        //           currentTab && currentTab.title_en == 'acts' ?
        //           'Сумма' : 'Статус'
        //         }
        //       </span>
        //       <svg
        //         className={`${styles.icon} ms-2`}
        //         >
        //         <use href={`${sprite_path}#chevron-down`} />
        //       </svg>
        //     </div>
        //     <div>

        //     </div>
        //   </div>
        //   <div className="flex">
        //     <div>
        //       {
        //         currentTab && currentTab.title_en == 'bills' ?
        //         'Счет за аренду' : 'Название помещения2'
        //       }
        //     </div>
        //     <div>
        //       {
        //         currentTab && currentTab.title_en == 'bills' ?
        //         '' : 'Авария'                  
        //       }
        //     </div>
        //   </div>
        // </div>

        <table className="rounded-lg border-separate border-spacing-0 overflow-hidden w-full">
          <thead className="bg-item-active">
            <tr align="center" className="text-center justify-center">
              <th width={currentTab.title_en == 'counters' ? '200px' : ''}>
                <div className="flex items-center ps-8">
                  <span className="inline">
                    {currentTab.title_en == 'counters' ? 'Дата' : '№'}
                  </span>
                  <svg
                    className={`${styles.icon} ms-2`}
                  >
                    <use href={`${sprite_path}#chevron-down`} />
                  </svg>
                </div>
              </th>
              <th width={currentTab.title_en == 'counters' ? '100px' : ''}>
                <div className="flex items-center min-w-22">
                  <span className="text-nowrap">
                    {currentTab.title_en == 'counters' ? '' : 'Название'}                    
                    {
                      currentTab && currentTab.title_en == 'acts' ?
                      ' акта' : currentTab.title_en == 'bills' ? 
                      ' счета' : currentTab.title_en == 'counters' ? 
                      ' ХВС' : ' помещения'
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
                currentRoute == '/requests' ?
                <th>
                  <div className="flex items-center">
                    <span className="text-nowrap">Тема обращения</span>
                    <svg
                      className={`${styles.icon} ms-2`}
                      >
                      <use href={`${sprite_path}#chevron-down`} />
                    </svg>
                  </div>
                </th> : ''
              }
              <th width={currentTab.title_en == 'counters' ? '200px' : ''}>
                <div className="flex items-center min-w-22">
                  <span>{currentTab.title_en == 'counters' ? 'ГВС' : 'Дата'}</span>
                  <svg
                    className={`${styles.icon} ms-2`}
                    >
                    <use href={`${sprite_path}#chevron-down`} />
                  </svg>
                </div>
              </th>
              <th width={currentTab.title_en == 'counters' ? '200px' : ''} align="center">
                <div className="flex items-center">
                  <span>
                    {
                      currentTab && (currentTab.title_en == 'acts' || currentTab.title_en == 'bills') ?
                      'Сумма' : currentTab.title_en == 'counters' ? 'Электроэнергия' : 'Статус'
                    }
                  </span>
                  <svg
                    className={`${styles.icon} ms-2`}
                    >
                    <use href={`${sprite_path}#chevron-down`} />
                  </svg>
                </div>
              </th>
              <th></th>
              {
                currentRoute != '/requests' ? 
                <th></th> : ''
              }
            </tr>
          </thead>
          <tbody className="bg-item-default ">
            <tr>
              <td className={currentTab.title_en == 'counters' ? 'align-top' : ''}>
                <div className="ps-8">
                  {currentTab.title_en == 'counters' ? '01.01.2011' : '001'}
                </div>
              </td>
              <td>
                {
                  currentTab && currentTab.title_en == 'acts' ?
                  'Акт об оплате аренды' : currentTab.title_en == 'bills' ? 'Счет за аренду' 
                  : currentTab.title_en == 'counters' ? 
                  <div>
                    <p className="text-[#787C82]">№000001</p>
                    <p>123.45 м3</p>
                  </div> 
                  : 'Название помещения'
                }
              </td>              
                {
                  currentTab && currentTab.title_en == 'acts' ?
                  '' : currentTab.title_en == 'bills' ? '' :
                  currentTab.title_en == 'counters' ? 
                  <td>
                    <div>
                      <p className="text-[#787C82]">№000001</p>
                      <p>123.45 м3</p>
                    </div> 
                  </td>
                  :                
                  <td>Авария</td>
                }              
              <td>
                {
                  currentTab.title_en == 'counters' ? 
                  <div>
                    <p className="text-[#787C82]">№000001</p>
                    <p>123.45 кВтч</p>
                  </div> : '01.01.2025'
                }
                
              </td>
              <td>
                {
                  currentTab && (currentTab.title_en == 'acts' || currentTab.title_en == 'bills') ?
                  <PriceFormatter amount="100000" /> 
                  : currentTab.title_en == 'counters' ? '' 
                  : <span className="text-green-600">Завершен</span>
                }
              </td>
              {
                currentTab && (currentTab.title_en == 'bills') ?
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
                {
                  currentTab.title_en == 'counters' ? '' 
                  : 
                  <button className="btn-success px-6 py-2 mt-5 w-full">
                    {
                      currentTab && (currentTab.title_en == 'bills') ? 'Оплатить' : 'Скачать'
                    }
                  </button>
                }
              </td>              
            </tr>
          </tbody>
        </table>
      }
      
    </div>
  )
}
export default TheDocsListComponent;