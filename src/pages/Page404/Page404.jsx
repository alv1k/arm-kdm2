import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';


const Page404 = () => {
  const [elementsLoaded, setElementsLoaded] = useState({
    canvas: false,
    image: false,
    svg: false
  });

  useEffect(() => {
    const timers = [
      setTimeout(() => setElementsLoaded(p => ({...p, canvas: true})), 100),
      setTimeout(() => setElementsLoaded(p => ({...p, image: true})), 300),
      setTimeout(() => setElementsLoaded(p => ({...p, svg: true})), 500)
    ];

    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  const sprite_path = '/src/assets/images/i.svg';
  return (
    
    <div className="lg:text-base md:text-base text-sm flex flex-col items-center justify-center p-4">
      <div className="flex md:justify-start justify-center">
        
          <p className="
            xl:mt-0 
            lg:px-6 lg:text-[26px] lg:mt-4
            md:px-2 md:mt-9
            text-xl font-bold mt-5
          ">Ошибка обращения к сервису</p>
      </div>
      <p className="
        lg:px-6
        md:px-2 md:mt-9 md:text-left
        mt-5 text-[#787C82] text-center
      ">
        Мы уже устраняем неисправность, попробуйте обновить страницу через некоторое время.
      </p>
      
      <div className={`relative bg-[url(./assets/images/404.png)] bg-no-repeat bg-size-[260px_200px] bg-right w-[300px] h-[200px] my-18 md:ms-22 ms-18 me-18 z-0`}>
        <canvas className={`absolute z-20 top-8 left-[8px] bg-[#CFD9F9] skew-x-5 w-[260px] h-[170px] transition-transform duration-300 origin-bottom ${elementsLoaded.canvas ? 'skew-x-10' : ''} `}>
        </canvas>
        <img className={`absolute z-20 top-28 left-14 animate-fadeIn duration-1000 ${elementsLoaded.image ? 'animate-fadeIn duration-1000' : 'opacity-0'}`} src="./src/assets/images/404-1.png" alt="" />
        <svg
          className={`absolute -top-10 left-10 z-10 w-14 me-2 animate-ping ${elementsLoaded.svg ? 'animate-float duration-2000' : 'opacity-0'}`}
        >
          <use href={`${sprite_path}#404-part`} />
        </svg>
      </div>
      
      <p className="
        xl:mt-0 
        lg:px-6 lg:mt-4
        md:px-2 md:mt-9 md:text-left
        mt-5 text-[#787C82] text-center
      ">
        Приносим извинения за временные неудобства.
      </p>
    </div>
  )
}
export default Page404;