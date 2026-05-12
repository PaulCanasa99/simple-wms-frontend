import { useState, type ChangeEvent } from 'react';
import { Box, Button, Container, Typography, styled } from '@mui/material';
import Grid from '@mui/material/Grid2';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { GridActionsCellItem, type GridColDef } from '@mui/x-data-grid';
import { parse } from 'papaparse';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useImportInboundOrders, useInboundOrders } from '../hooks/useInboundOrders';
import { StyledDataGrid } from '../components/StyledDataGrid';
import { Snackbar, type AlertState, emptyAlert } from '../components/Snackbar';
import { formatDate } from '../utils/format';
import { useLang } from '../hooks/useLang';
import type { InboundOrder } from '../types/api';

const HiddenInput = styled('input')({ display: 'none' });

export const InboundPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const lang = useLang();
  const { data: orders = [] } = useInboundOrders();
  const importOrders = useImportInboundOrders();
  const [alert, setAlert] = useState<AlertState>(emptyAlert);

  const onUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    const parsed = parse(text, { header: true });
    await importOrders.mutateAsync(parsed.data as unknown[]);
    setAlert({
      open: true,
      severity: 'success',
      message: t('inbound.uploadSuccess'),
    });
  };

  const columns: GridColDef<InboundOrder>[] = [
    {
      field: 'inboundOrderId',
      headerName: t('inbound.orderId'),
      flex: 1,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'huQuantity',
      headerName: t('inbound.huQuantity'),
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
      flex: 1,
      type: 'actions',
      getActions: ({ row }) => [
        <GridActionsCellItem
          key="detail"
          icon={<ArrowForwardIcon />}
          onClick={() => navigate(`/ordenes/ingreso/${row.id}`)}
          label={t('common.details')}
        />,
      ],
    },
  ];

  return (
    <Container sx={{ paddingTop: '40px' }} maxWidth="xl">
      <Grid container alignItems="center" spacing={0}>
        <Grid size={{ xs: 6 }}>
          <Typography variant="h4">{t('inbound.title')}</Typography>
        </Grid>
        <Grid size={{ xs: 6 }}>
          <Grid container justifyContent="flex-end">
            <label htmlFor="inbound-upload">
              <HiddenInput
                accept="text/csv,.csv"
                id="inbound-upload"
                type="file"
                onChange={onUpload}
              />
              <Button
                component="span"
                variant="contained"
                color="primary"
                startIcon={<FileUploadIcon />}
              >
                {t('inbound.upload')}
              </Button>
            </label>
          </Grid>
        </Grid>
        <Grid size={{ xs: 12 }} sx={{ pt: 5 }}>
          <Box sx={{ height: 640, flexGrow: 1 }}>
            <StyledDataGrid
              rows={orders}
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
