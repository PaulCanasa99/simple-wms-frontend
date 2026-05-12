import { format, parseISO } from 'date-fns';
import { es, enUS } from 'date-fns/locale';

export const formatDate = (
  iso: string | Date | null | undefined,
  lang: 'es' | 'en' = 'es',
): string => {
  if (!iso) return '-';
  const date = typeof iso === 'string' ? parseISO(iso) : iso;
  if (Number.isNaN(date.getTime())) return '-';
  return lang === 'es'
    ? format(date, "d 'de' MMMM yyyy", { locale: es })
    : format(date, 'MMMM d, yyyy', { locale: enUS });
};
