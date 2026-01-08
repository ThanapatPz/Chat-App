import List from "./components/list/List"
import Detail from "./components/Detail/Detail"
import Chat from "./components/chat/Chat"
import Login from "./components/login/Login"
import LoginDemo from "./components/login/LoginDemo"
import Notification from "./components/notification/Notification"
import { useUserStore } from "./lib/userStore"
import { useChatStore } from "./lib/chatStore"
import { useEffect } from "react"
import { onAuthStateChanged } from "firebase/auth"
import { auth, isValidConfig } from "./lib/firebase-safe"

const AppSafe = () => {
  const { currentUser, isLoading, fetchUserInfo } = useUserStore()
  const { chatId } = useChatStore()

  useEffect(() => {
    if (!isValidConfig || !auth) {
      console.log('Firebase not configured, skipping auth state listener')
      return
    }

    const unSub = onAuthStateChanged(auth, (user) => {
      fetchUserInfo(user?.uid)
    })

    return () => {
      unSub()
    }
  }, [fetchUserInfo])

  // แสดง demo mode หาก Firebase ไม่ได้ config
  if (!isValidConfig) {
    return (
      <div className='container'>
        <div style={{
          position: 'absolute',
          top: '10px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: '#ff6b35',
          color: 'white',
          padding: '10px 20px',
          borderRadius: '5px',
          fontSize: '14px',
          zIndex: 1000
        }}>
          🚨 Demo Mode - Firebase not configured
        </div>
        <LoginDemo />
      </div>
    )
  }

  if (isLoading) return <div className="loading">Loading...</div>

  return (
    <div className='container'>
      {currentUser ? (
        <>
          <List />
          {chatId && <Chat />}
          {chatId && <Detail />}
        </>
      ) : (
        <Login />
      )}
      <Notification />
    </div>
  )
}

export default AppSafe