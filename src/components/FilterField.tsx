import type { ChangeEvent, ReactNode } from 'react';
import { Box, Select, TextField, Typography, styled } from '@mui/material';
import type { SelectProps } from '@mui/material/Select';

const StyledTextField = styled(TextField)(({ theme }) => ({
  backgroundColor: theme.palette.white,
  borderRadius: theme.shape.borderRadius,
  '& .MuiInputBase-root': {
    height: 40,
  },
}));

interface TextFilterProps {
  title: string;
  value: string;
  onChange: (value: string) => void;
}

export const TextFilter = ({ title, value, onChange }: TextFilterProps) => (
  <Box>
    <Typography sx={{ color: 'white' }}>{title}</Typography>
    <StyledTextField
      size="small"
      value={value}
      onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
    />
  </Box>
);

interface SelectFilterProps<T extends string> {
  title: string;
  value: T;
  onChange: (value: T) => void;
  children: ReactNode;
}

export const SelectFilter = <T extends string>({
  title,
  value,
  onChange,
  children,
  ...rest
}: SelectFilterProps<T> &
  Omit<SelectProps<T>, 'value' | 'onChange' | 'children'>) => (
  <Box>
    <Typography sx={{ color: 'white' }}>{title}</Typography>
    <Select<T>
      value={value}
      onChange={(e) => onChange(e.target.value as T)}
      sx={(theme) => ({
        backgroundColor: theme.palette.white,
        borderRadius: theme.shape.borderRadius,
        height: 40,
        width: 250,
      })}
      {...rest}
    >
      {children}
    </Select>
  </Box>
);
