import { useMemo, useState } from 'react';
import { Box, Button, Container, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { LoadingButton } from '../components/LoadingButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import { useOrder, useOutboundSelection } from '../hooks/useOrders';
import { StyledDataGrid } from '../components/StyledDataGrid';
import { DetailRow } from '../components/DetailRow';
import { Snackbar, type AlertState, emptyAlert } from '../components/Snackbar';
import { formatDate } from '../utils/format';
import { useLang } from '../hooks/useLang';
import type { OrderProductLine } from '../types/api';

interface LineRow extends OrderProductLine {
  id: string;
  posNumber: number;
}

export const SalesOrderDetailPage = () => {
  const { t } = useTranslation();
  const lang = useLang();
  const { idPedido } = useParams();
  const navigate = useNavigate();

  const { data: order } = useOrder(idPedido);
  const select = useOutboundSelection(idPedido);
  const [selection, setSelection] = useState<GridRowSelectionModel>([]);
  const [alert, setAlert] = useState<AlertState>(emptyAlert);

  const rows: LineRow[] = useMemo(
    () =>
      order?.products.map((p, idx) => ({
        ...p,
        id: p._id,
        posNumber: idx + 1,
      })) ?? [],
    [order],
  );

  const columns: GridColDef<LineRow>[] = [
    {
      field: 'posNumber',
      headerName: t('common.position'),
      flex: 0.5,
      headerAlign: 'center',
      align: 'center',
    },
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
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      renderCell: ({ row }) => row.product.name,
    },
    {
      field: 'quantity',
      headerName: t('salesOrders.huQuantity'),
      flex: 1,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'stock',
      headerName: t('salesOrders.stock'),
      flex: 1,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'status',
      headerName: t('common.status'),
      flex: 1,
      headerAlign: 'center',
      align: 'center',
    },
  ];

  const onDispatch = async () => {
    await select.mutateAsync(selection.map(String));
    setAlert({
      open: true,
      severity: 'success',
      message: t('salesOrders.selectionSuccess'),
    });
    setSelection([]);
  };

  if (!order) return null;

  return (
    <Container sx={{ paddingTop: '40px' }} maxWidth="xl">
      <Grid container alignItems="center" spacing={0}>
        <Grid size={{ xs: 6 }}>
          <Typography variant="h4">{t('salesOrders.detailTitle')}</Typography>
        </Grid>
        <Grid size={{ xs: 6 }}>
          <Grid container justifyContent="flex-end">
            <LoadingButton
              loading={select.isPending}
              onClick={onDispatch}
              sx={{ mr: 3 }}
              variant="contained"
              color="primary"
              startIcon={<FactCheckIcon />}
              disabled={selection.length === 0}
            >
              {t('salesOrders.dispatch')}
            </LoadingButton>
            <Button
              onClick={() => navigate(-1)}
              variant="contained"
              color="primary"
              startIcon={<ArrowBackIcon />}
            >
              {t('salesOrders.back')}
            </Button>
          </Grid>
        </Grid>
        <Grid size={{ xs: 12 }} mt={3}>
          <Grid container p={3} sx={{ boxShadow: 3, borderRadius: 1 }} bgcolor="white">
            <Grid size={{ xs: 6 }} px="100px">
              <DetailRow label={t('salesOrders.orderId') + ':'} value={order.orderId} />
              <DetailRow label={t('salesOrders.customer') + ':'} value={order.customer.name} />
              <DetailRow
                label={t('common.registeredOn') + ':'}
                value={formatDate(order.date, lang)}
              />
              <DetailRow label={t('common.status') + ':'} value={order.status} />
            </Grid>
            <Grid size={{ xs: 6 }} px="100px">
              <DetailRow
                label={t('salesOrders.contactName') + ':'}
                value={order.customer.contactName}
              />
              <DetailRow
                label={t('salesOrders.contactPhone') + ':'}
                value={order.customer.contactPhoneNumber}
              />
              <DetailRow label={t('salesOrders.address') + ':'} value={order.customer.address} />
            </Grid>
          </Grid>
        </Grid>
        <Grid size={{ xs: 12 }} sx={{ pt: 5 }}>
          <Box sx={{ height: 640, flexGrow: 1 }}>
            <StyledDataGrid
              rows={rows}
              columns={columns}
              checkboxSelection
              isRowSelectable={(p) =>
                p.row.quantity <= p.row.stock && p.row.status === 'Pendiente'
              }
              rowSelectionModel={selection}
              onRowSelectionModelChange={setSelection}
              disableColumnMenu
              initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
              pageSizeOptions={[10]}
            />
          </Box>
        </Grid>
      </Grid>
      <Snackbar alert={alert} onClose={() => setAlert(emptyAlert)} />
    </Container>
  );
};
