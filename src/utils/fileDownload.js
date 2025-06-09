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
  
  printWindow.document.writeln(`
    <html>
      <head>
        <title>${filename}</title>
        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
              window.close();
            }, 500);
          };
        </script>
      </head>
      <body>
        <embed 
          src="data:application/pdf;base64,${base64String.split(',')[1]}" 
          type="application/pdf" 
          width="100%" 
          height="100%" />
      </body>
    </html>
  `);
  // id="print"
  // printWindow.document.close();
  // printWindow.document.writeln(`
  //   <button onclick="window.print()" 
  //           style="position: fixed; top: 10px; left: 10px; z-index: 9999">
  //     Нажмите для печати
  //   </button>
  // `);
  printWindow.onload = function() {
    setTimeout(() => {
      window.print();
      // printWindow.close(); // Осторожно - может закрыться до печати
    }, 1000);
  };
};