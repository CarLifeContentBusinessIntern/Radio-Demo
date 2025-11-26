import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FaCaretDown } from 'react-icons/fa';
import { useOEM } from '../contexts/OEMContext';
import { useZoom } from '../contexts/ZoomContext';

interface SettingItemProps {
  label: string;
  dropdownRef: React.RefObject<HTMLDivElement | null>;
  isOpen: boolean;
  toggleOpen: () => void;
  selectedItem: string;
  onSelect: (value: string) => void;
  options: string[];
}

const SettingItem = memo(
  ({
    label,
    dropdownRef,
    isOpen,
    toggleOpen,
    selectedItem,
    onSelect,
    options,
  }: SettingItemProps) => (
    <div>
      <div className="flex items-center h-32 justify-between">
        <p className="text-lg">{label}</p>

        <div className="relative w-48 h-14" ref={dropdownRef}>
          {/* 1. 선택된 값 표시 영역 (클릭 버튼) */}
          <button
            type="button"
            className="w-full h-full bg-black text-gray-200 text-lg rounded-2xl pl-5 pr-3 border-2 border-white flex items-center justify-between"
            onClick={toggleOpen}
            aria-haspopup="listbox"
            aria-expanded={isOpen}
          >
            <span>{selectedItem}</span>
            <FaCaretDown size={40} />
          </button>

          {/* 2. 드롭다운 목록 (isOpen 상태에 따라 표시) */}
          {isOpen && (
            <ul
              className="absolute z-10 mt-2 w-full bg-black text-gray-200 text-lg border-2 border-white rounded-xl shadow-lg overflow-hidden"
              role="listbox"
            >
              {options.map((option) => (
                <li
                  key={option}
                  onClick={() => onSelect(option)}
                  className={`
                    p-3 pl-5 cursor-pointer 
                    ${option === selectedItem ? 'bg-[#94CBFF] text-black' : 'hover:bg-blue-600'}
                  `}
                  role="option"
                  aria-selected={option === selectedItem}
                >
                  {option}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
);

const ZOOM_OPTIONS = ['100%', '120%', '140%', '160%', '180%', '200%'];
const OEM_OPTIONS = ['Hyundai', 'RKM', 'TOYOTA', 'KGM', 'Kia'];

function SettingDemo() {
  const { selectedZoom, setSelectedZoom } = useZoom();
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const zoomDropdownRef = useRef<HTMLDivElement>(null);

  const { selectedOEM, setSelectedOEM } = useOEM();
  const [isOEMOpen, setIsOEMOpen] = useState(false);
  const OEMdropdownRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (zoomDropdownRef.current && !zoomDropdownRef.current.contains(event.target as Node)) {
      setIsZoomOpen(false);
    }
    if (OEMdropdownRef.current && !OEMdropdownRef.current.contains(event.target as Node)) {
      setIsOEMOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [handleClickOutside]);

  const settings = useMemo(
    () => [
      {
        label: '화면 확대',
        dropdownRef: zoomDropdownRef,
        isOpen: isZoomOpen,
        toggleOpen: () => setIsZoomOpen((prev) => !prev),
        selectedItem: `${selectedZoom * 100}%`,
        onSelect: (v: string) => {
          const zoom = parseFloat(v) / 100;
          setSelectedZoom(zoom);
          setIsZoomOpen(false);
        },
        options: ZOOM_OPTIONS,
      },
      {
        label: 'OEM 콘텐츠',
        dropdownRef: OEMdropdownRef,
        isOpen: isOEMOpen,
        toggleOpen: () => setIsOEMOpen((prev) => !prev),
        selectedItem: selectedOEM,
        onSelect: (v: string) => {
          setSelectedOEM(v);
          setIsOEMOpen(false);
        },
        options: OEM_OPTIONS,
      },
    ],
    [isZoomOpen, selectedZoom, setSelectedZoom, isOEMOpen, selectedOEM, setSelectedOEM]
  );

  return (
    <div className="px-6">
      {settings.map((setting, index) => (
        <>
          <SettingItem key={setting.label} {...setting} />
          {index < settings.length - 1 && (
            <div className="border-t border-gray-400 border-[1px] w-full" />
          )}
        </>
      ))}
    </div>
  );
}

export default SettingDemo;
