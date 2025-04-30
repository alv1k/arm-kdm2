import { useEffect, useState } from 'react';
import { dataType, setDataType, setShowModal } from '@/store/slices/modalSlice';
import { useSelector, useDispatch } from 'react-redux';

const CountersModal = () => {
  const sprite_path = './src/assets/images/i.svg';
  
  return (
      <div className="mb-8">
        <p className="text-center md:text-2xl text-xl font-bold">Передать показания</p>
        <div className="my-8 flex flex-col">
          <p className="md:order-none order-2 md:my-0 my-2 md:flex block"><p className="text-[#787C82]">Текущая дата:&nbsp;</p> 20.02.2025</p>
          <p className="md:order-none order-3 my-2 md:flex block"><p className="text-[#787C82]">Период:&nbsp;</p> 20.01.2025 - 20.02.2025</p>
          <p className="md:order-none order-1 md:flex block"><p className="text-[#787C82]">Адрес:&nbsp;</p> г. Якутск, ул. Ленина 123, 1 этаж, каб. №123</p>
        </div>
        <div className="my-6">
          <p>ХВС</p>
          <p><span className="text-[#787C82]">Номер прибора учета:</span>&nbsp; 0123456</p>
          <input className="mt-4 p-5 bg-item-active w-full rounded-xl" type="number" placeholder='' />
        </div>
        <div className="my-6">
          <p>ГВС</p>
          <p><span className="text-[#787C82]">Номер прибора учета:</span>&nbsp; 0123456</p>
          <input className="mt-4 p-5 bg-item-active w-full rounded-xl" type="number" placeholder='' />
        </div>
        <div className="my-6">
          <p>Электроэнергия</p>
          <p><span className="text-[#787C82]">Номер прибора учета:</span>&nbsp; 0123456</p>
          <input className="mt-4 p-5 bg-item-active w-full rounded-xl" type="number" placeholder='' />
        </div>
        <div className="my-2 text-center">
          <button className="btn-primary py-2 px-10 md:w-auto w-full">
            Сохранить
          </button>
        </div>
      </div>
      
  )
}
export default CountersModal;