import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { requestStatusTrue, requestStatusFalse, fetchNewRequest, fetchRequestsList } from '@/store/slices/requestsSlice';
import { getBase64 } from '@/utils/getBase64';
import useMediaQueries from '@/hooks/useMediaQueries';
import CustomSelect from '@/components/CustomSelect/CustomSelect';
import { showToast } from '@/utils/notify';

const NewRequestPage = () => {
  const { xl_breakpoint, lg_breakpoint, md_breakpoint, sm_breakpoint } = useMediaQueries();
  const types = ['Авария', 'Проблема', 'Запрос'];
  const sprite_path = './src/assets/images/i.svg';
  const showNavbar = useSelector((state) => state.navbar.showNavbar);
  const allObjects = useSelector((state) => state.agreements_slice.allObjects)
  const isNewRequestSaved = useSelector((state) => state.requests_slice.isNewRequestSaved)
  const dispatch = useDispatch();
  const [selectedObject, setSelectedObject] = useState("");
  const [requestDescr, setRequestDescr] = useState("");  
  const [selectedType, setSelectedType] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [error, setError] = useState(null);

  function getUniqueById(options) {
    if (!Array.isArray(options)) return [];
    
    const idMap = new Map();
    
    options.forEach(option => {
      if (option?.id && !idMap.has(option.id)) {
        idMap.set(option.id, option);
      }
    });
    
    return Array.from(idMap.values());
  }
  
  // Использование
  const cleanedObjects = getUniqueById(allObjects);

  const handleDataSelectedObject = (data) => {
    data = data.split('-').join();
    setSelectedObject(data);
  };
  const handleDataSelectedType = (data) => {
    setSelectedType(data);
  };  

  const backToRequests = () => {
    dispatch(requestStatusFalse());
  }
  const handleCreateNewRequest = () => {
    const data = {
      object: selectedObject,
      type: selectedType,
      descr: requestDescr,
      status: 'В работе',
      token: localStorage.getItem('token') ?? sessionStorage.getItem('token'),
      file: uploadedFiles[0],
      // file:{ dataUrl, format } если добавлен файл
      // !!! update file: dataUrl
      // c заголовком data:application/pdf;base64
    }
    dispatch(fetchNewRequest(data))
  }
  const handleRequestDescrChange = (e) => {
    setRequestDescr(e.target.value);
  };
  const handleFilesUpload = async (e) => {
    
    try {
      const files = Array.from(e.target.files || []);      
      if (files.length === 0) {
        throw new Error('Файлы не выбраны');
      }
      
      const base64Results = await Promise.all(
        files.map(file => {
          // Проверка типа и размера
          if (!['application/pdf', 'image/jpeg', 'image/png'].includes(file.type)) {
            throw new Error(`Недопустимый формат: ${file.name}`);
          }    
          const MAX_SIZE_MB = 3;
          if (file.size > MAX_SIZE_MB * 1024 * 1024) {
            throw new Error(`Файл слишком большой. Максимум: ${MAX_SIZE_MB}MB`);
          }
          return getBase64(file);
        })
      );
      setUploadedFiles(base64Results);   
      setSelectedFiles(files);   
    } catch (error) {
      console.error('Ошибка загрузки:', error.message);
      // Показ пользователю: toast.error(error.message)
    }
  };
  useEffect(() => {
    if (isNewRequestSaved) {
      dispatch(requestStatusFalse());
      dispatch(fetchRequestsList())
      showToast('Заявка успешно внесена!', 'success', {
        autoClose: 2000,
      });
    }
  }, [isNewRequestSaved])
  useEffect(() => {
    if (selectedFiles.length > 2) {
      alert('Количество файлов должно быть не более 5, пожалуйста, произведите выбор еще раз');
      setSelectedFiles([]);
    }
  }, [selectedFiles])
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
          Новая заявка
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
              !sm_breakpoint ? <span className="text-[#787C82]">Объект аренды</span> : ''
            }
            <CustomSelect onDataSend={setSelectedObject} options={cleanedObjects} defaultValue={sm_breakpoint ? 'Название помещения' : 'Выбрать'} />
          </div>
          <div className="lg:mt-0 mt-4 w-full lg:w-1/2">
            {
              !sm_breakpoint ? <span className="text-[#787C82] md:mt-2">Тема обращения</span> : ''
            }
            <CustomSelect onDataSend={setSelectedType} options={types} defaultValue={sm_breakpoint ? 'Тема обращения' : 'Выбрать'} />
          </div>
        </div>
        {
          !sm_breakpoint ? <span className="text-[#787C82] md:mt-2">Описание заявки</span> : ''
        }
        <textarea 
          className="w-full rounded-lg px-5 py-4 bg-item-active md:min-h-43 min-h-50 outline-0"
          placeholder={`${!sm_breakpoint ? 'Введите текст' : 'Описание заявки'}`}
          value={requestDescr}
          onChange={(e) => handleRequestDescrChange(e)}
        ></textarea>
        <p className="text-[#787C82] md:mt-2">Прикрепить файлы. (*.jpeg, *.jpg, *.png, *.pdf) - каждый весом не более 3 MB</p>
        <div className="
          md:w-fit md:flex md:p-5 md:flex-row-reverse md:items-start
          w-full rounded-lg px-5 py-3 mb-1 bg-item-active text-center items-center
        ">
          {
            selectedFiles.length > 0 ? (
              <div className="mt-2 space-y-1 text-[#787C82] md:pb-0 md:ps-10 pb-4 md:pe-6">
                <p className="text-sm font-medium">Выбранные файлы:</p>
                <ul className="space-y-1">
                  {selectedFiles.map((file, index) => (
                    <li 
                      key={index} 
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="truncate max-w-xs">{file.name}</span>
                      <span className="ms-6 text-gray-500">
                        {(file.size / 1024 / 1024).toFixed(2)}MB
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : <p className="text-[#787C82] md:pb-0 md:ps-10 pb-4 md:pe-6 align-center self-center-safe">{ uploadedFiles ? '' : 'Файлы не выбраны'}</p>
}
            {error && (
              <div className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded">
                {error}
              </div>
            )
          }
          <button 
            className="
              w-full md:w-auto 
              px-4 py-2.5 
              rounded-lg
              btn-default 
              text-white font-medium
              transition-colors duration-200
              disabled:opacity-50 disabled:cursor-not-allowed
            "
            onClick={(e) => {
              e.preventDefault();
              const fileInput = document.createElement('input');
              fileInput.type = 'file';
              fileInput.multiple = 'true';
              fileInput.accept = ".pdf,.doc,.docx,.jpg,.png"; // Укажите нужные форматы
              fileInput.onchange = (e) => handleFilesUpload(e);
              fileInput.click();
            }}
          >
            <div className="flex items-center justify-center gap-2 text-nowrap">
              <span>Выберите файлы</span>
            </div>
          </button>
        </div>
      </div>
      <button className="btn-primary py-2 md:w-auto md:px-10 md:mt-8 w-full mt-11" type="submit" onClick={handleCreateNewRequest}>
        Отправить
      </button>
    </div>
  )
}
export default NewRequestPage;