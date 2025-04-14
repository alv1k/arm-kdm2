import { useMediaQuery } from 'react-responsive';

const useMediaQueries = () => {
  const xl_breakpoint = useMediaQuery({ maxWidth: 1920, minWidth: 1441 });
  const lg_breakpoint = useMediaQuery({ maxWidth: 1440, minWidth: 821 });
  const md_breakpoint = useMediaQuery({ maxWidth: 820, minWidth: 391 });
  const sm_breakpoint = useMediaQuery({ maxWidth: 390 });

  return { xl_breakpoint, lg_breakpoint, md_breakpoint, sm_breakpoint };
};

export default useMediaQueries;