// pages/_app.js

import '../src/app/globals.css';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css'; // Import Font Awesome CSS
config.autoAddCss = false; // Prevent Font Awesome from adding its own CSS

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;
