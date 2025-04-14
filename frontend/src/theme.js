import { createTheme } from '@mui/material/styles';

// Création d'un thème Material UI personnalisé (couleurs primaires/secondaires)
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Bleu par défaut de Material UI
    },
    secondary: {
      main: '#19857b', // Teal (exemple de couleur secondaire)
    },
  },
});

export default theme;
