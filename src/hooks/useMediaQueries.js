import { useMediaQuery } from 'react-responsive';

const useMediaQueries = () => {
  // const xxl_breakpoint = useMediaQuery({ minWidth: 1921 });
  const xl_breakpoint = useMediaQuery({ maxWidth: 1920, minWidth: 1441 });
  const lg_breakpoint = useMediaQuery({ maxWidth: 1440, minWidth: 821 });
  const md_breakpoint = useMediaQuery({ maxWidth: 820, minWidth: 601 });
  const sm_breakpoint = useMediaQuery({ maxWidth: 600 });

  
  // const xl_breakpoint = useMediaQuery({ maxWidth: 1920, minWidth: 1441 });
  // const lg_breakpoint = useMediaQuery({ maxWidth: 1440, minWidth: 1281 });
  // const md_breakpoint = useMediaQuery({ maxWidth: 1280, minWidth: 601 }); 
  // const sm_breakpoint = useMediaQuery({ maxWidth: 600 });

  return { xl_breakpoint, lg_breakpoint, md_breakpoint, sm_breakpoint };
};

export default useMediaQueries;