import { useEffect, useState } from 'react';
import { dataType, setDataType, setShowModal } from '@/store/slices/modalSlice';
import { useSelector, useDispatch } from 'react-redux';
import CountersModal from '@/components/TheCountersModal/TheCountersModal';
import PaymentModal from '@/components/ThePaymentModal/ThePaymentModal'

const TheModal = () => {
  const sprite_path = './src/assets/images/i.svg';
  
  const dispatch = useDispatch();
  const typeOfModal = useSelector(dataType);
  const dataOfModal = useSelector((state) => state.modal_slice.dataOfModal);
  
  const handleCloseModal = () => {
    dispatch(setShowModal())
  }
  const handleClick = (e) => {
    e.stopPropagation()
  }

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') handleCloseModal();
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
  // Добавляем анимацию появления/исчезновения
  if (!typeOfModal) return null; // Не рендерим модалку, если typeOfModal не задан

  
  return (
    <div className={`opacity-0 animate-fadeIn
      md:fixed inset-0 bg-[#00000033] z-20 flex items-center justify-center overflow-auto
    `} onClick={() => handleCloseModal()} >
      <div className="bg-white p-12 h-fit my-auto rounded-xl w-[645px]" onClick={(e) => handleClick(e)} >
        <svg
          className="icon ms-auto cursor-pointer"
          onClick={() => handleCloseModal()}
        >
          <use href={`${sprite_path}#close-icon`} />
        </svg>
        {typeOfModal === 'counters' &&  <CountersModal  onClick={(e) => handleClick(e)}  />}
        {typeOfModal === 'payment' &&  <PaymentModal data={dataOfModal} onClick={(e) => handleClick(e)}  />}
      </div>
    </div>
  )
}
export default TheModal;