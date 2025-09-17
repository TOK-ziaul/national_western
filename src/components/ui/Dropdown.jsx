import { useState, useRef, useEffect } from "react";
import { IoIosArrowDown } from "react-icons/io";

const Dropdown = ({
  options = [],
  selectedValue,
  onSelect,
  placeholder = "Select an option",
  className = "",
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleOptionClick = (option) => {
    onSelect(option);
    setIsOpen(false);
  };

  const selectedOption = options.find(
    (option) => option.value === selectedValue
  );

  return (
    <div className={`relative ${className} min-w-[11rem]  `} ref={dropdownRef}>
      {/* Dropdown Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          w-full px-4 pt-[0.4rem] pb-[9px]  text-left bg-white border border-gray-300/70 rounded-t-md
          shadow-sm focus:outline-none
           transition-colors duration-200
          ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
         
        `}
      >
        <span className="block truncate">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <IoIosArrowDown
            className={`w-5 h-5 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
          <ul className="py-0 max-h-60 overflow-auto">
            {options.map((option, index) => (
              <li key={option.value || index}>
                <button
                  type="button"
                  onClick={() => handleOptionClick(option)}
                  className={`
                    w-full px-4 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none
                    transition-colors duration-150  
                    ${selectedValue === option.value ? "bg-gray-100 " : ""}
                  `}
                >
                  {option.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
