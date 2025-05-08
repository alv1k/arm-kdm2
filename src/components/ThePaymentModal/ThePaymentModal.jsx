import { useState } from 'react';
import CustomCheckbox from '@/components/CustomCheckbox/CustomCheckbox';

const PaymentModal = (props) => {
  const [selectedOption, setSelectedOption] = useState(null);
  let data = props.data;
  
  const paymentOptions = [
    { id: 'card', label: 'Банковская карта' },
    { id: 'invoice', label: 'Счет' },
    { id: 'qr', label: 'QR код' },
    { id: 'receipt', label: 'Квитанция' }
  ];

  const handleOptionClick = (optionId) => {
    setSelectedOption(optionId);
  };
  
  return (
    <div className="mb-8">
      <p className="text-center md:text-2xl text-xl font-bold text-[#203887]">Способ оплаты</p>
      
      <div className="my-8 flex flex-col">
        <div className="my-2 md:flex block font-semibold">№001. Счет за аренду</div>
        <div className="md:my-0 my-2 md:flex block">
          <p className="text-[#787C82]">Дата:&nbsp;</p> 
          {data.date}
        </div>
      </div>
      
      <div className="my-6">
        {paymentOptions.map((option) => (
          <div 
            key={option.id}
            className="my-3 flex p-5 bg-item-default rounded-lg justify-between cursor-pointer"
            onClick={() => handleOptionClick(option.id)}
          >
            <label className="cursor-pointer">
              {option.label}
            </label>
            <CustomCheckbox 
              id={option.id} 
              label="&nbsp;"
              checked={selectedOption === option.id} 
              onChange={() => handleOptionClick(option.id)}
              type="payment"
            />
          </div>
        ))}
      </div>
      
      <div className="my-2 text-center">
        <button className="btn-success py-2 px-10 md:w-auto w-full" selectedOption={selectedOption}>
          Оплатить
        </button>
      </div>
    </div>
  );
};

export default PaymentModal;