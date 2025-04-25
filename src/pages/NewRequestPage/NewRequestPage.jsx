import React, { useEffect } from 'react';
import { Description, Field, Label, Select } from '@headlessui/react';
// import { ChevronDownIcon } from '@heroicons/react/20/solid';
import clsx from 'clsx';
import { useDispatch, useSelector } from 'react-redux';
import { hideNavbar } from '@/store/navbarSlice';
import { toggleStatus } from '@/store/requestsSlice';
import useMediaQueries from '@/hooks/useMediaQueries'; 
import styles from './NewRequestPage.module.css';
import CustomSelect from '@/components/CustomSelect/CustomSelect'

const NewRequestPage = () => {
  const { xl_breakpoint, lg_breakpoint, md_breakpoint, sm_breakpoint } = useMediaQueries();
  const options = ['Авария', 'Проблема', 'Запрос'];
  const sprite_path = './src/assets/images/i.svg';
  const showNavbar = useSelector((state) => state.navbar.showNavbar);
  const dispatch = useDispatch();
  const backToRequests = () => {
      dispatch(toggleStatus());
  }
  return (
    <div className="lg:text-base md:text-base text-sm md:h-auto h-[110%]">
      <div className="flex md:justify-start justify-center">
        {
          sm_breakpoint || md_breakpoint ? '' :
          <p className="
            xl:mt-0 
            lg:px-6 lg:text-[26px] lg:mt-4
            md:px-2 md:mt-9
            text-xl font-semibold mt-5
          ">
            Новая заявка
          </p>
        }
      </div>
      <div className="
        lg:mt-9 lg:ms-1 
        md:text-left md:ms-2 md:flex
        text-[#203887] text-center font-semibold mt-4 lg:text-base md:text-base text-sm
      ">
        <p className="text-xl">
          Заявка №001
        </p>
        {
          !sm_breakpoint ? 
          <button 
            className="btn-text ms-auto me-4 lg:mt-0 md:mt-0 flex"
            onClick={backToRequests}
          >
            <svg
              className="icon"
            >
              <use href={`${sprite_path}#back-icon`} />
            </svg>
            
            Назад
          </button> : ''
        }
      </div>
      <div className="lg:w-4/5 w-full pt-5 flex flex-col md:gap-2 gap-5">
        <div className='lg:flex lg:gap-5 block'>
          <div className="lg:mt-0 mt-4 w-full lg:w-1/2">
            {
              !sm_breakpoint ? <span className="text-[#787C82]">Название помещения</span> : ''
            }
            <input 
              className="w-full rounded-lg p-5 bg-item-active" 
              type="text" 
              placeholder={`${!sm_breakpoint ? 'Введите' : 'Название помещения'}`}
            />
          </div>
          <div className="lg:mt-0 mt-4 w-full lg:w-1/2">
            {
              !sm_breakpoint ? <span className="text-[#787C82] md:mt-2">Тема обращения</span> : ''
            }
            {/* <select className="w-full rounded-lg px-4 py-5 bg-item-active text-[#787C82]" name="" id="">
              <option   hidden disabled defaultValue selected>
                {
                  !sm_breakpoint ? 'Выбрать' : 'Тема обращения'
                }
              </option>
              <option className="text-black max-w-[100px]" value="disaster">Авария</option>
            </select> */}
            <CustomSelect options={options} defaultValue={sm_breakpoint ? 'Тема обращения' : 'Выбрать'} />
          </div>
        </div>
        {
          !sm_breakpoint ? <span className="text-[#787C82] md:mt-2">Описание заявки</span> : ''
        }
        <textarea 
          className="w-full rounded-lg px-5 py-4 bg-item-active md:min-h-43 min-h-50"
          placeholder={`${!sm_breakpoint ? 'Введите текст' : 'Описание заявки'}`}
        ></textarea>
        <p className="text-[#787C82] md:mt-2">Прикрепить файл</p>
        <div className="
          md:w-fit md:flex md:p-5 md:flex-row-reverse 
          w-full rounded-lg px-5 py-3 mb-1 bg-item-active text-center items-center
        ">
          <p className="text-[#787C82] md:pb-0 md:ps-10 pb-4 md:pe-6">Файл не выбран</p>
          <button className="md:w-auto md:px-5 w-full rounded-lg p-2 btn-default">
            Выберите файл
          </button>
        </div>
      </div>
      <button className="btn-primary py-2 md:w-auto md:px-10 md:mt-8 w-full mt-11" type="submit">
        Отправить
      </button>
    </div>
  )
}
export default NewRequestPage;