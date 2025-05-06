import React from 'react';

function Price({ amount }) {
  console.log(amount,'amo');
  
  const formatted = new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);

  return <span>{formatted}</span>;
}

export default Price;