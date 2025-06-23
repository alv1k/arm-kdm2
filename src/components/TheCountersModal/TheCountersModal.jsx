import { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setDataType, setShowModal } from '@/store/slices/modalSlice';
import { fetchSendCountersIndice, setHideCountersModal } from '@/store/slices/agreementsSlice';
import { invalidToken } from '@/store/slices/userSlice';
import PriceFormatter from '@/components/PriceFormatter/PriceFormatter'; 
import { showToast } from '@/utils/notify';

const CountersModal = () => {
  const sprite_path = './src/assets/images/i.svg';
  const dispatch = useDispatch();  
  const selectedAgreement = useSelector((state) => state.agreements_slice.selectedAgreement);
  let inputRefs = useRef([]);
  
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
  let countersData = [];
  const counters = getCountersIds();
  useEffect(() => {
    // Инициализируем refs только если массив counters изменился
    if (counters.length !== inputRefs.length) {
      countersData = counters.map((counter, i) => ({
        id: counter.id,
        ref: inputRefs[i], // Создаем новый ref для каждого элемента
        end_indice: counter.end_indice
      }));
    }  
}, [counters]); // Зависимость только от counters

  const getAllValues = () => {
    
    return countersData.map(item => ({
      id: item.id,
      value: item.ref?.value,
      refElement: item.ref,
      minValue: item.end_indice
    }));
  };
  
  const handleSetIndice = async () => {
    
    const data = getAllValues();
       
    let filtered_data = data.filter(item => item.value)
    
    const sendCountersIndice = async () => {

      const response = await dispatch(fetchSendCountersIndice(filtered_data));
  
      if (response && response.payload.success) {
        showToast('Показания счетчиков переданы!', 'success', {
          autoClose: 5000,
        });
      }
      dispatch(setShowModal(false))
    }
    
    for (const item of filtered_data) {
      if (Number(item.value) < item.minValue && item.value != undefined) {
        showToast('Введите значение больше/равно предыдущему значению!', 'error', {
          autoClose: 5000,
        });
        item.refElement.classList.add('danger_animation');
        setTimeout(() => item.refElement.classList.remove('danger_animation'), 3000);
      } else {
        sendCountersIndice();      
      }
    }
    
    window.scrollTo(0, 0);
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
            <p><span className="text-[#787C82]">Предыдущее значение:</span>&nbsp; 
              {item.end_indice != '' ? <PriceFormatter amount={item.end_indice} /> : 'не найдено'}
            </p>
            <input 
              key={item.id}
              ref={el => inputRefs[index] = el}
              // ref={el => {
              //   if (inputRefs.current[index]) {
              //     inputRefs.current[index].ref = el;
              //   }
              // }}
              name={`counter-${index}`}
              className="mt-4 p-5 bg-item-active w-full rounded-xl" 
              type="number"
              min={item.end_indice}
              onWheel={(e) => e.currentTarget.blur()}
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