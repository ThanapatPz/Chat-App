import React, { useState } from 'react';
import { useThemeStore } from '../../lib/themeStore';
import './themeModal.css';

const ThemeModal = ({ isOpen, onClose }) => {
  const { themes, currentTheme, setTheme, setCustomBackground, saveTheme, saveBackground } = useThemeStore();

  if (!isOpen) return null;

  const handleThemeChange = (themeName) => {
    setTheme(themeName);
    saveTheme(themeName);
  };

  const handleBackgroundUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // ตรวจสอบว่าเป็นไฟล์รูปภาพ
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // สร้าง URL จากไฟล์ในเครื่องโดยตรง
    const imageUrl = URL.createObjectURL(file);
    setCustomBackground(imageUrl);
    saveBackground(imageUrl);
    alert('Background updated! Note: You will need to select the image again when you restart the app.');
  };

  return (
    <div className="theme-modal-overlay" onClick={onClose}>
      <div className="theme-modal" onClick={(e) => e.stopPropagation()}>
        <div className="theme-header">
          <h2>🎨 Customize Theme</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="theme-content">
          {/* Preset Themes */}
          <div className="theme-section">
            <h3>🌈 Preset Themes</h3>
            <div className="theme-grid">
              {Object.entries(themes).map(([key, theme]) => (
                <div
                  key={key}
                  className={`theme-card ${currentTheme === key ? 'active' : ''}`}
                  onClick={() => handleThemeChange(key)}
                >
                  <div 
                    className="theme-preview"
                    style={{ background: theme.background }}
                  >
                    <div 
                      className="preview-accent" 
                      style={{ backgroundColor: theme.primaryColor }}
                    ></div>
                  </div>
                  <span>{theme.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Custom Background */}
          <div className="theme-section">
            <h3>🖼️ Custom Background</h3>
            <div className="custom-bg-section">
              <label htmlFor="bg-upload" className="upload-btn">
                📁 Choose Background Image
              </label>
              <input
                type="file"
                id="bg-upload"
                accept="image/*"
                onChange={handleBackgroundUpload}
                style={{ display: 'none' }}
              />
              <p className="upload-hint">Select image from your computer<br/>
                <small>(Will reset when app restarts)</small>
              </p>
            </div>
          </div>

          {/* Reset */}
          <div className="theme-section">
            <button 
              className="reset-btn"
              onClick={() => {
                localStorage.removeItem('chat-theme');
                localStorage.removeItem('chat-background');
                handleThemeChange('default');
              }}
            >
              🔄 Reset to Default
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeModal;