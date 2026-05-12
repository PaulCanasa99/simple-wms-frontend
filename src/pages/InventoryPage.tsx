import { useMemo, useState } from 'react';
import { Box, Button, Container, MenuItem, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { LoadingButton } from '../components/LoadingButton';
import CallReceivedIcon from '@mui/icons-material/CallReceived';
import RestoreIcon from '@mui/icons-material/Restore';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import { useGraspAssign, useHandlingUnits } from '../hooks/useHandlingUnits';
import { StyledDataGrid } from '../components/StyledDataGrid';
import { TextFilter, SelectFilter } from '../components/FilterField';
import { Snackbar, type AlertState, emptyAlert } from '../components/Snackbar';
import { formatDate } from '../utils/format';
import { useLang } from '../hooks/useLang';
import type { HandlingUnit, HandlingUnitStatus } from '../types/api';

type StatusFilter = 'Todos' | HandlingUnitStatus;

const STATUS_OPTIONS: HandlingUnitStatus[] = [
  'En inspección',
  'Registrado',
  'Por ingresar',
  'Libre disponibilidad',
  'Reservado',
  'Por despachar',
  'Despachado',
  'Observado',
];

export const InventoryPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const lang = useLang();

  const { data: handlingUnits = [] } = useHandlingUnits({ refetchInterval: 5000 });
  const grasp = useGraspAssign();

  const [statusSelected, setStatusSelected] = useState<StatusFilter>('Todos');
  const [productSearch, setProductSearch] = useState('');
  const [umSearch, setUmSearch] = useState('');
  const [selection, setSelection] = useState<GridRowSelectionModel>([]);
  const [alert, setAlert] = useState<AlertState>(emptyAlert);

  const filtered = useMemo(() => {
    return handlingUnits
      .filter((u) => statusSelected === 'Todos' || u.status === statusSelected)
      .filter((u) => u.product.code.includes(productSearch))
      .filter((u) => u.handlingUnitId.toString().includes(umSearch));
  }, [handlingUnits, statusSelected, productSearch, umSearch]);

  const clear = () => {
    setProductSearch('');
    setUmSearch('');
    setStatusSelected('Todos');
  };

  const onAssign = async () => {
    if (selection.length === 0) {
      setAlert({
        open: true,
        severity: 'warning',
        message: t('inventory.selectAtLeastOne'),
      });
      return;
    }
    const ids = selection.map(String);
    const result = await grasp.mutateAsync(ids);
    setAlert({
      open: true,
      severity: 'success',
      message: t('inventory.assignedSuccess', { count: result.length }),
    });
    setSelection([]);
    clear();
  };

  const columns: GridColDef<HandlingUnit>[] = [
    {
      field: 'handlingUnitId',
      headerName: t('inventory.huNumber'),
      flex: 1,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'productCode',
      headerName: t('inventory.product'),
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      renderCell: ({ row }) => row.product.code,
    },
    {
      field: 'productClasification',
      headerName: t('common.clasification'),
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      renderCell: ({ row }) => row.product.clasification,
    },
    {
      field: 'location',
      headerName: t('inventory.location'),
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      renderCell: ({ row }) =>
        row.location ? (
          <Typography
            sx={{ cursor: 'pointer' }}
            fontWeight={600}
            onClick={() => navigate(`/almacen/${row.location!.code.substring(0, 2)}`)}
          >
            {row.location.code}
          </Typography>
        ) : (
          '-'
        ),
    },
    {
      field: 'entryDate',
      headerName: t('inventory.entryDate'),
      flex: 2,
      headerAlign: 'center',
      align: 'center',
      valueFormatter: (value: string) => formatDate(value, lang),
    },
    {
      field: 'expirationDate',
      headerName: t('inventory.expirationDate'),
      flex: 2,
      headerAlign: 'center',
      align: 'center',
      valueFormatter: (value: string) => formatDate(value, lang),
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
      <Grid container alignItems="center" spacing={0}>
        <Grid size={{ xs: 6 }}>
          <Typography variant="h4">{t('inventory.title')}</Typography>
        </Grid>
        <Grid size={{ xs: 6 }}>
          <Grid container justifyContent="flex-end">
            <LoadingButton
              loading={grasp.isPending}
              onClick={onAssign}
              variant="contained"
              color="primary"
              startIcon={<CallReceivedIcon />}
            >
              {t('inventory.assignLocations')}
            </LoadingButton>
          </Grid>
        </Grid>
        <Grid size={{ xs: 8 }} sx={{ pt: 5, display: 'flex' }}>
          <Grid container justifyContent="space-between">
            <TextFilter
              title={t('inventory.huNumber')}
              value={umSearch}
              onChange={setUmSearch}
            />
            <TextFilter
              title={t('inventory.product')}
              value={productSearch}
              onChange={setProductSearch}
            />
            <SelectFilter<StatusFilter>
              title={t('common.status')}
              value={statusSelected}
              onChange={setStatusSelected}
            >
              <MenuItem value="Todos">{t('common.all')}</MenuItem>
              {STATUS_OPTIONS.map((s) => (
                <MenuItem key={s} value={s}>
                  {s}
                </MenuItem>
              ))}
            </SelectFilter>
          </Grid>
        </Grid>
        <Grid size={{ xs: 4 }} sx={{ pt: 5, display: 'flex' }}>
          <Grid container justifyContent="flex-end">
            <Button
              sx={{ mt: 3 }}
              onClick={clear}
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
              checkboxSelection
              isRowSelectable={(params) => params.row.status === 'Registrado'}
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
