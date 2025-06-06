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
  useEffect(async () => {
    let lastPaymentId = localStorage.getItem('lastPaymentId') ?? null;
    let response = null;
    lastPaymentId ? setTimeout(response = await dispatch(fetchCheckPayment(lastPaymentId)), 5000) : null;
    if (response) {
      console.log(response, 'response');
    } else {
      console.log('no response');
    }
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
        <div className="flex md:justify-start justify-center">
          success
        </div>
      </div>
    </section>
  )
}
export default PaymentStatusPage;