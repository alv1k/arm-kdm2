import React, { useEffect, useState } from 'react';
import { fetchContactsList } from '@/store/slices/contactsSlice';
import { useDispatch, useSelector } from 'react-redux';

const RequisitsPage = () => {


  // const contactData = useSelector((state) => state.contacts_slice.contacts);  
  const contactData = {
      "name": {
          "shortname": "АО «Комдрагметалл РС(Я)»",
          "fullname": "Акционерное общество «Комдрагметалл Республики Саха (Якутия)»",
          "eng": "'Komdragmetall of the Republic Sakha (Yakutia)' Joint-Stock Company",
          "director": "Кычкин Александр Егорович",
          "founding": "На основании Устава"
      },
      "inn": "1435343333",
      "kpp": "143501001",
      "ogrn": "1191447008719",
      "okpo": "40242888",
      "okato": "98401000000",
      "oktmo": "98701000001",
      "okogu": "4210001",
      "okfs": "13",
      "okopf": "12267",
      "iko": "51435343333143501001",
      "ikul": "2143534333314350100108",
      "okved": "47.77.2",
      "urAddress": "677018, Республика Саха (Якутия), г. Якутск, ул. Кирова 12",
      "postAddress": "677018, Республика Саха (Якутия), г. Якутск, ул. Кирова 12",
      "bank": {
          "name": "ПАО Сбербанк Якутское отделение 8603 в г. Якутске",
          "BIK": "049805609",
          "KorrAccount": "30101810400000000609",
          "Account": "40602810776000170062"
      }
  }

  return (

    <ul className="bg-red-900">
  {contactData ? (
    Object.entries(contactData).map(([key, value]) => (
      <li key={key}>
        <strong>{key}:</strong> 
        {typeof value === 'object' && value !== null ? (
          <ul>
            {Object.entries(value).map(([subKey, subValue]) => (
              <li key={subKey}>
                <strong>{subKey}:</strong> {String(subValue)}
              </li>
            ))}
          </ul>
        ) : (
          String(value)
        )}
      </li>
    ))
  ) : (
    <li>Реквизиты отсутствуют</li>
  )}
</ul>
  )
}

export default RequisitsPage;