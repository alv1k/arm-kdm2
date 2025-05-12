import { useSelector } from 'react-redux';

const LoadingPage = () => {
  const isLoading = useSelector((state) => state.loading_slice.isLoading);

  return (
    <div className={`
      fixed inset-0 bg-slate-900/80 z-[100] 
      flex items-center justify-center
      transition-all duration-300 ease-in-out
      ${isLoading ? 'opacity-100' : 'opacity-0 pointer-events-none'}
    `}>
      <img 
        className=" animate-bounce transition-opacity duration-300"
        src="/src/assets/images/logo.png" 
        alt="Loading..." 
      />
    </div>
  );
};

export default LoadingPage;