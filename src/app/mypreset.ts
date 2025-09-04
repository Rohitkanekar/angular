import { definePreset } from '@primeng/themes';
import Aura from '@primeng/themes/aura';

const MyPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '#e5f0f8',   // Lightest
      100: '#c8dff0',
      200: '#a8cce6',
      300: '#84b7da',
      400: '#5ca1ce',
      500: '#12689f',   // Base (your color)
      600: '#0f5a89',
      700: '#0c4b73',
      800: '#093d5e',
      900: '#072f49',
      950: '#041d2e'    // Darkest
    }
  }
});

export default MyPreset;
