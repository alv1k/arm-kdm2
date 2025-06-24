import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setShowRequisits } from '@/store/slices/requisitsSlice';

const RequisitsPage = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();



  const handleShowRequisitsBtn = () => {
    dispatch(setShowRequisits(false))
    navigate('/login', { replace: true });
  }

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
    <main className="min-h-fit h-screen w-full">
      <div className="lg:flex min-h-fit h-screen relative">
        <div className="lg:w-1/2 w-full h-screen bg-[#F6F8FF] flex flex-col justify-end">
          <img className="align-bottom justify-baseline justify-self-end lg:blur-none lg:mt-0 blur-xs h-fit mx-auto" src="/src/assets/images/bg-login.png" alt="" />
        </div>
        <div className="lg:w-1/2 lg:static w-full absolute md:top-16 top-10 left-0 right-0 bottom-0 flex align-middle items-center justify-center">
          <div className={`xl:w-3/5 lg:w-3/4 md:w-2/3 md:my-44 w-[90vw] bg-white md:p-10 px-5 py-10 lg:my-auto mx-auto  lg:rounded-none rounded-2xl text-center`}>
            <div className="flex flex-col justify-center">
              <img className="mx-auto" src="/src/assets/images/logo.png" alt="logo" />
              <img className="mx-auto mt-4 lg:text-2xl my-0 w-3/5" src="/src/assets/images/logo-text.png" alt="" />
            </div>
            <section>
                <div className="text-start text-xs mt-4 p-0">
                  {contactData ? (
                    Object.entries(contactData).map(([key, value]) => (
                      <li className="!m-0 !p-2" key={key}>
                        <strong>{key}:</strong> 
                        {typeof value === 'object' && value !== null ? (
                          <ul>
                            {Object.entries(value).map(([subKey, subValue]) => (
                              <li className="!m-0 !p-1" key={subKey}>
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
                </div>
            </section>
            
            <div className="pt-16">
              <a className="cursor-pointer" onClick={() => handleShowRequisitsBtn()}>
                Назад
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
export default RequisitsPage;