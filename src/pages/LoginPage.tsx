import { useEffect, useState } from 'react';
import { Box, Button, IconButton, InputAdornment, TextField, Typography } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { authenticate } from '../api/auth';
import { useAuth } from '../auth/AuthContext';
import { Snackbar, type AlertState, emptyAlert } from '../components/Snackbar';
import { useDemoMode } from '../hooks/useDemoMode';

export const LoginPage = () => {
  const { t } = useTranslation();
  const { setSession, clearSession } = useAuth();
  const navigate = useNavigate();
  const demo = useDemoMode();

  const [email, setEmail] = useState(demo ? 'demo@simplewms.dev' : '');
  const [password, setPassword] = useState(demo ? 'demo' : '');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [alert, setAlert] = useState<AlertState>(emptyAlert);

  useEffect(() => {
    clearSession();
  }, [clearSession]);

  const handleLogin = async () => {
    setSubmitting(true);
    try {
      const res = await authenticate(email, password);
      setSession(res.token, res.user);
      navigate('/almacen');
    } catch {
      setAlert({ open: true, severity: 'error', message: t('login.error') });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box p="100px 0" m="auto" width="30%" minWidth={320}>
      <Box bgcolor="primary.main" borderRadius="10px 10px 0 0" p={2}>
        <Typography variant="h5" align="center">
          {t('login.title')}
        </Typography>
      </Box>
      <Box bgcolor="white" p="15px 45px" borderRadius="0 0 10px 10px">
        <Typography fontWeight="bold">{t('login.username')}:</Typography>
        <TextField
          value={email}
          fullWidth
          variant="outlined"
          onChange={(e) => setEmail(e.target.value)}
        />
        <Typography fontWeight="bold" sx={{ m: '15px 0' }}>
          {t('login.password')}:
        </Typography>
        <TextField
          value={password}
          fullWidth
          type={showPassword ? 'text' : 'password'}
          variant="outlined"
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleLogin();
          }}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword((v) => !v)}>
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />
        <Button
          fullWidth
          variant="contained"
          color="primary"
          disabled={submitting || !email || !password}
          sx={{ margin: '20px 0' }}
          onClick={handleLogin}
        >
          {t('login.submit')}
        </Button>
        {demo && (
          <Typography fontSize={13} color="text.secondary" align="center">
            {t('login.demoHint')}
          </Typography>
        )}
      </Box>
      <Snackbar alert={alert} onClose={() => setAlert(emptyAlert)} />
    </Box>
  );
};
