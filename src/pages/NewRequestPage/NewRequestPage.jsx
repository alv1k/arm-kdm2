import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleStatus, fetchNewRequest, fetchRequestsList } from '@/store/slices/requestsSlice';
import { getBase64 } from '@/utils/getBase64';
import useMediaQueries from '@/hooks/useMediaQueries';
import CustomSelect from '@/components/CustomSelect/CustomSelect';

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

  const handleDataSelectedObject = (data) => {
    data = data.split('-').join();
    setSelectedObject(data);
  };
  const handleDataSelectedType = (data) => {
    setSelectedType(data);
  };  

  const backToRequests = () => {
      dispatch(toggleStatus());
  }
  const handleCreateNewRequest = () => {
    const data = {
      object: selectedObject.split('-').join(''),
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
          const MAX_SIZE_MB = 5;
          if (file.size > MAX_SIZE_MB * 1024 * 1024) {
            throw new Error(`Файл слишком большой. Максимум: ${MAX_SIZE_MB}MB`);
          }      
          return getBase64(file);
        })
      );
      setUploadedFiles(base64Results);      
    } catch (error) {
      console.error('Ошибка загрузки:', error.message);
      // Показ пользователю: toast.error(error.message)
    }
  };
  useEffect(() => {
    if (isNewRequestSaved) {
      alert('Заявка успешно внесена')
      dispatch(toggleStatus());
      dispatch(fetchRequestsList())
    }
  }, [isNewRequestSaved])
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
              !sm_breakpoint ? <span className="text-[#787C82]">Объект аренды</span> : ''
            }
            <CustomSelect onDataSend={setSelectedObject} options={allObjects} defaultValue='Выбрать' />
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
            <CustomSelect onDataSend={setSelectedType} options={types} defaultValue={sm_breakpoint ? 'Тема обращения' : 'Выбрать'} />
          </div>
        </div>
        {
          !sm_breakpoint ? <span className="text-[#787C82] md:mt-2">Описание заявки</span> : ''
        }
        <textarea 
          className="w-full rounded-lg px-5 py-4 bg-item-active md:min-h-43 min-h-50"
          placeholder={`${!sm_breakpoint ? 'Введите текст' : 'Описание заявки'}`}
          value={requestDescr}
          onChange={(e) => handleRequestDescrChange(e)}
        ></textarea>
        <p className="text-[#787C82] md:mt-2">Прикрепить файл</p>
        <div className="
          md:w-fit md:flex md:p-5 md:flex-row-reverse 
          w-full rounded-lg px-5 py-3 mb-1 bg-item-active text-center items-center
        ">
          <p className="text-[#787C82] md:pb-0 md:ps-10 pb-4 md:pe-6">Файл не выбран</p>
          {/* <button className="md:w-auto md:px-5 w-full rounded-lg p-2 btn-default" onClick={(e) => handleFilesUpload(e)}>
            Выберите файл
          </button> */}
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
            <div className="flex items-center justify-center gap-2">
              <span>Выберите файл</span>
            </div>
          </button>
          {/* {selectedFile && (
  <div className="mt-2 text-sm text-gray-600">
    Выбран: {selectedFile.name} 
    <button 
      onClick={() => setSelectedFile(null)}
      className="ml-2 text-red-500 hover:text-red-700"
    >
      ×
    </button>
  </div>
)} */}
        </div>
      </div>
      <button className="btn-primary py-2 md:w-auto md:px-10 md:mt-8 w-full mt-11" type="submit" onClick={handleCreateNewRequest}>
        Отправить
      </button>
    </div>
  )
}
export default NewRequestPage;