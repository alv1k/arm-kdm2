import React from 'react';

function Price({ amount, type }) {
  let options = null;
  if (type == 'price') {
    options = {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }
  } else {
    options = {
      useGrouping: true
    }
  }
  
  const formatted = new Intl.NumberFormat('ru-RU', options).format(amount);

  return <span>{formatted}</span>;
}

export default Price;