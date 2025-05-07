import { useState, useRef, useEffect } from 'react';

const CustomSelect = ({ options, defaultValue, onDataSend }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(defaultValue);
  const [selectedObject, setSelectedObject] = useState();
  const [selectedType, setSelectedType] = useState();
  const selectRef = useRef(null);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  const handleOptionClick = (option) => {
    if (typeof option == 'string') {
      setSelectedType(option)
    } else {
      setSelectedObject(option.address)
    }
    onDataSend(typeof option == 'string' ? option : option.id);
    setSelectedOption(typeof option == 'string' ? option : option.address)
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);  

  return (
    <div className="relative inline-block text-left w-full" ref={selectRef}>
      <div className="">
        <button
          onClick={toggleDropdown}
          className={`inline-flex justify-between w-full rounded-lg px-5 py-5 bg-item-active focus:outline-none focus:ring-1 focus:ring-[#6374AD] focus:border-[#6374AD] text-nowrap overflow-auto
          ${isOpen ? 'ring-2 ring-[#6374AD] ' : ''} 
          ${selectedObject || selectedType ? '' : 'text-[#787C82]'}
        `}>
          {selectedOption}
          <svg className="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {isOpen && (
        <div className="absolute right-0 z-10 mt-1 w-full rounded-md shadow-lg bg-white">
          <div className="py-1" role="menu" aria-orientation="vertical">
            {options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleOptionClick(option)}
                className={`text-[#787C82] block px-4 py-4 text-sm hover:bg-item-active w-full text-left ${selectedObject || selectedType ? 'text-black bg-item-active' : ''}`}
              >
                {typeof option == 'string' ? option : option.address}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomSelect;