import { Box, Button, Container, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { GridColDef } from '@mui/x-data-grid';
import { useLocationsByRack } from '../hooks/useLocations';
import { StyledDataGrid } from '../components/StyledDataGrid';
import type { Location } from '../types/api';

export const RackPage = () => {
  const { t } = useTranslation();
  const { rack } = useParams();
  const navigate = useNavigate();
  const { data: locations = [] } = useLocationsByRack(rack);

  const columns: GridColDef<Location>[] = [
    {
      field: 'code',
      headerName: t('inventory.location'),
      flex: 1,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'huNumber',
      headerName: t('warehouse.huNumber'),
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      renderCell: ({ row }) => row.handlingUnit?.handlingUnitId ?? '-',
    },
    {
      field: 'productCode',
      headerName: t('warehouse.productCode'),
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      renderCell: ({ row }) => row.handlingUnit?.product.code ?? '-',
    },
    {
      field: 'productName',
      headerName: t('warehouse.productName'),
      flex: 1.5,
      headerAlign: 'center',
      align: 'center',
      renderCell: ({ row }) => row.handlingUnit?.product.name ?? '-',
    },
    {
      field: 'rotation',
      headerName: t('common.rotation'),
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      renderCell: ({ row }) => row.handlingUnit?.product.rotation ?? '-',
    },
    {
      field: 'clasification',
      headerName: t('common.clasification'),
      flex: 1.5,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'status',
      headerName: t('common.status'),
      flex: 1.5,
      headerAlign: 'center',
      align: 'center',
    },
  ];

  return (
    <Container sx={{ paddingTop: '40px' }} maxWidth="xl">
      <Grid container alignItems="center">
        <Grid size={{ xs: 6 }}>
          <Typography variant="h4">
            {t('warehouse.rackTitle', { rack: rack ?? '' })}
          </Typography>
        </Grid>
        <Grid size={{ xs: 6 }}>
          <Grid container justifyContent="flex-end">
            <Button
              onClick={() => navigate(-1)}
              variant="contained"
              color="primary"
              startIcon={<ArrowBackIcon />}
            >
              {t('warehouse.back')}
            </Button>
          </Grid>
        </Grid>
        <Grid size={{ xs: 12 }} sx={{ pt: 5 }}>
          <Box sx={{ height: 640, flexGrow: 1 }}>
            <StyledDataGrid
              rows={locations}
              columns={columns}
              hideFooterSelectedRowCount
              hideFooterPagination
              disableColumnMenu
            />
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};
