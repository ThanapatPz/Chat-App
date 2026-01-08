import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import AppDemo from './AppDemo.jsx'
import AppSafe from './AppSafe.jsx'
import './index.css'
import './components/ui-fixes.css'

// 🔥 เปลี่ยนกลับไปใช้ App จริงเพื่อให้เห็น UI ครบถ้วน
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
