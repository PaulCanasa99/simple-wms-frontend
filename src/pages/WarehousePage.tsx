import { Container, Divider, Typography, Box } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLocations } from '../hooks/useLocations';
import { useHandlingUnits } from '../hooks/useHandlingUnits';
import { CircularProgressGauge } from '../components/CircularProgressGauge';
import type { Location, HandlingUnitStatus } from '../types/api';

const MAX_X = 17;
const MAX_Y = 16;

const getLetter = (index: number) => (index === 0 ? '' : String.fromCharCode(64 + index));

const racksFor = (locations: Location[], i: number, j: number) => {
  const prefix = `${getLetter(i)}${getLetter(j)}`;
  return locations.filter((l) => l.handlingUnit && l.code.startsWith(prefix));
};

const colorFor = (count: number, max: number) => {
  if (count >= max) return '#214D5B';
  if (count === 0) return 'white';
  return '#C3E8F8';
};

export const WarehousePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: locations = [] } = useLocations({ refetchInterval: 5000 });
  const { data: handlingUnits = [] } = useHandlingUnits();

  const occupied = locations.filter((l) => l.handlingUnit).length;
  const occupancyPct = locations.length ? (occupied * 100) / locations.length : 0;

  const countByStatus = (status: HandlingUnitStatus) =>
    handlingUnits.filter((h) => h.status === status).length;

  const map: React.ReactNode[] = [];
  for (let i = 0; i < MAX_X; i++) {
    const squareRows: React.ReactNode[] = [];
    for (let j = 0; j < MAX_Y; j++) {
      const onClick = () => navigate(`/almacen/${getLetter(i)}${getLetter(j + 1)}`);
      if (i === 0) {
        squareRows.push(
          <Box
            key={j}
            sx={{ m: j % 2 ? '2px 40px 2px 2px' : '2px', height: 25, width: 25, mb: 2 }}
            onClick={onClick}
          >
            <Typography fontSize={24} fontWeight={600} color="white" align="center">
              {getLetter(j + 1)}
            </Typography>
          </Box>,
        );
      } else {
        const racks = racksFor(locations, i, j + 1);
        squareRows.push(
          <Box
            key={j}
            display="flex"
            alignItems="center"
            justifyContent="center"
            sx={{
              m: j % 2 ? '2px 40px 2px 2px' : '2px',
              height: 25,
              width: 25,
              cursor: 'pointer',
              bgcolor: colorFor(racks.length, 6),
            }}
            onClick={onClick}
          >
            <Typography fontSize={14} align="center">
              {racks.length || ''}
            </Typography>
          </Box>,
        );
      }
    }
    map.push(
      <Box key={i} sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography
          fontSize={24}
          fontWeight={600}
          color="white"
          lineHeight={1}
          mr={4}
          width={10}
        >
          {getLetter(i)}
        </Typography>
        {squareRows}
      </Box>,
    );
  }

  return (
    <Container sx={{ paddingTop: '40px' }} maxWidth="xl">
      <Typography variant="h4">{t('warehouse.title')}</Typography>
      <Grid container sx={{ pt: 5 }} spacing={0}>
        <Grid size={{ xs: 9 }}>
          <Box
            sx={{
              p: 3,
              mb: 5,
              width: '20%',
              border: '1px solid',
              borderColor: 'secondary.light',
            }}
          >
            <Typography sx={{ color: 'white', fontSize: 14 }}>
              {t('warehouse.receptionDispatch')}
            </Typography>
          </Box>
          <Box pl={8}>
            <Box display="flex" mb={2} pl={5}>
              <Box border="1px solid" borderColor="secondary.light" width={250} mr={5}>
                <Typography align="center" color="white">
                  Orgánico
                </Typography>
              </Box>
              <Box border="1px solid" borderColor="secondary.light" width={250} mr={5}>
                <Typography align="center" color="white">
                  Inorgánico
                </Typography>
              </Box>
              <Box border="1px solid" borderColor="secondary.light" width={145}>
                <Typography align="center" color="white">
                  Congelado
                </Typography>
              </Box>
            </Box>
            {map}
          </Box>
        </Grid>
        <Grid size={{ xs: 3 }} sx={{ bgcolor: 'white', borderRadius: '5px' }}>
          <Box
            sx={{
              p: 2,
              bgcolor: 'primary.main',
              textAlign: 'center',
              borderRadius: '5px 5px 0 0',
            }}
          >
            <Typography sx={{ fontWeight: 600, color: 'white' }}>
              {t('warehouse.panelTitle')}
            </Typography>
          </Box>
          <Box sx={{ height: 250, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CircularProgressGauge value={occupancyPct} thickness={3} />
          </Box>
          <Divider variant="middle" sx={{ bgcolor: 'secondary.light' }} />
          <Box sx={{ p: '20px 40px' }}>
            <StatRow label={t('warehouse.inInspection')} value={countByStatus('En inspección')} />
            <StatRow label={t('warehouse.toReceive')} value={countByStatus('Registrado')} />
            <StatRow label={t('warehouse.toDispatch')} value={countByStatus('Por despachar')} />
            <StatRow label={t('warehouse.freeLocations')} value={locations.length - occupied} />
            <StatRow label={t('warehouse.occupied2')} value={occupied} />
            <StatRow label={t('warehouse.totalLocations')} value={locations.length} bold />
          </Box>
        </Grid>
        <Box display="flex" mt={5} pl={8}>
          <Box height={25} width={25} bgcolor="white" />
          <Typography m="0 20px" color="white">
            {t('warehouse.available')}
          </Typography>
          <Box height={25} width={25} bgcolor="secondary.light" />
          <Typography m="0 20px" color="white">
            {t('warehouse.partial')}
          </Typography>
          <Box height={25} width={25} bgcolor="primary.main" />
          <Typography m="0 20px" color="white">
            {t('warehouse.occupied')}
          </Typography>
        </Box>
      </Grid>
    </Container>
  );
};

const StatRow = ({
  label,
  value,
  bold,
}: {
  label: string;
  value: number;
  bold?: boolean;
}) => (
  <Box display="flex" mb={2} sx={{ justifyContent: 'space-between' }}>
    <Typography sx={{ fontSize: 14, fontWeight: bold ? 700 : 500 }}>{label}</Typography>
    <Typography sx={{ fontSize: 14 }}>{value}</Typography>
  </Box>
);
