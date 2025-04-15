import React, { useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { hideNavbar } from '../../store/navbarSlice';
import { setValue,selectValue } from '../../store/agreementsSlice';
import useMediaQueries from '../../hooks/useMediaQueries'; 
import styles from './AgreementsPage.module.css';

import Header from '../../components/TheHeader/TheHeader';
import TheNavbar from '../../components/TheNavbar/TheNavbar';
import AgreementItem from '../../components/TheAgreementItem/TheAgreementItem';


const AgreementsPage = () => {
  // const navigate = useNavigate();
  // const handleButtonClick = () => {
  //   navigate('/settings')
  // }
  const showNavbar = useSelector(state => state.navbar.showNavbar);
  const agreementType = useSelector(selectValue);
  
  const { xl_breakpoint, lg_breakpoint, md_breakpoint, sm_breakpoint } = useMediaQueries();
  const dispatch = useDispatch();
  useEffect(() => {
    if (xl_breakpoint) {
      dispatch(setValue('all'));
    } else if (lg_breakpoint) {
      dispatch(setValue('all'));
    } else if (md_breakpoint) {
      dispatch(setValue('all'));
    } else if (sm_breakpoint) {
      dispatch(setValue('active'));
    }
  }, [xl_breakpoint, lg_breakpoint, md_breakpoint, sm_breakpoint, dispatch]);
  const agreements = [
    {
      name: 'agree1',
      summ: 400000,
      date: new Date(2025, 5, 6).toLocaleDateString(), // Преобразуем дату в строку
      address: 'г. Якутск, ул. Ленина 123, 1 этаж, каб. №123',
      num: 'num123'
    },
    {
      name: 'agree2',
      summ: 250000,
      date: new Date(2025, 7, 15).toLocaleDateString(),
      address: 'г. Москва, ул. Пушкина 10',
      num: 'num456'
    },
  ]
  const sideClick = (event) => {
    event.stopPropagation();
    dispatch(hideNavbar());
  };
  const getAgreements = (type) => {
    dispatch(setValue(type));
  } 

  return (
    <main className={[styles.mainLogin, sm_breakpoint || md_breakpoint ? 'h-[500px]' : 'min-height'].join(' ')}>
      <Header />
      <div className="xl:p-10 lg:p-5 md:py-5 flex">        
        {
          md_breakpoint && (
            <div className="w-1/7"></div>
          )          
        }
        <TheNavbar />
        
        <section 
          className="
            xl:ml-10 xl:px-12 xl:py-9 xl:rounded-x
            lg:ml-8 lg:px-4 lg:py-5 
            md:w-full md:px-6 md:ms-9 md:rounded-xl md:min-h-[1080px]
            w-full px-5 ms-0 bg-white min-h-[844px]
          "
          onClick={sideClick}
        >
          <div className="lg:text-base md:text-base text-sm">
            <p className="
              xl:mt-0 
              lg:px-6 lg:text-[26px] lg:mt-4
              md:px-2 md:text-left md:mt-9
              text-center text-xl font-bold mt-4
            ">
              Мои договоры
            </p>
            <div className="
              xl:mt-9
              lg:mt-10 lg:gap-4
              md:mt-7 md:rounded-t-xl md:gap-10
              flex mt-6 bg-[#FAFBFD] border-b-1 border-slate-300 rounded-t-md font-medium
            ">
              {
                (xl_breakpoint || lg_breakpoint || md_breakpoint) && 
                <div className={`
                    lg:px-10
                    md:px-4
                    px-10 py-4 cursor-pointer bg-item-default rounded-t-xl
                    ${agreementType == 'all' ? 'text-[#203887] border-b border-b-[#6374AD]' : ''}
                  `}
                  onClick={() => getAgreements('all')}
                >
                  Все
                  {/* 
                      выбранный элемент #011E7D #6374AD 
                      hover для элементов (каждого договора)
                  */}
                </div>
              }
              <div 
                className={`
                  lg:px-10 lg:w-auto
                  md:px-5 md:w-auto
                  px-9 w-1/2 py-4 cursor-pointer bg-item-default rounded-t-xl
                  ${agreementType == 'active' ? 'text-[#203887] border-b border-b-[#6374AD]' : ''}
                `}
                onClick={() => getAgreements('active')}
              >
                Действующие
              </div>
              <div className={`
                  lg:px-10 px-9 lg:w-auto 
                  md:px-5 md:w-auto
                  w-1/2 py-4 cursor-pointer bg-item-default rounded-t-xl
                  ${agreementType == 'inactive' ? 'text-[#203887] border-b border-b-[#6374AD]' : ''}
                `}
                onClick={() => getAgreements('inactive')}
              >
                Неакуальные
              </div>
            </div>
            <div className="md:pt-4 pt-5">
              {
                agreements.map((agreement) => (
                  <AgreementItem 
                    key={agreement.num}
                    number={agreement.num}
                    date={agreement.date}
                    address={agreement.address}
                    summ={agreement.summ}
                  />
                ))
              }
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
export default AgreementsPage;