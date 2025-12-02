import { useTranslation } from 'react-i18next';

export const useIsEnglish = () => {
  const { i18n } = useTranslation();
  const isEnglish = i18n.language.startsWith('en');

  return { isEnglish };
};
