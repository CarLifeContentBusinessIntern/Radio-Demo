import { PiToggleLeftLight, PiToggleRightFill } from 'react-icons/pi';
import { useVersion } from '../contexts/VersionContext';
import { memo, useMemo } from 'react';

interface SettingItemProps {
  label: string;
  isEnabled: boolean;
  onToggle: () => void;
}

const SettingItem = memo(({ label, isEnabled, onToggle }: SettingItemProps) => (
  <div>
    <div className="flex px-4 items-center h-[160px] justify-between">
      <p className="text-[36px]">{label}</p>
      {isEnabled ? (
        <PiToggleRightFill size={80} className="cursor-pointer" onClick={onToggle} />
      ) : (
        <PiToggleLeftLight size={80} className="cursor-pointer" onClick={onToggle} />
      )}
    </div>

    <div className="border-t border-gray-400 border-[1px] w-full" />
  </div>
));

function SettingFunction() {
  const {
    isLiveVersion,
    toggleLiveVersion,
    isRadioVersion,
    toggleRadioVersion,
    isAIVoiceSearchVersion,
    toggleAIVoiceSearchVersion,
  } = useVersion();

  const settings = useMemo(
    () => [
      { label: 'Live', isEnabled: isLiveVersion, onToggle: toggleLiveVersion },
      { label: '라디오', isEnabled: isRadioVersion, onToggle: toggleRadioVersion },
      {
        label: 'AI 음성 검색',
        isEnabled: isAIVoiceSearchVersion,
        onToggle: toggleAIVoiceSearchVersion,
      },
    ],
    [
      isLiveVersion,
      isRadioVersion,
      isAIVoiceSearchVersion,
      toggleLiveVersion,
      toggleRadioVersion,
      toggleAIVoiceSearchVersion,
    ]
  );

  return (
    <div className="px-6">
      {settings.map((setting) => (
        <SettingItem key={setting.label} {...setting} />
      ))}
    </div>
  );
}

export default SettingFunction;
