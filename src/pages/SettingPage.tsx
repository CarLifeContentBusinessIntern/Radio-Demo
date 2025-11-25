import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RightArrowIcon from '../assets/rightArrowIcon.svg';
import { useVersion } from '../contexts/VersionContext';

function SettingPage() {
  const navigate = useNavigate();
  const { isLiveVersion, toggleLiveVersion, isRadioVersion, toggleRadioVersion } = useVersion();
  const [selectedCountry, setSelectedCountry] = useState('대한민국');

  const handleCountryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCountry(event.target.value);
  };

  return (
    <div>
      <div className="flex justify-between items-center bg-gray-800 h-60 pl-16 pr-8">
        <div className="flex items-center">
          <div className="w-[106px] h-[106px] rounded-full bg-gray-300 mr-7" />
          <div>
            <p className="text-[32px] text-gray-400">이름</p>
            <p className="text-[32px] text-white font-bold">pickle_sound@obigo.com</p>
          </div>
        </div>
        <div className="bg-gray-500 rounded-3xl w-[312px] h-24 flex items-center justify-center cursor-pointer">
          <p className="text-[42px]">로그아웃</p>
        </div>
      </div>

      <div className="px-9">
        <div
          className="flex px-4 items-center h-[170px] justify-between cursor-pointer"
          onClick={() => navigate('/setting/preference', { state: { title: '취향 설정' } })}
        >
          <p className="text-[42px]">취향 관리</p>
          <img src={RightArrowIcon} className="cursor-pointer" />
        </div>

        <div className="border-t border-gray-400 border-[1px] w-full" />

        <div className="flex px-4 items-center h-[170px] justify-between cursor-pointer">
          <p className="text-[42px]">공지사항</p>
          <img src={RightArrowIcon} className="cursor-pointer" />
        </div>

        <div className="border-t border-gray-400 border-[1px] w-full" />

        <div className="flex px-4 items-center h-[170px] justify-between cursor-pointer">
          <p className="text-[42px]">약관 정보</p>
          <img src={RightArrowIcon} className="cursor-pointer" />
        </div>

        <div className="border-t border-gray-400 border-[1px] w-full" />

        <div className="flex px-4 items-center h-[170px] justify-between">
          <p className="text-[42px]">버전 정보</p>
          <p className="text-[42px]">v.3.0.0</p>
        </div>

        <div className="border-t border-gray-400 border-[1px] w-full" />

        <div
          className="flex px-4 items-center h-[170px] justify-between cursor-pointer"
          onClick={() => navigate('/setting/function', { state: { title: '기능 설정' } })}
        >
          <p className="text-[42px]">기능 설정</p>
          <img src={RightArrowIcon} className="cursor-pointer" />
        </div>

        <div className="border-t border-gray-400 border-[1px] w-full" />

        <div
          className="flex px-4 items-center h-[170px] justify-between text-gray-400 cursor-pointer"
          onClick={() => navigate('/setting/demo', { state: { title: '데모 세팅' } })}
        >
          <p className="text-[42px]">데모 세팅</p>
        </div>

        <div className="border-t border-gray-400 border-[1px] w-full" />

        <div className="flex px-4 items-center h-[170px] justify-center text-gray-400 cursor-pointer">
          <p className="text-[42px]">서비스 탈퇴</p>
        </div>

        {/* <div className="flex px-4 items-center h-[170px] justify-between">
          <p className="text-[42px]">국가</p>

          <div className="relative w-60 h-16">
            <select
              className="w-full h-full bg-black text-gray-200 text-[32px] rounded-md p-1 pr-10 appearance-none pl-5"
              value={selectedCountry}
              onChange={handleCountryChange}
            >
              <option value="대한민국">대한민국</option>
              <option value="USA">USA</option>
            </select>

            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-200">
              <svg className="h-10 w-10 fill-current" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-400 border-[1px] w-full" />

        <div className="flex px-4 items-center h-[170px] justify-between">
          <p className="text-[42px]">OEM</p>

          <div className="relative w-60 h-16">
            <select
              className="w-full h-full bg-black text-gray-200 text-[32px] rounded-md p-1 pr-10 appearance-none pl-5"
              value={selectedOEM}
              onChange={handleOEMChange}
            >
              <option value="Hyundai">Hyundai</option>
              <option value="RKM">RKM</option>
              <option value="TOYOTA">TOYOTA</option>
              <option value="KGM">KGM</option>
              <option value="Kia">Kia</option>
            </select>

            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-200">
              <svg className="h-10 w-10 fill-current" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </div> */}

        {/* <div className="border-t border-gray-400 border-[1px] w-full" />

        <div className="flex px-4 items-center h-[170px] justify-between">
          <p className="text-[42px]">Live</p>
          {isLiveVersion ? (
            <PiToggleRightFill size={80} className="cursor-pointer" onClick={toggleLiveVersion} />
          ) : (
            <PiToggleLeftLight size={80} className="cursor-pointer" onClick={toggleLiveVersion} />
          )}
        </div>

        <div className="border-t border-gray-400 border-[1px] w-full" />

        <div className="flex px-4 items-center h-[170px] justify-between">
          <p className="text-[42px]">라디오</p>
          {isRadioVersion ? (
            <PiToggleRightFill size={80} className="cursor-pointer" onClick={toggleRadioVersion} />
          ) : (
            <PiToggleLeftLight size={80} className="cursor-pointer" onClick={toggleRadioVersion} />
          )}
        </div> */}
      </div>
    </div>
  );
}

export default SettingPage;
