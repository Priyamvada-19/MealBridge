import React from 'react'
import ReactDOM from 'react-dom/client'
import { GoogleOAuthProvider } from "@react-oauth/google";
import 'bootstrap/dist/css/bootstrap.min.css'

import App from './App'

ReactDOM.createRoot(
  document.getElementById('root')
).render(
  <React.StrictMode>
   <GoogleOAuthProvider
  clientId="509734946177-ftfhgkkln8hm17bg2lpvcvpnp3nbq2vf.apps.googleusercontent.com"
>
  <App />
</GoogleOAuthProvider>

  </React.StrictMode>
)