import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import useMediaQueries from '@/hooks/useMediaQueries';
import PriceFormatter from '@/components/PriceFormatter/PriceFormatter'; 
import DateFormatter from '@/components/DateFormatter/DateFormatter'; 
import styles from './TheDocsListComponent.module.css';
import { setDataType, setShowModal, setDataOfModal } from '@/store/slices/modalSlice';
import { selectedTab } from '@/store/slices/tabsSlice';
import { setShowCountersModal, setShowPaymentModal, fetchDowloadFile } from '@/store/slices/agreementsSlice';
import { isNew, requestStatusFalse, fetchRequestsList, requestsList } from '@/store/slices/requestsSlice';
import { downloadBase64PDF } from '@/utils/fileDownload';

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

  const handleFileDownload = async (e, id) => {     
    e.stopPropagation();
    try {
      const resultAction = await dispatch(fetchDowloadFile(id))

      const fileData = resultAction.payload;
        fileData.map(item => {
          if (item?.dataUrl) {
            downloadBase64PDF(item.dataUrl, item.type);
          } else {
            console.error(`Файл ${item.type} не загружен: отсутствует dataUrl`);
          }
        })
    } catch (error) {
      console.error("Ошибка загрузки файла:", error);
    }  
  }
  const handleGetFile = (file) => {    
    downloadBase64PDF(file);    
  }

  return (
    (sm_breakpoint || md_breakpoint) ?      
    getList()?.map((item, index) => (
      currentRoute != "/requests" ?
      <div className={`grid ${currentTab && currentTab.title_en == 'acts' ? '' : 'grid-cols-2'} gap-3 p-6 bg-[#FAFBFD] rounded-lg my-5`}>        
        <div className={`
          ${sm_breakpoint || md_breakpoint ? '' : 'flex'} 
          ${currentTab && currentTab.title_en == 'bills' ? 'text-left' : 'md:w-2/5'}
        `}>
          {
            currentTab && currentTab.title_en == 'bills' ? 
            <div className="md:pe-3">
              <div className="mb-1 text-nowrap">№001. Счет за аренду</div>
              <div><span className="text-[#787C82]">Дата:</span> <DateFormatter dateString={item.date} /></div>
              
              <button className="btn-default px-6 py-2 flex mt-5 w-full justify-center" onClick={(e) => handleFileDownload(e, item.id)}>
                <svg
                  className={`icon me-3`}
                >
                  <use href={`${sprite_path}#doc-icon`} />
                </svg>
                Скачать
              </button>
            </div>
            : ''            
          }
          {
            currentTab && currentTab.title_en == 'acts' ? 
            <div className={``}>
              <div className="text-nowrap"><span className="text-[#787C82]">№001:</span> Акт об оплате аренды</div>
              <div className="text-nowrap my-1"><span className="text-[#787C82]">Дата:&nbsp;</span><DateFormatter dateString={item.date} /></div>
              <button className="btn-default px-6 py-2 flex lg:mt-0 mt-5 md:w-fit w-full justify-center" disabled={!item.file}
                onClick={(e) => handleFileDownload(e, item.id)}
              >
                <svg
                  className="icon me-3"
                >
                  <use href={`${sprite_path}#doc-icon`} />
                </svg>
                Скачать
              </button> 
            </div> : ''
          }
          {
            currentTab && currentTab.title_en == 'counters' ? 
            <div className={`${currentTab && currentTab == 'counters' ? 'md:ps-3' : ''} `}>
              {
                currentTab && currentTab.title_en == 'counters' ? 
                <p className="mb-2"><span className="text-[#787C82] text-nowrap">Дата: </span>02.02.2026</p> : ''
              }
              <div className="text-nowrap"><span className="text-[#787C82]">№ пр. учета:</span> 0000001</div>
              <div className="text-nowrap my-1"><span className="text-[#787C82]">№ пр. учета:</span> 0000001</div>
              <div className="text-nowrap"><span className="text-[#787C82]">№ пр. учета:</span> 0000001</div>
            </div> : ''
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
            <div className={ item.status === 'payd' ? '' : 'text-red-600'}><PriceFormatter amount={item.summ} /></div>
            <button className="btn-success px-6 py-2 mt-auto w-full" disabled onClick={() => handleSetDataType('payment', item)}>{item.status === 'payd' ? 'Оплачено' : 'Оплатить'}</button>
          </div>
          : currentTab && currentTab.title_en == 'counters' ?
          <div className="ms-3">
            {
              currentTab && currentTab.title_en == 'counters' ? 
              <p className="leading-8">&nbsp;</p> : ''
            }
            <div>ГВС: 123.45 м3</div>
            <div className="my-1">ХВС: 123.45 м3</div>
            <div>{sm_breakpoint ? 'ЭЭ' : 'Электроэнегрия'}: 123.45 м3</div>
          </div> 
          : ''
        }
        </div>
      </div>
      :
      <div className={`${currentTab && (currentTab == 'all_requests' || currentTab == 'my_requests')  ? 'md:ps-3' : ''}  mt-6 bg-item-default rounded-xl p-4 md:flex block justify-between`}>
        <div>
          <p className="mb-2"><span className="text-[#787C82] text-nowrap">№ 001.&nbsp;</span>{item.object}</p>              
          <div className="text-nowrap"><span className="text-[#787C82]">Тема:&nbsp;</span>{item.type}</div>
          <div className="text-nowrap my-1 flex gap-5">
            <p>
              <span className="text-[#787C82]">Дата:&nbsp;</span><DateFormatter dateString={item.date} /> 
            </p>
            <p>
              <span className="text-[#787C82]">Статус:&nbsp;</span>
              <span className={item.status.includes('В работе') ? '' : 'text-green-700'}>
                {item.status}
              </span>
            </p>
          </div>
        </div>
        <div>
          <button className="btn-success px-6 py-2 md:w-auto w-full md:mt-0 mt-5">
            Открыть
          </button>
        </div>
      </div> 
    ))
    :
    <div className={`
      flex bg-[#FAFBFD] rounded-lg my-5 lg:p-0 p-5
    `}>
      <div className="w-full">
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
                <tr key={index} className="cursor-pointer">
                  <td className={currentTab && currentTab.title_en == 'counters' ? 'align-top' : ''}>
                    <div className="ps-8">
                      {currentTab && currentTab.title_en == 'counters' ? '01.01.2011' : item.number}
                    </div>
                  </td>
                  <td>
                    {
                      currentTab && currentTab.title_en == 'acts' ?
                      'Акт об оплате аренды' : currentTab && currentTab.title_en == 'bills' ? item.descr
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
                  <td align="right">
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
                      <button className="btn-default px-6 py-2 flex lg:mt-0 mt-5 md:w-full md:justify-center"
                          onClick={(e) => handleFileDownload(e, item.id)}
                      >
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
                      <button className="btn-success px-6 py-2 lg:mt-0 mt-5 w-full" disabled={currentTab && currentTab.title_en == 'bills'} onClick={() => currentTab && currentTab.title_en == 'bills' ? handleSetDataType('payment', item) : ''}>
                        {
                          currentTab && currentTab.title_en == 'bills' ? 'Оплатить' : 'Скачать2'
                        }
                      </button>
                    }
                  </td>              
                </tr>
              ))
            }
            
          </tbody>
        </table>
      </div>
      
    </div> 
  )
}
export default TheDocsListComponent;