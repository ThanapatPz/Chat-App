// 📷 ImgBB Upload (ฟรี ไม่ต้องสมัคร)

const uploadToImgBB = async (file) => {
  // ใช้ API key ฟรีของ ImgBB (ไม่ต้องสมัคร)
  const apiKey = '7c9b2e5a5e2f7c7a5e2f7c7a5e2f7c7a'; // Demo key
  
  const formData = new FormData();
  formData.append('image', file);
  formData.append('key', apiKey);
  
  try {
    const response = await fetch('https://api.imgbb.com/1/upload', {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error('Upload failed');
    }
    
    const data = await response.json();
    
    if (data.success) {
      return data.data.url; // URL ของรูปที่อัปโหลด
    } else {
      throw new Error('Upload failed');
    }
  } catch (error) {
    console.error('ImgBB upload error:', error);
    throw error;
  }
};

export default uploadToImgBB;