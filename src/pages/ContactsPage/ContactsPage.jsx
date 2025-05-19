import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { hideNavbar } from '@/store/slices/navbarSlice';
import { toggleTabs  } from '@/store/slices/tabsSlice';
import { isNew } from '@/store/slices/requestsSlice';
import { fetchAuth } from '@/store/slices/authSlice';
import useMediaQueries from '@/hooks/useMediaQueries';

import Header from '@/components/TheHeader/TheHeader';
import TheNavbar from '@/components/TheNavbar/TheNavbar';
import TheTabsComponent from '@/components/TheTabsComponent/TheTabsComponent';
import TheDocsListComponent from '@/components/TheDocsListComponent/TheDocsListComponent'


const ContactsPage = () => {
  const sprite_path = './src/assets/images/i.svg';
  const showNavbar = useSelector((state) => state.navbar.showNavbar);
  const isNewRequest = useSelector(isNew);
  // const tabs = useSelector((state) => state.tabs_slice.tabs);
  // useEffect(() => {
  //   dispatch(fetchAgreementsList()); // Загружаем список договоров при монтировании компонента
  // }, [dispatch]);  
  
  const { xl_breakpoint, lg_breakpoint, md_breakpoint, sm_breakpoint } = useMediaQueries();
  const [height1, changeHeight1] = useState('600px')
  const [testShow, changeTest] = useState(false);

  const dispatch = useDispatch();
  const sideClick = (event) => {
    event.stopPropagation();
    if (showNavbar) {
      dispatch(hideNavbar());
    }
  };
  useEffect(() => {
    dispatch(fetchAuth())
  }, [dispatch]);

    const locations = Array.from({ length: 4 }, (_, index) => (
      <div key={index} className={`rounded-xl bg-item-active p-8 md:mb-0 mb-4 `}>
        <p className="text-2xl font-bold mb-8">Якутск</p>
        <p className="my-4">
          <span className="text-[#787C82]">Телефон:</span> &nbsp;
          +7 (4112) 482-504
        </p>
        <p className="my-4">
          <span className="text-[#787C82]">Эл. почта:</span> &nbsp;
          info@aokdm.ru
        </p>
        <p className="my-4">
          <span className="text-[#787C82]">Адрес:</span> &nbsp;
          г. Якутск, ул. Кирова, 12
        </p>
      </div>
    ));
  


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
          {
            isNewRequest && sm_breakpoint ? '' :
            <p className="
              xl:mt-0 
              lg:px-6 lg:text-[26px] lg:mt-4
              md:px-2 md:mt-9
              text-xl font-bold mt-5
            ">
              Контакты
            </p>
          }
        </div>
        <div className="p-4 mt-6 text-base md:grid md:grid-cols-2 gap-8">
            {locations}
        </div>
      </div>
    </section>
  )
}
export default ContactsPage;