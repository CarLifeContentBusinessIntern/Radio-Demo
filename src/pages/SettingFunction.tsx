import { PiToggleLeftLight, PiToggleRightFill } from 'react-icons/pi';
import { useVersion } from '../contexts/VersionContext';

function SettingFunction() {
  const {
    isLiveVersion,
    toggleLiveVersion,
    isRadioVersion,
    toggleRadioVersion,
    isAIVoiceSearchVersion,
    toggleAIVoiceSearchVersion,
  } = useVersion();
  return (
    <div className="px-6">
      <div className="flex px-4 items-center h-[160px] justify-between">
        <p className="text-[36px]">Live</p>
        {isLiveVersion ? (
          <PiToggleRightFill size={80} className="cursor-pointer" onClick={toggleLiveVersion} />
        ) : (
          <PiToggleLeftLight size={80} className="cursor-pointer" onClick={toggleLiveVersion} />
        )}
      </div>

      <div className="border-t border-gray-400 border-[1px] w-full" />

      <div className="flex px-4 items-center h-[160px] justify-between">
        <p className="text-[36px]">라디오</p>
        {isRadioVersion ? (
          <PiToggleRightFill size={80} className="cursor-pointer" onClick={toggleRadioVersion} />
        ) : (
          <PiToggleLeftLight size={80} className="cursor-pointer" onClick={toggleRadioVersion} />
        )}
      </div>

      <div className="border-t border-gray-400 border-[1px] w-full" />

      <div className="flex px-4 items-center h-[160px] justify-between">
        <p className="text-[36px]">AI 음성 검색</p>
        {isAIVoiceSearchVersion ? (
          <PiToggleRightFill
            size={80}
            className="cursor-pointer"
            onClick={toggleAIVoiceSearchVersion}
          />
        ) : (
          <PiToggleLeftLight
            size={80}
            className="cursor-pointer"
            onClick={toggleAIVoiceSearchVersion}
          />
        )}
      </div>
    </div>
  );
}

export default SettingFunction;

// 라이브, 라디오, 음성검색
