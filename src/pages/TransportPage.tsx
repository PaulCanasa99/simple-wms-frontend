import { Box, Container, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useTranslation } from 'react-i18next';
import type { GridColDef } from '@mui/x-data-grid';
import { useTransportOrders } from '../hooks/useTransportOrders';
import { StyledDataGrid } from '../components/StyledDataGrid';
import { formatDate } from '../utils/format';
import { useLang } from '../hooks/useLang';
import type { TransportOrder } from '../types/api';

export const TransportPage = () => {
  const { t } = useTranslation();
  const lang = useLang();
  const { data: orders = [] } = useTransportOrders({ refetchInterval: 5000 });

  const columns: GridColDef<TransportOrder>[] = [
    {
      field: 'transportOrderId',
      headerName: t('transport.orderId'),
      flex: 1,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'handlingUnit',
      headerName: t('transport.huNumber'),
      flex: 1.5,
      headerAlign: 'center',
      align: 'center',
      valueGetter: (_v, row) => row.handlingUnit.handlingUnitId,
    },
    {
      field: 'product',
      headerName: t('transport.product'),
      flex: 1.5,
      headerAlign: 'center',
      align: 'center',
      renderCell: ({ row }) => row.handlingUnit.product.name,
    },
    {
      field: 'type',
      headerName: t('common.type'),
      flex: 1.5,
      headerAlign: 'center',
      align: 'center',
      renderCell: ({ row }) =>
        t(`ledger.type.${row.inboundOrder ? 'Ingreso' : 'Despacho'}`),
    },
    {
      field: 'date',
      headerName: t('common.registeredOn'),
      flex: 1.5,
      headerAlign: 'center',
      align: 'center',
      valueFormatter: (value: string) => formatDate(value, lang),
    },
    {
      field: 'status',
      headerName: t('common.status'),
      flex: 1,
      headerAlign: 'center',
      align: 'center',
    },
  ];

  return (
    <Container sx={{ paddingTop: '40px' }} maxWidth="xl">
      <Grid container alignItems="center" spacing={0}>
        <Grid size={{ xs: 12 }}>
          <Typography variant="h4">{t('transport.title')}</Typography>
        </Grid>
        <Grid size={{ xs: 12 }} sx={{ pt: 5 }}>
          <Box sx={{ height: 640, flexGrow: 1 }}>
            <StyledDataGrid
              rows={orders}
              columns={columns}
              hideFooterSelectedRowCount
              disableColumnMenu
              initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
              pageSizeOptions={[10]}
            />
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};
