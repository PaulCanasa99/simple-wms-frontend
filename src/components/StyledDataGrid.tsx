import {
  DataGrid,
  type DataGridProps,
  type GridValidRowModel,
} from '@mui/x-data-grid';
import { type Theme, type SxProps } from '@mui/material/styles';

const sxStyles: SxProps<Theme> = {
  border: 0,
  '& .inboundOrder .MuiDataGrid-cell': {
    backgroundColor: '#97FCA1 !important',
  },
  '& .outboundOrder .MuiDataGrid-cell': {
    backgroundColor: '#FE988C !important',
  },
  '& .MuiDataGrid-row:nth-of-type(odd) .MuiDataGrid-cell': {
    backgroundColor: 'white',
  },
  '& .MuiDataGrid-row:nth-of-type(even) .MuiDataGrid-cell': {
    backgroundColor: 'secondary.light',
  },
  '& .MuiDataGrid-columnHeaders': {
    backgroundColor: 'primary.main',
    color: 'white',
    borderRadius: '5px 5px 0 0',
  },
  '& .MuiDataGrid-columnHeader': {
    color: 'white',
  },
  '& .MuiDataGrid-columnHeaderTitle': {
    fontWeight: 600,
  },
  '& .MuiDataGrid-iconSeparator': {
    display: 'none',
  },
  '& .MuiDataGrid-cell': {
    border: 0,
    '&:focus, &:focus-within': {
      outline: 'none',
    },
  },
  '& .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-columnHeader:focus-within': {
    outline: 'none',
  },
};

export const StyledDataGrid = <R extends GridValidRowModel>(
  props: DataGridProps<R>,
) => (
  <DataGrid<R>
    {...props}
    sx={[sxStyles, ...(Array.isArray(props.sx) ? props.sx : props.sx ? [props.sx] : [])]}
  />
);
