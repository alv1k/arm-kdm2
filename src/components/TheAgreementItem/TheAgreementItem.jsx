import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import useMediaQueries from '@/hooks/useMediaQueries'; 
import { isShowDetails, isShowCountersModal, setShowCountersModal, isShowPaymentModal, setShowPaymentModal, fetchDowloadFile } from '@/store/slices/agreementsSlice';
import PriceFormatter from '../PriceFormatter/PriceFormatter'; 
import DateFormatter from '../DateFormatter/DateFormatter';
import CountersModal from '@/components/TheCountersModal/TheCountersModal'; 
import PaymentModal from '@/components/ThePaymentModal/ThePaymentModal'; 
import { setDataType, setShowModal } from '@/store/slices/modalSlice';
import { toggleTabs  } from '@/store/slices/tabsSlice';
import { downloadBase64PDF } from '@/utils/fileDownload';

const TheAgreementItem = ({ id, number, beginDate, endDate, debt, objects, name, monthly }) => {
  const sprite_path = './src/assets/images/i.svg';
  const today = new Date().toLocaleDateString();
  const { xl_breakpoint, lg_breakpoint, md_breakpoint, sm_breakpoint } = useMediaQueries();
  const dispatch = useDispatch();
  const isDetailsShown = useSelector(isShowDetails);
  const showCountersModal = useSelector(isShowCountersModal);
  const showPaymentModal = useSelector(isShowPaymentModal);  
  const fileToDownload = useSelector((state) => state.agreements_slice.fileToDownload);  
  
  const handleSetDataType = (type) => {
    dispatch(setDataType(type));
    if (!sm_breakpoint) {
      dispatch(setShowModal())
    } else if (type == 'counters') {
      dispatch(setShowCountersModal())
    } else if (type == 'payment') {
      dispatch(setShowPaymentModal())
    }
  }  

  const objectAddress = objects ? objects[0].address : null;
  const objectdebts = objects ? objects[0].debts : null;
  const objectMonthly = objects ? objects[0].monthly : null;
  const objectName = objects ? objects[0].name : null;

  // Получить массив всех адресов:
  // const allAddresses = objects.map(service => 
  //   service.ОбъектыАренды[0].АдресАренды
  // );


  const handleDownloadAgree = async (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const resultAction = await dispatch(fetchDowloadFile(id))

      const fileData = resultAction.payload;
      fileData.map(item => {
        
        if (item?.dataUrl) {
          downloadBase64PDF(item.dataUrl, name);
        } else {
          console.error(`Файл ${item.type} не загружен: отсутствует dataUrl`);
        }
      })
    } catch (error) {
      console.error("Ошибка загрузки файла:", error);
    }   
  }  

  // useEffect(() => {
  //   dispatch(toggleTabs({
  //     type: 'singleAgreement', 
  //     breakpoint: sm_breakpoint ? 'sm-breakpoint' : '',
  //     hasCounters: name.includes(' перем') ? true : false
  //   } ));
  //   console.log(name.includes(' перем') ? true : false);
    
  // }, [dispatch]);

  return (
    <div>
      {
        showCountersModal ? 
        <div className=" bg-white">
          <CountersModal />
        </div> 
        : 
        showPaymentModal ?         
        <div className=" bg-white">
          <PaymentModal />
        </div> 
        :
        <div className={`
          lg:p-10 lg:rounded-2xl lg:mb-10 lg:flex lg:gap-4
          md:mb-4 md:bg-item-active
          rounded-xl mb-6 block w-full
          ${isDetailsShown ? 'lg:mt-6 p-0' : 'cursor-pointer p-5 bg-item-default'}
          ${isDetailsShown && (lg_breakpoint || xl_breakpoint) ? 'bg-item-active': ''}
        `}>
          <div className={`
            lg:text-xl lg:p-0
            md:text-base  md:rounded-xl
            text-sm p-0 bg-none
            ${isDetailsShown && md_breakpoint ? 'md:bg-item-active bg-item-active md:p-5' : 'md:bg-none bg-none md:p-0'}
          `}>
            <div className="h-full flex flex-col justify-between ">
              <h3 className={`
                lg:font-bold  md:text-left text-xl text-center
                ${isDetailsShown ? 'lg:text-xl font-semibold' : 'lg:text-xl font-medium'}
              `}>
                Договор: {name}</h3>
              {/* <div className={`
                ${isDetailsShown ? 'md:text-base md:mt-8' : 'lg:text-base md:mt-2'}
                md:block
                my-2
              `}>
                
              {
                isDetailsShown && sm_breakpoint ? 
                <button className="bg-white px-4 py-2 rounded-lg border border-[#6374AD] flex gap-3 text-[#203887] w-full text-base ms-auto mt-4">
                  <svg
                    className="icon lg:ms-0 ms-auto"
                  >
                    <use href={`${sprite_path}#doc-icon`} />
                  </svg>
                  <span className="lg:me-0 me-auto text-nowrap" onClick={(e) => handleDownloadAgree(e, id)}>
                    Скачать договор
                  </span>
                </button>
                : ''
              }
                
                <div className={`
                  md:p-0 md:mt-0 
                  rounded-md
                  ${isDetailsShown ? 'px-5 py-3 mt-4' : 'mt-2'}
                  ${isDetailsShown && sm_breakpoint ? 'md:bg-none bg-item-active' : ''}
                `}>
                  <span className="text-[#787C82] lg:inline md:inline block lg:mt-0">Адрес:&nbsp;</span>
                  <span className="lg:inline md:inline block">{address}</span>
                </div>
                
              </div>  */}
              {
                isDetailsShown ? 
                <div className="grid grid-cols-2 gap-2 md:mt-0 mt-4">
                  
                  <div className={`
                      ${isDetailsShown ? 'md:text-base' : 'lg:text-xl'}
                      ${isDetailsShown && sm_breakpoint ? 'my-0 gap-2' : 'my-2 gap-0'}
                      md:my-3
                      flex col-span-2 order-1
                    `}>
                    <p 
                      className={`
                        ${isDetailsShown && sm_breakpoint ? 'px-5 py-2 w-1/2 rounded-md bg-item-active' : 'bg-none'}
                        md:block
                      `}>
                      <span className={`text-[#787C82] lg:inline md:inline block lg:mt-0 ${isDetailsShown && sm_breakpoint ? 'mt-0' : ' mt-2'}`}>Дата начала:&nbsp;</span>
                      <span className={`lg:inline md:inline block ${isDetailsShown && sm_breakpoint ? 'mt-0' : ' mt-1'}`}>
                        {<DateFormatter dateString={beginDate} />}
                      </span>
                    </p>
                    <p 
                      className={`
                        ${isDetailsShown && sm_breakpoint ? 'px-5 py-2 w-1/2 rounded-md bg-item-active' : 'ms-8 bg-none'}
                        md:block                  
                      `}>
                      <span className={`text-[#787C82] lg:inline md:inline block lg:mt-0 ${isDetailsShown && sm_breakpoint ? 'mt-0' : ' mt-2'}`}>Дата окончания:&nbsp;</span>
                      <span className={`lg:inline md:inline block ${isDetailsShown && sm_breakpoint ? 'mt-0' : ' mt-1'}`}>
                        {<DateFormatter dateString={endDate} />}
                      </span>
                    </p>
                  </div>
                  <div 
                    className={`
                      ${isDetailsShown ? 'md:text-base' : 'lg:text-xl'}
                      ${isDetailsShown && sm_breakpoint ? 'bg-item-active px-5 py-2 rounded-md col-span-2' : 'bg-none'}
                      md:block md:col-span-2 lg:mb-0 md:mb-4
                      order-3
                    `}>
                    <span className={`
                      text-[#787C82] lg:inline lg:mt-0 
                        ${isDetailsShown && sm_breakpoint ? 'mt-0' : 'mt-2'}
                    `}>
                      Ежемес{isDetailsShown && sm_breakpoint ? '.' : 'ячный'} платеж{isDetailsShown && sm_breakpoint ? '' : ' по договору'}:&nbsp;
                    </span>
                    <span className="lg:inline mt-1"><PriceFormatter amount={monthly} /></span>
                  </div>
                </div>
                : 
                <PriceFormatter amount={debt ?? 0} /> && (
                  <p className="xl:text-xl lg:text-base mt-2">Сумма долга: &nbsp;
                    <span className={`${debt ? 'text-red-600' : ''}`}>
                      {debt ? '-' : ''}
                      {
                        <PriceFormatter amount={debt ?? 0} />
                      }
                    </span>
                  </p>
                )
              }
              {
                isDetailsShown && md_breakpoint ? 
                <div>
                  {/* <button className="bg-white px-4 py-2 rounded-lg border border-[#6374AD] flex gap-3 text-[#203887] md:w-auto w-full">
                    <svg
                      className="icon lg:ms-0 ms-auto"
                    >
                      <use href={`${sprite_path}#doc-icon`} />
                    </svg>
                    <span className="lg:me-0 me-auto text-nowrap" onClick={(e) => handleDownloadAgree(e, id)}>
                      Скачать договор
                    </span>
                  </button> */}
                  {
                    name.includes(' перем') &&
                    <button className="md:mt-4 mt-7 btn-default px-5 py-2" onClick={() => handleSetDataType('counters')}>
                      Передать показания счетчиков
                    </button>
                  }
                </div> : ''
              }
              {
                isDetailsShown && !md_breakpoint && name.includes(' перем') &&
                <div className="ms-0 lg:mt-4 md:mt-3 mt-3">
                  <button className="lg:mt-4 mt-7 btn-default px-5 py-2 lg:w-auto w-full" onClick={() => handleSetDataType('counters')}>
                    Передать показания счетчиков
                  </button>
                </div>
              }
            </div>
          </div>
          {
            <div className="lg:ms-auto">
              {/* {
                isDetailsShown && (md_breakpoint || sm_breakpoint) ? '' :
                <button className="btn-default lg:w-auto lg:ms-auto lg:mt-0 md:w-auto md:ms-0 bg-white px-4 py-2 rounded-lg border flex gap-3 w-full text-base ms-auto mt-4">
                  <svg
                    className="icon lg:ms-0 ms-auto"
                  >
                    <use href={`${sprite_path}#doc-icon`} />
                  </svg>
                  <span className="lg:me-0 me-auto text-nowrap" onClick={(e) => handleDownloadAgree(e, id)}>
                    Скачать договор
                  </span>
                </button>
              } */}
              {
                isDetailsShown ?
                <div className="
                  lg:p-10 lg:my-auto
                  md:mt-5 md:border-slate-200 md:py-4 py-0
                  rounded-xl bg-white md:border mt-9 text-base text-center h-full flex
                ">
                  <div className="my-auto w-full">
                    <p className="text-nowrap">Общая сумма долга на {today}:</p>
                    <p className={`text-xl lg:mt-4 lg:mb-0 mt-2 ${debt ? 'text-red-600' : ''} font-semibold`}>
                      {debt ? '-' : ''} 
                      <PriceFormatter amount={debt ?? 0} /> 
                    </p>
                  </div>
                </div> : ''
              }
            </div>
          }

        </div>
      }

    </div>
  )
}
export default TheAgreementItem;