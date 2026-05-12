import { Alert, Box, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { db } from '../mocks/db';

export const DemoBanner = () => {
  const { t } = useTranslation();
  const handleReset = () => {
    db.reset();
    window.location.reload();
  };
  return (
    <Box>
      <Alert
        severity="info"
        sx={{ borderRadius: 0 }}
        action={
          <Button color="inherit" size="small" onClick={handleReset}>
            {t('app.demoBannerCta')}
          </Button>
        }
      >
        {t('app.demoBanner')}
      </Alert>
    </Box>
  );
};
