function splitBase64(base64String) {
  if (typeof base64String !== 'string') {
    throw new Error('Input must be a string');
  }

  const [type, pureBase64] = base64String.split(',');

  return {
    mimeType: type?.match(/^data:(.*?);/)?.[1] || null,
    pureBase64: pureBase64 || null
  };
}

export async function downloadBase64PDF(base64String, filename = 'document') {
  
  if (typeof base64String !== 'string') {
    throw new Error('Input must be a string');
  }  
  
  try {
    const {mimeType, pureBase64} = splitBase64(base64String);
    const extensionMap = {
      'application/pdf': '.pdf',
      'image/jpeg': '.jpg',
      'image/png': '.png',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx'
      // Добавьте другие MIME-типы по необходимости
    };
    const type = extensionMap[mimeType] || '';
     
    const binaryString = atob(pureBase64);
    const bytes = new Uint8Array(binaryString.length);
    
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    const blob = new Blob([bytes], { type: mimeType });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename + (filename.includes(type) ? '' : type);
    document.body.appendChild(a);
    a.click();
    
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  } catch (error) {
    console.error('Ошибка при скачивании:', error);
    throw error;
  }
}

export const downloadAndPrintPDF = (base64String, filename) => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  // Создаем структуру документа правильно
  const doc = printWindow.document;
  doc.open();
  
  // Создаем элементы через DOM API
  const html = doc.createElement('html');
  const head = doc.createElement('head');
  const title = doc.createElement('title');
  title.textContent = filename;
  head.appendChild(title);

  const style = doc.createElement('style');
  style.textContent = `
    body { margin: 0; padding: 0; }
    embed { width: 100%; height: 100vh; }
  `;
  head.appendChild(style);

  const body = doc.createElement('body');
  const embed = doc.createElement('embed');
  embed.setAttribute('src', `data:application/pdf;base64,${base64String.split(',')[1]}`);
  embed.setAttribute('type', 'application/pdf');
  embed.setAttribute('width', '100%');
  embed.setAttribute('height', '100%');

  const script = doc.createElement('script');
  script.textContent = `
    document.querySelector('embed').addEventListener('load', function() {
      setTimeout(function() {
        window.print();
      }, 500);
    });
  `;

  body.appendChild(embed);
  body.appendChild(script);
  html.appendChild(head);
  html.appendChild(body);
  doc.appendChild(html);
  doc.close();

  // Обработка закрытия окна
  printWindow.onbeforeunload = () => {
    URL.revokeObjectURL(embed.src);
  };
};