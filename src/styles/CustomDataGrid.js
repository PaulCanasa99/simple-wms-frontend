import { DataGrid } from '@mui/x-data-grid';
import { styled } from '@mui/system';

export const CustomDataGrid = styled(DataGrid)(({theme}) => ({
	borderWidth: `0px !important`,
	'& .MuiDataGrid-row:nth-child(odd)': {
		'& .MuiDataGrid-cell': {
			backgroundColor: theme.palette.white,
		},
	},
	'& .MuiDataGrid-row:nth-child(even)': {
		'& .MuiDataGrid-cell': {
			backgroundColor: theme.palette.secondary.light,
		},
	},
	'& .MuiDataGrid-row:last-child': {
      '& .MuiDataGrid-cell:first-child': {
        borderRadius: '0px 0px 0px 5px',
      },
      '& .MuiDataGrid-cell:last-child': {
        borderRadius: '0px 0px 5px 0px',
      },
	},
	'& .MuiDataGrid-columnsContainer': {
		backgroundColor: theme.palette.primary.main,
		color: theme.palette.white,
		borderRadius: '5px 5px 0px 0px'
	},
	'& .MuiDataGrid-iconSeparator': {
		display: 'none',
	},
	'& .MuiDataGrid-columnsContainer, .MuiDataGrid-cell': {
		borderWidth: '0px !important',
	},
	'& .MuiDataGrid-columnHeader': {
    '& .Mui-checked': {
      color: 'white'
    }
	},
}));