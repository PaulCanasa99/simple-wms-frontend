import { useState, type MouseEvent } from 'react';
import { Box, Menu, MenuItem, Typography } from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';
import { useTranslation } from 'react-i18next';

const LANGS: Array<{ code: 'es' | 'en'; label: string }> = [
  { code: 'es', label: 'Español' },
  { code: 'en', label: 'English' },
];

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const open = (e: MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget);
  const close = () => setAnchorEl(null);
  const choose = (lang: 'es' | 'en') => {
    i18n.changeLanguage(lang);
    close();
  };

  const current = i18n.language?.startsWith('en') ? 'EN' : 'ES';

  return (
    <>
      <Box
        onClick={open}
        sx={{
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
          color: 'white',
          mr: 2,
        }}
      >
        <LanguageIcon fontSize="small" />
        <Typography variant="body2" sx={{ color: 'white' }}>
          {current}
        </Typography>
      </Box>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={close}>
        {LANGS.map((lang) => (
          <MenuItem key={lang.code} onClick={() => choose(lang.code)}>
            {lang.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};
