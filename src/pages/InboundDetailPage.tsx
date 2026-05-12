import { useMemo } from 'react';
import { Box, Button, Container, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { GridColDef } from '@mui/x-data-grid';
import { useInboundOrder } from '../hooks/useInboundOrders';
import { StyledDataGrid } from '../components/StyledDataGrid';
import { DetailRow } from '../components/DetailRow';
import { formatDate } from '../utils/format';
import { useLang } from '../hooks/useLang';
import type { HandlingUnit } from '../types/api';

interface HuRow extends HandlingUnit {
  posNumber: number;
}

export const InboundDetailPage = () => {
  const { t } = useTranslation();
  const lang = useLang();
  const { idOrden } = useParams();
  const navigate = useNavigate();
  const { data: order } = useInboundOrder(idOrden);

  const rows: HuRow[] = useMemo(
    () => order?.handlingUnits.map((h, idx) => ({ ...h, posNumber: idx + 1 })) ?? [],
    [order],
  );

  const columns: GridColDef<HuRow>[] = [
    { field: 'posNumber', headerName: t('common.position'), flex: 1, headerAlign: 'center', align: 'center' },
    { field: 'handlingUnitId', headerName: t('warehouse.huNumber'), flex: 1, headerAlign: 'center', align: 'center' },
    {
      field: 'productCode',
      headerName: t('common.code'),
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      renderCell: ({ row }) => row.product.code,
    },
    {
      field: 'productName',
      headerName: t('common.name'),
      flex: 2,
      headerAlign: 'center',
      align: 'center',
      renderCell: ({ row }) => row.product.name,
    },
    { field: 'status', headerName: t('common.status'), flex: 1, headerAlign: 'center', align: 'center' },
  ];

  if (!order) return null;

  return (
    <Container sx={{ paddingTop: '40px' }} maxWidth="xl">
      <Grid container alignItems="center" spacing={0}>
        <Grid size={{ xs: 6 }}>
          <Typography variant="h4">{t('inbound.detailTitle')}</Typography>
        </Grid>
        <Grid size={{ xs: 6 }}>
          <Grid container justifyContent="flex-end">
            <Button
              onClick={() => navigate(-1)}
              variant="contained"
              color="primary"
              startIcon={<ArrowBackIcon />}
            >
              {t('inbound.back')}
            </Button>
          </Grid>
        </Grid>
        <Grid size={{ xs: 12 }} mt={3}>
          <Grid container p={3} sx={{ boxShadow: 3, borderRadius: 1 }} bgcolor="white">
            <Grid size={{ xs: 6 }} px="100px">
              <DetailRow label={t('inbound.orderId') + ':'} value={order.inboundOrderId} />
              <DetailRow
                label={t('common.registeredOn') + ':'}
                value={formatDate(order.date, lang)}
              />
              <DetailRow label={t('common.status') + ':'} value={order.status} />
            </Grid>
          </Grid>
        </Grid>
        <Grid size={{ xs: 12 }} sx={{ pt: 5 }}>
          <Box sx={{ height: 640, flexGrow: 1 }}>
            <StyledDataGrid
              rows={rows}
              columns={columns}
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
