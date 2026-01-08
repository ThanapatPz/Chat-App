import { deleteUser, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import { doc, deleteDoc, collection, getDocs, query, where, writeBatch, getDoc } from "firebase/firestore";
import { db, auth } from "./firebase";

// ฟังก์ชันลบข้อมูลผู้ใช้ทั้งหมด
export const deleteUserData = async (userId) => {
  try {
    console.log(`🗑️ Starting to delete user data for: ${userId}`);
    
    // 1. หา userchats ของผู้ใช้ที่จะลบ เพื่อดูว่ามีแชทอะไรบ้าง
    const userChatsRef = doc(db, "userchats", userId);
    const userChatsSnap = await getDoc(userChatsRef);
    
    let chatsToDelete = [];
    
    if (userChatsSnap.exists()) {
      const userChatsData = userChatsSnap.data();
      if (userChatsData.chats) {
        chatsToDelete = userChatsData.chats.map(chat => chat.chatId);
        console.log(`📝 Found ${chatsToDelete.length} chats to process`);
      }
    }
    
    // 2. อัพเดท userchats ของผู้ใช้อื่นที่มีแชทกับผู้ใช้นี้ก่อน
    const allUserChatsSnapshot = await getDocs(collection(db, "userchats"));
    const batch1 = writeBatch(db);
    let updateCount = 0;
    
    allUserChatsSnapshot.forEach((userChatDoc) => {
      if (userChatDoc.id === userId) return; // ข้าม userchats ของผู้ใช้ที่จะลบ
      
      const userData = userChatDoc.data();
      if (userData.chats && userData.chats.length > 0) {
        const originalLength = userData.chats.length;
        
        // ลบแชทที่เกี่ยวข้องกับผู้ใช้ที่จะลบออก
        const updatedChats = userData.chats.filter(chat => {
          // ตรวจสอบว่าแชทนี้เกี่ยวข้องกับผู้ใช้ที่จะลบหรือไม่
          return !chatsToDelete.includes(chat.chatId) && chat.receiverId !== userId;
        });
        
        if (updatedChats.length !== originalLength) {
          batch1.update(userChatDoc.ref, { chats: updatedChats });
          updateCount++;
          console.log(`🔄 Updating userchats for user: ${userChatDoc.id}`);
        }
      }
    });
    
    if (updateCount > 0) {
      await batch1.commit();
      console.log(`✅ Updated ${updateCount} userchats documents`);
    }
    
    // 3. ลบแชทที่เกี่ยวข้อง
    const batch2 = writeBatch(db);
    
    for (const chatId of chatsToDelete) {
      const chatRef = doc(db, "chats", chatId);
      batch2.delete(chatRef);
      console.log(`🗑️ Marking chat for deletion: ${chatId}`);
    }
    
    // 4. ลบ userchats ของผู้ใช้
    batch2.delete(userChatsRef);
    
    // 5. ลบข้อมูลผู้ใช้
    const userRef = doc(db, "users", userId);
    batch2.delete(userRef);
    
    await batch2.commit();
    console.log("✅ User data deleted successfully");
    
  } catch (error) {
    console.error("❌ Error deleting user data:", error);
    throw error;
  }
};

// ฟังก์ชันลบแอคเคาท์หลัก
export const deleteAccount = async () => {
  try {
    const user = auth.currentUser;
    
    if (!user) {
      throw new Error("No user is currently signed in");
    }
    
    const userId = user.uid;
    
    // 1. ลบข้อมูลใน Firestore ก่อน
    await deleteUserData(userId);
    
    // 2. ลบแอคเคาท์ Authentication
    await deleteUser(user);
    
    console.log("✅ Account deleted successfully");
    return true;
    
  } catch (error) {
    console.error("❌ Error deleting account:", error);
    
    // จัดการ error ต่างๆ
    if (error.code === 'auth/requires-recent-login') {
      throw new Error("กรุณาเข้าสู่ระบบใหม่ก่อนลบแอคเคาท์");
    }
    
    throw error;
  }
};

// ฟังก์ชันสำหรับ re-authenticate ก่อนลบแอคเคาท์
export const reauthenticateAndDelete = async (password) => {
  try {
    const user = auth.currentUser;
    
    if (!user || !user.email) {
      throw new Error("No user or email found");
    }
    
    // Re-authenticate
    const credential = EmailAuthProvider.credential(user.email, password);
    await reauthenticateWithCredential(user, credential);
    
    // หลังจาก re-authenticate แล้ว ลบแอคเคาท์
    return await deleteAccount();
    
  } catch (error) {
    console.error("❌ Re-authentication failed:", error);
    
    if (error.code === 'auth/wrong-password') {
      throw new Error("รหัสผ่านไม่ถูกต้อง");
    }
    
    if (error.code === 'auth/too-many-requests') {
      throw new Error("พยายามหลายครั้งเกินไป กรุณารอสักครู่");
    }
    
    throw error;
  }
};

// ฟังก์ชันตรวจสอบและซ่อมแซมข้อมูล userchats ที่เสียหาย
export const repairUserChats = async () => {
  try {
    console.log("🔧 Starting userchats repair...");
    
    // ดึงรายชื่อผู้ใช้ที่มีอยู่จริง
    const usersSnapshot = await getDocs(collection(db, "users"));
    const existingUserIds = new Set(usersSnapshot.docs.map(doc => doc.id));
    
    // ตรวจสอบ userchats ทั้งหมด
    const allUserChatsSnapshot = await getDocs(collection(db, "userchats"));
    const batch = writeBatch(db);
    let repairCount = 0;
    
    for (const userChatDoc of allUserChatsSnapshot.docs) {
      const userData = userChatDoc.data();
      
      if (userData.chats && userData.chats.length > 0) {
        const originalLength = userData.chats.length;
        
        // กรองเฉพาะแชทที่ receiverId ยังมีอยู่จริง
        const validChats = userData.chats.filter(chat => {
          return existingUserIds.has(chat.receiverId);
        });
        
        if (validChats.length !== originalLength) {
          batch.update(userChatDoc.ref, { chats: validChats });
          repairCount++;
          console.log(`🔧 Repairing userchats for ${userChatDoc.id}: ${originalLength} → ${validChats.length}`);
        }
      }
    }
    
    if (repairCount > 0) {
      await batch.commit();
      console.log(`✅ Repaired ${repairCount} userchats documents`);
    } else {
      console.log("✅ No repairs needed");
    }
    
    return repairCount;
    
  } catch (error) {
    console.error("❌ Error repairing userchats:", error);
    throw error;
  }
};