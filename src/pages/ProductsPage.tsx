import { useMemo, useState } from 'react';
import { Box, Button, Container, MenuItem, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import RestoreIcon from '@mui/icons-material/Restore';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import SummarizeIcon from '@mui/icons-material/Summarize';
import { GridActionsCellItem, type GridColDef } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useProducts } from '../hooks/useProducts';
import { StyledDataGrid } from '../components/StyledDataGrid';
import { TextFilter, SelectFilter } from '../components/FilterField';
import { ProductSummaryDialog } from '../components/ProductSummaryDialog';
import type { Clasification, Product, Rotation } from '../types/api';

type RotationFilter = 'Todos' | Rotation;
type ClasificationFilter = 'Todos' | Clasification;

export const ProductsPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: products = [] } = useProducts();

  const [codeSearch, setCodeSearch] = useState('');
  const [nameSearch, setNameSearch] = useState('');
  const [rotation, setRotation] = useState<RotationFilter>('Todos');
  const [clasification, setClasification] = useState<ClasificationFilter>('Todos');
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Product | null>(null);

  const filtered = useMemo(
    () =>
      products
        .filter((p) => rotation === 'Todos' || p.rotation === rotation)
        .filter((p) => clasification === 'Todos' || p.clasification === clasification)
        .filter((p) => p.code.includes(codeSearch))
        .filter((p) => p.name.toLowerCase().includes(nameSearch.toLowerCase())),
    [products, rotation, clasification, codeSearch, nameSearch],
  );

  const clear = () => {
    setCodeSearch('');
    setNameSearch('');
    setRotation('Todos');
    setClasification('Todos');
  };

  const openSummary = (product: Product) => {
    setSelected(product);
    setOpen(true);
  };

  const columns: GridColDef<Product>[] = [
    {
      field: 'code',
      headerName: t('common.code'),
      flex: 1,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'name',
      headerName: t('common.name'),
      flex: 1.5,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'productsPerHU',
      headerName: t('products.perHU'),
      flex: 1,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'rotation',
      headerName: t('common.rotation'),
      flex: 1,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'clasification',
      headerName: t('common.clasification'),
      flex: 1,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'actions',
      headerName: t('products.moreInfo'),
      flex: 1,
      type: 'actions',
      getActions: ({ row }) => [
        <GridActionsCellItem
          key="ledger"
          icon={<SwapVertIcon />}
          onClick={() => navigate(`/productos/${row.id}`)}
          label={t('products.viewLedger')}
        />,
        <GridActionsCellItem
          key="summary"
          icon={<SummarizeIcon />}
          onClick={() => openSummary(row)}
          label={t('products.viewSummary')}
        />,
      ],
    },
  ];

  return (
    <Container sx={{ paddingTop: '40px' }} maxWidth="xl">
      <Grid container alignItems="center" spacing={0}>
        <Grid size={{ xs: 12 }}>
          <Typography variant="h4">{t('products.title')}</Typography>
        </Grid>
        <Grid size={{ xs: 10 }} sx={{ pt: 5, display: 'flex' }}>
          <Grid container justifyContent="space-between">
            <TextFilter
              title={t('common.code')}
              value={codeSearch}
              onChange={setCodeSearch}
            />
            <TextFilter
              title={t('common.name')}
              value={nameSearch}
              onChange={setNameSearch}
            />
            <SelectFilter<RotationFilter>
              title={t('common.rotation')}
              value={rotation}
              onChange={setRotation}
            >
              <MenuItem value="Todos">{t('common.all')}</MenuItem>
              <MenuItem value="A">A</MenuItem>
              <MenuItem value="B">B</MenuItem>
              <MenuItem value="C">C</MenuItem>
            </SelectFilter>
            <SelectFilter<ClasificationFilter>
              title={t('common.clasification')}
              value={clasification}
              onChange={setClasification}
            >
              <MenuItem value="Todos">{t('common.all')}</MenuItem>
              <MenuItem value="Orgánico">Orgánico</MenuItem>
              <MenuItem value="Inorgánico">Inorgánico</MenuItem>
              <MenuItem value="Congelado">Congelado</MenuItem>
            </SelectFilter>
          </Grid>
        </Grid>
        <Grid size={{ xs: 2 }} sx={{ pt: 5, display: 'flex' }}>
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
      <ProductSummaryDialog
        open={open}
        product={selected}
        onClose={() => setOpen(false)}
      />
    </Container>
  );
};
