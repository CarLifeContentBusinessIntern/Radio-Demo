import { useState } from 'react';
import { INIT_PREFERENCE_STATE, usePreference } from '../contexts/PreferenceContext';
import { PREFERENCE_QUESTIONS } from '../constants/preferenceQuestions';
import PreferenceSection from '../components/preference/PreferenceSection';
import PreferenceButton from '../components/preference/PreferenceButton';
import PreferenceSlider from '../components/preference/PreferenceSlider';
import type { PreferenceState } from '../types/preference';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function Preference() {
  const { t, i18n } = useTranslation();
  const { preferences, updatePreference } = usePreference();
  const [localPreferences, setLocalPreferences] = useState<PreferenceState>(preferences);
  const navigate = useNavigate();
  const isKorean = i18n.language === 'ko';

  const handleUpdateLocal = <K extends keyof PreferenceState>(
    key: K,
    value: PreferenceState[K]
  ) => {
    setLocalPreferences((prev) => ({ ...prev, [key]: value }));
  };

  const handleToggleLocal = (key: keyof PreferenceState, value: string) => {
    setLocalPreferences((prev) => {
      const currentValues = prev[key] as string[];
      const isSelected = currentValues.includes(value);

      return {
        ...prev,
        [key]: isSelected ? currentValues.filter((v) => v !== value) : [...currentValues, value],
      };
    });
  };

  const handleReset = () => {
    setLocalPreferences(INIT_PREFERENCE_STATE);
  };

  const handleSave = () => {
    try {
      Object.keys(localPreferences).forEach((key) => {
        updatePreference(
          key as keyof PreferenceState,
          localPreferences[key as keyof PreferenceState]
        );
      });
      navigate(-1);
    } catch (error) {
      console.error('오류 발생:', error);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-[90%] mx-auto">
        <div className="flex justify-between items-center leading-none sticky top-0 bg-black z-10 py-2">
          <h1 className="text-xl font-bold">{t('preference.title')}</h1>
          <div className="flex gap-4">
            <button
              className="flex gap-[6px] text-base font-semibold rounded-full bg-[#202026] text-[#A1A1A1] items-center justify-center px-3 py-3 w-[120px]"
              onClick={handleReset}
            >
              <img src="/refresh.png" alt="초기화" className="w-6 h-4" />
              <span>{t('button.reset')}</span>
            </button>
            <button
              className="flex text-base font-semibold rounded-full bg-[#5D3983] text-[#D5D5D5] items-center justify-center px-3 py-3 w-[120px]"
              onClick={handleSave}
            >
              <span>{t('button.save')}</span>
            </button>
          </div>
        </div>

        <div className="my-6">
          {PREFERENCE_QUESTIONS.map((question) => (
            <PreferenceSection
              key={question.id}
              question={isKorean ? question.question.ko : question.question.en}
            >
              {question.type === 'single' && question.options && (
                <>
                  {question.options.map((option) => (
                    <PreferenceButton
                      key={option.value}
                      label={isKorean ? option.label.ko : option.label.en}
                      selected={localPreferences[question.id] === option.value}
                      onClick={() => handleUpdateLocal(question.id, option.value)}
                    />
                  ))}
                </>
              )}

              {question.type === 'multiple' && question.options && (
                <>
                  {question.options.map((option) => (
                    <PreferenceButton
                      key={option.value}
                      label={isKorean ? option.label.ko : option.label.en}
                      selected={(localPreferences[question.id] as string[]).includes(option.value)}
                      onClick={() => handleToggleLocal(question.id, option.value)}
                    />
                  ))}
                </>
              )}

              {question.type === 'slider' && (
                <div className="sticky top-24 w-full">
                  <PreferenceSlider
                    value={localPreferences.diversity as number}
                    onChange={(value) => handleUpdateLocal('diversity', value)}
                    min={question.min}
                    max={question.max}
                    step={question.step}
                  />
                </div>
              )}
            </PreferenceSection>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Preference;
