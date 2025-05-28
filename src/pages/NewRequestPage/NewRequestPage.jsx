import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { requestStatusFalse, fetchNewRequest, fetchRequestsList } from '@/store/slices/requestsSlice';
import { getBase64 } from '@/utils/getBase64';
import useMediaQueries from '@/hooks/useMediaQueries';
import CustomSelect from '@/components/CustomSelect/CustomSelect';
import { showToast } from '@/utils/notify';
import Compressor from 'compressorjs';
import { PDFDocument } from 'pdf-lib';

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
  const [uploadedFiles, setUploadedFiles] = useState([]);
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
  const handleCreateNewRequest = async () => {    
    const data = {
      object: selectedObject,
      type: selectedType,
      descr: requestDescr,
      status: 'В работе',
      token: localStorage.getItem('token') ?? sessionStorage.getItem('token'),
      file: uploadedFiles,
      // file:{ dataUrl, format } если добавлен файл
      // !!! update file: dataUrl
      // c заголовком data:application/pdf;base64
    }
     if (selectedObject == '') {
      showToast('Выберите объект заявки', 'error', {
        autoClose: 2000,
      });
      return;
    } else if (selectedType == '') {   
      showToast('Выберите тему обращения', 'error', {
        autoClose: 2000,
      });
      return;
    } else if (requestDescr == '') {
      showToast('Введите описание заявки', 'error', {
        autoClose: 2000,
      });
      return;
    }
    const response = await dispatch(fetchNewRequest(data));

    if (response.payload.success) {      
      showToast('Заявка успешно внесена!', 'success', {
        autoClose: 2000,
      });
      dispatch(fetchRequestsList());
      dispatch(requestStatusFalse());
    }    
  }
  const handleRequestDescrChange = (e) => {
    if (e.target.value.length < 1000) {
      setRequestDescr(e.target.value);
    } else {          
      showToast('Текст слишкой длинный', 'error', {
        autoClose: 2000,
      });
    }
  };

  const base64ToFileObject = (base64String, filename = 'uploaded') => {
    // 1. Извлекаем MIME-тип и данные
    const matches = base64String.match(/^data:(.*?);base64,(.*)$/);
    
    if (!matches || matches.length !== 3) {
      throw new Error('Неверный формат Base64 строки');
    }

    const mimeType = matches[1];
    const base64Data = matches[2];

    // 2. Создаем объект File-подобной структуры
    const byteCharacters = atob(base64Data);
    const byteArrays = [];
    
    for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
      const slice = byteCharacters.slice(offset, offset + 1024);
      const byteNumbers = new Array(slice.length);
      
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      
      byteArrays.push(new Uint8Array(byteNumbers));
    }
    
    // 3. Создаем Blob и преобразуем в File
    const blob = new Blob(byteArrays, { type: mimeType });
    const fileName = filename || `file.${mimeType.split('/')[1] || 'dat'}`;
    
    return new File([blob], fileName, { type: mimeType });
  };
  
  const compressImage = async (file) => {    
    return new Promise((resolve) => {
      new Compressor(file, {
        quality: 0.6,
        maxWidth: 1024,
        success(result) {
          resolve(result);
        },
        error(err) {
          console.error(err);
          resolve(file); // Возвращаем оригинал при ошибке
        },
      });
    });
  };

  const compressPDF = async (file) => {
    const pdfBytes = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(pdfBytes);
    
    // Удаляем метаданные и сжимаем изображения внутри PDF
    pdfDoc.setTitle('');
    pdfDoc.setAuthor('');
    
    return new Blob([await pdfDoc.save()], { type: 'application/pdf' });
  };
  const handleFilesUpload = async (e) => {
    try {
      const files = Array.from(e.target.files || []);      
      if (files.length === 0) {
        throw new Error('Файлы не выбраны');
      }

      // Обрабатываем файлы и сохраняем оригинальные имена
      const filesWithNames = await Promise.all(
        files.map(async (file) => {
          if (!['application/pdf', 'image/jpeg', 'image/png'].includes(file.type)) {
            throw new Error(`Недопустимый формат: ${file.name}`);
          }
          
          const base64 = await getBase64(file);
          
          return {
            name: file.name,
            type: file.type,
            size: file.size,
            base64: base64 // Полная строка с data:image/...;base64,...
          };
        })
      );

      // Сжимаем файлы (если нужно)
      const processedFiles = await Promise.all(
        filesWithNames.map(async (file) => {
          try {
            if (file.type.startsWith('image/')) {
              const compressed = await compressImage(base64ToFileObject(file.base64, file.name));
              return {
                ...file,
                base64: await fileToBase64(compressed) // Обновляем base64 после сжатия
              };
            } 
            // else if (file.type === 'application/pdf') {
            //   // Сжатие PDF
            //   const compressed = await compressPDF(base64ToFileObject(file.base64, file.name));
            //   return {
            //     ...file,
            //     base64: await fileToBase64(compressed)
            //   };
            // }
            return file; // Для PDF возвращаем как есть
          } catch (e) {
            console.error(`Ошибка обработки ${file.name}:`, e);
            return file; // Возвращаем исходный файл при ошибке сжатия
          }
        })
      );

      // Формируем данные для отправки
      const filesToSend = processedFiles.map(file => ({
        fileName: file.name,
        fileData: file.base64 // Полная base64 строка
      }));

      console.log('Файлы для отправки:', filesToSend);
      setSelectedFiles(filesToSend);
      setUploadedFiles(filesToSend);

      // Отправка на бэкенд (пример)
      // await api.post('/upload', { files: filesToSend });

    } catch (error) {
      console.error('Ошибка загрузки:', error.message);
      showToast('Ошибка загрузки: ' + error.message, 'error', { autoClose: 2000 });
    }
  };
  const fileToBase64 = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.readAsDataURL(file);
    });
  };

  useEffect(() => {
    if (selectedFiles.length > 5) {
      showToast('Количество файлов должно быть не более 5, пожалуйста, произведите выбор еще раз', 'error', {
        autoClose: 5000,
      });
      setSelectedFiles([]);
    }
    selectedFiles.map(file => {
      const MAX_SIZE_MB = 3;
      if (file.fileSize > MAX_SIZE_MB * 1024 * 1024) {
        showToast('Файл слишком большой. Максимум: 3 MB', 'error', {
          autoClose: 5000,
        });
        setSelectedFiles([]);
      }
    })
    
  }, [selectedFiles])
  return (
    <div className="lg:text-base md:text-base md:pb-10 text-sm md:h-auto h-fit pb-10">
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
            className="btn-text ms-auto me-4 lg:mt-0 md:mt-0 flex cursor-pointer"
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
                      <span className="truncate max-w-xs">{file.fileName}</span>
                      <span className="ms-6 text-gray-500">
                        {(file.fileSize / 1024 / 1024).toFixed(2)}MB
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ) 
            : 
            <p className="text-[#787C82] md:pb-0 md:ps-10 pb-4 md:pe-6 align-center self-center-safe">{ uploadedFiles ? '' : 'Файлы не выбраны'}</p>
          }
          {
            error && (
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