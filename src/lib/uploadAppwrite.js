// 🚀 Appwrite Storage Upload

const uploadToAppwrite = async (file) => {
  // Appwrite configuration
  const endpoint = 'https://cloud.appwrite.io/v1';
  const projectId = 'fra-68d98950000c37e6681f'; // จาก URL ที่ให้มา
  const bucketId = '68d989fc000c9c416441'; // Bucket ID ที่สร้างแล้ว
  
  try {
    console.log('🚀 Uploading to Appwrite Storage...');
    
    // สร้าง FormData สำหรับ upload
    const formData = new FormData();
    formData.append('fileId', 'unique()'); // ให้ Appwrite สร้าง ID ให้
    formData.append('file', file);
    
    // Upload ไฟล์ไป Appwrite Storage
    const response = await fetch(`${endpoint}/storage/buckets/${bucketId}/files`, {
      method: 'POST',
      headers: {
        'X-Appwrite-Project': projectId,
      },
      body: formData,
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Appwrite error response:', errorText);
      throw new Error(`Upload failed: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    console.log('✅ Appwrite upload successful:', data);
    
    // สร้าง URL สำหรับดูไฟล์
    const fileUrl = `${endpoint}/storage/buckets/${bucketId}/files/${data.$id}/view?project=${projectId}`;
    
    console.log('📷 Image URL:', fileUrl);
    return fileUrl;
    
  } catch (error) {
    console.error('❌ Appwrite upload error:', error);
    throw error;
  }
};

export default uploadToAppwrite;