import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import AppDemo from './AppDemo.jsx'
import './index.css'

// เปลี่ยนเป็น AppDemo เพื่อทดสอบการทำงานโดยไม่ต้องใช้ Firebase
// เปลี่ยนกลับเป็น App เมื่อ setup Firebase เสร็จแล้ว
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppDemo />
  </React.StrictMode>,
)