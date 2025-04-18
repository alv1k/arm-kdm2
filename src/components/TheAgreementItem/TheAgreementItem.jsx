import { useSelector, useDispatch } from 'react-redux';
import useMediaQueries from '@/hooks/useMediaQueries'; 
import { isShowDetails } from '@/store/agreementsSlice';
import PriceFormatter from '../PriceFormatter/PriceFormatter'; 

const TheAgreementItem = ({ number, date, address, summ }) => {
  const sprite_path = './src/assets/images/i.svg';
  const { xl_breakpoint, lg_breakpoint, md_breakpoint, sm_breakpoint } = useMediaQueries();
  const dispatch = useDispatch();
  const isDetailsShown = useSelector(isShowDetails);
  
  return (
    <div className={`
        lg:p-10 lg:rounded-2xl lg:mb-10 lg:flex
        md:mb-4
        rounded-xl mb-6 md:p-5
        ${isDetailsShown ? 'lg:mt-6 md:bg-blue-100 bg-transparent p-0' : 'md:bg-item-default bg-item-active cursor-pointer p-5'}
        
      `}
    >
      <div className="lg:text-xl md:text-base text-sm">
        <h3 className={`
          lg:font-bold lg:text-base md:text-left text-xl text-center
          ${isDetailsShown ? 'font-semibold' : 'font-medium'}
        `}>
          Договор: {number} <span>от {date}</span></h3>
        <p className={`
          ${isDetailsShown ? 'md:text-base md:mt-8' : 'lg:text-xl'}
          md:my-4 md:block
          my-2 contents
        `}>
        {
          isDetailsShown ? 
          <button className="bg-white px-4 py-2 rounded-lg border border-[#6374AD] flex gap-3 text-[#203887] w-full text-base ms-auto mt-4">
            <svg
              className="icon lg:ms-0 ms-auto"
            >
              <use href={`${sprite_path}#doc-icon`} />
            </svg>
            <span className="lg:me-0 me-auto">
              Скачать договор
            </span>
          </button>
          : ''
        }
          <span className="text-[#787C82] lg:inline md:inline block lg:mt-0 mt-2">Адрес:&nbsp;</span>
          <span className="lg:inline md:inline block mt-1">{address}</span>
        </p>
        {
          isDetailsShown ? 
          <div>
            <p 
              className={`
                ${isDetailsShown ? 'md:text-base' : 'lg:text-xl'}
                md:my-4 md:block
                my-2 contents
              `}>
              <span className="text-[#787C82] lg:inline md:inline block lg:mt-0 mt-2">Площадь:&nbsp;</span>
              <span className="lg:inline md:inline block mt-1">123 м2</span>
            </p>
            <div className={`
                ${isDetailsShown ? 'md:text-base' : 'lg:text-xl'}
                md:my-2
                my-2 flex
              `}>
              <p 
                className="
                  md:block
                  contents
                ">
                <span className="text-[#787C82] lg:inline md:inline block lg:mt-0 mt-2">Дата начала:&nbsp;</span>
                <span className="lg:inline md:inline block mt-1">01.01.2011</span>
              </p>
              <p 
                className="
                  md:block
                  contents ms-8
                ">
                <span className="text-[#787C82] lg:inline md:inline block lg:mt-0 mt-2">Дата окончания:&nbsp;</span>
                <span className="lg:inline md:inline block mt-1">02.02.2013</span>
              </p>
            </div>
            <p 
              className={`
                ${isDetailsShown ? 'md:text-base' : 'lg:text-xl'}
                md:my-4 md:block
                my-2 contents
              `}>
              <span className="text-[#787C82] lg:inline md:inline block lg:mt-0 mt-2">Ежемесячный платеж по договору:&nbsp;</span>
              <span className="lg:inline md:inline block mt-1"><PriceFormatter amount={100000} /></span>
            </p>
            <button className="mt-4 btn-default px-5 py-2">
              Передать показания счетчиков
            </button>
          </div>
          : 
          <PriceFormatter amount={summ} /> && (
            <p className="xl:text-xl lg:text-base ">Сумма долга: &nbsp;<span className="text-red-600"> -&nbsp;{
              <PriceFormatter amount={summ} />
            }</span></p>
          )
        }
      </div>
      <div className="lg:ms-auto ms-0 lg:mt-0 md:mt-4 mt-3">
        <button className="bg-white px-4 py-2 rounded-lg border border-[#6374AD] flex gap-3 text-[#203887] md:w-auto w-full ms-auto">
          <svg
            className="icon lg:ms-0 ms-auto"
          >
            <use href={`${sprite_path}#doc-icon`} />
          </svg>
          <span className="lg:me-0 me-auto">
            Скачать договор
          </span>
        </button>
        {
          isDetailsShown ? 
          <div className="mt-8 p-10 rounded-xl bg-white border border-slate-200 text-center">
            <p>Общая сумма долга на 01.01.2025:</p>
            <p className="text-xl my-4">-<PriceFormatter amount={100000} /> </p>
            <button className="btn-success px-10 py-2">Оплатить</button>
          </div>
          : ''
        }
        
      </div>
    </div>
  )
}
export default TheAgreementItem;