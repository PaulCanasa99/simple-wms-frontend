import { useMemo, useState } from 'react';
import { Box, Button, Container, MenuItem, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import RestoreIcon from '@mui/icons-material/Restore';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { GridActionsCellItem, type GridColDef } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useOutboundOrders } from '../hooks/useOutboundOrders';
import { StyledDataGrid } from '../components/StyledDataGrid';
import { TextFilter, SelectFilter } from '../components/FilterField';
import { formatDate } from '../utils/format';
import { useLang } from '../hooks/useLang';
import type { OperationOrderStatus, OutboundOrder } from '../types/api';

type StatusFilter = 'Todos' | OperationOrderStatus;

export const OutboundPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const lang = useLang();
  const { data: orders = [] } = useOutboundOrders({ refetchInterval: 5000 });

  const [outboundSearch, setOutboundSearch] = useState('');
  const [orderSearch, setOrderSearch] = useState('');
  const [statusSelected, setStatusSelected] = useState<StatusFilter>('Todos');

  const filtered = useMemo(
    () =>
      orders
        .filter((o) => statusSelected === 'Todos' || o.status === statusSelected)
        .filter((o) => o.outboundOrderId.toString().includes(outboundSearch))
        .filter((o) => o.order.orderId.toString().includes(orderSearch)),
    [orders, statusSelected, outboundSearch, orderSearch],
  );

  const clear = () => {
    setOutboundSearch('');
    setOrderSearch('');
    setStatusSelected('Todos');
  };

  const columns: GridColDef<OutboundOrder>[] = [
    {
      field: 'outboundOrderId',
      headerName: t('outbound.orderId'),
      flex: 1,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'order',
      headerName: t('outbound.linkedOrder'),
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      valueGetter: (_v, row) => row.order.orderId,
    },
    {
      field: 'huQuantity',
      headerName: t('outbound.huQuantity'),
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      renderCell: ({ row }) => row.handlingUnits.length,
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
      flex: 0.8,
      type: 'actions',
      getActions: ({ row }) => [
        <GridActionsCellItem
          key="detail"
          icon={<ArrowForwardIcon />}
          onClick={() => navigate(`/ordenes/despacho/${row.id}`)}
          label={t('common.details')}
        />,
      ],
    },
  ];

  return (
    <Container sx={{ paddingTop: '40px' }} maxWidth="xl">
      <Grid container alignItems="center" spacing={0}>
        <Grid size={{ xs: 12 }}>
          <Typography variant="h4">{t('outbound.title')}</Typography>
        </Grid>
        <Grid size={{ xs: 8 }} sx={{ pt: 5, display: 'flex' }}>
          <Grid container justifyContent="space-between">
            <TextFilter
              title={t('outbound.orderId')}
              value={outboundSearch}
              onChange={setOutboundSearch}
            />
            <TextFilter
              title={t('outbound.linkedOrder')}
              value={orderSearch}
              onChange={setOrderSearch}
            />
            <SelectFilter<StatusFilter>
              title={t('common.status')}
              value={statusSelected}
              onChange={setStatusSelected}
            >
              <MenuItem value="Todos">{t('common.all')}</MenuItem>
              <MenuItem value="Pendiente">Pendiente</MenuItem>
              <MenuItem value="En proceso">En proceso</MenuItem>
              <MenuItem value="Finalizado">Finalizado</MenuItem>
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
