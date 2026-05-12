import { useTranslation } from 'react-i18next';

export const useLang = (): 'es' | 'en' => {
  const { i18n } = useTranslation();
  return i18n.language?.startsWith('en') ? 'en' : 'es';
};
