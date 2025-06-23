import { useEffect, useState, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useDispatch, useSelector } from 'react-redux';
import CustomCheckbox from '@/components/CustomCheckbox/CustomCheckbox';
import DateFormatter from '@/components/DateFormatter/DateFormatter';
import { fetchDowloadFile } from '@/store/slices/agreementsSlice';
import { fetchPayment } from '@/store/slices/paymentSlice';
import { setShowModal } from '@/store/slices/modalSlice';
import { downloadAndPrintPDF } from '@/utils/fileDownload';
import { showToast } from '@/utils/notify';

const PaymentModal = (props) => {

  const dispatch = useDispatch();

  const [selectedOption, setSelectedOption] = useState(null);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [paymentSum, setPaymentSum] = useState();
  const [qrUrl, setQrUrl] = useState(null);  
  const profileFetchedData = useSelector((state) => state.user_slice.profileData);
  const selectedAgreement = useSelector((state) => state.agreements_slice.selectedAgreement);   
  const [userEmail, setUserEmail] = useState(null);

  let data = props.data;
  
  useEffect(() => {
    if (shouldAnimate) {
      const timer = setTimeout(() => setShouldAnimate(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [shouldAnimate]);
  useEffect(() => {
    setPaymentSum(data.status === 'not payd' ? data.summ : data.notpaydsum);
  }, [data]);
  useEffect(() => {
    setUserEmail(profileFetchedData.email);
  }, [profileFetchedData]);

  const paymentOptions = [
    { id: 'card', label: 'Банковская карта' },
    { id: 'invoice', label: 'Счет' },
    { id: 'qr', label: 'QR код' },
    // { id: 'receipt', label: 'Квитанция' }
  ];

  const handleOptionClick = (optionId) => {
    setSelectedOption(optionId);
  };

  let payload = {
    
    amount: paymentSum,
    description: data.number + '. ' + data.descr,
    createReceipt: true,
    email: userEmail,
    phone: profileFetchedData.phone,
    userId: profileFetchedData.id,
    contractId: selectedAgreement[0].id,
    items: [
      {
        description: data.descr,
        quantity: 1,
        amount: paymentSum,
        vatCode: 1
      }
    ]
  }

  let response = null;

  const handleCreatePayment = async () => {
    if (!selectedOption) {      
      showToast('Выберите один из вариантов!', 'error', {
        autoClose: 5000,
      });
      setShouldAnimate(true); // Активируем анимацию
      return;
    }    
    if (userEmail && (!userEmail.includes('@') || !userEmail.includes('.'))) {   
      showToast('Введите корректный адрес электронной почты', 'error', {
        autoClose: 5000,
      });
      return;
    }
    response = payload.userId && payload.contractId && payload.amount ? await dispatch(fetchPayment(payload)) : null;
    if (response && response.payload.success && selectedOption === 'card') {  
      window.location.href = response.payload.paymentUrl;
      localStorage.setItem('lastPaymentId', response.payload.paymentId);
      setTimeout(() => {        
        dispatch(setShowModal());
      }, 1000);
    } else if (response && response.payload.success && selectedOption === 'invoice') {
      handleFileDownload(data);
      setTimeout(() => {        
        dispatch(setShowModal());
      }, 1000);
    } else if (response && response.payload.success && selectedOption === 'qr') {
      // show qr code
      setQrUrl(response.payload.paymentUrl);
      localStorage.setItem('lastPaymentId', response.payload.paymentId);      
    } else {
      dispatch(invalidToken());
      window.location.href = '/login';
      showToast('Ошибка при передаче данных! ' + response.payload, 'error', {
        autoClose: 5000,
      });
    };  
  }

  const handleFileDownload = async (item) => {
    try {
      const resultAction = await dispatch(fetchDowloadFile(item.id))
      const doc_name = item.descr + item.number;

      const fileData = resultAction.payload;
      if (fileData.length == 0) {
        showToast('Файл не найден!', 'error', {
          autoClose: 5000,
        });
      } else if (typeof fileData == 'object') {        
        fileData.map(item => {
          if (item?.dataUrl) {
            downloadAndPrintPDF(item.dataUrl, doc_name);
          } else {
            console.error(`Файл ${item.type} не загружен: отсутствует dataUrl`);
          }
        })
      }
      
    } catch (error) {
      console.error("Ошибка загрузки файла:", error);
    }  
  }
  
  const changePaymentSumHandler = (e) => {
    const newSum = Math.max(0, e.target.value)
    setPaymentSum(Number(newSum) || 0);
  }
  const changeUserEmailHandler = (e) => {
    const newEmail = e.target.value;
    setUserEmail(newEmail);
  }

  
      // {
      //   "amount": 1500.50,
      //   "description": "Оплата за аренду",
      //   "createReceipt": true,
      //   "email": "client@example.com",
      //   "phone": "+7900123456",
      //   "items": [
      //     {
      //       "description": "Аренда помещения за январь 2025",
      //       "quantity": 1,
      //       "amount": 1500.50,
      //       "vatCode": 1
      //     }
      //   ]
      // }


  return (
    <div className="mb-8">
      <p className="text-center md:text-2xl text-xl font-bold text-[#203887]">Способ оплаты</p>      
      <div className="my-8 flex flex-col">
        <div className="my-2 md:flex block font-semibold">№{data.number}. {data.descr}</div>
        <div className="md:my-0 my-2 md:flex block">
          <p className="text-[#787C82]">Дата:&nbsp;</p> 
          <DateFormatter dateString={data.date} />
        </div>
        <div className="my-2">
          <p className="text-[#787C82]">Сумма:&nbsp;</p> 
          <input 
            className="bg-item-default roundedd-4 p-3 w-full" 
            type="number" 
            value={paymentSum || ''}
            onChange={(e) => changePaymentSumHandler(e)}
            onWheel={(e) => e.currentTarget.blur()}
          />
        </div>
        <div className="my-2">
          <p className="text-[#787C82]">Эл.почта:&nbsp;</p> 
          <input 
            className="bg-item-default roundedd-4 p-3 w-full" 
            type="email" 
            value={userEmail || ''}
            onChange={(e) => changeUserEmailHandler(e)}
          />
        </div>

      </div>
      
      {
        qrUrl ? 
        <QRCodeSVG className="mx-auto" value={qrUrl} size={200} />
        : 
        <div>
          <div className="my-6">
            {              
              paymentOptions.map((option) => (
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
                    type="payment"
                    animate={shouldAnimate}
                  />
                </div>
              ))
            }
          </div>      
          <div className="my-2 text-center">
            <button 
              className="btn-success py-2 px-10 md:w-auto w-full" 
              selectedOption={selectedOption}
              onClick={handleCreatePayment}
            >
              Оплатить
            </button>
          </div>

        </div>
      }
    </div>
  );
};

export default PaymentModal;