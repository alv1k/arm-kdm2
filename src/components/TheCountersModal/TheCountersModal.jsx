import { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { dataType, setDataType, setShowModal } from '@/store/slices/modalSlice';
import { fetchSendCountersIndice, setHideCountersModal } from '@/store/slices/agreementsSlice';
import { showToast } from '@/utils/notify';

const CountersModal = () => {
  const sprite_path = './src/assets/images/i.svg';
  const dispatch = useDispatch();  
  const selectedAgreement = useSelector((state) => state.agreements_slice.selectedAgreement);
  const inputRefs = useRef([]);
  
  let address = '';
  selectedAgreement.flatMap(contract => 
    contract.objects.flatMap(object => {
      address = object.address      
    })
  );
  const getCountersIds = () => {
    const allCounters = selectedAgreement.flatMap(contract => 
      contract.objects.flatMap(object => {
        return object.services.flatMap(service => 
          service.counters || []  // Если counters нет, возвращаем пустой массив
        )  
      })
    );
    // Фильтруем уникальные counters по id
    const uniqueCounters = Array.from(new Map(
      allCounters.map(counter => [counter.id, counter])
    ).values());
    return uniqueCounters
  } 
  
  const counters = getCountersIds();  
  

  useEffect(() => {
    inputRefs.current = counters.map((counter, i) => ({
      id: counter.id,       // Сохраняем ID счетчика
      ref: inputRefs.current[i]?.ref || null  // Сохраняем существующий ref или null
    }));
  }, [counters]);

  const getAllValues = () => {
    return inputRefs.current.map(item => ({
      id: item.id,
      value: item.ref?.value
    }));
  };
  
  const handleSetIndice = () => {
    const data = getAllValues();
    data.filter(item => item.value != '')
    data.map(async item => {
      if (item.value != '' && item.value != 0) {
        const response = await dispatch(fetchSendCountersIndice(item))
        console.log(response, 'response here');        
        if (response.payload.success) {
          showToast('Показания счетчиков переданы!', 'success', {
            autoClose: 5000,
          });
          dispatch(setHideCountersModal())
        } else {
          showToast('Ошибка при передаче показаний счетчиков! ' + response.message, 'error', {
            autoClose: 5000,
          });
        }
        window.scrollTo(0, 0);
      }
            
    });
    setTimeout(() => {
      dispatch(setShowModal(false));
    }, 3000);
  }

  return (
      <div className="mb-8">
        <p className="text-center md:text-2xl text-xl font-bold">Передать показания</p>
        <div className="my-8 flex flex-col">
          <div className="md:order-none order-2 md:my-0 my-2 md:flex block"><p className="text-[#787C82]">Текущая дата:&nbsp;</p> {new Date().toLocaleDateString('ru-RU')}</div>
          {/* <div className="md:order-none order-3 my-2 md:flex block"><p className="text-[#787C82]">Период:&nbsp;</p> 20.01.2025 - 20.02.2025</div> */}
          <div className="md:order-none my-2 order-1 block"><span className="text-[#787C82] md:inline block">Адрес:&nbsp;</span>{address}</div>
        </div>
        {          
          Array.isArray(counters) && counters.length > 0 && counters.map((item, index) => (
          <div key={item.id} className="my-6">
            <p>{item.name}</p>
            <p><span className="text-[#787C82]">Номер прибора учета:</span>&nbsp; {item.number != '' ? item.number : 'номер не найден'}</p>
            <input 
              ref={el => {
                if (inputRefs.current[index]) {
                  inputRefs.current[index].ref = el;
                }
              }}
              name={`counter-${index}`}
              className="mt-4 p-5 bg-item-active w-full rounded-xl" 
              type="number"
            />
          </div>
          ))          
        }
        {
          counters.length == 0 && 
          <div>
            Нет данных о счетчиках.
          </div>
        }  
        {
          counters.length != 0 && 
          <div className="my-2 text-center">
            <button className="btn-primary py-2 px-10 md:w-auto w-full" onClick={(e) => handleSetIndice()}>
              Сохранить
            </button>
          </div>
        }
      </div>
      
  )
}
export default CountersModal;