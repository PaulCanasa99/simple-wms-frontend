import { useMemo } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { es as esDateFns, enUS as enDateFns } from 'date-fns/locale';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { buildTheme } from './theme';
import { AuthProvider } from './auth/AuthContext';
import { AppRouter } from './router';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5_000,
    },
  },
});

export const App = ({ demoMode }: { demoMode: boolean }) => {
  const { i18n } = useTranslation();
  const lang: 'es' | 'en' = i18n.language?.startsWith('en') ? 'en' : 'es';
  const theme = useMemo(() => buildTheme(lang), [lang]);
  const dateLocale = lang === 'es' ? esDateFns : enDateFns;

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={dateLocale}>
          <AuthProvider>
            <AppRouter demoMode={demoMode} />
          </AuthProvider>
        </LocalizationProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};
