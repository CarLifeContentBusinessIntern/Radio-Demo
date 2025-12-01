import { PiToggleLeftLight, PiToggleRightFill } from 'react-icons/pi';
import { useVersion } from '../contexts/VersionContext';
import { memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

interface SettingItemProps {
  label: string;
  isEnabled: boolean;
  onToggle: () => void;
}

const SettingItem = memo(({ label, isEnabled, onToggle }: SettingItemProps) => (
  <div>
    <div className="flex px-4 items-center h-32 justify-between">
      <p className="text-lg">{label}</p>
      {isEnabled ? (
        <PiToggleRightFill size={50} className="cursor-pointer" onClick={onToggle} />
      ) : (
        <PiToggleLeftLight size={50} className="cursor-pointer" onClick={onToggle} />
      )}
    </div>

    <div className="border-t border-gray-400 border-[1px] w-full" />
  </div>
));

function SettingFunction() {
  const { t } = useTranslation();

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
      { label: t('setting.live'), isEnabled: isLiveVersion, onToggle: toggleLiveVersion },
      { label: t('setting.radio'), isEnabled: isRadioVersion, onToggle: toggleRadioVersion },
      {
        label: t('setting.AI-voice-search'),
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
      t,
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
