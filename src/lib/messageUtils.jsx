// Utility functions for message formatting

// ฟังก์ชันดึงชื่อเว็บจาก URL
const getDomainFromUrl = (url) => {
  try {
    const urlObj = new URL(url);
    let domain = urlObj.hostname;
    
    // ลบ www. ออก
    domain = domain.replace(/^www\./, '');
    
    // จำกัดความยาว
    if (domain.length > 25) {
      domain = domain.substring(0, 22) + '...';
    }
    
    return domain;
  } catch (error) {
    // ถ้า URL ไม่ถูกต้อง ให้ใช้วิธีเดิม
    return url.length > 30 ? `${url.substring(0, 27)}...` : url;
  }
};

// ตรวจสอบและแปลงลิ้งค์ในข้อความ
export const formatMessageWithLinks = (text) => {
  if (!text) return text;
  
  // Regex สำหรับหาลิ้งค์
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  
  // แยกข้อความเป็นส่วนๆ
  const parts = text.split(urlRegex);
  
  return parts.map((part, index) => {
    if (part.match(urlRegex)) {
      const displayText = getDomainFromUrl(part);
      return (
        <a 
          key={index}
          href={part} 
          target="_blank" 
          rel="noopener noreferrer"
          className="message-link"
          onClick={(e) => e.stopPropagation()}
          title={part} // แสดง full URL เมื่อ hover
        >
          {displayText}
        </a>
      );
    }
    return part;
  });
};

// ตรวจสอบว่าข้อความมีลิ้งค์หรือไม่
export const hasLinks = (text) => {
  if (!text) return false;
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return urlRegex.test(text);
};

// ฟังก์ชันสำหรับ chat list - ย่อข้อความที่มีลิ้งค์
export const formatMessageForList = (text, maxLength = 30) => {
  if (!text) return text;
  
  // ตรวจสอบว่ามีลิ้งค์หรือไม่
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const hasUrl = urlRegex.test(text);
  
  if (hasUrl) {
    // ถ้ามีลิ้งค์ ให้แทนที่ด้วยชื่อเว็บ
    const processedText = text.replace(urlRegex, (url) => {
      return getDomainFromUrl(url);
    });
    
    // ตัดข้อความถ้ายาวเกินไป
    if (processedText.length > maxLength) {
      return processedText.substring(0, maxLength - 3) + '...';
    }
    
    return processedText;
  }
  
  // ถ้าไม่มีลิ้งค์ ให้ตัดข้อความปกติ
  if (text.length > maxLength) {
    return text.substring(0, maxLength - 3) + '...';
  }
  
  return text;
};