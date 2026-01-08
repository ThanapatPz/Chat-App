// 📸 Base64 Upload (100% ฟรี - เก็บใน Firestore)

const uploadToBase64 = async (file) => {
  return new Promise((resolve, reject) => {
    // ตรวจสอบขนาดไฟล์ (จำกัดที่ 1MB สำหรับ Firestore)
    if (file.size > 1024 * 1024) {
      reject(new Error('File too large. Please choose a smaller image (max 1MB)'));
      return;
    }
    
    const reader = new FileReader();
    
    reader.onload = () => {
      try {
        const base64String = reader.result;
        resolve(base64String); // คืนค่า data:image/jpeg;base64,/9j/4AAQ...
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsDataURL(file);
  });
};

export default uploadToBase64;