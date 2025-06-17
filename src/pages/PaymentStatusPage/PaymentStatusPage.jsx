import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { hideNavbar } from '@/store/slices/navbarSlice';
import { fetchCheckPayment } from '@/store/slices/paymentSlice';
import { fetchAgreementsList } from '@/store/slices/agreementsSlice';

import useMediaQueries from '@/hooks/useMediaQueries';
import PriceFormatter from '@/components/PriceFormatter/PriceFormatter'; 

const PaymentStatusPage = () => {
  const sprite_path = './src/assets/images/i.svg';
  const showNavbar = useSelector((state) => state.navbar.showNavbar);
  const agreementsList = useSelector(state => state.agreements_slice.agreementsList);  
  const { xl_breakpoint, lg_breakpoint, md_breakpoint, sm_breakpoint } = useMediaQueries();
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [paymentData, setPaymentData] = useState(null);  

      // succeeded
      // 2fd49bbe-000f-5001-9000-1c9e0c15df22

      // ???
      // 2fd8908b-000f-5001-9000-12777e1e8082

      // pending
      // 2fd86bab-000f-5000-b000-11fe05401855


  const dispatch = useDispatch();
  
  const sideClick = (event) => {
    event.stopPropagation();
    if (showNavbar) {
      dispatch(hideNavbar());
    }
  };
  useEffect(() => {
    let timer;
    
    const checkPayment = async () => {
      const lastPaymentId = localStorage.getItem('lastPaymentId');
      if (!lastPaymentId) return;

      try {
        const resultAction = await dispatch(fetchCheckPayment(lastPaymentId));
        if (fetchCheckPayment.fulfilled.match(resultAction)) {
          const payload = resultAction.payload;
          setPaymentStatus(payload.status);
          payload.data ? setPaymentData(payload.data) : null;
          
          if (paymentStatus === 'pending') {
            // Продолжаем проверку
            timer = setTimeout(checkPayment, 10000);
          } else if (paymentStatus === 'succeeded') {
            // Успешный платеж
            localStorage.removeItem('lastPaymentId');
          } else if (paymentStatus === 'canceled') {

          }
        }
      } catch (error) {
        console.error('Payment check failed:', error);
        timer = setTimeout(checkPayment, 5000);
      }
    };

    checkPayment();    
    dispatch(fetchAgreementsList());
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [dispatch]);


  const convertDate = (dateString) => {
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString();
    return formattedDate;
  }

  const getContractById = (id) => {
    const paymentAgreement = agreementsList.filter(agree => agree.id == id);    
    return paymentAgreement[0]?.name;
  }

  return (
    <section 
      className={`
        xl:ml-10 xl:px-10 xl:py-10 xl:rounded-x
        lg:ml-8 lg:px-4 lg:py-5 lg:shadow-none
        md:w-full md:px-6 md:ms-8 md:rounded-xl md:shadow-lg
        w-full px-5 ms-0 bg-white shadow-none
        ${md_breakpoint ? 'md:ms-30 md:me-4' : ''}
      `}
      onClick={sideClick}
    >
      <div className="lg:text-base md:text-base text-sm">
        {
          paymentStatus ? 
          <div className="md:justify-start justify-center">
            <div className="text-center p-10 w-full text-[#787C82]">            
              <svg
                className="w-10 h-10 mx-auto"
              >
                <use href={`${sprite_path}#${paymentStatus === 'canceled' ? 'stop-icon' : ''}${paymentStatus === 'pending' ? 'time-icon' : ''}${paymentStatus === 'succeeded' ? 'checked-icon' : ''}
              `} />
              </svg>
              
              <p className={`text-2xl font-semibold mt-4
                ${paymentStatus === 'pending' && 'text-[#787C82]'}
                ${paymentStatus === 'succeeded' && 'text-[#008A21]'}
              `}>
                {paymentStatus === 'canceled' && 'Ваш платеж не прошел'}
                {paymentStatus === 'pending' && 'Ожидание подтверждения получения средств'}
                {paymentStatus === 'succeeded' && 'Оплата прошла успешно'}
              </p>
              <p className="mt-2 text-[#787C82]">
                {paymentStatus === 'canceled' && 'Попробуйте оплатить снова'}
              </p>
            </div>
            {
              paymentData && 
              <div className="bg-item-active rounded-xl lg:p-10 md:p-8 p-6 w-full flex flex-col gap-5">
                <div 
                  className={`               
                    md:block md:col-span-2 lg:mb-0 md:mb-4
                    order-3
                  `}>
                  <span className={`
                    text-[#787C82] lg:inline lg:mt-0 
                  `}>
                    Название договора:&nbsp;
                  </span>
                  <span className="lg:inline mt-1">
                    {getContractById(paymentData.metadata.contractId)}
                  </span>
                </div>
                <div 
                  className={`               
                    md:block md:col-span-2 lg:mb-0 md:mb-4
                    order-3
                  `}>
                  <span className={`
                    text-[#787C82] lg:inline lg:mt-0 
                  `}>
                    Название платежа:&nbsp;
                  </span>
                  <span className="lg:inline mt-1">
                    {paymentData.description}
                  </span>
                </div>
                <div 
                  className={`               
                    md:block md:col-span-2 lg:mb-0 md:mb-4
                    order-3
                  `}>
                  <span className={`
                    text-[#787C82] lg:inline lg:mt-0 
                  `}>
                    Дата платежа:&nbsp;
                  </span>
                  <span className="lg:inline mt-1">
                    {paymentData.paid ? convertDate(paymentData.captured_at) : convertDate(paymentData.created_at)}
                  </span>
                </div>
                <div 
                  className={`               
                    md:block md:col-span-2 lg:mb-0 md:mb-4
                    order-3
                  `}>
                  <span className={`
                    text-[#787C82] lg:inline lg:mt-0 
                  `}>
                    Сумма платежа:&nbsp;
                  </span>
                  <span className="lg:inline mt-1">
                    <PriceFormatter amount={paymentData.amount.value} type="price" />
                  </span>
                </div>
              </div>
            }
          </div> 
          : 
          <div className="md:justify-start justify-center text-center pt-20">
            Нет данных
          </div>
        }
      </div>
    </section>
  )
}
export default PaymentStatusPage;