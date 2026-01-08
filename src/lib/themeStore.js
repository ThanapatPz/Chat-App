import { create } from 'zustand'

// Theme presets
const themes = {
  default: {
    name: 'Default',
    background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
    primaryColor: '#5183fe',
    secondaryColor: 'rgba(17, 25, 40, 0.5)',
    textColor: '#ffffff',
    borderColor: 'rgba(221, 221, 221, 0.2)'
  },
  dark: {
    name: 'Dark Mode',
    background: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a1a 100%)',
    primaryColor: '#bb86fc',
    secondaryColor: 'rgba(0, 0, 0, 0.7)',
    textColor: '#ffffff',
    borderColor: 'rgba(255, 255, 255, 0.1)'
  },
  ocean: {
    name: 'Ocean',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    primaryColor: '#4facfe',
    secondaryColor: 'rgba(102, 126, 234, 0.3)',
    textColor: '#ffffff',
    borderColor: 'rgba(255, 255, 255, 0.2)'
  },
  sunset: {
    name: 'Sunset',
    background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)',
    primaryColor: '#ff6b6b',
    secondaryColor: 'rgba(255, 154, 158, 0.3)',
    textColor: '#ffffff',
    borderColor: 'rgba(255, 255, 255, 0.3)'
  },
  forest: {
    name: 'Forest',
    background: 'linear-gradient(135deg, #134e5e 0%, #71b280 100%)',
    primaryColor: '#4ecdc4',
    secondaryColor: 'rgba(19, 78, 94, 0.5)',
    textColor: '#ffffff',
    borderColor: 'rgba(255, 255, 255, 0.2)'
  }
}

export const useThemeStore = create((set, get) => ({
  currentTheme: 'default',
  customBackground: null,
  themes,
  
  setTheme: (themeName) => {
    const theme = themes[themeName]
    if (theme) {
      set({ currentTheme: themeName })
      get().applyTheme(theme)
    }
  },
  
  setCustomBackground: (imageUrl) => {
    set({ customBackground: imageUrl })
    const currentTheme = themes[get().currentTheme]
    get().applyTheme({
      ...currentTheme,
      background: `url(${imageUrl}) center/cover no-repeat, ${currentTheme.background}`
    })
  },
  
  applyTheme: (theme) => {
    const root = document.documentElement
    const body = document.body
    
    // อัพเดท CSS variables
    root.style.setProperty('--bg-gradient', theme.background)
    root.style.setProperty('--primary-color', theme.primaryColor)
    root.style.setProperty('--secondary-color', theme.secondaryColor)
    root.style.setProperty('--text-color', theme.textColor)
    root.style.setProperty('--border-color', theme.borderColor)
    
    // อัพเดทพื้นหลังโดยตรงเพื่อป้องกันการแตก
    body.style.background = theme.background
    body.style.backgroundSize = 'cover'
    body.style.backgroundPosition = 'center'
    body.style.backgroundRepeat = 'no-repeat'
    body.style.backgroundAttachment = 'fixed'
  },
  
  initializeTheme: () => {
    const savedTheme = localStorage.getItem('chat-theme')
    
    if (savedTheme && themes[savedTheme]) {
      get().setTheme(savedTheme)
    } else {
      get().setTheme('default')
    }
    
    // หมายเหตุ: รูปพื้นหลังจะต้องเลือกใหม่ทุกครั้งเพราะใช้ file จากเครื่อง
  },
  
  saveTheme: (themeName) => {
    localStorage.setItem('chat-theme', themeName)
  },
  
  saveBackground: (imageUrl) => {
    // ไม่บันทึก blob URL ใน localStorage เพราะจะหายเมื่อปิดเบราว์เซอร์
    // ผู้ใช้ต้องเลือกรูปใหม่ทุกครั้ง
    console.log('Background set from local file')
  }
}))