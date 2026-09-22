import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// ============================================================================
// VITE CONFIGURATION
// ============================================================================
// This file controls the Vite dev server behavior.
//
// IMPORTANT: After editing this file you MUST restart the Vite dev server
//            (Ctrl+C then `npm run dev`) for changes to take effect.
//
// HOW TO SWITCH TO A LOCALHOST API (instead of ngrok shared tunnel):
// -------------------------------------------------------------------
// Your backend API is typically served locally on a port like 8000 (Django),
// 3000 (Node/Express), 5000 (Flask), etc.
//
// STEP 1: Start your local backend server (e.g. `python manage.py runserver`
//         for Django, which runs on http://localhost:8000 by default).
//
// STEP 2: In the `server.proxy['/api']` section below:
//           - Comment out or delete the ngrok `target` line
//           - Uncomment the LOCALHOST target line that matches your backend
//             port (examples provided: Django :8000, Express :3000, Flask :5000)
//           - Or set your own custom port if different.
//
// STEP 3: You can REMOVE the ngrok-specific header lines in the
//         `proxy.on('proxyReq')` hook when using localhost — they are only
//         needed to bypass ngrok's free-tier interstitial warning page.
//         (A "localhost proxy error" hook is provided as a starting point.)
//
// STEP 4: Restart Vite (`npm run dev`).  The frontend will now send requests
//         to http://localhost:<VITE_PORT>/api/* and Vite will silently forward
//         them to your local backend — no CORS, no ngrok required.
// ============================================================================

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],

  // Import aliases — `@/foo` resolves to `src/foo` anywhere in the project
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },

  // Dev server settings — only affects `npm run dev`, NOT the production build
  server: {
    // Dev server port (default is 5173; change if you want a different port)
    port: 5173,

    // Proxy rules: intercept requests that start with `/api` and forward them
    // to a real backend server. This is how we avoid CORS errors in dev.
    proxy: {
      '/api': {
        // -----------------------------------------------------------------
        // LOCALHOST BACKEND — now active!
        // Your Django dev server is running at:  http://127.0.0.1:8000
        // Requests from the browser to http://localhost:5173/api/* will
        // be silently forwarded here (no CORS needed).
        // -----------------------------------------------------------------
        target: 'http://127.0.0.1:8000',

        // -----------------------------------------------------------------
        // SHARED NGROK TUNNEL (kept as fallback — uncomment and comment
        // the localhost target above if you need the shared tunnel again)
        // -----------------------------------------------------------------
        // target: 'https://lying-schnapps-doorknob.ngrok-free.dev',

        // Other example targets for future reference:
        // target: 'http://127.0.0.1:3000',   // Node Express
        // target: 'http://127.0.0.1:5000',   // Flask
        // target: 'http://127.0.0.1:8080',   // Spring Boot

        // Rewrites the `Host` header of the proxied request to match the
        // target URL.  Django (especially with `ALLOWED_HOSTS`) is very
        // picky about this — leave it on.
        changeOrigin: true,

        // Harmless for plain http:// localhost targets (only affects HTTPS).
        secure: false,

        // Also proxy WebSocket connections (Django Channels, etc.).
        ws: true,

        // How long (ms) to wait before giving up with a 504 timeout.
        timeout: 30000,
        proxyTimeout: 30000,

        // Follow 301/302 redirects from Django (e.g. missing trailing /).
        followRedirects: true,

        // Low-level hook for inspecting proxied requests & responses.
        configure: (proxy) => {
          // --- BEFORE the request is sent to your local Django backend ---
          proxy.on('proxyReq', (proxyReq) => {
            // Tell Django we want JSON (avoids DRF's Browsable API HTML).
            proxyReq.setHeader('Accept', 'application/json')
          })

          // --- AFTER the backend replies ---
          // Prints every proxied call to the Vite terminal (e.g.
          //   [proxy] GET /api/students/ -> 200
          // so you can quickly see what's happening).
          proxy.on('proxyRes', (proxyRes, req) => {
            console.log(`[proxy] ${req.method} ${req.url} -> ${proxyRes.statusCode}`)
          })

          // --- If the proxy itself fails (e.g. Django not running) ---
          proxy.on('error', (err, req) => {
            console.error(`[proxy error] ${req.method} ${req.url}:`, err.message)
          })
        },
      },
    },
  },
})
