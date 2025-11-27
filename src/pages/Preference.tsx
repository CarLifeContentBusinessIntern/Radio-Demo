import { useState } from 'react';
import { usePreference } from '../contexts/PreferenceContext';
import { PREFERENCE_QUESTIONS } from '../constants/preferenceQuestions';
import PreferenceSection from '../components/preference/PreferenceSection';
import PreferenceButton from '../components/preference/PreferenceButton';
import PreferenceSlider from '../components/preference/PreferenceSlider';
import type { PreferenceState } from '../types/preference';
import { useNavigate } from 'react-router-dom';

function Preference() {
  const { preferences, updatePreference, resetPreferences } = usePreference();
  const [localPreferences, setLocalPreferences] = useState<PreferenceState>(preferences);
  const navigate = useNavigate();

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
    resetPreferences();
    setLocalPreferences(preferences);
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
        <div className="flex justify-between items-center leading-none sticky top-0 bg-black z-10 py-7">
          <h1 className="text-xl font-bold">
            AI 추천 정확도를 높이는 선택 옵션입니다. 자유롭게 선택해 주세요.
          </h1>
          <button
            className="flex gap-6 text-xl font-semibold rounded-full bg-[#202026] text-[#A1A1A1] items-center justify-between px-6 py-4"
            onClick={handleReset}
          >
            <img src="/refresh.png" alt="초기화" width={34} height={25} />
            <span>초기화</span>
          </button>
        </div>

        <div className="my-6">
          {PREFERENCE_QUESTIONS.map((question) => (
            <PreferenceSection key={question.id} question={question.question}>
              {question.type === 'single' && question.options && (
                <>
                  {question.options.map((option) => (
                    <PreferenceButton
                      key={option.value}
                      label={option.label}
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
                      label={option.label}
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

        <div className="mt-16 mb-[72px]">
          <button
            className="w-full bg-[#202026] text-[#A1A1A1] py-6 rounded-full text-xl font-semibold hover:bg-[#aa5bff] hover:text-white transition-colors"
            onClick={handleSave}
          >
            저장하기
          </button>
        </div>
      </div>
    </div>
  );
}

export default Preference;
