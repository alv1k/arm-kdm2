import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom'; 
import useMediaQueries from '@/hooks/useMediaQueries';
import PriceFormatter from '@/components/PriceFormatter/PriceFormatter'; 
import DateFormatter from '@/components/DateFormatter/DateFormatter'; 
import { useNavigate } from 'react-router-dom';
import styles from './TheDocsListComponent.module.css';
import { setDataType, setShowModal, setDataOfModal } from '@/store/slices/modalSlice';
import { selectedTab } from '@/store/slices/tabsSlice';
import { setShowCountersModal, setShowPaymentModal, fetchDowloadFile } from '@/store/slices/agreementsSlice';
import { isNew, requestStatusFalse, fetchRequestsList, requestsList } from '@/store/slices/requestsSlice';
import { removeToken } from '@/store/slices/userSlice';
import { downloadBase64PDF } from '@/utils/fileDownload';
import { showToast } from '@/utils/notify';

const TheDocsListComponent = () => {
  const sprite_path = './src/assets/images/i.svg';
  const { xl_breakpoint, lg_breakpoint, md_breakpoint, sm_breakpoint } = useMediaQueries();
  const dispatch = useDispatch();  
  const currentTab = useSelector(selectedTab);
  const requests = useSelector(requestsList);
  const navigate = useNavigate();
  
  const allInvoices = useSelector((state) => state.agreements_slice.allInvoices)  
  const allCounters = useSelector((state) => state.agreements_slice.allCounters)  
  const allObjects = useSelector((state) => state.agreements_slice.allObjects)
  const allClosingDocs = useSelector((state) => state.agreements_slice.allClosingDocs)
  const selectedAgreement = useSelector((state) => state.agreements_slice.selectedAgreement);
  
  const error = useSelector(state => state.user_slice.error);
  const agreementObjects = useSelector((state) => state.agreements_slice.agreementObjects);  
    
  const location = useLocation();
  const currentRoute = location.pathname;
  const [isLoading, setIsLoading] = useState(true);

  const statusStyles = {
    'Выполнено': 'text-green-700',
    'Выполняется': 'text-blue-700',
    'Отклонена': 'text-red-700',
    'Утверждена': 'text-purple-700',
    'На рассмотрении': 'text-yellow-700',
    'default': 'text-gray-700'
  };

  const getStatusClass = (status) => {
    const key = Object.keys(statusStyles).find(key => status.includes(key));
    return statusStyles[key] || statusStyles.default;
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        if (currentTab && currentTab.title_en == 'requests') {
          await dispatch(fetchRequestsList());
        }
        // Закрывающие документы
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [dispatch]);
  useEffect(() => {
      if (error === 'Неверный токен') {
        navigate('/login', { replace: true });
      }
    }, [error, navigate]);

  const getFileName = (fileName) => {
    return 'name.pdf'
  }

  const getList = () => {
    if (currentTab) {
      switch(currentRoute) {
        case '/requests':
          switch(currentTab.title_en) {
            case 'my_requests':
            case 'all_requests':
              return requests;
            case 'in_progress':
              return requests.filter(request => request.status.includes('работе') || request.status.includes('рассмотрении') || request.status.includes('твержден') || request.status.includes('ыполняется'))
            case 'completed':
              return requests.filter(request => request.status.includes('заверш') || request.status.includes('ыполнен') || request.status.includes('клонен'))
          }
        case '/agreements':
          switch(currentTab.title_en) {
            case 'bills':
              return allInvoices;
            case 'closing_docs':              
              let sortedDocs = []
              allClosingDocs.map((doc) => {                
                if (doc?.agree == selectedAgreement[0].id) {
                  sortedDocs.push(doc);
                }
              })
              return sortedDocs;
            case 'counters':
              // Получаем все уникальные даты
              const uniqueDates = [...new Set(allCounters.map(counter => counter.end_date))];

              // Инициализируем sorted массив
              const sorted = uniqueDates.map(() => []);

              allCounters.forEach(counter => {
                if (md_breakpoint || sm_breakpoint) {
                  // Мобильная версия - все в первом подмассиве
                  if (sorted[0]) {
                    sorted[0].push(counter);
                  }
                } else {
                  // Десктопная версия - группировка по дате и категории
                  const dateIndex = uniqueDates.indexOf(counter.end_date);
                  if (dateIndex !== -1) {
                    const category = counter.name.includes('ХВС') ? 0 :
                                  counter.name.includes('ГВС') ? 1 : 2;
                    
                    if (!sorted[dateIndex][category]) {
                      sorted[dateIndex][category] = [];
                    }
                    sorted[dateIndex][category].push(counter);
                  }
                }
              });              
              return sorted;
            case 'objects':
              return agreementObjects;
          }
          default:
            return []; // На случай, если `currentRoute` не совпадает ни с одним кейсом
      }
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

  const handleFileDownload = async (e, item) => {     
    e.stopPropagation();
    try {
      const resultAction = await dispatch(fetchDowloadFile(item.id))
      const doc_name = item.descr + item.number;

      const fileData = resultAction.payload;
      if (fileData.length == 0) {
        showToast('Файл не найден!', 'error', {
          autoClose: 5000,
        });
      } else if (typeof fileData == 'object') {        
        fileData.map(item => {
          if (item?.dataUrl) {
            downloadBase64PDF(item.dataUrl, doc_name);
          } else {
            console.error(`Файл ${item.type} не загружен: отсутствует dataUrl`);
          }
        })
      } 
    } catch (error) {
      console.error("Ошибка загрузки файла:", error);
    }  
  }

  const requestFileDownloadHandler = async (e, file) => {  
    try {
      await downloadBase64PDF(file.dataUrl, file.name)
    } catch {
      dispatch({
        type: 'DOWNLOAD_FILE_ERROR',
        payload: error.message
      });
    }    
  }

  const handleSort = (target) => {
    //ASC DESC
    console.log(target, 'firstTd');
    
  }

  const getCounterName = (name) => {
    if (name.includes('ГВС')) {
      return 'ГВС';
    } else if (name.includes('ХВС')) {
      return 'ХВС';
    } else if (name.includes('Э/Э')) {
      return 'Э/Э';
    }
  }
  
  const getEndDate = (item) => {
    return item.find(i => i?.[0]?.end_date)?.[0]?.end_date || '';
  }

  return (
    (sm_breakpoint || md_breakpoint) ?      
    getList()?.map((item, index) => (
      currentRoute != "/requests" ?
      <div key={index} className={`grid ${currentTab && currentTab.title_en == 'closing_docs' ? '' : 'grid-cols-2'} gap-3 p-6 bg-[#FAFBFD] rounded-lg my-5`}>
        <div className={`
          ${sm_breakpoint || md_breakpoint ? '' : 'flex'} 
          ${currentTab && (currentTab.title_en == 'bills' || currentTab.title_en == 'objects') ? 'text-left' : ''}
          ${currentTab && currentTab.title_en == 'objects' ? 'col-span-2 md:mb-4' : ''}
        `}>
          {
            currentTab && currentTab.title_en == 'bills' &&
            <div className="md:pe-3">
              <div className="mb-1 text-nowrap truncate">№{item.number}. {item.descr}</div>
              <div>
                <span className="text-[#787C82]">Дата: </span> 
                {item.date &&  <DateFormatter dateString={item.date} /> }
              </div>
              <button 
                className="btn-default px-6 py-2 flex mt-5 w-full justify-center" 
                onClick={(e) => handleFileDownload(e, item)}
                disabled={item.status == 'payd'}
              >
                <svg
                  className={`icon me-3`}
                >
                  <use href={`${sprite_path}#doc-icon`} />
                </svg>
                Скачать
              </button>
            </div>                  
          }
          {
            currentTab && currentTab.title_en == 'closing_docs' &&
            <div className={``}>
              <div className=""><span className="text-[#787C82]">№{item.number}:</span> {item.descr}</div>
              <div className="text-nowrap my-1">
                <span className="text-[#787C82]">Дата:&nbsp;</span>
                {item.date && <DateFormatter dateString={item.date} />}
              </div>
              <div className="text-nowrap my-1">
                <span className="text-[#787C82]">Сумма:&nbsp;</span>
                {item.date && <PriceFormatter amount={item.summ} type="price" />}
              </div>
              {
                item.files.length > 0 ? (
                  <div className="flex gap-5">
                    {                      
                      item.files.map((file) => (
                        <button 
                          className="text-xs btn-default px-3 py-2 flex lg:mt-0 mt-5 md:w-fit w-full justify-center"
                          onClick={(e) => handleFileDownload(e, item)}
                        >
                          <svg
                            className="icon me-3"
                          >
                            <use href={`${sprite_path}#doc-icon`} />
                          </svg>
                          {file.type}
                        </button>
                      ))
                    }
                  </div>
                ) : 
                <button className="btn-default px-6 py-2 flex lg:mt-0 mt-5 md:w-fit w-full justify-center" disabled={!item.files}
                  onClick={(e) => handleFileDownload(e, item)}
                >
                  <svg
                    className="icon me-3"
                  >
                    <use href={`${sprite_path}#doc-icon`} />
                  </svg>
                  Скачать
                </button> 
              }
            </div>
          }
          {
            currentTab && currentTab.title_en == 'counters' &&
            <div className={`${currentTab && currentTab == 'counters' ? 'md:ps-3' : ''} `}>
              {
                currentTab && currentTab.title_en == 'counters' ? 
                <p className="mb-2"><span className="text-[#787C82] text-nowrap">Дата: </span> <DateFormatter dateString={item[0] ? item[0].end_date : ''} /></p> : ''
              }
              {
                item.length > 0 && item.map((counter, index) => (
                  <div key={index} className="text-nowrap"><span className="text-[#787C82]">№ пр. учета:</span> {counter.number ? counter.number : 'не найден'}</div>
                ))
              }
            </div>
          }
          {
            currentTab && currentTab.title_en == 'objects' &&
            <div className={`${currentTab && currentTab == 'objects' ? 'md:ps-3' : ''}`}>
              <div>
                <span className="text-[#787C82]">Адрес: </span>
                <span>
                  {item.name}
                </span>
              </div>
              {/* <div className="mt-2">
                <span className="text-[#787C82]">Площадь: </span>
                <span>
                  {item.code}
                </span>
              </div> */}
            </div>
          }
        </div>

        {
          currentTab && currentTab.title_en == 'bills' ? '' :
          <div className={`
            ${sm_breakpoint || md_breakpoint ? '' : 'flex'}           
          `}>
            {
              currentTab && currentTab.title_en == 'counters' &&
              <div className={`${currentTab && currentTab == 'counters' ? 'md:ps-3' : ''} `}>
                {
                  currentTab && currentTab.title_en == 'counters' ? 
                  <p className="mb-2">&nbsp;</p> : ''
                }
                {
                  item.length > 0 && item.map((counter, index) => (
                    <div key={index} className="text-nowrap"><span className="text-[#787C82]">{ getCounterName(counter.name) }:</span> { counter.end_indice }</div>
                  ))
                }
              </div>
            }
          </div>
        }
        {
          currentTab && currentTab.title_en == 'bills' &&
          <div className={`
            ${sm_breakpoint || md_breakpoint ? '' : 'flex'}
            text-center
          `}>
            <div className="h-full justify-baseline flex flex-col">
              <div className="mb-1 text-[#787C82]">Сумма:</div>
              <div className={ item.status === 'payd' ? '' : 'text-red-600'}>
                <PriceFormatter amount={item.summ} type="price" />
              </div>
              <button 
                className={`${item.status === 'payd' ? 'btn-default' : 'rounded-lg bg-green-500 text-white'} px-6 py-2 mt-5 h-full w-full`} 
                disabled 
                >
                {/* onClick={() => handleSetDataType('payment', item)} */}
                {item.status === 'payd' ? 'Оплачено' : 'Оплатить'}
              </button>
            </div>          
          </div>
        }
      </div>
      :
      <div key={index} className={`${currentTab && (currentTab == 'all_requests' || currentTab == 'my_requests')  ? 'md:ps-3' : ''}  mt-6 bg-item-default rounded-xl p-4 md:flex block`}>
        <div className="w-full">
          <p className="mb-2"><span className="text-[#787C82] text-nowrap">№ 001.&nbsp;</span>{item.object}</p>
          <div className="text-nowrap"><span className="text-[#787C82]">Тема:&nbsp;</span>{item.type}</div>
          <div className="text-nowrap my-1 md:flex block gap-5">
            <div className="flex gap-6">
              <p>
                <span className="text-[#787C82]">Дата:&nbsp;</span>
                {item.date && <DateFormatter dateString={item.date} /> }
              </p>
              <p>
                <span className="text-[#787C82]">Статус:&nbsp;</span>
                <span className={item.status ? getStatusClass(item.status) : ''}>
                  {item.status}
                </span>
              </p>
            </div>
            {
              item.file && 
              <div className={md_breakpoint ? 'inline ms-6' : 'block mt-4'}>
                <div className="flex">              
                  <svg
                    className="w-6 h-6 text-gray-300 stroke-1 outline-0"
                  >
                    <use href={`${sprite_path}#clip-icon`} />
                  </svg>
                  <p className="text-base text-[#787C82] ms-2">
                    {/* filename2.pdf ,22 */}
                  </p>
                </div>
              </div>
            }
          </div>
          {
            item.files && (
              <div className="flex relative text-[#4c515a]">
                <svg className="w-6 h-6 flex-shrink-0 text-gray-300 stroke-1 outline-0 me-3 mt-2 self-top">
                  <use href={`${sprite_path}#clip-icon`} />
                </svg>
                <div className="gap-2 overflow-hidden">
                  {item.files.map((file, index) => (
                    <div className="mt-1" key={index}>
                      <span
                        className="w-[280px] block cursor-pointer hover:text-[#232427] truncate"
                        onClick={(e) => requestFileDownloadHandler(e, {dataUrl: file.dataUrl, name: file.name})}
                      >
                        {index + 1}. {file.name}{index !== item.files.length - 1 && ","}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )
          }
        </div>
      </div> 
    ))
    :
    <div className={`
      flex bg-[#FAFBFD] rounded-lg my-5 lg:p-0 p-5 min-h-[50vh]
    `}>
      <div className="w-full overflow-x-auto">
        {/* Header */}
        <div className={`flex bg-item-active rounded-t-lg p-4 font-medium ${window.innerWidth < 1280 ? 'max-w-[600px]' : ''} `}>
          {/* Column 1 */}
          <div className={`
              flex items-center ps-2 flex-shrink-0
              ${currentTab && currentTab.title_en === 'bills' ? 'w-[150px]' : 'w-[120px]'}
            `}
          >
            {currentTab && currentTab.title_en === 'counters' ? 'Дата' : '№'}
          </div>
          
          {/* Column 2 */}
          <div className={`
              flex items-center flex-shrink-0
              ${currentTab && currentTab.title_en === 'objects' ? 'w-[350px]' : 'w-[200px]'}
            `}
          >
            <span className="whitespace-nowrap">
              {currentTab && (currentTab.title_en === 'counters' || currentTab.title_en === 'objects') ? '' : 'Название'}
              {currentTab && currentTab.title_en === 'closing_docs' ? null : 
              currentTab && currentTab.title_en === 'bills' ? ' счета' : 
              currentTab && currentTab.title_en === 'counters' ? ' ХВС' : 
              currentTab && currentTab.title_en === 'objects' ? 'Адрес' : ' помещения'}
            </span>
          </div>

          {/* Dynamic Column */}
          {currentRoute === '/requests' && (
            <div className="flex items-center w-[180px] flex-shrink-0">
              <span className="whitespace-nowrap">Тема обращения</span>
            </div>
          )}

          {/* Column 3 */}
          <div className={`flex items-center ${currentRoute === '/requests' ? 'w-[150px]' : 'w-[200px]'} flex-shrink-0`}>
            <span>{currentTab && currentTab.title_en === 'counters' ? 'ГВС' : currentTab && currentTab.title_en === 'objects' ? '' : 'Дата'}</span>
          </div>

          {/* Column 4 */}
          {currentTab && currentTab.title_en !== 'objects' && (
            <div className="flex w-[150px] flex-shrink-0">
              <span>
                {currentTab && (currentTab.title_en === 'closing_docs' || currentTab.title_en === 'bills') ? 
                'Сумма' : currentTab && currentTab.title_en === 'counters' ? 
                'Электроэнергия' : 'Статус'}
              </span>
            </div>
          )}

          {/* Action Column */}
          {currentTab && (currentTab.title_en !== 'objects' || currentTab.title_en == 'counters') && (
            <div className="flex justify-end w-[120px] flex-shrink-0">
              {/* Empty for spacing */}
            </div>
          )}
        </div>

        {/* Body */}
        <div className={`flex flex-col ${window.innerWidth < 1280 ? 'max-w-[600px]' : ''} `}>
          {getList()?.map((item, index) => (
            <div 
              key={index} 
              className="flex items-center p-4 bg-item-default rounded-lg hover:bg-item-hover transition-colors"
            >
              {/* Cell 1 */}
              <div className={`
                  flex-shrink-0
                  ${currentTab && currentTab.title_en === 'bills' ? 'w-[150px]' : 'w-[120px]'}
                `}
              >
                <div className="ps-2">
                  {
                    currentTab && currentTab.title_en === 'counters' && item ? 
                    (
                      <div>
                        <p>{getEndDate(item)}</p>
                      </div>
                    ) : 
                    currentTab.title_en === 'objects' ? index + 1 : item.number
                  }
                </div>
              </div>

              {/* Cell 2 */}
              <div className={`
                  flex-shrink-0                  
                  ${currentTab && currentTab.title_en === 'objects' ? 'w-[350px]' : 'w-[200px]'}
                `}
              >
                {currentTab && (currentTab.title_en === 'closing_docs' || currentTab.title_en === 'bills') ? item.descr :
                currentTab && currentTab.title_en === 'counters' ? (
                  <div key={index}>
                    {
                      item[0] && item[0].map((counter, counter_index) => 
                        (
                          <div key={counter_index} className="mb-2">                              
                            <p className="text-[#787C82]">{counter ? '№' : ''}{counter.number ? counter.number : ''}</p>
                            <p>{counter ? counter.end_indice : ''} {counter ? 'м3' : ''} </p>
                          </div>
                        )
                      )
                    }
                  </div>
                ) : 
                currentTab && currentTab.title_en === 'counters' ? 
                (
                  <div data={index} key={index}>
                  </div>
                ) : 
                currentTab && currentTab.title_en === 'objects' ? (
                  <div>{item.name}</div>
                ) : 
                (
                  <div className="group relative">
                    <p className="py-2 rounded cursor-default truncate">
                      {item.object}
                    </p>
                    {item.object && (
                      <div className="absolute z-10 hidden group-hover:block w-96 bg-white shadow-md text-base rounded-b-xl rounded-tr-xl p-5 top-full mt-2">
                        {item.object}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Dynamic Cell */}
              {currentTab && currentTab.title_en === 'closing_docs' ? null : 
              currentTab && currentTab.title_en === 'bills' ? null :
              currentTab && currentTab.title_en === 'counters' ? (
                <div className="w-[200px] flex-shrink-0">
                  <div key={item[1] ? item[1].id : ''}>
                    <p className="text-[#787C82]">{item[1] ? '№' : ''}{item[1] ? item[1].number : ''}</p>
                    <p>{item[1] ? item[1].end_indice : ''} {item[1] ? 'м3' : ''}</p>
                  </div>
                </div>
              ) : (
                <div className="w-[180px] flex-shrink-0">{item.type}</div>
              )}

              {/* Cell 3 */}
              {currentTab && currentTab.title_en !== 'objects' && (
                <div className={`${currentRoute === '/requests' ? 'w-[150px]' : 'w-[200px]'} flex-shrink-0`}>
                  {
                    currentTab && currentTab.title_en === 'counters' ? (
                      <div key={index}>
                        {
                          item[2] && item[2].map((counter, counter_index) => 
                            (
                              <div key={counter_index} className="mb-2">                              
                                <p className="text-[#787C82]">{counter ? '№' : ''}{counter.number ? counter.number : ''}</p>
                                <p>{counter ? counter.end_indice : ''} {counter ? 'м3' : ''} </p>
                              </div>
                            )
                          )
                        }
                      </div>
                    ) : item.date && <DateFormatter dateString={item.date} />
                  }
                </div>
              )}

              {/* Cell 4 */}
              {currentTab && currentTab.title_en !== 'objects' && (
                <div className="w-[150px] flex-shrink-0">
                  {currentTab && currentTab.title_en === 'closing_docs' ? <PriceFormatter amount={item.summ} type="price" /> :
                  currentTab && currentTab.title_en === 'bills' ? (
                    <PriceFormatter amount={item.summ} type="price" />
                  ) : currentTab && currentTab.title_en === 'counters' ? null : (
                    <span className={item.status ? getStatusClass(item.status) : ''}>
                      {item.status}
                    </span>
                  )}
                </div>
              )}

              {/* Action Cell */}
              {currentTab && currentTab.title_en === 'bills' && (
                <div className="w-[120px] flex-shrink-0 flex justify-end pe-5">
                  <button 
                    className="btn-default px-4 py-2 flex items-center text-sm"
                    onClick={(e) => handleFileDownload(e, item)}
                    disabled={item.status === 'payd'}
                  >
                    <svg className="icon me-2 w-4 h-4">
                      <use href={`${sprite_path}#doc-icon`} />
                    </svg>
                    Скачать
                  </button>
                </div>
              )}

              {currentTab && (currentTab.title_en !== 'objects' || currentTab.title_en == 'closing_docs') && (
                <div className="w-[120px] flex-shrink-0 flex justify-start ">
                  {currentRoute === '/requests' || (currentTab && currentTab.title_en == 'counters' || currentTab.title_en == 'closing_docs') ? (
                    item.files && (
                      <div className="flex group relative text-[#4c515a] ">
                        <svg className="w-6 h-6 text-gray-300 stroke-1 outline-0 me-3 self-center">
                          <use href={`${sprite_path}#clip-icon`} />
                        </svg>
                        <span>
                          файлы
                        </span>
                        <div className="absolute z-10 hidden group-hover:block hover:block bg-white shadow-md text-base rounded-b-xl rounded-tl-xl p-5 top-full right-0 min-w-full">
                          {item.files.map((file, index) => (
                            <div className="flex mt-1" key={index}>
                              <span                                 
                                className="w-full cursor-pointer hover:text-[#232427] block truncate"
                                onClick={(e) => requestFileDownloadHandler(e, {dataUrl: file.dataUrl, name: file.name})}
                              >
                                {index + 1}. {file.name ?? file.type}{index !== item.files.length - 1 && ","}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  ) : (
                    <button 
                      className="btn-success px-4 py-2 text-sm"
                      disabled={currentTab && ((currentTab.title_en === 'bills' && item.status === 'payd') || currentTab.title_en === 'closing_docs')}
                    >
                      {currentTab && currentTab.title_en === 'bills' ? 
                      (item.status === 'payd' ? 'Оплачено' : 'Оплатить') : 'Скачать'}
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div> 
  )
}
export default TheDocsListComponent;