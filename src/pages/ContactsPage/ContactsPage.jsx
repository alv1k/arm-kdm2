import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { hideNavbar } from '@/store/slices/navbarSlice';
import { toggleTabs  } from '@/store/slices/tabsSlice';
import { isNew } from '@/store/slices/requestsSlice';
import { showToast } from '@/utils/notify';
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

  
  const location = 
    {
      city: "Якутск",
      phone: "+7 (4112) 482-504",
      email: "info@aokdm.ru",
      address: "г. Якутск, ул. Кирова, 12",
      mapLink: "https://yandex.ru/maps/-/CHvP6GYP"
    }
  ;  

  const ContactCards = () => {
    return (
      <div className="grid md:grid-cols-2 gap-4">
          <div className={`rounded-xl bg-item-active p-8 md:mb-0 mb-4`}>
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
            {contactData?.Curators?.map((contact, i) => (
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
        
      </div>
    );
  };

  const CopyIcon = () => {
    return (
      <svg
        className="icon absolute -right-10 top-1/2 -translate-y-1/2
          w-5 h-5 opacity-0 group-hover:opacity-100
          max-md:hover:opacity-0
          transition delay-150 duration-300 ease-in-out
          hidden md:block"
      >
        <use href={`${sprite_path}#copy-icon`} />
      </svg>
    )
  }

  const handleCopyValue = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
          console.log('Text copied successfully!');      
          showToast( <div>
                      Скопировано!<br />
                      <span className="text-xs">{text}</span>
                    </div>, 'success', {
            autoClose: 1000,
          });
      })
      .catch(err => {    
        console.error('Failed to copy text: ', err);
          showToast( 'Не удалось скопировать', 'error', {
            autoClose: 1000,
          });
      });
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
        <div className="p-4 mt-6 text-base md:grid md:grid-cols-2 gap-5">
          <div className={`rounded-xl bg-item-active lg:p-10 md:p-6 p-5 md:mb-0 mb-4`}>
            <p className="md:text-xl text-base font-bold mb-8">{location.city}</p>
            
            {/* Статические контакты локации */}
            <p className="my-4 md:text-base text-sm">
              <span className="text-[#787C82]">Телефон:</span> &nbsp;          
              <a href={`tel:${location.phone.replace(/\D/g, '')}`}>
                {location.phone}
              </a>
            </p>
            <p className="my-4 md:text-base text-sm">
              <span className="text-[#787C82]">Эл. почта:</span> &nbsp;
              <a href={`mailto:${location.email}`}>
                {location.email}
              </a>
            </p>
            <p className="my-4 md:text-base text-sm">
              <span className="text-[#787C82]">Адрес:</span> &nbsp;          
              <a href={location.mapLink} target="_blank" rel="noopener noreferrer">
                {location.address}
              </a>
            </p>

            {/* Динамические контакты из JSON */}
            {contactData?.Curators?.map((contact, i) => (
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
          {
            contactData?.Curators?.map((curator) => (
              <div>
                {curator}
              </div>
            ))
          }
          <div className="rounded-xl col-span-2 flex flex-col gap-3 bg-item-default lg:p-10 md:p-6 p-5 md:mb-0 mb-4">
            <p className="md:text-xl text-base font-semibold">Реквизиты {contactData?.requisits?.name.shortname}</p>
            <div className="flex">
              <div className="flex flex-col gap-3 md:text-base text-sm">
                <p className="w-fit relative group max-md:hover:after:hidden cursor-pointer" onClick={() => handleCopyValue(contactData?.requisits?.name.fullname)}>
                  <span className="text-[#787C82]">Полное  название:</span>
                  &nbsp;{contactData?.requisits?.name.fullname}
                  {CopyIcon()}
                </p>
                <p className="w-fit relative group max-md:hover:after:hidden cursor-pointer" onClick={() => handleCopyValue(contactData?.requisits?.urAddress)}>
                  <span className="text-[#787C82]">Юридический адрес:</span>
                  &nbsp;{contactData?.requisits?.urAddress}
                  {CopyIcon()}
                </p>

                <p className="w-fit relative group max-md:hover:after:hidden cursor-pointer" onClick={() => handleCopyValue(contactData?.requisits?.inn)}>
                  <span className="text-[#787C82]">ИНН::</span>
                  &nbsp;{contactData?.requisits?.inn}
                  {CopyIcon()}
                </p>
                <p className="w-fit relative group max-md:hover:after:hidden cursor-pointer" onClick={() => handleCopyValue(contactData?.requisits?.kpp)}>
                  <span className="text-[#787C82]">КПП:</span>
                  &nbsp;{contactData?.requisits?.kpp}
                  {CopyIcon()}
                </p>



                {/* <p className=" ">
                  <span className="text-[#787C82]">Почтовый адрес:</span>
                  &nbsp;{contactData?.requisits?.postAddress}
                </p> */}
                <p className="w-fit relative group max-md:hover:after:hidden cursor-pointer" onClick={() => handleCopyValue(contactData?.requisits?.bank.name)}>
                  <span className="text-[#787C82]">Наименование банка:</span>
                  &nbsp;{contactData?.requisits?.bank.name}
                  {CopyIcon()}
                </p>
                <p className="w-fit relative group max-md:hover:after:hidden cursor-pointer" onClick={() => handleCopyValue(contactData?.requisits?.bank.Account)}>
                  <span className="text-[#787C82]">Р/с:</span>
                  &nbsp;{contactData?.requisits?.bank.Account}
                  {CopyIcon()}
                </p>
                <p className="w-fit relative group max-md:hover:after:hidden cursor-pointer" onClick={() => handleCopyValue(contactData?.requisits?.bank.KorrAccount)}>
                  <span className="text-[#787C82]">К/с:</span>
                  &nbsp;{contactData?.requisits?.bank.KorrAccount}
                  {CopyIcon()}
                </p>
                <p className="w-fit relative group max-md:hover:after:hidden cursor-pointer" onClick={() => handleCopyValue(contactData?.requisits?.bank.BIK)}>
                  <span className="text-[#787C82]">БИК:</span>
                  &nbsp;{contactData?.requisits?.bank.BIK}
                  {CopyIcon()}
                </p>
              </div>
              {
                (sm_breakpoint || md_breakpoint) &&
                <div className={md_breakpoint ? 'w-1/5' : 'w-2/5'}> </div>
              }
            </div>
            <div className="flex flex-col gap-3 hidden md:text-base text-sm">
              <p className="">
                <span className="text-[#787C82]">ОГРН:</span>
                &nbsp;{contactData?.requisits?.ogrn}
              </p>
              <p className="">
                <span className="text-[#787C82]">ОКАТО:</span>
                &nbsp;{contactData?.requisits?.okato}
              </p>
              <p className="">
                <span className="text-[#787C82]">ОКФС:</span>
                &nbsp;{contactData?.requisits?.okfs}
              </p>
              <p className="">
                <span className="text-[#787C82]">ОКОГУ:</span>
                &nbsp;{contactData?.requisits?.okogu}
              </p>
              <p className="">
                <span className="text-[#787C82]">ОКОПФ:</span>
                &nbsp;{contactData?.requisits?.okopf}
              </p>
              <p className="">
                <span className="text-[#787C82]">ОКПО:</span>
                &nbsp;{contactData?.requisits?.okpo}
              </p>
              <p className="">
                <span className="text-[#787C82]">ОКТМО:</span>
                &nbsp;{contactData?.requisits?.oktmo}
              </p>
              <p className="">
                <span className="text-[#787C82]">ОКВЭД:</span>
                &nbsp;{contactData?.requisits?.okved}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
export default ContactsPage;