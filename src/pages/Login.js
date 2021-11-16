import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Button, IconButton, InputAdornment, TextField, Typography } from "@mui/material";
import { UserContext } from "../context/Context";
import { Box } from "@mui/system";
import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "@reach/router";
import CustomSnackbar from '../components/CustomSnackbar';
import axios from "axios";

const Login = () => {
  const [alert, setAlert] = useState({isOpen: false, message: '', type: ''})
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { setUserToken } = useContext(UserContext);
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = () => setShowPassword(!showPassword);
  const navigate = useNavigate();

  useEffect(() => {
    setUserToken(null);
    // eslint-disable-next-line
  }, []);

  const handleLogin = () => {
    axios.post(`${process.env.REACT_APP_API_URL}/warehouseWorkers/authenticate`, {data: {email: username, password: password}})
    .then((r) => {
      console.log(r);
      setUserToken(r.data);
      navigate('almacen');
    })
    .catch(() => setAlert({isOpen: true, message: 'Credenciales incorrectas', type: 'error'}))
  };

  return (
    <Box p='100px 0' m='auto' width={'30%'} >
      <Box bgcolor='primary.main' borderRadius='10px 10px 0 0' p={2}>
        <Typography variant="h5" align="center">
          Inicia sesión en SimpleWMS
        </Typography>
      </Box>
      <Box bgcolor='white' p='15px 45px' borderRadius='0 0 10px 10px'>
        <Typography style={{ fontWeight: "bold" }}>
          Usuario o correo electrónico:
        </Typography>
        <TextField
          value={username}
          fullWidth
          variant="outlined"
          onChange={(event) => setUsername(event.target.value)}
        />
        <Typography fontWeight="bold" m='15px 0' width='100%' type="password">
          Contraseña:
        </Typography>
        <TextField
          value={password}
          fullWidth
          type={showPassword ? "text" : "password"}
          variant="outlined"
          onChange={(event) => setPassword(event.target.value)}
          InputProps={{
            endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
            )
          }}
        />
        <Button
          fullWidth
          variant="contained"
          color="primary"
          style={{ margin: "20px 0" }}
          onClick={handleLogin}
        >
          Ingresar
        </Button>
      </Box>
      <CustomSnackbar alert={alert} setAlert={setAlert}/>
    </Box>
  );
};

export default Login;