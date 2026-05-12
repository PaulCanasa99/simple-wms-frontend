import { useMemo, useState, type ChangeEvent } from 'react';
import { Box, Button, Container, MenuItem, Typography, styled } from '@mui/material';
import Grid from '@mui/material/Grid2';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import RestoreIcon from '@mui/icons-material/Restore';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { GridActionsCellItem, type GridColDef } from '@mui/x-data-grid';
import { parse } from 'papaparse';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useImportOrders, useOrders } from '../hooks/useOrders';
import { StyledDataGrid } from '../components/StyledDataGrid';
import { TextFilter, SelectFilter } from '../components/FilterField';
import { Snackbar, type AlertState, emptyAlert } from '../components/Snackbar';
import { formatDate } from '../utils/format';
import { useLang } from '../hooks/useLang';
import type { Order, OrderStatus } from '../types/api';

const HiddenInput = styled('input')({ display: 'none' });
type StatusFilter = 'Todos' | OrderStatus;

export const SalesOrdersPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const lang = useLang();
  const { data: orders = [] } = useOrders();
  const importOrders = useImportOrders();

  const [orderSearch, setOrderSearch] = useState('');
  const [customerSearch, setCustomerSearch] = useState('');
  const [statusSelected, setStatusSelected] = useState<StatusFilter>('Todos');
  const [alert, setAlert] = useState<AlertState>(emptyAlert);

  const filtered = useMemo(
    () =>
      orders
        .filter((o) => statusSelected === 'Todos' || o.status === statusSelected)
        .filter((o) => o.id.includes(orderSearch))
        .filter((o) =>
          o.customer.name.toLowerCase().includes(customerSearch.toLowerCase()),
        ),
    [orders, statusSelected, orderSearch, customerSearch],
  );

  const clear = () => {
    setOrderSearch('');
    setCustomerSearch('');
    setStatusSelected('Todos');
  };

  const onUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    const parsed = parse(text, { header: true });
    await importOrders.mutateAsync(parsed.data as unknown[]);
    setAlert({
      open: true,
      severity: 'success',
      message: t('salesOrders.uploadSuccess'),
    });
  };

  const columns: GridColDef<Order>[] = [
    {
      field: 'orderId',
      headerName: t('salesOrders.orderId'),
      flex: 1.5,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'products',
      headerName: t('salesOrders.huQuantity'),
      flex: 1.5,
      headerAlign: 'center',
      align: 'center',
      valueGetter: (_v, row) =>
        row.products.reduce((sum, p) => sum + p.quantity, 0),
    },
    {
      field: 'customer',
      headerName: t('salesOrders.customer'),
      flex: 1.5,
      headerAlign: 'center',
      align: 'center',
      valueGetter: (_v, row) => row.customer.name,
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
    {
      field: 'actions',
      headerName: t('common.details'),
      flex: 1,
      type: 'actions',
      getActions: ({ row }) => [
        <GridActionsCellItem
          key="detail"
          icon={<ArrowForwardIcon />}
          onClick={() => navigate(`/pedidos/${row.id}`)}
          label={t('common.details')}
        />,
      ],
    },
  ];

  return (
    <Container sx={{ paddingTop: '40px' }} maxWidth="xl">
      <Grid container alignItems="center" spacing={0}>
        <Grid size={{ xs: 6 }}>
          <Typography variant="h4">{t('salesOrders.title')}</Typography>
        </Grid>
        <Grid size={{ xs: 6 }}>
          <Grid container justifyContent="flex-end">
            <label htmlFor="orders-upload">
              <HiddenInput
                accept="text/csv,.csv"
                id="orders-upload"
                type="file"
                onChange={onUpload}
              />
              <Button
                component="span"
                variant="contained"
                color="primary"
                startIcon={<FileUploadIcon />}
              >
                {t('salesOrders.upload')}
              </Button>
            </label>
          </Grid>
        </Grid>
        <Grid size={{ xs: 8 }} sx={{ pt: 5, display: 'flex' }}>
          <Grid container justifyContent="space-between">
            <TextFilter
              title={t('salesOrders.orderId')}
              value={orderSearch}
              onChange={setOrderSearch}
            />
            <TextFilter
              title={t('salesOrders.customer')}
              value={customerSearch}
              onChange={setCustomerSearch}
            />
            <SelectFilter<StatusFilter>
              title={t('common.status')}
              value={statusSelected}
              onChange={setStatusSelected}
            >
              <MenuItem value="Todos">{t('common.all')}</MenuItem>
              <MenuItem value="Pendiente">Pendiente</MenuItem>
              <MenuItem value="En proceso">En proceso</MenuItem>
              <MenuItem value="Despachado">Despachado</MenuItem>
            </SelectFilter>
          </Grid>
        </Grid>
        <Grid size={{ xs: 4 }} sx={{ pt: 5, display: 'flex' }}>
          <Grid container justifyContent="flex-end">
            <Button
              onClick={clear}
              sx={{ mt: 3 }}
              variant="contained"
              color="primary"
              startIcon={<RestoreIcon />}
            >
              {t('common.clearFilters')}
            </Button>
          </Grid>
        </Grid>
        <Grid size={{ xs: 12 }} sx={{ pt: 5 }}>
          <Box sx={{ height: 640, flexGrow: 1 }}>
            <StyledDataGrid
              rows={filtered}
              columns={columns}
              hideFooterSelectedRowCount
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
