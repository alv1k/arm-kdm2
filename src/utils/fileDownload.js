export async function downloadBase64PDF(base64String, filename = 'document.pdf') {
  if (!base64String?.startsWith('data:application/pdf;base64,')) {
    throw new Error('Некорректный формат Base64 PDF');
  }

  try {
    const pureBase64 = base64String.split(',')[1];
    const binaryString = atob(pureBase64);
    const bytes = new Uint8Array(binaryString.length);
    
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    const blob = new Blob([bytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  } catch (error) {
    console.error('Ошибка при скачивании PDF:', error);
    throw error;
  }
}