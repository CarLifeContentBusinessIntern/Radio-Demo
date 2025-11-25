import { useState, useRef, useEffect } from 'react';
import { FaCaretDown } from 'react-icons/fa';
import { useOEM } from '../contexts/OEMContext';

const OEM_OPTIONS = ['Hyundai', 'RKM', 'TOYOTA', 'KGM', 'Kia'];

function SettingDemo() {
  const { selectedOEM, setSelectedOEM } = useOEM();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

  const handleSelect = (oem: string) => {
    setSelectedOEM(oem);
    setIsOpen(false);
  };

  return (
    <div className="px-6">
      <div className="flex px-4 items-center h-[160px] justify-between">
        <p className="text-[36px]">OEM 콘텐츠</p>

        <div className="relative w-60 h-16" ref={dropdownRef}>
          {/* 1. 선택된 값 표시 영역 (클릭 버튼) */}
          <button
            type="button"
            className="w-full h-full bg-black text-gray-200 text-[28px] rounded-2xl pl-5 pr-3 border-4 border-white flex items-center justify-between"
            onClick={() => setIsOpen(!isOpen)}
            aria-haspopup="listbox"
            aria-expanded={isOpen}
          >
            <span>{selectedOEM}</span>
            <FaCaretDown size={50} />
          </button>

          {/* 2. 드롭다운 목록 (isOpen 상태에 따라 표시) */}
          {isOpen && (
            <ul
              className="absolute z-10 mt-2 w-full bg-black text-gray-200 text-[28px] border-4 border-white rounded-xl shadow-lg overflow-hidden"
              role="listbox"
            >
              {OEM_OPTIONS.map((oem) => (
                <li
                  key={oem}
                  onClick={() => handleSelect(oem)}
                  className={`
                    p-3 pl-5 cursor-pointer 
                    ${oem === selectedOEM ? 'bg-[#94CBFF] text-black' : 'hover:bg-blue-600'}
                  `}
                  role="option"
                  aria-selected={oem === selectedOEM}
                >
                  {oem}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default SettingDemo;
