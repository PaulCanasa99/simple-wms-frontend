import { createTheme } from '@mui/material/styles';
import { esES } from '@mui/x-data-grid';
import { esES as coreEsES} from '@mui/material/locale';

const theme = createTheme (
  {
    typography: {
      fontFamily: "'Montserrat', sans-serif",
      h4: {
        fontSize: 24,
        color: "#FFFFFF",
        fontWeight: '600'
      },
      h5: {
        fontSize: 18,
        color: "#FFFFFF",
        fontWeight: '500'
      },
      body1: {
        fontSize: 18,
        color: "#353535",
      },
      body2: {
        fontSize: 18,
      },
      button: {
        fontWeight: '400',
        textTransform: "none",
        fontSize: 16,
      },
    },
    palette: {
      primary: {
        main: "#214D5B",
      },
      secondary: {
        main: "#284B63",
        light: "#C3E8F8"
      },
      white: "#ffffff",
      black: "#000000",
    },
    shape: {
      borderRadius: 5,
    },
  },
  esES,
  coreEsES
);

export default theme;
