import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { hideNavbar } from '@/store/slices/navbarSlice';
import { toggleTabs  } from '@/store/slices/tabsSlice';
import { isNew } from '@/store/slices/requestsSlice';
import { fetchAuth } from '@/store/slices/authSlice';
import { fetchContactsList } from '@/store/slices/contactsSlice';
import useMediaQueries from '@/hooks/useMediaQueries';

const ContactsPage = () => {
  const sprite_path = './src/assets/images/i.svg';
  const showNavbar = useSelector((state) => state.navbar.showNavbar);
  const contactData = useSelector((state) => state.contacts_slice.contacts);
  
  // const tabs = useSelector((state) => state.tabs_slice.tabs);
  // useEffect(() => {
  //   dispatch(fetchAgreementsList()); // Загружаем список договоров при монтировании компонента
  // }, [dispatch]);  
  
  const { xl_breakpoint, lg_breakpoint, md_breakpoint, sm_breakpoint } = useMediaQueries();
  const dispatch = useDispatch();
  const sideClick = (event) => {
    event.stopPropagation();
    if (showNavbar) {
      dispatch(hideNavbar());
    }
  };
  useEffect(() => {
    dispatch(fetchAuth())
    dispatch(fetchContactsList())
  }, [dispatch]);

  
  const locations = [
    {
      city: "Якутск",
      phone: "+7 (4112) 482-504",
      email: "info@aokdm.ru",
      address: "г. Якутск, ул. Кирова, 12",
      mapLink: "https://yandex.ru/maps/-/CHvP6GYP"
    }
  ];  

  const ContactCards = () => {
    return (
      <div className="grid md:grid-cols-2 gap-4">
        {locations.map((location, index) => (
          <div key={index} className={`rounded-xl bg-item-active p-8 md:mb-0 mb-4`}>
            <p className="text-2xl font-bold mb-8">{location.city}</p>
            
            {/* Статические контакты локации */}
            <p className="my-4">
              <span className="text-[#787C82]">Телефон:</span> &nbsp;          
              <a href={`tel:${location.phone.replace(/\D/g, '')}`}>
                {location.phone}
              </a>
            </p>
            <p className="my-4">
              <span className="text-[#787C82]">Эл. почта:</span> &nbsp;
              <a href={`mailto:${location.email}`}>
                {location.email}
              </a>
            </p>
            <p className="my-4">
              <span className="text-[#787C82]">Адрес:</span> &nbsp;          
              <a href={location.mapLink} target="_blank" rel="noopener noreferrer">
                {location.address}
              </a>
            </p>

            {/* Динамические контакты из JSON */}
            {contactData.Curators.map((contact, i) => (
              <div key={i} className="mt-6 pt-6 border-t border-gray-200">
                <p className="my-4">
                  <span className="text-[#787C82]">Ответственный:</span> &nbsp;
                  {contact.responsible}
                </p>
                <p className="my-4">
                  <span className="text-[#787C82]">Контактный телефон:</span> &nbsp;
                  <a href={`tel:${contact.phone.replace(/\D/g, '')}`}>
                    {contact.phone}
                  </a>
                </p>
                <p className="my-4">
                  <span className="text-[#787C82]">Контактный email:</span> &nbsp;
                  <a href={`mailto:${contact.email}`}>
                    {contact.email}
                  </a>
                </p>
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  };

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
            sm_breakpoint ? '' :
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
            {locations.map((location, index) => (
              <div key={index} className={`rounded-xl bg-item-active p-8 md:mb-0 mb-4`}>
                <p className="text-2xl font-bold mb-8">{location.city}</p>
                
                {/* Статические контакты локации */}
                <p className="my-4">
                  <span className="text-[#787C82]">Телефон:</span> &nbsp;          
                  <a href={`tel:${location.phone.replace(/\D/g, '')}`}>
                    {location.phone}
                  </a>
                </p>
                <p className="my-4">
                  <span className="text-[#787C82]">Эл. почта:</span> &nbsp;
                  <a href={`mailto:${location.email}`}>
                    {location.email}
                  </a>
                </p>
                <p className="my-4">
                  <span className="text-[#787C82]">Адрес:</span> &nbsp;          
                  <a href={location.mapLink} target="_blank" rel="noopener noreferrer">
                    {location.address}
                  </a>
                </p>

                {/* Динамические контакты из JSON */}
                {contactData.Curators.map((contact, i) => (
                  <div key={i} className="mt-6 pt-6 border-t border-gray-200">
                    <p className="my-4">
                      <span className="text-[#787C82]">Ответственный:</span> &nbsp;
                      {contact.responsible}
                    </p>
                    <p className="my-4">
                      <span className="text-[#787C82]">Контактный телефон:</span> &nbsp;
                      <a href={`tel:${contact.phone.replace(/\D/g, '')}`}>
                        {contact.phone}
                      </a>
                    </p>
                    <p className="my-4">
                      <span className="text-[#787C82]">Контактный email:</span> &nbsp;
                      <a href={`mailto:${contact.email}`}>
                        {contact.email}
                      </a>
                    </p>
                  </div>
                ))}
              </div>
            ))}
          </div>
          {/* Динамические контакты из JSON */}
          {/* {
            
            <ul>
              {Object.entries(contactData.requisits).map(([key, value]) => (
                <li key={key}>
                  <strong>{key}:</strong> {String(value)}
                </li>
              ))}
            </ul>
          } */}

          <div>

          </div>
      </div>
    </section>
  )
}
export default ContactsPage;