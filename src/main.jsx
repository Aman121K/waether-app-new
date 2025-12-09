import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import Admin from './components/Admin.jsx'
import { requestNotificationPermissionAndSaveToken, startPresenceHeartbeat, listenForegroundNotifications } from './utils/notifications'

const router = createBrowserRouter([
  { path: '/admin', element: <Admin /> },
  { path: '/', element: <App /> },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(async (reg) => {
      try {
        const token = await requestNotificationPermissionAndSaveToken(reg)
        console.log('token', token)
        if (token) {
          startPresenceHeartbeat(token)
          listenForegroundNotifications()
        }
      } catch {
        console.log('error', error)
        // Ignored
      }
    }).catch(() => {
      // No-op: registration failed
    })
  });
}
