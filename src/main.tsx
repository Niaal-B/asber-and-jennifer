import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import '@fontsource/pinyon-script/400.css';
import '@fontsource/bodoni-moda/400.css';
import '@fontsource/bodoni-moda/500.css';
import '@fontsource/cormorant-garamond/400.css';
import '@fontsource/cormorant-garamond/400-italic.css';
import '@fontsource/lato/300.css';
import '@fontsource/lato/400.css';
import '@fontsource/amiri/400.css';
import '@fontsource/amiri/700.css';

import './styles/tokens.css';
import './styles/global.css';
import App from './App';
import { MusicProvider } from './music/MusicProvider';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MusicProvider>
      <App />
    </MusicProvider>
  </StrictMode>,
);
