// 🚀 Universal Image Upload (ทดแทน Firebase Storage)
import uploadToImgBB from './uploadImgBB.js';
import uploadToBase64 from './uploadBase64.js';
import uploadToCloudinary from './uploadCloudinary.js';
import uploadToAppwrite from './uploadAppwrite.js';

// เลือกบริการที่จะใช้ (เปลี่ยนได้ตามต้องการ)
const UPLOAD_SERVICE = 'appwrite'; // 'imgbb', 'base64', 'cloudinary', 'appwrite'
// เปลี่ยนเป็น appwrite storage

const upload = async (file) => {
  try {
    console.log(`🚀 Uploading with ${UPLOAD_SERVICE}...`);
    
    switch (UPLOAD_SERVICE) {
      case 'appwrite':
        return await uploadToAppwrite(file);
        
      case 'cloudinary':
        return await uploadToCloudinary(file);
        
      case 'imgbb':
        return await uploadToImgBB(file);
        
      case 'base64':
        return await uploadToBase64(file);
        
      default:
        // Fallback เป็น base64 ถ้าบริการอื่นไม่ได้
        console.warn(`Unknown service: ${UPLOAD_SERVICE}, falling back to base64`);
        return await uploadToBase64(file);
    }
  } catch (error) {
    console.error('Upload failed, trying fallback...', error);
    
    // ถ้าบริการหลักไม่ได้ ลอง base64
    if (UPLOAD_SERVICE !== 'base64') {
      try {
        console.log('🔄 Trying base64 fallback...');
        return await uploadToBase64(file);
      } catch (fallbackError) {
        console.error('Fallback also failed:', fallbackError);
        throw new Error('All upload methods failed. Please try a smaller image.');
      }
    }
    
    throw error;
  }
};

export default upload;