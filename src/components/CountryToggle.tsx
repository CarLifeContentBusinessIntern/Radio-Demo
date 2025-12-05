import { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import KR from '../assets/ko.png';
import US from '../assets/us.png';

interface Country {
  code: string;
  flag: string;
  language: string;
}

const MAIN_TABS = ['/', '/radio', '/episodes/recent', '/ai-pick'];
const LANGUAGE_STORAGE_KEY = 'selected_language';

function CountryToggle() {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState('KR');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const countries: Country[] = [
    { code: 'KR', flag: KR, language: 'ko' },
    { code: 'US', flag: US, language: 'en' },
  ];

  // 초기 언어 설정 및 i18n 동기화
  useEffect(() => {
    try {
      const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (savedLanguage && savedLanguage !== i18n.language) {
        i18n.changeLanguage(savedLanguage);
      }
    } catch (error) {
      console.error('Failed to access localStorage:', error);
    }
  }, []);

  // i18n 언어 변경 시 selectedCountry 동기화
  useEffect(() => {
    const currentLang = i18n.language;
    const country = countries.find((c) => c.language === currentLang);
    if (country) {
      setSelectedCountry(country.code);
    }
  }, [i18n.language]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCountrySelect = async (country: Country) => {
    setSelectedCountry(country.code);
    setIsOpen(false);

    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, country.language);
    } catch (error) {
      console.error('Failed to write to localStorage:', error);
    }

    await i18n.changeLanguage(country.language);

    const isMainTab = MAIN_TABS.includes(location.pathname);

    if (!isMainTab) {
      navigate('/');
    }
  };

  const currentCountry = countries.find((c) => c.code === selectedCountry);
  const otherCountries = countries.filter((c) => c.code !== selectedCountry);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-8 h-8 rounded-full flex items-center justify-center relative z-50"
      >
        <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center">
          <img
            src={currentCountry?.flag}
            alt={currentCountry?.code}
            className="w-full h-full object-cover"
          />
        </div>
      </button>

      {isOpen && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 -translate-y-8 bg-[#D9D9D9]/50 rounded-full z-40 overflow-hidden">
          {otherCountries.map((country) => (
            <button
              key={country.code}
              onClick={() => handleCountrySelect(country)}
              className="w-8 h-[72px] flex items-end justify-center relative z-50"
            >
              <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center">
                <img src={country.flag} alt={country.code} className="w-full h-full object-cover" />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default CountryToggle;
