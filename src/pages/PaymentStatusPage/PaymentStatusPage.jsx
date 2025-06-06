import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { hideNavbar } from '@/store/slices/navbarSlice';
import { fetchCheckPayment } from '@/store/slices/paymentSlice';
import useMediaQueries from '@/hooks/useMediaQueries';

const PaymentStatusPage = () => {
  const sprite_path = './src/assets/images/i.svg';
  const showNavbar = useSelector((state) => state.navbar.showNavbar);  
  const { xl_breakpoint, lg_breakpoint, md_breakpoint, sm_breakpoint } = useMediaQueries();
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
          const { success } = resultAction.payload;
          
          if (success) {
            // Успешный платеж
            dispatch(paymentSuccess(resultAction.payload));
            localStorage.removeItem('lastPaymentId');
          } else {
            // Продолжаем проверку
            timer = setTimeout(checkPayment, 5000);
          }
        }
      } catch (error) {
        console.error('Payment check failed:', error);
        timer = setTimeout(checkPayment, 5000);
      }
    };

    checkPayment();
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [dispatch]);


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
        <div className="md:justify-start justify-center">
          <div className="text-center p-10 w-full text-[#787C82]">            
            <svg
              className="w-10 h-10 mx-auto"
            >
              <use href={`${sprite_path}#stop-icon`} />
            </svg>
            
            <svg
              className="w-10 h-10 mx-auto"
            >
              <use href={`${sprite_path}#time-icon`} />
            </svg>
            <svg
              className="w-10 h-10 mx-auto"
            >
              <use href={`${sprite_path}#checked-icon`} />
            </svg>
            <p className="text-2xl font-semibold mt-4">
              Ваш платеж не прошел
            </p>
            <p className="mt-2">
              Попробуйте оплатить снова
            </p>
          </div>
          <div className="bg-item-active rounded-xl p-10 w-full ">

          </div>
        </div>
      </div>
    </section>
  )
}
export default PaymentStatusPage;