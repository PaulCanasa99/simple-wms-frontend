import { TextField, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Box } from '@mui/system';

const StyledTextField = styled(TextField)(({theme}) => ({
	backgroundColor: theme.palette.white,
	borderRadius: theme.shape.borderRadius,
	height: '40px'
}));

export const CustomTextField = (props) => {
	return (
		<Box>
			<Typography sx={{color: 'white'}}>{props.title}</Typography>
			<StyledTextField
				InputProps={{
					sx: {height: '40px'}
				}}
				{...props}
			/>
		</Box>
	)
}