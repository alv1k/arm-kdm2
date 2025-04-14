import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { hideNavbar } from '../../store/navbarSlice';
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
  const { xl_breakpoint, lg_breakpoint, md_breakpoint, sm_breakpoint } = useMediaQueries();
  const dispatch = useDispatch();
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
    console.log(type, 'getAgreements');
  }


  return (
    <main className={[styles.mainLogin, sm_breakpoint || md_breakpoint ? 'h-[500px]' : 'minHeight'].join(' ')}>
      <Header />
      <div className="lg:p-10 md:py-5 flex">        
        {          
          md_breakpoint && (
            <div className="w-1/7"></div>
          )          
        }
        <TheNavbar />
        
        <section 
          className="
            lg:ml-10 lg:px-12 lg:py-9 lg:ms-0 lg:rounded-x
            md:w-full md:px-6 md:ms-9 md:rounded-xl md:min-h-[1080px]
            w-full px-5 ms-0 bg-white min-h-[844px]
          "
          onClick={sideClick}
        >
          <div className="lg:text-base md:text-base text-sm">
            <p className="
              lg:px-6 lg:text-left lg:text-[26px] lg:mt-0 
              md:px-2 md:text-left md:mt-9
              text-center text-xl font-bold mt-4
            ">
              Мои договоры
            </p>
            <div className="
              lg:mt-9 lg:gap-4
              md:mt-7 md:rounded-t-xl md:gap-10
              flex mt-6 bg-[#FAFBFD] border-b-1 border-slate-300 rounded-t-md font-medium
            ">
              {
                (xl_breakpoint || lg_breakpoint || md_breakpoint) && 
                <div className="
                  md:px-4
                  px-10 py-4 text-[#203887] border-b border-b-[#6374AD]
                ">
                  Все
                  {/* 
                      выбранный элемент #011E7D #6374AD 
                      hover для элементов (каждого договора)
                  */}
                </div>
              }
              <div 
                className="
                  lg:px-10 lg:w-auto
                  md:px-5 md:w-auto
                  px-9 w-1/2 py-4 text-[#203887] border-b border-b-[#6374AD]
                "
                onClick={() => getAgreements('actual')}
              >
                Действующие
              </div>
              <div className="
                lg:px-10 px-9 lg:w-auto 
                md:px-5 md:w-auto
                w-1/2 py-4
              ">
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