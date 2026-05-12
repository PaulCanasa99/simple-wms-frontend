import { useEffect, useMemo, useState } from 'react';
import { Box, Button, Container, TextField, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { GridColDef } from '@mui/x-data-grid';
import { useProduct } from '../hooks/useProducts';
import { useHandlingUnitsByProduct } from '../hooks/useHandlingUnits';
import { StyledDataGrid } from '../components/StyledDataGrid';
import { DetailRow } from '../components/DetailRow';
import { formatDate } from '../utils/format';
import { useLang } from '../hooks/useLang';
import type { HandlingUnit } from '../types/api';

interface LedgerRow {
  id: string;
  movementId: number;
  type: 'Ingreso' | 'Despacho';
  date: string;
  handlingUnits: HandlingUnit[];
}

const groupByMovement = (units: HandlingUnit[]): LedgerRow[] => {
  const inbound = new Map<string, LedgerRow>();
  const outbound = new Map<string, LedgerRow>();
  for (const u of units) {
    if (u.inboundOrder) {
      const key = u.inboundOrder.id;
      const existing = inbound.get(key);
      if (existing) existing.handlingUnits.push(u);
      else
        inbound.set(key, {
          id: `in-${key}`,
          movementId: u.inboundOrder.inboundOrderId,
          type: 'Ingreso',
          date: u.inboundOrder.date,
          handlingUnits: [u],
        });
    }
    if (u.outboundOrder) {
      const key = u.outboundOrder.id;
      const existing = outbound.get(key);
      if (existing) existing.handlingUnits.push(u);
      else
        outbound.set(key, {
          id: `out-${key}`,
          movementId: u.outboundOrder.outboundOrderId,
          type: 'Despacho',
          date: u.outboundOrder.date,
          handlingUnits: [u],
        });
    }
  }
  return [...inbound.values(), ...outbound.values()].sort(
    (a, b) => a.movementId - b.movementId,
  );
};

export const ProductLedgerPage = () => {
  const { t } = useTranslation();
  const lang = useLang();
  const { idProducto } = useParams();
  const navigate = useNavigate();

  const { data: product } = useProduct(idProducto);
  const { data: units = [] } = useHandlingUnitsByProduct(idProducto);

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  useEffect(() => {
    const start = new Date();
    start.setDate(start.getDate() - 7);
    setStartDate(start);
    setEndDate(new Date());
  }, []);

  const rows = useMemo(() => {
    const grouped = groupByMovement(units);
    if (!startDate || !endDate) return grouped;
    return grouped.filter((r) => {
      const d = new Date(r.date);
      return d >= startDate && d <= endDate;
    });
  }, [units, startDate, endDate]);

  const columns: GridColDef<LedgerRow>[] = [
    {
      field: 'movementId',
      headerName: t('inbound.orderId'),
      flex: 1,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'type',
      headerName: t('ledger.movement'),
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      renderCell: ({ row }) => t(`ledger.type.${row.type}`),
    },
    {
      field: 'date',
      headerName: t('common.date'),
      flex: 1.5,
      headerAlign: 'center',
      align: 'center',
      valueFormatter: (value: string) => formatDate(value, lang),
    },
    {
      field: 'huQuantity',
      headerName: t('ledger.huQuantity'),
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      renderCell: ({ row }) => row.handlingUnits.length,
    },
  ];

  if (!product) return null;

  return (
    <Container sx={{ paddingTop: '40px' }} maxWidth="xl">
      <Grid container alignItems="center" spacing={0}>
        <Grid size={{ xs: 6 }}>
          <Typography variant="h4">{t('ledger.title')}</Typography>
        </Grid>
        <Grid size={{ xs: 6 }}>
          <Grid container justifyContent="flex-end">
            <Button
              onClick={() => navigate(-1)}
              variant="contained"
              color="primary"
              startIcon={<ArrowBackIcon />}
            >
              {t('ledger.back')}
            </Button>
          </Grid>
        </Grid>
        <Grid size={{ xs: 12 }} mt={3}>
          <Grid container p={3} sx={{ boxShadow: 3, borderRadius: 1 }} bgcolor="white">
            <Grid size={{ xs: 6 }} px="100px">
              <DetailRow label={t('common.code') + ':'} value={product.code} />
              <DetailRow label={t('common.name') + ':'} value={product.name} />
              <DetailRow label={t('common.rotation') + ':'} value={product.rotation} />
              <DetailRow
                label={t('common.clasification') + ':'}
                value={product.clasification}
              />
            </Grid>
            <Grid size={{ xs: 6 }} px="100px">
              <DetailRow label={t('ledger.startDate') + ':'}>
                <DatePicker
                  value={startDate}
                  onChange={setStartDate}
                  slots={{ textField: TextField }}
                />
              </DetailRow>
              <DetailRow label={t('ledger.endDate') + ':'}>
                <DatePicker
                  value={endDate}
                  onChange={setEndDate}
                  slots={{ textField: TextField }}
                />
              </DetailRow>
            </Grid>
          </Grid>
        </Grid>
        <Grid size={{ xs: 12 }} sx={{ pt: 5 }}>
          <Box sx={{ height: 640, flexGrow: 1 }}>
            <StyledDataGrid
              rows={rows}
              columns={columns}
              disableColumnMenu
              getRowClassName={({ row }) =>
                row.type === 'Ingreso' ? 'inboundOrder' : 'outboundOrder'
              }
              initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
              pageSizeOptions={[10]}
            />
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};
