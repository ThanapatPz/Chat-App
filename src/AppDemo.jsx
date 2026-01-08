import { useState } from "react"
import LoginDemo from "./components/login/LoginDemo"
import TestUpload from "./components/TestUpload"
import List from "./components/list/List"
import Chat from "./components/chat/Chat"
import Detail from "./components/Detail/Detail"

const AppDemo = () => {
  const [currentUser, setCurrentUser] = useState(null)
  const [chatId, setChatId] = useState(null)
  const [showUploadTest, setShowUploadTest] = useState(false)

  const handleLoginSuccess = (user) => {
    setCurrentUser(user)
  }

  const handleLogout = () => {
    setCurrentUser(null)
    setChatId(null)
  }

  const handleChatSelect = (id) => {
    setChatId(id)
  }

  return (
    <div className='container'>
        <div style={{
        position: 'absolute',
        top: '10px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: '#4CAF50',
        color: 'white',
        padding: '8px 16px',
        borderRadius: '20px',
        fontSize: '12px',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        🧪 Demo Mode
        {currentUser && (
          <>
            - Welcome {currentUser.username}!
            <button 
              onClick={() => setShowUploadTest(!showUploadTest)}
              style={{
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                color: 'white',
                padding: '2px 8px',
                borderRadius: '10px',
                fontSize: '10px',
                cursor: 'pointer',
                marginRight: '5px'
              }}
            >
              {showUploadTest ? 'Hide' : 'Test Upload'}
            </button>
            <button 
              onClick={handleLogout}
              style={{
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                color: 'white',
                padding: '2px 8px',
                borderRadius: '10px',
                fontSize: '10px',
                cursor: 'pointer'
              }}
            >
              Logout
            </button>
          </>
        )}
      </div>      {currentUser ? (
        showUploadTest ? (
          <TestUpload />
        ) : (
          <div style={{ display: 'flex', width: '100%', height: '100vh' }}>
            <div style={{ flex: '1' }}>
              <DemoList onChatSelect={handleChatSelect} currentUser={currentUser} />
            </div>
            {chatId && (
              <>
                <div style={{ flex: '2' }}>
                  <DemoChat chatId={chatId} currentUser={currentUser} />
                </div>
                <div style={{ flex: '1' }}>
                  <DemoDetail chatId={chatId} />
                </div>
              </>
            )}
          </div>
        )
      ) : (
        <LoginDemo onLoginSuccess={handleLoginSuccess} />
      )}
    </div>
  )
}

// Demo components
const DemoList = ({ onChatSelect, currentUser }) => {
  const demoChats = [
    { id: 'chat1', name: 'Alice Johnson', lastMessage: 'Hey there! How are you?', time: '2m ago' },
    { id: 'chat2', name: 'Bob Smith', lastMessage: 'Thanks for the help!', time: '1h ago' },
    { id: 'chat3', name: 'Carol Wilson', lastMessage: 'See you tomorrow', time: '3h ago' }
  ]

  return (
    <div style={{ padding: '20px', background: 'rgba(17, 25, 40, 0.5)', height: '100vh' }}>
      <div style={{ marginBottom: '20px' }}>
        <img src={currentUser.avatar || '/avatar.png'} alt="" style={{ width: '40px', height: '40px', borderRadius: '50%', marginRight: '10px' }} />
        <span style={{ color: 'white', fontWeight: 'bold' }}>{currentUser.username}</span>
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <input 
          type="text" 
          placeholder="Search chats..." 
          style={{ 
            width: '100%', 
            padding: '10px', 
            background: 'rgba(255,255,255,0.1)', 
            border: 'none',
            borderRadius: '5px',
            color: 'white'
          }} 
        />
      </div>

      {demoChats.map(chat => (
        <div 
          key={chat.id}
          onClick={() => onChatSelect(chat.id)}
          style={{ 
            padding: '15px',
            background: 'rgba(255,255,255,0.05)',
            marginBottom: '10px',
            borderRadius: '8px',
            cursor: 'pointer',
            color: 'white'
          }}
        >
          <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>{chat.name}</div>
          <div style={{ fontSize: '14px', opacity: '0.7' }}>{chat.lastMessage}</div>
          <div style={{ fontSize: '12px', opacity: '0.5', marginTop: '5px' }}>{chat.time}</div>
        </div>
      ))}
    </div>
  )
}

const DemoChat = ({ chatId, currentUser }) => {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([
    { id: 1, text: 'Hello! This is a demo chat.', sender: 'other', time: '10:30 AM' },
    { id: 2, text: 'Hi there! This looks great!', sender: 'me', time: '10:32 AM' },
    { id: 3, text: 'Thanks! Try sending a message below.', sender: 'other', time: '10:33 AM' }
  ])

  const sendMessage = () => {
    if (message.trim()) {
      setMessages([...messages, {
        id: Date.now(),
        text: message,
        sender: 'me',
        time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
      }])
      setMessage('')
      
      // Auto reply
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          text: 'Thanks for your message! This is a demo auto-reply.',
          sender: 'other',
          time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
        }])
      }, 1000)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: 'rgba(17, 25, 40, 0.3)' }}>
      <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', color: 'white' }}>
        <h3>Demo Chat {chatId}</h3>
      </div>
      
      <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
        {messages.map(msg => (
          <div 
            key={msg.id}
            style={{ 
              marginBottom: '15px',
              display: 'flex',
              justifyContent: msg.sender === 'me' ? 'flex-end' : 'flex-start'
            }}
          >
            <div style={{
              background: msg.sender === 'me' ? '#007bff' : 'rgba(255,255,255,0.1)',
              color: 'white',
              padding: '10px 15px',
              borderRadius: '20px',
              maxWidth: '70%'
            }}>
              <div>{msg.text}</div>
              <div style={{ fontSize: '10px', opacity: '0.7', marginTop: '5px' }}>{msg.time}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ padding: '20px', display: 'flex', gap: '10px' }}>
        <input 
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Type a message..."
          style={{
            flex: 1,
            padding: '10px',
            border: 'none',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '20px',
            color: 'white'
          }}
        />
        <button 
          onClick={sendMessage}
          style={{
            padding: '10px 20px',
            background: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '20px',
            cursor: 'pointer'
          }}
        >
          Send
        </button>
      </div>
    </div>
  )
}

const DemoDetail = ({ chatId }) => {
  return (
    <div style={{ padding: '20px', background: 'rgba(17, 25, 40, 0.5)', height: '100vh', color: 'white' }}>
      <h3>Chat Details</h3>
      <div style={{ marginTop: '20px' }}>
        <div style={{ marginBottom: '20px' }}>
          <img src="/avatar.png" alt="" style={{ width: '60px', height: '60px', borderRadius: '50%' }} />
          <div style={{ marginTop: '10px' }}>
            <div style={{ fontWeight: 'bold' }}>Demo User</div>
            <div style={{ fontSize: '14px', opacity: '0.7' }}>Online</div>
          </div>
        </div>
        
        <div style={{ marginTop: '30px' }}>
          <div style={{ padding: '15px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', marginBottom: '10px' }}>
            Chat Settings
          </div>
          <div style={{ padding: '15px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', marginBottom: '10px' }}>
            Shared Files
          </div>
          <div style={{ padding: '15px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', marginBottom: '20px' }}>
            Privacy & Help
          </div>
          
          <button style={{
            width: '100%',
            padding: '10px',
            background: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            marginBottom: '10px'
          }}>
            Block User (Demo)
          </button>
        </div>
      </div>
    </div>
  )
}

export default AppDemo