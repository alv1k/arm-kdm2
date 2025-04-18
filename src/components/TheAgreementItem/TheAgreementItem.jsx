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
          my-2
        `}>
        {
          isDetailsShown && sm_breakpoint ? 
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
          
        <div className={`
          md:p-0 md:mt-0 
          rounded-md
          ${isDetailsShown ? 'px-5 py-3 mt-4' : 'mt-2'}
          ${isDetailsShown && sm_breakpoint ? 'md:bg-none bg-item-active' : ''}
        `}>
          <span className="text-[#787C82] lg:inline md:inline block lg:mt-0">Адрес:&nbsp;</span>
          <span className="lg:inline md:inline block">{address}</span>
        </div> 
          
        </p>
        {
          isDetailsShown ? 
          <div className="grid grid-cols-2 gap-2">
            <div 
              className={`
                ${isDetailsShown ? 'md:text-base' : 'lg:text-xl'}
                ${isDetailsShown && sm_breakpoint ? 'rounded-md bg-item-active px-5 py-2 my-0' : 'bg-none my-2'}
                md:my-4 md:block md:order-1
                order-2
              `}>
              <span className={`
                text-[#787C82] lg:inline md:inline block lg:mt-0 
                ${isDetailsShown && sm_breakpoint ? 'my-0' : 'my-2'}
              `}>
                  Площадь:&nbsp;
              </span>
              <span className="lg:inline md:inline block mt-1">123 м2</span>
            </div>
            <div className={`
                ${isDetailsShown ? 'md:text-base' : 'lg:text-xl'}
                ${isDetailsShown && sm_breakpoint ? 'my-0 gap-2' : 'my-2 gap-0'}
                md:my-2
                flex col-span-2 order-1
              `}>
              <p 
                className={`
                  ${isDetailsShown && sm_breakpoint ? 'px-5 py-2 w-1/2 rounded-md bg-item-active' : 'bg-none'}
                  md:block
                `}>
                <span className={`text-[#787C82] lg:inline md:inline block lg:mt-0 ${isDetailsShown && sm_breakpoint ? 'mt-0' : ' mt-2'}`}>Дата начала:&nbsp;</span>
                <span className={`lg:inline md:inline block ${isDetailsShown && sm_breakpoint ? 'mt-0' : ' mt-1'}`}>01.01.2011</span>
              </p>
              <p 
                className={`
                  ${isDetailsShown && sm_breakpoint ? 'px-5 py-2 w-1/2 rounded-md bg-item-active' : 'ms-8 bg-none'}
                  md:block                  
                `}>
                <span className={`text-[#787C82] lg:inline md:inline block lg:mt-0 ${isDetailsShown && sm_breakpoint ? 'mt-0' : ' mt-2'}`}>Дата окончания:&nbsp;</span>
                <span className={`lg:inline md:inline block ${isDetailsShown && sm_breakpoint ? 'mt-0' : ' mt-1'}`}>02.02.2013</span>
              </p>
            </div>
            <div 
              className={`
                ${isDetailsShown ? 'md:text-base' : 'lg:text-xl'}
                ${isDetailsShown && sm_breakpoint ? 'bg-item-active px-5 py-2 rounded-md' : 'bg-none my-2'}
                md:my-4 md:block
                order-3
              `}>
              <span className={`
                text-[#787C82] lg:inline md:inline block lg:mt-0 
                  ${isDetailsShown && sm_breakpoint ? 'mt-0' : 'mt-2'}
              `}>
                Ежемес{isDetailsShown && sm_breakpoint ? '.' : 'ячный'} платеж{isDetailsShown && sm_breakpoint ? '' : ' по договору'}:&nbsp;
              </span>
              <span className="lg:inline md:inline block mt-1"><PriceFormatter amount={100000} /></span>
            </div>
          </div>
          : 
          <PriceFormatter amount={summ} /> && (
            <p className="xl:text-xl lg:text-base mt-2">Сумма долга: &nbsp;<span className="text-red-600"> -&nbsp;{
              <PriceFormatter amount={summ} />
            }</span></p>
          )
        }
      </div>
      <div className="lg:ms-auto ms-0 lg:mt-0 md:mt-4 mt-3">        
        {
          isDetailsShown && sm_breakpoint ? 
          <button className="mt-7 btn-default px-5 py-2 w-full">
            Передать показания счетчиков
          </button>
          :
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
        }
        {
          isDetailsShown ? 
          <div className="
            lg:p-10 
            md:mt-8 md:border-slate-200
            rounded-xl bg-white md:border mt-9 text-base text-center
          ">
            <p>Общая сумма долга на 01.01.2025:</p>
            <p className="text-xl lg:my-4 my-2 text-red-600 font-semibold">- <PriceFormatter amount={100000} /> </p>
            <button className="btn-success lg:px-10 lg:mt-0 py-2 w-full mt-2">Оплатить</button>
          </div>
          : ''
        }
        
      </div>
    </div>
  )
}
export default TheAgreementItem;