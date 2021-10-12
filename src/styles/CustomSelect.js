import { Select, Typography } from '@mui/material';
import { Box, styled } from '@mui/system';

const StyledSelect = styled(Select)(({theme}) => ({
  backgroundColor: theme.palette.white,
  borderRadius: theme.shape.borderRadius,
  height: '40px',
  width: '250px'
}));

export const CustomSelect = (props) => {
	return (
		<Box>
			<Typography sx={{color: 'white'}}>{props.title}</Typography>
			<StyledSelect value={props.value} onChange={props.onChange}>{props.children}</StyledSelect>
		</Box>
	)
}