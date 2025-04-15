import styles from './TheAgreementItem.module.css';
import useMediaQueries from '../../hooks/useMediaQueries'; 

const TheAgreementItem = ({ number, date, address, summ }) => {
  const sprite_path = './src/assets/images/i.svg';
  const { xl_breakpoint, lg_breakpoint, md_breakpoint, sm_breakpoint } = useMediaQueries();
  
  return (
    <div className={`
      ${styles.agreementDiv} 
      lg:p-10 p-5 lg:rounded-2xl lg:mb-10 lg:flex
      md:mb-4
      rounded-xl mb-6
    `}>
      <div className="lg:text-xl md:text-base text-sm">
        <h3 className="lg:font-bold font-medium">Договор: {number} <span>от {date}</span></h3>
        <p className="
          lg:my-4 lg:block
          md:my-4 md:block
          my-2 contents
        ">
          <span className="text-[#787C82] lg:inline md:inline block lg:mt-0 mt-2">Адрес:&nbsp;</span>          
          {/* { sm_breakpoint && <br className="bg-green-700" /> } */}
          <span className="lg:inline md:inline block mt-1">{address}</span>
        </p>
        {
          summ && (
            <p className="">Сумма долга:  &nbsp;<span className="text-red-600"> -&nbsp;{summ}</span> </p>

          )
        }
      </div>
      <div className="lg:ms-auto ms-0 lg:mt-0 md:mt-4 mt-3">
        <button className="bg-white px-4 py-2 rounded-lg border border-[#6374AD] flex gap-3 text-[#203887] md:w-auto w-full">
          <svg
            className="icon lg:ms-0 ms-auto"
          >
            <use href={`${sprite_path}#doc-icon`} />
          </svg>
          <span className="lg:me-0 me-auto">
            Скачать договор
          </span>
        </button>
      </div>
    </div>
  )
}
export default TheAgreementItem;