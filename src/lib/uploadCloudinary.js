// 🌤️ Cloudinary Upload (ฟรี ไม่ต้องสมัคร)

const uploadToCloudinary = async (file) => {
  // ใช้ demo cloud ฟรี (สำหรับทดสอบ)
  const cloudName = 'demo';
  const uploadPreset = 'docs_upload_example_us_preset';
  
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);
  
  try {
    console.log('🌤️ Uploading to Cloudinary...');
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Cloudinary error response:', errorText);
      throw new Error(`Upload failed: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('✅ Cloudinary upload successful:', data.secure_url);
    return data.secure_url; // URL ของรูปที่อัปโหลด
  } catch (error) {
    console.error('❌ Cloudinary upload error:', error);
    throw error;
  }
};

export default uploadToCloudinary;