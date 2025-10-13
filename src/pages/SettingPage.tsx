import RightArrowIcon from '../assets/rightArrowIcon.svg';
import { PiToggleLeftLight, PiToggleRightFill } from 'react-icons/pi';
import { useVersion } from '../contexts/VersionContext';

function SettingPage() {
  const { isLiveVersion, toggleVersion } = useVersion();

  const handleToggleClick = () => {
    toggleVersion();
  };

  return (
    <div>
      <div className="flex justify-between items-center bg-gray-800 h-60 pl-16 pr-8">
        <div className="flex items-center">
          <div className="w-[106px] h-[106px] rounded-full bg-gray-300 mr-7" />
          <p className="text-[32px] text-gray-400">Guest</p>
        </div>
        <div className="bg-gray-500 rounded-3xl w-[312px] h-24 flex items-center justify-center cursor-pointer">
          <p className="text-[42px]">로그인</p>
        </div>
      </div>
      <div className="px-9">
        <div className="flex px-4 items-center h-[170px] justify-between">
          <p className="text-[42px]">공지사항</p>
          <img src={RightArrowIcon} className="cursor-pointer" />
        </div>
        <div className="border-t border-gray-400 border-[1px] w-full" />
        <div className="flex px-4 items-center h-[170px] justify-between">
          <p className="text-[42px]">약관 정보</p>
          <img src={RightArrowIcon} className="cursor-pointer" />
        </div>
        <div className="border-t border-gray-400 border-[1px] w-full" />
        <div className="flex px-4 items-center h-[170px] justify-between">
          <p className="text-[42px]">버전 정보</p>
          <p className="text-[42px]">v.1.0.0</p>
        </div>
        <div className="border-t border-gray-400 border-[1px] w-full" />
        <div className="flex px-4 items-center h-[170px] justify-between">
          <p className="text-[42px]">Live</p>
          {isLiveVersion ? (
            <PiToggleRightFill size={80} className="cursor-pointer" onClick={handleToggleClick} />
          ) : (
            <PiToggleLeftLight size={80} className="cursor-pointer" onClick={handleToggleClick} />
          )}
        </div>
      </div>
    </div>
  );
}

export default SettingPage;
