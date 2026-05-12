import {
  Dialog,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useHandlingUnits } from '../hooks/useHandlingUnits';
import type { HandlingUnitStatus, Product } from '../types/api';

const STATUSES: HandlingUnitStatus[] = [
  'En inspección',
  'Registrado',
  'Por ingresar',
  'Libre disponibilidad',
  'Reservado',
  'Por despachar',
  'Despachado',
];

interface Props {
  open: boolean;
  onClose: () => void;
  product: Product | null;
}

export const ProductSummaryDialog = ({ open, onClose, product }: Props) => {
  const { t } = useTranslation();
  const { data: handlingUnits = [] } = useHandlingUnits();

  if (!product) return null;
  const productHUs = handlingUnits.filter((u) => u.product.id === product.id);

  return (
    <Dialog onClose={onClose} open={open}>
      <DialogTitle>{t('summary.title', { code: product.code })}</DialogTitle>
      <List sx={{ pt: 0, pl: 2, width: 350 }}>
        {STATUSES.map((status) => (
          <ListItem key={status}>
            <ListItemText primary={status} sx={{ width: '80%' }} />
            <ListItemText
              primary={productHUs.filter((u) => u.status === status).length}
              sx={{ width: '20%' }}
            />
          </ListItem>
        ))}
      </List>
    </Dialog>
  );
};
