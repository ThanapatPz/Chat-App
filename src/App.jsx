import List from "./components/list/List"
import Detail from "./components/Detail/Detail"
import Chat from "./components/chat/Chat"
import Login from "./components/login/Login"
import Notification from "./components/notification/Notification"
import { useUserStore } from "./lib/userStore"
import { useChatStore } from "./lib/chatStore"
import { useThemeStore } from "./lib/themeStore"
import { useEffect } from "react"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "./lib/firebase"

const App = () => {
  const { currentUser, isLoading, fetchUserInfo } = useUserStore()
  const { chatId } = useChatStore()
  const { initializeTheme } = useThemeStore()

  useEffect(() => {
    const unSub = onAuthStateChanged(auth, (user) => {
      fetchUserInfo(user?.uid)
    })

    return () => {
      unSub()
    }
  }, [fetchUserInfo])

  // Initialize theme on app start
  useEffect(() => {
    initializeTheme()
  }, [])

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

export default App;