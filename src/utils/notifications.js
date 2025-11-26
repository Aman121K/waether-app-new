import { getToken, isSupported } from 'firebase/messaging'
import { doc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore'
import { app, db, vapidKey } from '../firebase'
import { getMessaging } from 'firebase/messaging'

export async function requestNotificationPermissionAndSaveToken(serviceWorkerRegistration) {
  const supported = await isSupported()
  if (!supported) return null

  const permission = await Notification.requestPermission()
  if (permission !== 'granted') return null

  const messaging = getMessaging(app)
  const token = await getToken(messaging, {
    vapidKey,
    serviceWorkerRegistration,
  })

  if (!token) return null

  const tokenRef = doc(db, 'tokens', token)
  await setDoc(tokenRef, {
    token,
    userAgent: navigator.userAgent || '',
    createdAt: serverTimestamp(),
    lastSeen: serverTimestamp(),
    visibility: document.visibilityState,
    focused: document.hasFocus(),
    active: true,
  }, { merge: true })

  return token
}

export function startPresenceHeartbeat(token, intervalMs = 30000) {
  if (!token) return
  const tokenRef = doc(db, 'tokens', token)

  const updatePresence = async () => {
    try {
      await updateDoc(tokenRef, {
        lastSeen: serverTimestamp(),
        visibility: document.visibilityState,
        focused: document.hasFocus(),
        active: true,
      })
    } catch {
      // ignore
    }
  }

  const id = setInterval(updatePresence, intervalMs)

  const handleVis = () => updatePresence()
  const handleFocus = () => updatePresence()
  const handleBlur = () => updatePresence()

  document.addEventListener('visibilitychange', handleVis)
  window.addEventListener('focus', handleFocus)
  window.addEventListener('blur', handleBlur)

  // initial ping
  updatePresence()

  return () => {
    clearInterval(id)
    document.removeEventListener('visibilitychange', handleVis)
    window.removeEventListener('focus', handleFocus)
    window.removeEventListener('blur', handleBlur)
  }
}

