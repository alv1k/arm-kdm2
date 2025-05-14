import { useEffect, useRef } from 'react';

// Хук для безопасного чтения файлов
export function useFileReader() {
  const readerRef = useRef(null);

  const getBase64 = (file) => {
    // Отменяем предыдущее чтение
    if (readerRef.current) {
      readerRef.current.abort();
    }

    const reader = new FileReader();
    readerRef.current = reader;

    return new Promise((resolve, reject) => {
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error('File read error'));
      reader.onabort = () => reject(new Error('File read aborted'));
      reader.readAsDataURL(file);
    });
  };

  // Очистка при размонтировании
  useEffect(() => {
    return () => {
      if (readerRef.current) {
        readerRef.current.abort();
      }
    };
  }, []);

  return { getBase64 };
}

// Отдельная функция для использования вне компонентов
export function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    const cleanup = () => {
      reader.onload = null;
      reader.onerror = null;
      reader.onabort = null;
    };

    reader.onload = () => {
      cleanup();
      resolve(reader.result);
    };

    reader.onerror = () => {
      cleanup();
      reject(new Error('File read failed'));
    };

    reader.onabort = () => {
      cleanup();
      reject(new Error('File read cancelled'));
    };

    reader.readAsDataURL(file);
  });
}