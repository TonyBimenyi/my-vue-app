import axios from "axios"

// ============================================================================
// API SERVICE (axios instance)
// ============================================================================
// Every component in the app imports THIS single axios instance to make API
// calls.  This way, config (base URL, headers, timeouts) lives in ONE place.
//
// HOW TO SWITCH TO A LOCALHOST API:
// -------------------------------------------------------------------
// In DEVELOPMENT (`npm run dev`) you usually DON'T need to touch THIS file.
// The Vite dev server catches any request to `/api/...` and forwards it to
// whatever `target` is set in `vite.config.js` (see instructions there).
//
// baseURL = "/api" means:
//   • api.get("/students/")  →  browser asks for "http://localhost:5173/api/students/"
//   • Vite proxies that to   →  "https://<ngrok-url>/api/students/"  (or localhost)
//
// IF you ever want to call a backend DIRECTLY (without Vite proxy — e.g. in
// production, or during testing), replace `baseURL: "/api"` with the full URL:
//
//   baseURL: "http://localhost:8000/api"   // Django local
//   baseURL: "http://localhost:3000/api"   // Express local
//   baseURL: "https://api.example.com/api" // real production
//
// NOTE: calling a backend on a different origin directly (full URL) REQUIRES
//       that backend to send proper CORS headers — otherwise the browser will
//       block the request.  The Vite proxy approach avoids this entirely.
// ============================================================================

const api = axios.create({
  // Base path prepended to every `api.get()`, `api.post()`, etc. call.
  // "/api" means requests go through the Vite dev proxy (see vite.config.js).
  // Currently the proxy forwards to your local Django: http://127.0.0.1:8000/api
  baseURL: "/api",

  // Max time (ms) to wait for a response before throwing a timeout error.
  timeout: 30000,

  // Default headers sent with EVERY request made through this instance.
  headers: {
    // Tell the backend we want JSON back (most REST APIs default to this,
    // but explicit is safer — especially with HTML-rendered frameworks).
    Accept: "application/json",

    // Content-Type is what WE are sending in POST/PUT/PATCH bodies.
    // axios sets this automatically for objects, but explicit is safer.
    "Content-Type": "application/json",
  },
})

// ---------------------------------------------------------------------------
// Optional: GLOBAL REQUEST / RESPONSE INTERCEPTORS
// ---------------------------------------------------------------------------
// If later you want to attach a JWT auth token to every request, or globally
// handle 401 Unauthorized responses, uncomment and adapt these:
//
// // Attach a bearer token from localStorage (or wherever you store auth)
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("auth_token")
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`
//   }
//   return config
// })
//
// // Globally catch 401s and kick the user back to login
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       localStorage.removeItem("auth_token")
//       window.location.href = "/login"
//     }
//     return Promise.reject(error)
//   }
// )
// ---------------------------------------------------------------------------

export default api
