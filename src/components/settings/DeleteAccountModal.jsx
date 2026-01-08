import React, { useState } from 'react';
import './deleteAccountModal.css';

const DeleteAccountModal = ({ isOpen, onClose, onConfirm }) => {
  const [password, setPassword] = useState('');
  const [confirmText, setConfirmText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // ตรวจสอบการยืนยัน
    if (confirmText !== 'DELETE') {
      setError('กรุณาพิมพ์ "DELETE" เพื่อยืนยัน');
      return;
    }

    if (!password.trim()) {
      setError('กรุณาใส่รหัสผ่าน');
      return;
    }

    setIsLoading(true);

    try {
      await onConfirm(password);
      onClose();
    } catch (error) {
      setError(error.message || 'เกิดข้อผิดพลาดในการลบแอคเคาท์');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setPassword('');
    setConfirmText('');
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="delete-modal-overlay" onClick={handleClose}>
      <div className="delete-modal" onClick={(e) => e.stopPropagation()}>
        <div className="delete-header">
          <h2>⚠️ ลบแอคเคาท์</h2>
          <button className="close-btn" onClick={handleClose}>×</button>
        </div>

        <div className="delete-content">
          <div className="warning-box">
            <p>⚠️ <strong>คำเตือน:</strong> การลบแอคเคาท์จะไม่สามารถยกเลิกได้</p>
            <ul>
              <li>ข้อมูลผู้ใช้ทั้งหมดจะถูกลบ</li>
              <li>ประวัติการแชททั้งหมดจะหายไป</li>
              <li>ไม่สามารถกู้คืนข้อมูลได้</li>
            </ul>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>รหัสผ่านปัจจุบัน:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="ใส่รหัสผ่านเพื่อยืนยัน"
                disabled={isLoading}
              />
            </div>

            <div className="input-group">
              <label>พิมพ์ "DELETE" เพื่อยืนยัน:</label>
              <input
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="DELETE"
                disabled={isLoading}
              />
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="modal-actions">
              <button
                type="button"
                className="cancel-btn"
                onClick={handleClose}
                disabled={isLoading}
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                className="delete-btn"
                disabled={isLoading || confirmText !== 'DELETE' || !password.trim()}
              >
                {isLoading ? 'กำลังลบ...' : 'ลบแอคเคาท์'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DeleteAccountModal;