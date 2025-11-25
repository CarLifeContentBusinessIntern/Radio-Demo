import { usePreference } from '../contexts/PreferenceContext';
import { PREFERENCE_QUESTIONS } from '../constants/preferenceQuestions';
import PreferenceSection from '../components/preference/PreferenceSection';
import PreferenceButton from '../components/preference/PreferenceButton';
import PreferenceSlider from '../components/preference/PreferenceSlider';

function Preference() {
  const { preferences, updatePreference, toggleGenre } = usePreference();

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">AI 추천 정확도를 높이는 선택 옵션입니다.</h1>
        <p className="text-gray-400 mb-12">자유롭게 선택해 주세요.</p>

        {PREFERENCE_QUESTIONS.map((question) => (
          <PreferenceSection key={question.id} question={question.question}>
            {question.type === 'single' && question.options && (
              <>
                {question.options.map((option) => (
                  <PreferenceButton
                    key={option.value}
                    label={option.label}
                    selected={preferences[question.id] === option.value}
                    onClick={() => updatePreference(question.id, option.value as never)}
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
                    selected={(preferences.genres as string[]).includes(option.value)}
                    onClick={() => toggleGenre(option.value)}
                  />
                ))}
              </>
            )}

            {question.type === 'slider' && (
              <div className="w-full">
                <PreferenceSlider
                  value={preferences.diversity as number}
                  onChange={(value) => updatePreference('diversity', value as never)}
                  min={question.min}
                  max={question.max}
                  step={question.step}
                />
              </div>
            )}
          </PreferenceSection>
        ))}

        <div className="mt-16">
          <button className="w-full bg-blue-600 text-white py-4 rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors">
            저장하기
          </button>
        </div>
      </div>
    </div>
  );
}

export default Preference;
