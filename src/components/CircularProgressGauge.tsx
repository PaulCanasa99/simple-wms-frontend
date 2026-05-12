import { Box, CircularProgress, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

export const CircularProgressGauge = ({
  value,
  thickness = 4,
}: {
  value: number;
  thickness?: number;
}) => {
  const { t } = useTranslation();
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex', height: 200 }}>
      <CircularProgress
        variant="determinate"
        value={value}
        size={200}
        thickness={thickness}
        sx={{ zIndex: 1, color: 'primary.light' }}
      />
      <CircularProgress
        thickness={thickness}
        variant="determinate"
        value={100}
        size={200}
        sx={{ color: 'secondary.light', position: 'absolute', left: 0 }}
      />
      <Box
        sx={{
          inset: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box>
          <Typography align="center" color="text.primary" fontSize={36}>
            {`${Math.round(value)}%`}
          </Typography>
          <Typography fontSize={12}>{t('warehouse.occupiedLocations')}</Typography>
        </Box>
      </Box>
    </Box>
  );
};
