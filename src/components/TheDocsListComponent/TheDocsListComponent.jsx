import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import useMediaQueries from '@/hooks/useMediaQueries';
import PriceFormatter from '@/components/PriceFormatter/PriceFormatter'; 
import DateFormatter from '@/components/DateFormatter/DateFormatter'; 
import styles from './TheDocsListComponent.module.css';
import { setDataType, setShowModal, setDataOfModal } from '@/store/slices/modalSlice';
import { selectedTab } from '@/store/slices/tabsSlice';
import { setShowCountersModal, setShowPaymentModal } from '@/store/slices/agreementsSlice';
import { isNew, requestStatusFalse, fetchRequestsList, requestsList } from '@/store/slices/requestsSlice';

const TheDocsListComponent = () => {
  const sprite_path = './src/assets/images/i.svg';
  const { xl_breakpoint, lg_breakpoint, md_breakpoint, sm_breakpoint } = useMediaQueries();
  const dispatch = useDispatch();  
  const currentTab = useSelector(selectedTab);
  const requests = useSelector(requestsList);
  
  const allInvoices = useSelector((state) => state.agreements_slice.allInvoices)  
    
  const location = useLocation();
  const currentRoute = location.pathname;
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        if (currentTab && currentTab.title_en == 'requests') {
          await dispatch(fetchRequestsList());
        }
        // Акты
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [dispatch]);

  const getList = () => {
    
    switch(currentRoute) {
      case '/requests':
        return requests;
      case '/agreements':
        switch(currentTab.title_en) {
          case 'bills':
            return allInvoices;
          case 'acts':
            return [{"id": "1", "descr": "descr1", "date": "4025-04-08T11:56:31"}];
          case 'counters':
            return [{"id": "2", "descr": "descr2", "date": "4025-05-09T12:46:22"}];
        }
        default:
          return []; // На случай, если `currentRoute` не совпадает ни с одним кейсом
    }

  }
  
  if (isLoading) return <div className="p-14">Загрузка...</div>;

  const handleSetDataType = (type, item) => {
    dispatch(setDataType(type));
    if (!sm_breakpoint) {
      dispatch(setShowModal())      
      dispatch(setDataOfModal(item))
    } else if (type == 'counters') {
      dispatch(setShowCountersModal())
    } else if (type == 'payment') {
      dispatch(setShowPaymentModal())
    }
  }  



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
            
            getList()?.map((item, index) => (
              <div key={index} className="md:flex block">
                <div>
                  <p className="mb-1">
                    {
                      currentTab && currentTab.title_en == 'acts' ? '№001. Акт об оплате аренды' : item.object
                    }
                  </p>
                  {
                    currentTab && currentTab.title_en == 'acts' ? '' :
                    <p className="mb-1">
                      <span className="text-[#787C82]">
                        Тема:&nbsp;
                      </span>
                      {item.type}
                    </p>
                  }
                  <div className="flex">
                    <p>
                      <span className="text-[#787C82]">
                        Дата:&nbsp;
                      </span>
                      <DateFormatter dateString={item.date} />
                    </p>
                    <div>
                      {
                        currentTab && currentTab.title_en == 'acts' ? '' :
                        <div className="ms-4">
                          <span className="text-[#787C82]">
                            Статус:&nbsp;
                          </span>
                          <span className="text-green-700"> 
                            {item.status}
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
            ))
            
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
                <button className="btn-success px-6 py-2 mt-auto w-full" onClick={() => handleSetDataType('payment', item)}>Оплатить</button>
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
        //         'Счет за аренду' : 'Объект аренды'
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
              <th width={currentTab && currentTab.title_en == 'counters' ? '200px' : ''}>
                <div className="flex items-center ps-8">
                  <span className="inline">
                    {currentTab && currentTab.title_en == 'counters' ? 'Дата' : '№'}
                  </span>
                  <svg
                    className={`${styles.icon} ms-2`}
                  >
                    <use href={`${sprite_path}#chevron-down`} />
                  </svg>
                </div>
              </th>
              <th width={currentTab && currentTab.title_en == 'counters' ? '100px' : ''}>
                <div className="flex items-center min-w-22">
                  <span className="text-nowrap">
                    {currentTab && currentTab.title_en == 'counters' ? '' : 'Название'}                    
                    {
                      currentTab && currentTab.title_en == 'acts' ?
                      ' акта' : currentTab && currentTab.title_en == 'bills' ? 
                      ' счета' : currentTab && currentTab.title_en == 'counters' ? 
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
              <th width={currentTab && currentTab.title_en == 'counters' ? '200px' : ''}>
                <div className="flex items-center min-w-22">
                  <span>{currentTab && currentTab.title_en == 'counters' ? 'ГВС' : 'Дата'}</span>
                  <svg
                    className={`${styles.icon} ms-2`}
                    >
                    <use href={`${sprite_path}#chevron-down`} />
                  </svg>
                </div>
              </th>
              <th width={currentTab && currentTab.title_en == 'counters' ? '200px' : ''} align="center">
                <div className="flex items-center">
                  <span>
                    {
                      currentTab && (currentTab && currentTab.title_en == 'acts' || currentTab && currentTab.title_en == 'bills') ?
                      'Сумма' : currentTab && currentTab.title_en == 'counters' ? 'Электроэнергия' : 'Статус'
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
            {
              getList()?.map((item, index) => (
                <tr key={index}>
                  <td className={currentTab && currentTab.title_en == 'counters' ? 'align-top' : ''}>
                    <div className="ps-8">
                      {currentTab && currentTab.title_en == 'counters' ? '01.01.2011' : index + 1}
                    </div>
                  </td>
                  <td>
                    {
                      currentTab && currentTab.title_en == 'acts' ?
                      'Акт об оплате аренды' : currentTab && currentTab.title_en == 'bills' ? 'Счет за аренду' 
                      : currentTab && currentTab.title_en == 'counters' ? 
                      <div>
                        <p className="text-[#787C82]">№000001</p>
                        <p>123.45 м3</p>
                      </div> 
                      : item.object
                    }
                  </td>              
                    {
                      currentTab && currentTab.title_en == 'acts' ?
                      '' : currentTab && currentTab.title_en == 'bills' ? '' :
                      currentTab && currentTab.title_en == 'counters' ? 
                      <td>
                        <div>
                          <p className="text-[#787C82]">№000001</p>
                          <p>123.45 м3</p>
                        </div> 
                      </td>
                      :                
                      <td>{item.type}</td>
                    }              
                  <td>
                    {
                      currentTab && currentTab.title_en == 'counters' ? 
                      <div>
                        <p className="text-[#787C82]">№000001</p>
                        <p>123.45 кВтч</p>
                      </div> : <DateFormatter dateString={item.date} />
                    }
                    
                  </td>
                  <td>
                    {
                      currentTab && (currentTab.title_en == 'acts' || currentTab.title_en == 'bills') ?
                      <PriceFormatter amount={item.summ} /> 
                      : currentTab && currentTab.title_en == 'counters' ? '' 
                      : <span className="text-green-600">{item.status}</span>
                    }
                  </td>
                  {
                    currentTab && currentTab.title_en == 'bills' ?
                    <td className="ms-auto">                
                      <button className="btn-default px-6 py-2 flex lg:mt-0 mt-5 md:w-full md:justify-center">
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
                      currentTab && currentTab.title_en == 'counters' ? '' 
                      : 
                      <button className="btn-success px-6 py-2 lg:mt-0 mt-5 w-full" onClick={() => currentTab && currentTab.title_en == 'bills' ? handleSetDataType('payment', item) : ''}>
                        {
                          currentTab && currentTab.title_en == 'bills' ? 'Оплатить' : 'Скачать'
                        }
                      </button>
                    }
                  </td>              
                </tr>
              ))
            }
            
          </tbody>
        </table>
      }
      
    </div>
  )
}
export default TheDocsListComponent;